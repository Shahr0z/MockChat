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
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const statusConfig = {
    online: { iconName: 'checkcircle', iconType: 'AntDesign', color: '#10B981' },
    away: { iconName: 'circle', iconType: 'FontAwesome', color: '#F59E0B' },
    Busy: { iconName: 'circle', iconType: 'FontAwesome', color: '#EF4444' },
    offline: { iconName: 'closecircleo', iconType: 'AntDesign', color: '#6B7280' },
    donot_disturb: { iconName: 'minus-circle', iconType: 'FontAwesome', color: '#8B5CF6' },
};

const requestTypes = {
    text: { icon: null, label: null },
    image: { icon: 'image', label: 'Photo' },
    video: { icon: 'videocam', label: '🎥 Video' },
    audio: { icon: 'mic', label: '🎵 Audio' },
    location: { icon: 'location-on', label: 'Location' },
    document: { icon: 'description', label: '📄 Document' },
    gif: { icon: 'gif', label: '🎞️ GIF' },
};

interface RequestListCardProps {
    avatarUrl: string;
    requesterName: string;
    status: string;
    requestDetails: string;
    requestType?: keyof typeof requestTypes;
    requestTime: string;
    pendingCount?: number;
    onAccept: () => void;
    onCancel: () => void;
}

const RequestListCard: React.FC<RequestListCardProps> = ({
    avatarUrl,
    requesterName,
    status,
    requestDetails,
    requestType = 'text',
    requestTime,
    pendingCount = 0,
    onAccept,
    onCancel,
}) => {
    const statusInfo = statusConfig[status] || statusConfig.offline;
    const requestInfo = requestTypes[requestType] || requestTypes.text;

    const renderRequestContent = () => {
        if (requestType === 'text') {
            return (
                <Text style={styles.requestText} numberOfLines={1}>
                    {requestDetails}
                </Text>
            );
        }

        return (
            <View style={styles.requestWithIcon}>
                {requestInfo.icon && (
                    <MaterialIcons
                        name={requestInfo.icon}
                        size={14}
                        color="#6B7280"
                        style={{ marginRight: 4 }}
                    />
                )}
                <Text style={styles.requestText} numberOfLines={1}>
                    {requestInfo.label}
                </Text>
            </View>
        );
    };

    return (
        <TouchableOpacity style={styles.container} activeOpacity={0.85}>

            <View style={styles.leftContent}>
                <View style={styles.avatarWrapper}>
                    <Image source={{ uri: avatarUrl }} style={styles.avatar} />
                    <View style={styles.statusIconContainer}>
                        {statusInfo.iconType === 'AntDesign' ? (
                            <AntDesign
                                name={statusInfo.iconName}
                                size={12}
                                color={statusInfo.color}
                            />
                        ) : (
                            <FontAwesome
                                name={statusInfo.iconName}
                                size={12}
                                color={statusInfo.color}
                            />
                        )}
                    </View>
                    {pendingCount > 0 && (
                        <View style={styles.pendingBadge}>
                            <Text style={styles.pendingText}>
                                {pendingCount > 99 ? '99+' : pendingCount}
                            </Text>
                        </View>
                    )}
                </View>
            </View>

            <View style={styles.middleContent}>
                <View style={styles.topRow}>
                    <Text style={styles.requesterName} numberOfLines={1}>
                        {requesterName}
                    </Text>
                </View>
                {renderRequestContent()}

                <View style={styles.buttonRow}>
                    <TouchableOpacity
                        style={[styles.actionButton, styles.acceptButton]}
                        onPress={onAccept}
                    >
                        <Text style={styles.buttonText}>Accept</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.actionButton, styles.cancelButton]}
                        onPress={onCancel}
                    >
                        <Text style={styles.buttonText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.rightContent}>
                <Text style={styles.timeText}>{requestTime}</Text>
            </View>
        </TouchableOpacity>
    );
};

export default RequestListCard;

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
    pendingBadge: {
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
    pendingText: {
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
    requesterName: {
        fontSize: 15,
        fontWeight: '500',
        color: '#1F2937',
        maxWidth: screenWidth - 160,
    },
    requestText: {
        fontSize: 13,
        color: '#6B7280',
        marginTop: 3,
        maxWidth: screenWidth - 160,
    },
    requestWithIcon: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 3,
        maxWidth: screenWidth - 160,
    },
    buttonRow: {
        flexDirection: 'row',
        marginTop: 8,
    },
    actionButton: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 8,
        marginRight: 8,
    },
    acceptButton: {
        backgroundColor: '#10B981',
    },
    cancelButton: {
        backgroundColor: '#EF4444',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '500',
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
});
