import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  chats: [],
  currentChat: null,
  messages: [],
  selectedUser: null,
  unreadCount: 0,
  unreadByChat: {},
  loading: false,
  error: null,
  totalPages: 1,
  currentPage: 1,
  onlineUsers: [],
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setChats: (state, action) => {
      state.chats = action.payload.chats;
      state.totalPages = action.payload.totalPages;
      state.currentPage = action.payload.page;
      state.loading = false;
      state.error = null;
    },

    setCurrentChat: (state, action) => {
      state.currentChat = action.payload;
    },

    setMessages: (state, action) => {
      state.messages = action.payload;
    },

    addMessage: (state, action) => {
      state.messages.push(action.payload);
      if (state.currentChat) {
        state.currentChat.lastMessage = action.payload.text;
        state.currentChat.lastMessageTime = action.payload.createdAt;
      }
    },

    updateMessage: (state, action) => {
      const index = state.messages.findIndex(m => m._id === action.payload._id);
      if (index !== -1) {
        state.messages[index] = action.payload;
      }
    },

    deleteMessage: (state, action) => {
      state.messages = state.messages.filter(m => m._id !== action.payload);
    },

    setUnreadCount: (state, action) => {
      state.unreadCount = action.payload.unreadCount;
      state.unreadByChat = action.payload.chats || {};
    },

    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },

    addOnlineUser: (state, action) => {
      if (!state.onlineUsers.includes(action.payload)) {
        state.onlineUsers.push(action.payload);
      }
    },

    removeOnlineUser: (state, action) => {
      state.onlineUsers = state.onlineUsers.filter(u => u !== action.payload);
    },

    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },

    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    clearError: (state) => {
      state.error = null;
    },

    clearChat: (state) => {
      state.currentChat = null;
      state.messages = [];
      state.selectedUser = null;
    },

    clearAllChats: (state) => {
      state.chats = [];
      state.currentChat = null;
      state.messages = [];
      state.selectedUser = null;
      state.unreadCount = 0;
      state.totalPages = 1;
      state.currentPage = 1;
    },
  },
});

export const {
  setChats,
  setCurrentChat,
  setMessages,
  addMessage,
  updateMessage,
  deleteMessage,
  setUnreadCount,
  setOnlineUsers,
  addOnlineUser,
  removeOnlineUser,
  setSelectedUser,
  setLoading,
  setError,
  clearError,
  clearChat,
  clearAllChats,
} = chatSlice.actions;

export default chatSlice.reducer;