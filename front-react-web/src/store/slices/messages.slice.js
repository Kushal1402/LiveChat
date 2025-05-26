import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';

export const fakeMessages = [
  {
    id: 'msg1',
    conversationId: '5',
    senderId: 'u6',
    reciverId: '67eb104b6d48a231b8de76bf',
    content: 'Hey, are you available?',
    timestamp: '2025-04-21T13:15:00Z'
  },
  {
    id: 'msg2',
    conversationId: '5',
    senderId: '67eb104b6d48a231b8de76bf',
    reciverId: 'u6',
    content: 'Yes, I am. What’s up?',
    timestamp: '2025-04-21T13:17:00Z'
  },
  {
    id: 'msg3',
    conversationId: '5',
    senderId: 'u6',
    reciverId: '67eb104b6d48a231b8de76bf',
    content: 'Just wanted to check in about the project.',
    timestamp: '2025-04-21T13:20:00Z'
  },

  // Messages for conversationId: '6'
  {
    id: 'msg4',
    conversationId: '6',
    senderId: 'u6',
    reciverId: '67eb104b6d48a231b8de76bf',
    content: 'Hey there!',
    timestamp: '2025-04-21T10:15:00Z'
  },
  {
    id: 'msg5',
    conversationId: '6',
    senderId: '67eb104b6d48a231b8de76bf',
    reciverId: 'u6',
    content: 'Hello! What’s new?',
    timestamp: '2025-04-21T10:18:00Z'
  },
  {
    id: 'msg6',
    conversationId: '6',
    senderId: 'u6',
    reciverId: '67eb104b6d48a231b8de76bf',
    content: 'Let’s sync up today.',
    timestamp: '2025-04-20T09:45:00Z'
  },
  {
    id: 'msg7',
    conversationId: '6',
    senderId: '67eb104b6d48a231b8de76bf',
    reciverId: 'u6',
    content: 'Sounds good.',
    timestamp: '2025-04-20T10:10:00Z'
  },
  {
    id: 'msg8',
    conversationId: '6',
    senderId: 'u6',
    reciverId: '67eb104b6d48a231b8de76bf',
    content: 'Did you review the document?',
    timestamp: '2025-04-18T14:00:00Z'
  },
  {
    id: 'msg9',
    conversationId: '6',
    senderId: '67eb104b6d48a231b8de76bf',
    reciverId: 'u6',
    content: 'Yes, I did. Looks good.',
    timestamp: '2025-04-18T14:10:00Z'
  },
  {
    id: 'msg10',
    conversationId: '6',
    senderId: 'u6',
    reciverId: '67eb104b6d48a231b8de76bf',
    content: 'We might need to add more sections.',
    timestamp: '2025-04-16T11:00:00Z'
  },
  {
    id: 'msg11',
    conversationId: '6',
    senderId: '67eb104b6d48a231b8de76bf',
    reciverId: 'u6',
    content: 'Sure, let’s do that.',
    timestamp: '2025-04-16T11:05:00Z'
  },
  {
    id: 'msg12',
    conversationId: '6',
    senderId: 'u6',
    reciverId: '67eb104b6d48a231b8de76bf',
    content: 'Meeting at 3pm?',
    timestamp: '2025-04-12T15:00:00Z'
  },
  {
    id: 'msg13',
    conversationId: '6',
    senderId: '67eb104b6d48a231b8de76bf',
    reciverId: 'u6',
    content: 'Yes, confirmed.',
    timestamp: '2025-04-12T15:02:00Z'
  },
  {
    id: 'msg14',
    conversationId: '6',
    senderId: 'u6',
    reciverId: '67eb104b6d48a231b8de76bf',
    content: 'Don’t forget to update the sheet.',
    timestamp: '2025-04-10T09:20:00Z'
  },
  {
    id: 'msg15',
    conversationId: '6',
    senderId: '67eb104b6d48a231b8de76bf',
    reciverId: 'u6',
    content: 'Already done.',
    timestamp: '2025-04-10T09:25:00Z'
  },
  {
    id: 'msg16',
    conversationId: '6',
    senderId: 'u6',
    reciverId: '67eb104b6d48a231b8de76bf',
    content: 'Nice! 👍',
    timestamp: '2025-04-10T09:30:00Z'
  },
  {
    id: 'msg17',
    conversationId: '6',
    senderId: 'u6',
    reciverId: '67eb104b6d48a231b8de76bf',
    content: 'Morning! Ready for the call?',
    timestamp: '2025-04-09T08:45:00Z'
  },
  {
    id: 'msg18',
    conversationId: '6',
    senderId: '67eb104b6d48a231b8de76bf',
    reciverId: 'u6',
    content: 'Yep. Joining now.',
    timestamp: '2025-04-09T08:50:00Z'
  },
  {
    id: 'msg19',
    conversationId: '6',
    senderId: 'u6',
    reciverId: '67eb104b6d48a231b8de76bf',
    content: 'Did you get the new updates?',
    timestamp: '2025-04-08T12:00:00Z'
  },
  {
    id: 'msg20',
    conversationId: '6',
    senderId: '67eb104b6d48a231b8de76bf',
    reciverId: 'u6',
    content: 'Not yet. I’ll check.',
    timestamp: '2025-04-08T12:05:00Z'
  },
  {
    id: 'msg21',
    conversationId: '6',
    senderId: 'u6',
    reciverId: '67eb104b6d48a231b8de76bf',
    content: 'Ok. Let me know.',
    timestamp: '2025-04-08T12:10:00Z'
  },
  {
    id: 'msg22',
    conversationId: '6',
    senderId: 'u6',
    reciverId: '67eb104b6d48a231b8de76bf',
    content: 'Good night!',
    timestamp: '2025-04-06T22:30:00Z'
  },
  {
    id: 'msg23',
    conversationId: '6',
    senderId: '67eb104b6d48a231b8de76bf',
    reciverId: 'u6',
    content: 'Night!',
    timestamp: '2025-04-06T22:32:00Z'
  },
  {
    id: 'msg24',
    conversationId: '6',
    senderId: 'u6',
    reciverId: '67eb104b6d48a231b8de76bf',
    content: 'Let’s review tomorrow.',
    timestamp: '2025-04-03T09:30:00Z'
  },
  {
    id: 'msg25',
    conversationId: '6',
    senderId: '67eb104b6d48a231b8de76bf',
    reciverId: 'u6',
    content: 'Sure. Good idea.',
    timestamp: '2025-04-03T09:35:00Z'
  },
  {
    id: 'msg26',
    conversationId: '6',
    senderId: 'u6',
    reciverId: '67eb104b6d48a231b8de76bf',
    content: 'Great progress today!',
    timestamp: '2025-03-30T16:00:00Z'
  },
  {
    id: 'msg27',
    conversationId: '6',
    senderId: '67eb104b6d48a231b8de76bf',
    reciverId: 'u6',
    content: 'Absolutely!',
    timestamp: '2025-03-30T16:01:00Z'
  }
];


