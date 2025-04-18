const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/user');

const createUsers = async () => {
  try {
    // Clear existing users
    // await User.deleteMany({});
    // console.log('Existing users deleted');
    
    // Generate password hash
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);
    
    // Create sample users
    const users = [
      {
        username: 'john_doe',
        email: 'john@example.com',
        password: hashedPassword,
        about: 'Hey there! I am using Vibe Chats',
        status: true,
        lastActive: new Date()
      },
      {
        username: 'jane_smith',
        email: 'jane@example.com',
        password: hashedPassword,
        about: 'Available',
        status: true,
        lastActive: new Date()
      },
      {
        username: 'alex_wilson',
        email: 'alex@example.com',
        password: hashedPassword,
        about: 'Busy',
        status: false,
        lastActive: new Date(Date.now() - 24 * 60 * 60 * 1000) // 1 day ago
      },
      {
        username: 'emma_brown',
        email: 'emma@example.com',
        password: hashedPassword,
        about: 'At work',
        status: true,
        lastActive: new Date()
      },
      {
        username: 'michael_taylor',
        email: 'michael@example.com',
        password: hashedPassword,
        about: 'In a meeting',
        status: false,
        lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
      }
    ];
    
    const createdUsers = await User.insertMany(users);
    console.log(`${createdUsers.length} users created successfully`);
    
    return createdUsers;
  } catch (error) {
    console.error('Error seeding users:', error);
    throw error;
  }
};

module.exports = { createUsers };

// Run standalone if called directly
if (require.main === module) {
  (async () => {
    try {
      await createUsers();
      console.log('User seeding completed');
    } catch (error) {
      console.error('User seeding failed:', error);
      process.exit(1);
    }
  })();
}