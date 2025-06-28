import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ViewStyle,
    TextStyle,
    StyleProp,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Avatar from '../Avatar';

// Status mapping
const statusConfig: Record<number, { color: string; label: string }> = {
    0: { color: '#6B7280', label: 'Offline' },
    1: { color: '#10B981', label: 'Online' },
    2: { color: '#8B0000', label: 'Busy' },
    3: { color: '#FF0000', label: 'Away' },
    4: { color: '#FFA500', label: 'Invisible' },
};

interface ChatHeaderProps {
    userName?: string;
    avatarImage?: string;
    userStatus?: number;
    onBackPress: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
    userName,
    avatarImage,
    userStatus = 0,
    onBackPress,
}) => {
    const displayName = userName || 'Alex Johnson';
    const initial = displayName.charAt(0).toUpperCase();
    const status = statusConfig[userStatus] || statusConfig[0]; // Default to 'Offline'

    return (
        <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={onBackPress}>
                <Icon name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>

            <View style={styles.headerInfo}>
                <Avatar
                    imageUri={avatarImage}
                    letter={initial}
                    size={40}
                    backgroundColor="#6366F1"
                    style={styles.headerAvatar}
                />
                <View style={styles.headerDetails}>
                    <Text style={styles.headerName}>{displayName}</Text>
                    <Text style={[styles.onlineStatus, { color: status.color }]}>
                        {status.label}
                    </Text>
                </View>
            </View>

            <View style={styles.headerActions}>
                <TouchableOpacity style={styles.headerButton}>
                    <Icon name="more-vert" size={20} color="#666" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    } as ViewStyle,
    backButton: {
        marginRight: 16,
        padding: 4,
    } as ViewStyle,
    headerInfo: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    } as ViewStyle,
    headerAvatar: {
        marginRight: 12,
    } as ViewStyle,
    headerDetails: {
        flex: 1,
    } as ViewStyle,
    headerName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 2,
    } as TextStyle,
    onlineStatus: {
        fontSize: 12,
        fontWeight: '500',
    } as TextStyle,
    headerActions: {
        flexDirection: 'row',
    } as ViewStyle,
    headerButton: {
        padding: 8,
        marginLeft: 4,
    } as ViewStyle,
});

export default ChatHeader;