export const messagesAdapter = createEntityAdapter({
  selectId: (message) => message._id,
  sortComparer: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
});

export const sendMessage = createAsyncThunk(
  'messages/sendMessage',
  async (messageData, { rejectWithValue }) => {
    try {
      const response = await yourApi.sendMessage(messageData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const messagesSlice = createSlice({
  name: 'messages',
  initialState: messagesAdapter.getInitialState({
    loading: false,
    error: null,
    pagination: {
      // Stores pagination state per conversation
      // Example: { 'conv1': { page: 1, hasMore: true } }
    }
  }),

  reducers: {
    messageAdded: messagesAdapter.addOne,
    messagesReceived: messagesAdapter.addMany,
    messageUpdated: messagesAdapter.updateOne,
    messageRemoved: messagesAdapter.removeOne,
    setPagination: (state, { payload: { conversationId, pagination } }) => {
      state.pagination[conversationId] = pagination;
    },
    resetMessages: messagesAdapter.removeAll,
    addTempMessage: (state, { payload }) => {
      messagesAdapter.addOne(state, {
        ...payload,
        status: 'sending',
        isTemp: true
      });
    },
    confirmMessage: (state, { payload: { tempId, serverMessage } }) => {
      messagesAdapter.updateOne(state, {
        id: tempId,
        changes: {
          ...serverMessage,
          status: 'delivered',
          isTemp: false
        }
      });
    },
    markMessageFailed: (state, { payload: tempId }) => {
      messagesAdapter.updateOne(state, {
        id: tempId,
        changes: {
          status: 'failed'
        }
      });
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessage.pending, (state, { meta }) => {
        // Optimistic update for sending message
        const tempMessage = {
          ...meta.arg,
          tempId: meta.requestId,
          status: 'sending'
        };
        messagesAdapter.addOne(state, tempMessage);
      })
      .addCase(sendMessage.fulfilled, (state, { payload, meta }) => {
        // Replace temporary message with server response
        messagesAdapter.updateOne(state, {
          id: meta.requestId,
          changes: {
            ...payload,
            id: payload.id, // Server-generated ID
            status: 'sent',
            tempId: undefined
          }
        });
      })
      .addCase(sendMessage.rejected, (state, { meta }) => {
        // Mark message as failed
        messagesAdapter.updateOne(state, {
          id: meta.requestId,
          changes: { status: 'failed' }
        });
      });
  }
});

export const {
  messageAdded,
  messagesReceived,
  messageUpdated,
  messageRemoved,
  setPagination,
  resetMessages,
  addFakeMessages,
  addTempMessage,
  confirmMessage,
  markMessageFailed
} = messagesSlice.actions;

export const messagesReducer = messagesSlice.reducer;
