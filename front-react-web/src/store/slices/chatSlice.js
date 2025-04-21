import apiClient from "@/utils/apiClient";
import { createAsyncThunk, createEntityAdapter, createSelector, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const conversationsAdapter = createEntityAdapter();
const usersAdapter = createEntityAdapter();
import { messagesAdapter } from './messages.slice';

// const currentUserId = useSelector(state => state.auth.user?.id);


export const fetchConversations = createAsyncThunk(
    'chat/fetchConversations',
    async (_, { dispatch, rejectWithValue }) => {
        try {
            const response = await axios.get('http://localhost:5000/conversation', {
                timeout: 10000,
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            const conversationsData = response.data;

            // Normalize users (senders)
            const users = conversationsData.map(item => ({
                id: item.sender_id,
                profileImage: item.sender_profile,
                isOnline: item.sender_status,
                username: item.sender_username,
                lastActive: item.sender_lastActive,
            }));

            // Normalize conversations
            const conversations = conversationsData.map(item => ({
                id: item._id,
                participants: [item.sender_id, item.reciver_id],
                lastMessage: {
                    text: item.lastMessage,
                    createdAt: item.lastMessageTime,
                    sender: item.sender_id,
                },
                unreadCount: item.unread_count,
                typingUsers: [],
                updatedAt: item.lastMessageTime || Date.now(),
            }));

            dispatch(usersSlice.actions.usersReceived(users));
            dispatch(conversationsSlice.actions.conversationsReceived(conversations));
        } catch (error) {
            console.log(error);
            return rejectWithValue(error?.response?.data?.message || 'Login failed');
        }
    }
);

const conversationsSlice = createSlice({
    name: 'conversations',
    initialState: conversationsAdapter.getInitialState({
        loaded: false
    }),

    // Reducers 
    reducers: {
        conversationsReceived: conversationsAdapter.setAll,
        conversationUpdated: conversationsAdapter.updateOne,
        messageReceived: (state, { payload: message }) => {
            const conversation = state.entities[message.conversationId];
            if (!conversation) return;

            conversation.lastMessage = message;
            conversation.updatedAt = Date.now();

            if (state.activeConversation?.id !== message.conversationId) {
                conversation.unreadCount = (conversation.unreadCount || 0) + 1;
            }
        },
        setActiveConversation: (state, { payload }) => {
            state.activeConversation = payload;
        },
        markAsRead: (state, { payload: conversationId }) => {

            const conversation = state.entities[conversationId];

            if (conversation) conversation.unreadCount = 0;
        },
        addTypingUser: (state, { payload: { conversationId, userId } }) => {
            const conversation = state.entities[conversationId];
            if (conversation && !conversation.typingUsers?.includes(userId)) {
                conversation.typingUsers = [...(conversation.typingUsers || []), userId];
            }
        },
        removeTypingUser: (state, { payload: { conversationId, userId } }) => {
            const conversation = state.entities[conversationId];
            if (conversation) {
                conversation.typingUsers = conversation.typingUsers?.filter(id => id !== userId) || [];
            }
        },

        messagesLoaded: (state, { payload: { conversationId, messages } }) => {

            const conversation = state.entities[conversationId];
            if (conversation) {
                if (!Array.isArray(conversation.messages)) {
                    conversation.messages = [];
                }
                conversation.messages = [
                    ...new Set([...conversation.messages, ...messages.map(m => m.id)])
                ]
            }
        },
        prependMessage: (state, { payload: { conversationId, messageId } }) => {
            const conversation = state.entities[conversationId];
            console.log(conversation);
            if (conversation) {
                if (!Array.isArray(conversation.messages)) {
                    conversation.messages = [];
                }
                conversation.messages = [messageId, ...conversation.messages];
            }
        }
    },

    extraReducers: (builder) => {
        builder
            // Fetch Conversations
            .addCase(fetchConversations.pending, (state) => {
                state.isFetchingConversations = true;
            })
            .addCase(fetchConversations.fulfilled, (state) => {
                state.isFetchingConversations = false;
                state.loaded = true
            })
            .addCase(fetchConversations.rejected, (state) => {
                state.isFetchingConversations = false;
            })
    }
})

const usersSlice = createSlice({
    name: 'users',
    initialState: usersAdapter.getInitialState(),
    reducers: {
        userUpdated: usersAdapter.updateOne,
        usersReceived: usersAdapter.setAll,
        presenceUpdated: (state, action) => {
            const { userId, isOnline, lastSeen } = action.payload;
            usersAdapter.updateOne(state, {
                id: userId,
                changes: { isOnline, lastSeen }
            });
        },
        profileUpdated: (state, action) => {
            const { userId, username, profileImage } = action.payload;
            usersAdapter.updateOne(state, {
                id: userId,
                changes: { username, profileImage }
            });
        }
    }
});


// Selectors
export const {
    selectAll: selectAllConversations,
    selectById: selectConversationById,
} = conversationsAdapter.getSelectors(state => state.conversations)

// Base selectors
export const selectMessageEntities = messagesAdapter.getSelectors(
    state => state.messages
).selectEntities;


export const { selectById: selectUserById } = usersAdapter.getSelectors(state => state?.users);

// Selectors
export const selectConversationListItems = createSelector(
    [
        selectAllConversations,
        (state) => usersAdapter.getSelectors().selectEntities(state.users),
        (state) => state.auth.user?.id // Get current user ID from your auth slice
    ],
    (conversations, users, currentUserId) => {
        return conversations.map(conv => {
            // Find the conversation opponent (participant that's not current user)
            const opponent = conv.participants
                .map(userId => users[userId] || { id: userId }) // Handle missing users
                .find(user => user.id !== currentUserId);

            // Get last message details with sender info
            const lastMessage = conv.lastMessage ? {
                text: conv.lastMessage.text,
                time: conv.lastMessage.createdAt,
                isSentByMe: conv.lastMessage.sender === currentUserId,
                senderName: users[conv.lastMessage.sender]?.username || 'Unknown'
            } : null;

            return {
                id: conv.id,
                opponent: {
                    id: opponent?.id,
                    name: opponent?.username || 'Unknown User',
                    avatar: opponent?.profileImage,
                    isOnline: opponent?.isOnline || false,
                    lastActive: opponent?.lastActive || "haha"
                },
                lastMessage,
                unreadCount: conv.unreadCount,
                isTyping: conv.typingUsers.some(id =>
                    id !== currentUserId && users[id]?.isOnline
                ),
                updatedAt: conv.updatedAt
            };
        }).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)); // Sort by recent
    }
);

export const selectActiveConversation = state =>
    state.conversations.activeConversation;



// Complex selector combining messages and conversations
export const selectConversationMessages = createSelector(
    [
        selectMessageEntities,
        selectActiveConversation,
        (state) => state.conversations.entities
    ],
    (messages, activeConv, conversations) => {
        console.log(conversations[activeConv?.id]);

        const conversation = conversations[activeConv?.id];
        if (!conversation) return [];
        console.log(conversation.messages);


        return conversation.messages
            ?.map(id => messages[id])
            ?.filter(Boolean)
            ?.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)) || [];
    }
);

export const conversationsReducer = conversationsSlice.reducer;
export const usersReducer = usersSlice.reducer;

export const {
    messageReceived,
    setActiveConversation,
    markAsRead,
    addTypingUser,
    removeTypingUser,
    messagesLoaded,
    prependMessage
} = conversationsSlice.actions;

export const { presenceUpdated } = usersSlice.actions;

