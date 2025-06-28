import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    FlatList,
    StyleSheet,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
    ViewStyle,
    ListRenderItem,
    Alert,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import ChatHeader from './ChatHeader';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import ChatInput from './ChatInput';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import {
    selectActiveChatMessages,
    selectActiveChatUser,
} from '../../store/selectors/chatSelectors';
import {
    setActiveChat,
    sendMessage,
    receiveMessage,
    markChatAsRead,
} from '../../store/slices/chatSlice';
import { ChatMessage } from '../../types';
import EmptyState from '../chatList/EmptyState';

type RootStackParamList = {
    ChatScreen: {
        chatId: string;
        userId: string;
    };
};

type ChatScreenRouteProp = RouteProp<RootStackParamList, 'ChatScreen'>;

interface ExtendedMessage extends ChatMessage {
    seen?: boolean;
}

const ChatScreen: React.FC = () => {
    const navigation = useNavigation();
    const route = useRoute<ChatScreenRouteProp>();
    const { chatId, userId } = route.params;

    const dispatch = useAppDispatch();
    const messages = useAppSelector(selectActiveChatMessages) as ExtendedMessage[];
    const activeChatUser = useAppSelector(selectActiveChatUser);
    const { currentUserId } = useAppSelector(state => state.chat);

    const [newMessage, setNewMessage] = useState<string>('');
    const [isTyping, setIsTyping] = useState<boolean>(false);

    const flatListRef = useRef<FlatList>(null);

    useEffect(() => {
        if (chatId) {
            dispatch(setActiveChat(chatId));
            dispatch(markChatAsRead(chatId));
        }

        return () => {
            dispatch(setActiveChat(null));
        };
    }, [chatId, dispatch]);

    const scrollToBottom = () => {
        setTimeout(() => {
            if (messages.length > 0) {
                flatListRef.current?.scrollToEnd({ animated: true });
            }
        }, 100);
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const getUserMessageCount = () => {
        return messages.filter(message => message.sender_id === currentUserId).length;
    };

    const handleSendMessage = () => {
        if (!newMessage.trim()) {
            return;
        }

        try {

            dispatch(sendMessage({
                chatId,
                receiverId: userId,
                message: newMessage.trim() || undefined,
                message_type: 'text'
            }));

            setNewMessage('');
            const userMessageCount = getUserMessageCount();

            if (newMessage.trim() && userMessageCount < 3) {
                setIsTyping(true);
                setTimeout(() => {
                    setIsTyping(false);

                    dispatch(receiveMessage({
                        chatId,
                        senderId: userId,
                        message: "Hi, I'm Shahroz — a React Native developer. I'm currently working on this chat module. It's running locally using Redux, and things are still under construction. We can connect soon. Excited to share the updates!",
                        message_type: 'text'
                    }));
                }, 2000);
            }
        } catch (error) {
            console.error('Error sending message:', error);
            Alert.alert('Error', 'Failed to send message. Please try again.');
        }
    };

    const formatMessageForDisplay = (message: ExtendedMessage) => {
        const isFromCurrentUser = message.sender_id === currentUserId;

        return {
            id: parseInt(message.id.replace(/[^0-9]/g, '')) || Math.random(),
            text: message.message,
            sender: isFromCurrentUser ? 'me' : 'other' as 'me' | 'other',
            time: new Date(message.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
            }),
            seen: message.is_read || false,
            messageType: message.message_type,
            originalId: message.id
        };
    };

    const renderMessage: ListRenderItem<any> = ({ item }) => (
        <MessageBubble
            message={item}
        />
    );

    const renderFooter = () => {
        return isTyping ? <TypingIndicator /> : null;
    };

    const keyExtractor = (item: any) => item.originalId || item.id.toString();

    // Transform Redux messages to component format
    const displayMessages = messages.map(formatMessageForDisplay);

    return (
        <SafeAreaView style={styles.container}>
            <ChatHeader
                onBackPress={() => navigation.goBack()}
                userName={activeChatUser ? `${activeChatUser.name} ${activeChatUser.last_name || ''}` : 'Chat'}
                avatarImage={activeChatUser?.avatar}
                userStatus={activeChatUser?.available_status}
            />

            <View style={styles.chatContent}>
                <FlatList
                    ref={flatListRef}
                    data={displayMessages}
                    renderItem={renderMessage}
                    keyExtractor={keyExtractor}
                    ListEmptyComponent={
                        <EmptyState
                            icon="chat"
                            message={'No messages yet! Send a message to start a conversation.'}
                        />
                    }
                    style={styles.messagesContainer}
                    contentContainerStyle={styles.messagesContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    ListFooterComponent={renderFooter}
                    maintainVisibleContentPosition={{
                        minIndexForVisible: 0,
                        autoscrollToTopThreshold: 10,
                    }}
                    initialNumToRender={20}
                    maxToRenderPerBatch={10}
                    windowSize={10}
                />
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
            >
                <ChatInput
                    newMessage={newMessage}
                    setNewMessage={setNewMessage}
                    handleSendMessage={handleSendMessage}
                />
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    } as ViewStyle,
    chatContent: {
        flex: 1,
    } as ViewStyle,
    messagesContainer: {
        flex: 1,
    } as ViewStyle,
    messagesContent: {
        paddingTop: 12,
        paddingBottom: 20,
        flexGrow: 1,
    } as ViewStyle,
});

export default ChatScreen;
