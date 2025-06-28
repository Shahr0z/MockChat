import React, { useState } from 'react';
import {
    View,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Platform,
    ViewStyle,
    TextStyle,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AttachmentMenu from '../AttachmentMenu';
import FeatureDevelopmentModal from '../PendingModal';

interface ChatInputProps {
    newMessage: string;
    setNewMessage: (text: string) => void;
    handleSendMessage: () => void;
}

const ChatInput: React.FC<ChatInputProps> = ({
    newMessage,
    setNewMessage,
    handleSendMessage,
}) => {
    const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const handleAttachPress = () => {
        setShowAttachmentMenu(!showAttachmentMenu);
    };

    const handleSelectAttachment = (attachmentType: string) => {
        setShowModal(true);
        console.log('Selected attachment type:', attachmentType);
        setShowAttachmentMenu(false);
    };

    const handleSend = () => {
        if (newMessage.trim()) {
            handleSendMessage();
            // Close attachment menu if open
            if (showAttachmentMenu) {
                setShowAttachmentMenu(false);
            }
        }
    };

    const closeModal = () => {
        setShowModal(false);
    };

    return (
        <View style={styles.container}>

            {showAttachmentMenu && (
                <AttachmentMenu
                    visible={showAttachmentMenu}
                    onSelectAttachment={handleSelectAttachment}
                />
            )}

            {showModal && (
                <FeatureDevelopmentModal
                    visible={showModal}
                    onClose={closeModal}
                />
            )}


            {/* Input Container */}
            <View style={styles.inputContainer}>
                <View style={styles.inputRow}>
                    <TouchableOpacity
                        style={[
                            styles.attachButton,
                            showAttachmentMenu && styles.attachButtonActive
                        ]}
                        onPress={handleAttachPress}
                        activeOpacity={0.7}
                    >
                        <Icon
                            name={showAttachmentMenu ? "close" : "attach-file"}
                            size={22}
                            color={showAttachmentMenu ? "#6366F1" : "#666"}
                        />
                    </TouchableOpacity>

                    <View style={styles.inputWrapper}>
                        <TextInput
                            style={styles.textInput}
                            value={newMessage}
                            onChangeText={(e) => {
                                setNewMessage(e);
                                if (showAttachmentMenu) {
                                    setShowAttachmentMenu(false);
                                }
                            }}
                            placeholder="Type a message..."
                            placeholderTextColor="#999"
                            multiline={true}
                            maxLength={500}
                            textAlignVertical="center"
                            returnKeyType="default"
                            blurOnSubmit={false}
                            onFocus={() => {
                                if (showAttachmentMenu) {
                                    setShowAttachmentMenu(false);
                                }
                            }}
                        />
                        <TouchableOpacity style={styles.emojiButton} onPress={() => setShowModal(true)}>
                            <Icon name="emoji-emotions" size={18} color="#666" />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        style={[
                            styles.sendButton,
                            newMessage.trim()
                                ? styles.sendButtonActive
                                : styles.sendButtonInactive,
                        ]}
                        onPress={handleSend}
                        disabled={!newMessage.trim()}
                        activeOpacity={0.8}
                    >
                        <Icon
                            name="send"
                            size={18}
                            color={newMessage.trim() ? '#FFF' : '#999'}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        zIndex: 1,
    } as ViewStyle,

    inputContainer: {
        backgroundColor: '#FFF',
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
        paddingTop: 8,
        paddingBottom: Platform.OS === 'ios' ? 8 : 12,
        zIndex: 2,
    } as ViewStyle,

    inputRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        paddingHorizontal: 12,
        minHeight: 44,
    } as ViewStyle,

    attachButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 8,
        backgroundColor: '#F5F5F5',
        borderWidth: 1,
        borderColor: 'transparent',
    } as ViewStyle,

    attachButtonActive: {
        backgroundColor: '#E8F2FF',
        borderColor: '#6366F1',
    } as ViewStyle,

    inputWrapper: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8F9FA',
        borderRadius: 22,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        paddingHorizontal: 12,
        paddingVertical: 6,
        marginRight: 8,
        minHeight: 36,
        maxHeight: 80,
    } as ViewStyle,

    textInput: {
        flex: 1,
        fontSize: 15,
        color: '#333',
        paddingVertical: 6,
        paddingHorizontal: 4,
        textAlignVertical: 'center',
        lineHeight: 18,
        minHeight: 24,
    } as TextStyle,

    emojiButton: {
        width: 28,
        height: 28,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 4,
    } as ViewStyle,

    sendButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    } as ViewStyle,

    sendButtonActive: {
        backgroundColor: '#6366F1',
    } as ViewStyle,

    sendButtonInactive: {
        backgroundColor: '#E0E0E0',
    } as ViewStyle,

});

export default ChatInput;
