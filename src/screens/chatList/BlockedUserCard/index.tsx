import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    Dimensions,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const statusConfig: Record<
    string,
    { iconName: string; iconType: 'AntDesign' | 'FontAwesome'; color: string }
> = {
    online: { iconName: 'checkcircle', iconType: 'AntDesign', color: '#10B981' },
    away: { iconName: 'circle', iconType: 'FontAwesome', color: '#F59E0B' },
    busy: { iconName: 'circle', iconType: 'FontAwesome', color: '#EF4444' },
    offline: { iconName: 'closecircleo', iconType: 'AntDesign', color: '#6B7280' },
    donot_disturb: { iconName: 'minus-circle', iconType: 'FontAwesome', color: '#8B5CF6' },
};

interface BlockedUserCardProps {
    avatarUrl: string;
    blockedUserName: string;
    status: string;
    blockTime: string;
    blockReason: string;
    onUnblock: () => void;
}

const BlockedUserCard: React.FC<BlockedUserCardProps> = ({
    avatarUrl,
    blockedUserName,
    status,
    blockTime,
    blockReason,
    onUnblock,
}) => {
    const currentStatus = statusConfig[status] || statusConfig['offline'];

    return (
        <View style={styles.container}>

            <View style={styles.leftContent}>
                <View style={styles.avatarWrapper}>
                    <Image
                        source={{ uri: avatarUrl }}
                        style={styles.avatar}
                        accessibilityLabel={`Avatar of ${blockedUserName}`}
                    />
                    <View style={styles.statusIconContainer}>
                        {currentStatus.iconType === 'AntDesign' ? (
                            <AntDesign
                                name={currentStatus.iconName}
                                size={12}
                                color={currentStatus.color}
                            />
                        ) : (
                            <FontAwesome
                                name={currentStatus.iconName}
                                size={12}
                                color={currentStatus.color}
                            />
                        )}
                    </View>
                </View>
            </View>

            <View style={styles.middleContent}>
                <View style={styles.topRow}>
                    <Text style={styles.blockedUserName} numberOfLines={1}>
                        {blockedUserName}
                    </Text>
                </View>
                <Text style={styles.blockReasonText} numberOfLines={1}>
                    {blockReason}
                </Text>
            </View>

            <View style={styles.rightContent}>
                <Text style={styles.timeText}>{blockTime}</Text>
                <TouchableOpacity
                    style={styles.unblockButton}
                    onPress={onUnblock}
                    accessibilityLabel={`Unblock ${blockedUserName}`}
                    accessibilityRole="button"
                >
                    <AntDesign name="user" size={16} color="#2563EB" />
                    <Text style={styles.unblockButtonText}>Unblock</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default BlockedUserCard;

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
        marginRight: 12,
    },
    avatarWrapper: {
        position: 'relative',
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
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
    middleContent: {
        flex: 1,
        justifyContent: 'center',
    },
    topRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    blockedUserName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
        maxWidth: screenWidth - 200,
        marginRight: 8,
    },
    blockReasonText: {
        fontSize: 13,
        color: '#6B7280',
        marginTop: 4,
        maxWidth: screenWidth - 200,
    },
    rightContent: {
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    timeText: {
        fontSize: 11,
        color: '#6B7280',
        marginBottom: 8,
    },
    unblockButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#EFF6FF',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#2563EB',
    },
    unblockButtonText: {
        color: '#2563EB',
        fontSize: 13,
        fontWeight: '500',
        marginLeft: 4,
    },
});
