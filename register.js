const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
let client;
let clientPromise;

if (!uri) {
  throw new Error('Please add your Mongo URI to Vercel Environment Variables');
}

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

module.exports = async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const dbClient = await clientPromise;
    const db = dbClient.db('tabor_ashram');
    const collection = db.collection('registrations');

    const data = req.body;
    const timestamp = new Date();
    const rowsToInsert = [];

    // --- REGISTRATION NUMBER LOGIC ---
    const lastReg = await collection.find({}).sort({ timestamp: -1 }).limit(1).toArray();
    let nextRegCounter = 1;
    
    if (lastReg.length > 0 && lastReg[0].registrationNumber) {
      const match = lastReg[0].registrationNumber.match(/\d+/);
      if (match) {
        nextRegCounter = parseInt(match[0], 10) + 1;
      }
    }

    function getNextRegNumber() {
      const numStr = String(nextRegCounter).padStart(3, '0');
      nextRegCounter++;
      return `REG-${numStr}`;
    }

    // --- 1. MAIN APPLICANT DATA ---
    const mainApplicant = {
      registrationNumber: getNextRegNumber(),
      fullName: data.fullName,
      age: data.age,
      gender: data.gender,
      phone: data.phone,
      email: data.email,
      aadhar: data.aadhar,
      language: data.language,
      diseases: data.diseases,
      applicantType: "Main Applicant",
      address: data.address,
      emergencyName: data.emergencyName,
      emergencyPhone: data.emergencyPhone,
      emergencyAddress: data.emergencyAddress,
      consent: data.consent,
      signature: data.signature,
      timestamp: timestamp
    };
    rowsToInsert.push(mainApplicant);

    // --- 2. EXTRA PARTICIPANTS DATA ---
    if (data.extraParticipantsList && data.extraParticipantsList.length > 0) {
      data.extraParticipantsList.forEach(extra => {
        rowsToInsert.push({
          registrationNumber: getNextRegNumber(),
          fullName: extra.name,
          age: extra.age,
          gender: extra.gender,
          phone: extra.phone,
          email: data.email,
          aadhar: extra.aadhar,
          language: data.language,
          diseases: "N/A",
          applicantType: "Additional Participant",
          address: data.address,
          emergencyName: data.emergencyName,
          emergencyPhone: data.emergencyPhone,
          emergencyAddress: data.emergencyAddress,
          consent: data.consent,
          signature: data.signature,
          timestamp: timestamp
        });
      });
    }

    // --- 3. SAVE TO MONGODB ---
    await collection.insertMany(rowsToInsert);

    return res.status(200).json({ result: "success" });

  } catch (error) {
    console.error("Database Error:", error);
    return res.status(500).json({ result: "error", error: error.message });
  }
};