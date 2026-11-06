'use strict';

const mongoose = require('mongoose');
const env = require('../config/env');

async function inspectDb() {
  try {
    console.log('Connecting to:', env.MONGO_URI);
    const conn = await mongoose.connect(env.MONGO_URI);
    console.log('Connected! Current default DB:', conn.connection.name);

    // List all databases
    const adminDb = conn.connection.db.admin();
    const dbs = await adminDb.listDatabases();
    console.log('\n--- Available Databases on this cluster ---');
    dbs.databases.forEach((d) => console.log(`- ${d.name} (${d.sizeOnDisk} bytes)`));

    // For each relevant database, list collections and users
    for (const d of dbs.databases) {
      if (['admin', 'local', 'config'].includes(d.name)) continue;
      const targetDb = conn.connection.useDb(d.name);
      const collections = await targetDb.db.listCollections().toArray();
      console.log(`\nDatabase [${d.name}] Collections:`, collections.map((c) => c.name));

      for (const coll of collections) {
        if (coll.name.toLowerCase().includes('user')) {
          const usersColl = targetDb.db.collection(coll.name);
          const users = await usersColl.find({}).toArray();
          console.log(`\nUsers in [${d.name}.${coll.name}] (Total: ${users.length}):`);
          users.forEach((u) => {
            console.log(`  • ID: ${u._id} | Email: ${u.email} | Username: ${u.username || u.name} | Role: ${u.role}`);
          });
        }
      }
    }

    process.exit(0);
  } catch (err) {
    console.error('Inspection failed:', err);
    process.exit(1);
  }
}

inspectDb();

