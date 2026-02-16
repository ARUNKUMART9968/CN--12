import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import profileReducer from './profileSlice';
import matchReducer from './matchSlice';
import chatReducer from './chatSlice';
import jobReducer from './jobSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    match: matchReducer,
    chat: chatReducer,
    job: jobReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export default store;