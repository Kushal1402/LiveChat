export const findConversationByUser = (conversations, userId) => {
  return conversations.find(conv =>
    conv.participants.some(p => p.id === userId)
  );
};

export const createNewConversation = (user) => ({
  id: `temp_${Date.now()}`,
  participants: [currentUser, user],
  lastMessage: null,
  unreadCount: 0,
  isNew: true 
});