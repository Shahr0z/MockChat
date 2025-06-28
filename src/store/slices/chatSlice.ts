import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ChatMessage, ChatState, ChatUser } from '../../types';
import initialData from '../../utils/data';

const initialState: ChatState = {
    currentUserId: '35',
    users: [],
    messages: [],
    activeChat: null,
    loading: false,
    error: null,
};

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        // Initialize with dummy data
        initializeDummyData: (state) => {
            state.users = initialData
        },

        // Set active chat (when user opens a conversation)
        setActiveChat: (state, action: PayloadAction<string | null>) => {
            state.activeChat = action.payload;

            // Mark messages as read when opening chat
            if (action.payload) {
                state.messages.forEach(message => {
                    if (message.chat_id === action.payload &&
                        message.receiver_id === state.currentUserId) {
                        message.is_read = true;
                    }
                });

                // Update unread count in user list
                const user = state.users.find(u => u.chat_id === action.payload);
                if (user) {
                    user.receiver_unread_messages = 0;
                }
            }
        },

        // Send new message
        sendMessage: (state, action: PayloadAction<{
            chatId: string;
            receiverId: string;
            message?: string;
            message_type: 'text';
        }>) => {
            const { chatId, receiverId, message, message_type } = action.payload;

            const newMessage: ChatMessage = {
                id: `msg_${chatId}_${Date.now()}`,
                message,
                timestamp: new Date().toISOString(),
                sender_id: state.currentUserId,
                receiver_id: receiverId,
                chat_id: chatId,
                message_type,
                is_read: false
            };

            state.messages.push(newMessage);

            // Update last message in user list
            const user = state.users.find(u => u.chat_id === chatId);
            if (user) {
                user.last_message = message || `Sent a ${message_type}`;
                user.message.message = message;
                user.message.updated_at = newMessage.timestamp;
            }
        },

        // Receive message (from other user)
        receiveMessage: (state, action: PayloadAction<{
            chatId: string;
            senderId: string;
            message?: string;
            message_type: 'text';
        }>) => {
            const { chatId, senderId, message, message_type } = action.payload;

            const newMessage: ChatMessage = {
                id: `msg_${chatId}_${Date.now()}`,
                message,
                timestamp: new Date().toISOString(),
                sender_id: senderId,
                receiver_id: state.currentUserId,
                chat_id: chatId,
                message_type,
                is_read: state.activeChat === chatId
            };

            state.messages.push(newMessage);

            // Update last message and unread count in user list
            const user = state.users.find(u => u.chat_id === chatId);
            if (user) {
                user.last_message = message || `Sent a ${message_type}`;
                user.message.message = message;
                user.message.updated_at = newMessage.timestamp;

                // Increment unread count if chat is not active
                if (state.activeChat !== chatId) {
                    user.receiver_unread_messages += 1;
                }
            }
        },

        // Mark specific chat messages as read
        markChatAsRead: (state, action: PayloadAction<string>) => {
            const chatId = action.payload;

            state.messages.forEach(message => {
                if (message.chat_id === chatId &&
                    message.receiver_id === state.currentUserId) {
                    message.is_read = true;
                }
            });

            // Update unread count in user list
            const user = state.users.find(u => u.chat_id === chatId);
            if (user) {
                user.receiver_unread_messages = 0;
            }
        },

        // Accept friend request - change status and move to chat
        acceptRequest: (state, action: PayloadAction<string>) => {
            const userId = action.payload;
            const user = state.users.find(u => u.id === userId);

            if (user && user.userType === 'request') {
                user.requestStatus = 'accepted';
                user.userType = 'chat';
                user.message.updated_at = new Date().toISOString();
            }
        },

        // Reject friend request - remove from storage
        rejectRequest: (state, action: PayloadAction<string>) => {
            const userId = action.payload;
            state.users = state.users.filter(user => user.id !== userId);
        },

        // Block user - change status and move to blocked
        blockUser: (state, action: PayloadAction<string>) => {
            const userId = action.payload;
            const user = state.users.find(u => u.id === userId);

            if (user) {
                user.blockStatus = 'blocked';
                user.requestStatus = 'rejected';
                user.userType = 'blocked';
                user.message.updated_at = new Date().toISOString();
            }
        },

        // Unblock user - change status and move to chat
        unblockUser: (state, action: PayloadAction<string>) => {
            const userId = action.payload;
            const user = state.users.find(u => u.id === userId);

            if (user && user.userType === 'blocked') {
                user.blockStatus = 'unblocked';
                user.requestStatus = 'accepted';
                user.userType = 'chat';
                user.last_message = 'User unblocked - Ready to chat';
                user.message.message = 'User unblocked - Ready to chat';
                user.message.updated_at = new Date().toISOString();
                user.receiver_unread_messages = 0;
            }
        },

        // Remove user completely
        removeUser: (state, action: PayloadAction<string>) => {
            const userId = action.payload;
            const user = state.users.find(u => u.id === userId);

            if (user) {
                // Remove all messages for this chat
                state.messages = state.messages.filter(msg => msg.chat_id !== user.chat_id);
                // Clear active chat if removing current chat
                if (state.activeChat === user.chat_id) {
                    state.activeChat = null;
                }
                // Remove user
                state.users = state.users.filter(u => u.id !== userId);
            }
        },

        // Pin/Unpin chat
        togglePinChat: (state, action: PayloadAction<string>) => {
            const userId = action.payload;
            const user = state.users.find(u => u.id === userId);

            if (user && user.userType === 'chat') {
                const isReceiver = user.receiver_id === state.currentUserId;
                const isPinned = isReceiver ? user.pinned_by_receiver : user.pinned_by_sender;

                if (isReceiver) {
                    user.pinned_by_receiver = isPinned ? 0 : 1;
                } else {
                    user.pinned_by_sender = isPinned ? 0 : 1;
                }

                user.pinned_Time = isPinned ? null : new Date().toISOString();
            }
        },

        // Update message
        updateMessage: (state, action: PayloadAction<{ userId: string; message: string }>) => {
            const { userId, message } = action.payload;
            const user = state.users.find(u => u.id === userId);

            if (user) {
                user.last_message = message;
                user.message.message = message;
                user.message.updated_at = new Date().toISOString();
                user.receiver_unread_messages += 1;
            }
        },

        // Mark messages as read
        markAsRead: (state, action: PayloadAction<string>) => {
            const userId = action.payload;
            const user = state.users.find(u => u.id === userId);

            if (user) {
                user.receiver_unread_messages = 0;
            }
        },

        // Set loading state
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },

        // Set error state
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },

        // Clear all data
        clearAllData: (state) => {
            state.users = [];
            state.error = null;
        }
    },
});

export const {
    initializeDummyData,
    setActiveChat,
    sendMessage,
    receiveMessage,
    markChatAsRead,
    acceptRequest,
    rejectRequest,
    blockUser,
    unblockUser,
    removeUser,
    togglePinChat,
    updateMessage,
    markAsRead,
    setLoading,
    setError,
    clearAllData
} = chatSlice.actions;

export default chatSlice.reducer;