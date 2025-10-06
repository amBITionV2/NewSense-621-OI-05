const mongoose = require('mongoose');
const path = require('path');
const config = require('../config.dev');

let User, Admin;
try {
  User = require('../models/User');
  Admin = require('../models/Admin');
} catch (e) {
  console.error('Failed to load models:', e.message);
  process.exit(1);
}

async function main() {
  const emailArg = process.argv[2];
  const newPassword = process.argv[3] || 'password';

  if (!emailArg) {
    console.error('Usage: node scripts/resetPassword.js <email> [newPassword]');
    process.exit(1);
  }

  try {
    if (!config.MONGODB_URI) {
      console.error('MONGODB_URI is not set in config. Cannot reset password without MongoDB.');
      process.exit(1);
    }

    await mongoose.connect(config.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Try admin first
    let account = await Admin.findOne({ email: emailArg });
    let model = 'Admin';
    if (!account) {
      account = await User.findOne({ email: emailArg });
      model = 'User';
    }

    if (!account) {
      console.error('No user/admin found with email:', emailArg);
      process.exit(1);
    }

    account.password = newPassword; // will be hashed by pre('save')
    await account.save();

    console.log(`✅ ${model} password reset successful for ${emailArg}`);
    console.log('You can now login with the new password.');
  } catch (err) {
    console.error('Error resetting password:', err);
    process.exit(1);
  } finally {
    await mongoose.disconnect().catch(() => {});
  }
}

main();


