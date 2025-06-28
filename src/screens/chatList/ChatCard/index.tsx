import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Menu, MenuItem } from 'react-native-material-menu';

const statusConfig = {
    1: { iconName: 'checkcircle', iconType: 'AntDesign', color: '#10B981' },
    2: { iconName: 'circle', iconType: 'FontAwesome', color: '#8B0000' },
    3: { iconName: 'circle', iconType: 'FontAwesome', color: '#FF0000' },
    0: { iconName: 'closecircleo', iconType: 'AntDesign', color: '#6B7280' },
};

const messageTypes = {
    text: { icon: null, displayText: null },
    image: { icon: 'image', displayText: 'Photo' },
    video: { icon: 'videocam', displayText: '🎥 Video' },
    audio: { icon: 'mic', displayText: '🎵 Audio' },
    location: { icon: 'location-on', displayText: 'Location' },
    document: { icon: 'description', displayText: '📄 Document' },
    gif: { icon: 'gif', displayText: '🎞️ GIF' },
};

interface ChatCardProps {
    avatarUrl: string;
    username: string;
    status: number;
    isPinned: boolean;
    lastMessage: string;
    lastMessageTime: string;
    lastMessageType?: 'text' | 'image' | 'video' | 'audio' | 'location' | 'document' | 'gif';
    unreadCount: number;
    onPress: () => void;
    onDelete: () => void;
    onTogglePin: () => void;
}

const ChatCard: React.FC<ChatCardProps> = ({
    avatarUrl,
    username,
    status,
    isPinned,
    lastMessage,
    lastMessageTime,
    lastMessageType = 'text',
    unreadCount,
    onPress,
    onDelete,
    onTogglePin,
}) => {
    const menuRef = useRef(null);

    const showMenu = () => menuRef.current?.show();
    const hideMenu = () => menuRef.current?.hide();
    const currentStatusConfig = statusConfig[status] || statusConfig[0];
    const messageConfig = messageTypes[lastMessageType] || messageTypes.text;

    const renderMessageContent = () => {
        if (lastMessageType === 'text') {
            return (
                <Text style={styles.messageText} numberOfLines={1}>
                    {lastMessage}
                </Text>
            );
        }

        return (
            <View style={styles.messageWithIcon}>
                {messageConfig.icon && (
                    <MaterialIcons
                        name={messageConfig.icon}
                        size={14}
                        color="#6B7280"
                        style={styles.messageIcon}
                    />
                )}
                <Text style={styles.messageText} numberOfLines={1}>
                    {messageConfig.displayText}
                </Text>
            </View>
        );
    };

    return (
        <TouchableOpacity style={styles.container} activeOpacity={0.8} onPress={onPress}>
            <View style={styles.leftContent}>
                <View style={styles.avatarWrapper}>
                    <Image source={{ uri: avatarUrl }} style={styles.avatar} />
                    <View style={styles.statusIconContainer}>
                        {currentStatusConfig.iconType === 'AntDesign' ? (
                            <AntDesign
                                name={currentStatusConfig.iconName}
                                size={12}
                                color={currentStatusConfig.color}
                            />
                        ) : (
                            <FontAwesome
                                name={currentStatusConfig.iconName}
                                size={12}
                                color={currentStatusConfig.color}
                            />
                        )}
                    </View>
                    {unreadCount > 0 && (
                        <View style={styles.unreadBadge}>
                            <Text style={styles.unreadText}>
                                {unreadCount > 99 ? '99+' : unreadCount}
                            </Text>
                        </View>
                    )}
                </View>
            </View>

            <View style={styles.middleContent}>
                <View style={styles.topRow}>
                    <Text style={styles.username} numberOfLines={1}>
                        {username}
                    </Text>
                    {isPinned && <Text style={styles.pinIcon}>📌</Text>}
                </View>
                {renderMessageContent()}
            </View>

            <View style={styles.rightContent}>
                <Text style={styles.timeText}>{lastMessageTime}</Text>
                <TouchableOpacity onPress={showMenu} style={styles.menuIcon}>
                    <Icon name="ellipsis-vertical" size={18} color="#4B5563" />
                </TouchableOpacity>
            </View>

            <Menu
                ref={menuRef}
                style={styles.menu}
                onRequestClose={hideMenu}
            >
                <MenuItem
                    onPress={() => {
                        hideMenu();
                        onTogglePin();
                    }}
                    textStyle={styles.menuItemText}
                >
                    <AntDesign
                        name={isPinned ? 'pushpin' : 'pushpino'}
                        size={18}
                        color={isPinned ? '#2563EB' : '#4B5563'}
                    />{' '}
                    {isPinned ? 'Unpin' : 'Pin'}
                </MenuItem>
                <MenuItem
                    onPress={() => {
                        hideMenu();
                        onDelete();
                    }}
                    textStyle={styles.menuItemText}
                >
                    <AntDesign name="delete" size={18} color="#EF4444" /> Delete
                </MenuItem>
            </Menu>
        </TouchableOpacity>
    );
};

export default ChatCard;

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        marginHorizontal: 4,
        marginVertical: 4,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 2,
        elevation: 2,
    },
    leftContent: {
        position: 'relative',
        marginRight: 12,
    },
    avatarWrapper: {
        position: 'relative',
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#F3F4F6',
    },
    statusIconContainer: {
        position: 'absolute',
        bottom: -2,
        right: -2,
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#FFFFFF',
    },
    unreadBadge: {
        position: 'absolute',
        top: -4,
        left: -4,
        backgroundColor: '#F43F5E',
        borderRadius: 12,
        minWidth: 20,
        height: 20,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 6,
        borderWidth: 2,
        borderColor: '#FFFFFF',
    },
    unreadText: {
        color: '#FFFFFF',
        fontSize: 11,
        fontWeight: '600',
        textAlign: 'center',
    },
    middleContent: {
        flex: 1,
        justifyContent: 'center',
    },
    topRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    username: {
        fontSize: 15,
        fontWeight: '500',
        color: '#1F2937',
        maxWidth: screenWidth - 160,
    },
    pinIcon: {
        fontSize: 13,
        marginLeft: 4,
    },
    messageText: {
        fontSize: 13,
        color: '#6B7280',
        marginTop: 3,
        maxWidth: screenWidth - 160,
    },
    messageWithIcon: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 3,
        maxWidth: screenWidth - 160,
    },
    messageIcon: {
        marginRight: 4,
    },
    rightContent: {
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    timeText: {
        fontSize: 11,
        color: '#6B7280',
        marginBottom: 6,
    },
    menuIcon: {
        backgroundColor: '#F3F4F6',
        width: 28,
        height: 28,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    menu: {
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
    },
    menuItemText: {
        color: '#1F2937',
        fontSize: 13,
        marginLeft: 6,
    },
});