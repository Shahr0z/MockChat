import { RootState } from '../index';

export const selectChatUsers = (state: RootState) =>
    state.chat.users.filter(user => user.userType === 'chat');

export const selectRequestUsers = (state: RootState) =>
    state.chat.users.filter(user => user.userType === 'request');

export const selectBlockedUsers = (state: RootState) =>
    state.chat.users.filter(user => user.userType === 'blocked');

export const selectPinnedChats = (state: RootState) =>
    state.chat.users.filter(user =>
        user.userType === 'chat' &&
        (user.pinned_by_sender === 1 || user.pinned_by_receiver === 1)
    );

export const selectUnreadCount = (state: RootState) =>
    state.chat.users.reduce((total, user) => total + user.receiver_unread_messages, 0);

export const selectActiveChat = (state: RootState) => state.chat.activeChat;

export const selectActiveChatUser = (state: RootState) => {
    const activeChatId = state.chat.activeChat;
    if (!activeChatId) return null;
    return state.chat.users.find(user => user.chat_id === activeChatId) || null;
};

export const selectActiveChatMessages = (state: RootState) => {
    const activeChatId = state.chat.activeChat;
    if (!activeChatId) return [];

    return state.chat.messages
        .filter(message => message.chat_id === activeChatId)
        .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
};

export const selectChatMessages = (chatId: string) => (state: RootState) => {
    return state.chat.messages
        .filter(message => message.chat_id === chatId)
        .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
};