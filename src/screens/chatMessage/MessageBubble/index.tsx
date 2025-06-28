import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    ViewStyle,
    TextStyle,
    StyleProp,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Avatar from '../Avatar';

const { width } = Dimensions.get('window');

interface Message {
    sender: 'me' | 'other';
    text: string;
    time: string;
    seen?: boolean;
}

interface MessageBubbleProps {
    message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => (
    <View style={styles.container}>
        <View
            style={[
                styles.messageContainer,
                message.sender === 'me'
                    ? styles.myMessageContainer
                    : styles.otherMessageContainer,
            ]}
        >
            {/* Avatar for other user */}
            {message.sender === 'other' && (
                <Avatar letter="A" backgroundColor="#6366F1" style={styles.avatar} />
            )}

            <View
                style={[
                    styles.messageBubble,
                    message.sender === 'me' ? styles.myMessage : styles.otherMessage,
                    message.sender === 'me' ? { borderBottomRightRadius: 0 } : { borderBottomLeftRadius: 0 }
                ]}
            >
                <Text
                    style={[
                        styles.messageText,
                        message.sender === 'me'
                            ? styles.myMessageText
                            : styles.otherMessageText,
                    ]}
                >
                    {message.text}
                </Text>

                <View style={styles.messageFooter}>
                    <Text
                        style={[
                            styles.messageTime,
                            message.sender === 'me'
                                ? styles.myMessageTime
                                : styles.otherMessageTime,
                        ]}
                    >
                        {message.time}
                    </Text>

                    {message.sender === 'me' && (
                        <View style={styles.seenStatus}>
                            <Icon
                                name="done-all"
                                size={14}
                                color={message.seen ? '#4CAF50' : '#B0B0B0'}
                            />
                        </View>
                    )}
                </View>
            </View>

            {/* Avatar for current user */}
            {message.sender === 'me' && (
                <Avatar
                    letter="M"
                    backgroundColor="#FF6B6B"
                    style={[styles.avatar, styles.myAvatar]}
                />
            )}
        </View>
    </View>
);

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 10,
    } as ViewStyle,
    messageContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        marginBottom: 16,
        maxWidth: width - 20,
    } as ViewStyle,
    myMessageContainer: {
        alignSelf: 'flex-end',
    } as ViewStyle,
    otherMessageContainer: {
        alignSelf: 'flex-start',
    } as ViewStyle,
    avatar: {
        marginHorizontal: 8,
    } as ViewStyle,
    myAvatar: {
        backgroundColor: '#FF6B6B',
    } as ViewStyle,
    messageBubble: {
        borderTopEndRadius: 18,
        borderTopLeftRadius: 18,
        borderBottomLeftRadius: 9,
        borderBottomRightRadius: 9,
        paddingHorizontal: 14,
        paddingVertical: 10,
        maxWidth: width * 0.65,
        alignSelf: 'flex-start',
    } as ViewStyle,
    myMessage: {
        backgroundColor: '#6366F1',
        alignSelf: 'flex-end',
    } as ViewStyle,
    otherMessage: {
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        alignSelf: 'flex-start',
    } as ViewStyle,
    messageText: {
        fontSize: 15,
        lineHeight: 20,
    } as TextStyle,
    myMessageText: {
        color: '#FFF',
    } as TextStyle,
    otherMessageText: {
        color: '#333',
    } as TextStyle,
    messageFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginTop: 4,
    } as ViewStyle,
    messageTime: {
        fontSize: 11,
    } as TextStyle,
    myMessageTime: {
        color: 'rgba(255, 255, 255, 0.7)',
    } as TextStyle,
    otherMessageTime: {
        color: '#666',
    } as TextStyle,
    seenStatus: {
        marginLeft: 4,
    } as ViewStyle,
});

export default MessageBubble;