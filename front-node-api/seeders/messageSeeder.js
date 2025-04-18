const Message = require('../models/messages');
const Conversation = require('../models/conversations');
const { createConversations } = require('./conversationSeeder');

const createMessages = async (data = null) => {
  try {
    // If data is not provided, create users and conversations first
    let conversations, users;
    if (!data) {
      console.log('No data provided, creating conversations and users first...');
      const result = await createConversations();
      conversations = result.createdConversations;
      users = result.users;
    } else {
      conversations = data.createdConversations;
      users = data.users;
    }
    
    // Clear existing messages
    // await Message.deleteMany({});
    // console.log('Existing messages deleted');
    
    const messages = [];
    const now = new Date();
    
    // Generate messages for each conversation
    for (const conversation of conversations) {
      const participants = conversation.participants;
      const isGroup = conversation.type === 'group';
      
      // Generate different number of messages based on conversation type
      const messageCount = isGroup ? 15 : 10;
      
      for (let i = 0; i < messageCount; i++) {
        // Alternate senders for realistic conversation
        const senderIndex = i % participants.length;
        const sender = participants[senderIndex];
        
        // Create timestamp with increasing time (older to newer)
        const messageTime = new Date(now - (messageCount - i) * 3600000); // Each message 1 hour apart
        
        // Generate read receipts for all participants except sender
        const readBy = participants
          .filter(participant => participant.toString() !== sender.toString())
          .map(participant => ({
            user: participant,
            readAt: i < messageCount - 3 ? messageTime : null // Last 3 messages unread
          }))
          .filter(receipt => receipt.readAt !== null); // Filter out null read receipts
        
        // Create message content
        let content;
        if (isGroup) {
          content = `Group message #${i+1} from ${users.find(u => u._id.toString() === sender.toString()).username}`;
        } else {
          content = `Hi there! This is message #${i+1} in our conversation.`;
        }
        
        // For some messages, add more realistic content
        if (i % 3 === 0) {
          content = "Hey, how are you doing today?";
        } else if (i % 3 === 1) {
          content = "I'm doing well, thanks for asking! What about you?";
        } else if (i % 5 === 0) {
          content = "Did you see the latest update? It's amazing!";
        }
        
        messages.push({
          conversationId: conversation._id,
          sender,
          content,
          readBy,
          createdAt: messageTime,
          updatedAt: messageTime
        });
      }
    }
    
    const createdMessages = await Message.insertMany(messages);
    console.log(`${createdMessages.length} messages created successfully`);
    
    // Update lastMessage field in conversations
    const conversationUpdates = [];
    for (const conversation of conversations) {
      // Find the latest message for this conversation
      const latestMessage = createdMessages
        .filter(msg => msg.conversationId.toString() === conversation._id.toString())
        .sort((a, b) => b.createdAt - a.createdAt)[0];
      
      if (latestMessage) {
        conversationUpdates.push(
          Conversation.updateOne(
            { _id: conversation._id },
            { lastMessage: latestMessage._id }
          )
        );
      }
    }
    
    await Promise.all(conversationUpdates);
    console.log(`Updated lastMessage field for ${conversationUpdates.length} conversations`);
    
    return { createdMessages, conversations, users };
  } catch (error) {
    console.error('Error seeding messages:', error);
    throw error;
  }
};

module.exports = { createMessages };

// Run standalone if called directly
if (require.main === module) {
  (async () => {
    try {
      await createMessages();
      await disconnectDB();
      console.log('Message seeding completed');
    } catch (error) {
      console.error('Message seeding failed:', error);
      process.exit(1);
    }
  })();
}