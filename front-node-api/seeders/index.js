const { createUsers } = require('./userSeeder');
const { createConversations } = require('./conversationSeeder');
const { createMessages } = require('./messageSeeder');
require('../config/db')

/**
 * Main seeder function to populate the database with initial data
 */
const seedDatabase = async () => {
  try {
    console.log('=== Starting database seeding ===');
    console.time('Seeding completed in');
        
    // Create users
    console.log('\n----- Seeding Users -----');
    const users = await createUsers();
    console.log(`----- ${users.length} Users created successfully -----\n`);
    
    // Create conversations
    console.log('----- Seeding Conversations -----');
    const { createdConversations } = await createConversations(users);
    console.log(`----- ${createdConversations.length} Conversations created successfully -----\n`);
    
    // Create messages
    console.log('----- Seeding Messages -----');
    const { createdMessages } = await createMessages({ createdConversations, users });
    console.log(`----- ${createdMessages.length} Messages created successfully -----\n`);
    
    console.log('\n=== Database seeding completed successfully ===');
    console.timeEnd('Seeding completed in');
    
    return { users, conversations: createdConversations, messages: createdMessages };
  } catch (error) {
    console.error('ERROR: Database seeding failed:', error);
    
    // Try to disconnect database even if seeding failed
    try {
      console.log('Attempting to disconnect from database...');
    } catch (disconnectError) {
      console.error('Failed to disconnect from database:', disconnectError);
    }
    
    process.exit(1);
  }
};

// Run if called directly
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };