const Conversation = require('../models/conversations');
const { createUsers } = require('./userSeeder');

const createConversations = async (users = null) => {
  try {
    // If users are not provided, create them
    if (!users) {
      console.log('No users provided, creating users first...');
      users = await createUsers();
    }
    
    // Clear existing conversations
    // await Conversation.deleteMany({});
    // console.log('Existing conversations deleted');
    
    // Create conversations between users
    const conversations = [
      // One-on-one conversations
      {
        participants: [users[0]._id, users[1]._id], // John and Jane
        type: 'one-on-one'
      },
      {
        participants: [users[0]._id, users[2]._id], // John and Alex
        type: 'one-on-one'
      },
      {
        participants: [users[1]._id, users[2]._id], // Jane and Alex
        type: 'one-on-one'
      },
      {
        participants: [users[0]._id, users[3]._id], // John and Emma
        type: 'one-on-one'
      },
      {
        participants: [users[2]._id, users[4]._id], // Alex and Michael
        type: 'one-on-one'
      },
      // Group conversations
      {
        participants: [users[0]._id, users[1]._id, users[2]._id], // John, Jane, and Alex
        type: 'group'
      },
      {
        participants: [users[0]._id, users[1]._id, users[2]._id, users[3]._id, users[4]._id], // All users
        type: 'group'
      }
    ];
    
    const createdConversations = await Conversation.insertMany(conversations);
    console.log(`${createdConversations.length} conversations created successfully`);
    
    return { createdConversations, users };
  } catch (error) {
    console.error('Error seeding conversations:', error);
    throw error;
  }
};

module.exports = { createConversations };

// Run standalone if called directly
if (require.main === module) {
  (async () => {
    try {
      await createConversations();
      console.log('Conversation seeding completed');
    } catch (error) {
      console.error('Conversation seeding failed:', error);
      process.exit(1);
    }
  })();
}