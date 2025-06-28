import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import chatReducer from './slices/chatSlice';

const persistConfig = {
    key: 'chatApp',
    storage: AsyncStorage,
    whitelist: ['users', 'messages', 'currentUserId'],
};

const persistedChatReducer = persistReducer(persistConfig, chatReducer);

export const store = configureStore({
    reducer: {
        chat: persistedChatReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
            },
        }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;