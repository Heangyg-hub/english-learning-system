'use strict';

const mongoose = require('mongoose');
const env = require('../config/env');
const { connectDB, disconnectDB } = require('../config/db');
const User = require('../models/User.model');

const upsertAdmin = async () => {
  try {
    await connectDB();
    console.log(`[Upsert Admin] Connected to database: "${mongoose.connection.name}"`);

    const adminEmail = 'sengheang@els.com';
    const rawEmail = 'Sengheang@els.com';
    const adminPassword = 'Admin@heang123$';

    let user = await User.findOne({ email: adminEmail });

    if (user) {
      console.log(`[Upsert Admin] User "${adminEmail}" already exists. Updating password and ensuring admin role...`);
      user.password = adminPassword;
      user.role = 'admin';
      user.isActive = true;
      await user.save();
      console.log(`[Upsert Admin] Admin user updated successfully!`);
    } else {
      console.log(`[Upsert Admin] Creating new admin user "${rawEmail}"...`);
      user = await User.create({
        username: 'Sengheang',
        email: rawEmail,
        password: adminPassword,
        role: 'admin',
        isActive: true,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      });
      console.log(`[Upsert Admin] Admin user created successfully with ID: ${user._id}`);
    }

    console.log('\n--- Admin Credentials ---');
    console.log(`Email:    ${rawEmail}`);
    console.log(`Password: ${adminPassword}`);
    console.log(`Database: ${mongoose.connection.name}`);
    console.log('-------------------------\n');

    await disconnectDB();
    process.exit(0);
  } catch (err) {
    console.error('[Upsert Admin] Error:', err);
    await disconnectDB();
    process.exit(1);
  }
};

upsertAdmin();

