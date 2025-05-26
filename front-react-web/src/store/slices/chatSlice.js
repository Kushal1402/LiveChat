import apiClient from "@/utils/apiClient";
import { createAsyncThunk, createEntityAdapter, createSelector, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const conversationsAdapter = createEntityAdapter();
const usersAdapter = createEntityAdapter();
import { messagesAdapter } from './messages.slice';
import { dispatch } from "../store";

// const currentUserId = useSelector(state => state.auth.user?.id);


export const fetchConversations = createAsyncThunk(
    'chat/fetchConversations',
    async (_, { dispatch, rejectWithValue }) => {
        try {
            // const response = await axios.get('http://localhost:5000/conversation', {
            //     timeout: 10000,
            //     headers: {
            //         'Content-Type': 'application/json',
            //     }
            // });
            const response = await apiClient.get('/conversation');
            const conversationsData = response.data.data;

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
                participants: [item.sender_id, item.receiver_id],
                lastMessage: {
                    content: item.lastMessage,
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

export const fetchNewUsers = createAsyncThunk(
    'chat/fetchUsers',
    async (name, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(`/user/get-users?username=${name || ''}`);
            return response?.data?.result
        } catch (error) {
            console.log(error);
            return rejectWithValue(error || 'new user falies');
        }
    }
)

const conversationsSlice = createSlice({
    name: 'conversations',
    initialState: conversationsAdapter.getInitialState({
        loaded: false,
        isFetchingUsers: false,
        newUsers: []
    }),

    // Reducers 
    reducers: {
        conversationsReceived: conversationsAdapter.setAll,
        conversationUpdated: conversationsAdapter.updateOne,
        addNewConversation: conversationsAdapter.addOne,
        resetActiveConversation: (state) => {
            state.activeConversation = null
        },
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
        },

        clearNewUsers: (state) => {
            state.newUsers = []
        },


        
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

            // Fetching Users 
            .addCase(fetchNewUsers.pending, (state, action) => {
                state.isFetchingUsers = true;
            })
            .addCase(fetchNewUsers.fulfilled, (state, action) => {
                state.isFetchingUsers = false;
                state.newUsers = action.payload
            })
            .addCase(fetchNewUsers.rejected, (state, action) => {
                state.isFetchingUsers = false;
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

            const { userId, status, sender_lastActive } = action.payload;
            const isOnline = status;
            const lastSeen = status ? null : sender_lastActive || null;

            usersAdapter.updateOne(state, {
                id: userId,
                changes: { isOnline, lastSeen }
            });
        },
        profileUpdated: (state, action) => {
            console.log(action.payload);

            const { userId } = action.payload;
            const username = action?.payload?.updatedProfile?.username;
            const profileImage = action?.payload?.updatedProfile?.profile_picture;

            usersAdapter.updateOne(state, {
                id: userId,
                changes: { username, profileImage }
            });
        }
    },

});


// Selectors
export const {
    selectAll: selectAllConversations,
    selectById: selectConversationById,
    selectIds: selectConversationIds,
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
      (state) => state.auth.user?.id
    ],
    (conversations, users, currentUserId) => {
      return conversations?.map((conv) => {
        const participantIds = conv?.participants || [];
  
        // Get opponent (the other user in the conversation)
        const opponent = participantIds
          .map((userId) => users?.[userId] ?? { id: userId })
          .find((user) => user?.id !== currentUserId);
  
        const lastMessage = conv?.lastMessage;
        const senderUser = lastMessage?.sender ? users?.[lastMessage.sender] : null;
  
        return {
          id: conv?.id ?? '',
          opponent: {
            id: opponent?.id ?? '',
            name: opponent?.username ?? 'Unknown User',
            avatar: opponent?.profileImage ?? null,
            isOnline: opponent?.isOnline ?? false,
            lastActive: opponent?.lastActive ?? null
          },
          lastMessage: lastMessage
            ? {
                content: lastMessage?.content ?? '',
                time: lastMessage?.createdAt ?? '',
                isSentByMe: lastMessage?.sender === currentUserId,
                senderName: senderUser?.username ?? 'Unknown'
              }
            : null,
          unreadCount: conv?.unreadCount ?? 0,
          isTyping: (conv?.typingUsers ?? []).some(
            (id) => id !== currentUserId && users?.[id]?.isOnline
          ),
          updatedAt: conv?.updatedAt ?? null
        };
      })?.sort(
        (a, b) => new Date(b.updatedAt ?? 0) - new Date(a.updatedAt ?? 0)
      ) ?? [];
    }
  );
  


// Custom selector to find conversation by participant
export const selectConversationByUserId = createSelector(
    [selectAllConversations, (state, userId) => userId],
    (conversations, userId) => conversations.find(conv =>
        conv.participants.some(p => p === userId)
    )
)

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
        console.log(conversation?.messages);


        return conversation?.messages
            ?.map(id => messages[id])
            ?.filter(Boolean)
            ?.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)) || [];
    }
);

// 1. Get the adapter selectors
const messagesSelectors = messagesAdapter.getSelectors(state => state.messages);

// 2. Selector to filter messages by conversationId
export const selectMessagesByConversationId = createSelector(
    [
        messagesSelectors.selectAll, // All messages (already sorted by `createdAt`)
        (state, conversationId) => conversationId, // Dynamic argument: activeConvId
    ],
    (messages, conversationId) =>
        messages.filter(message => message.conversationId === conversationId)
);

// 3. Selector for active conversation messages (combines with activeConvId)
export const selectActiveConversationMessages = createSelector(
    [
        (state) => state.conversations.activeConversationId, // Active conversation ID
        (state) => selectMessagesByConversationId(state, state.conversations.activeConversationId),
    ],
    (activeConvId, messages) => messages
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
    prependMessage,
    clearNewUsers,
    confirmMessage,
    markMessageFailed
} = conversationsSlice.actions;

export const {
    profileUpdated,
    presenceUpdated
} = usersSlice.actions;

