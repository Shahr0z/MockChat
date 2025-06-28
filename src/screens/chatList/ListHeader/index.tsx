import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Animated, Easing } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

interface ListHeaderProps {
    onBackPress?: () => void;
    onSettingsPress?: () => void;
    status?: number;
    onStatusChange?: (status: number) => void;
}

const statusConfig = {
    1: { iconName: 'checkcircle', iconType: 'AntDesign', color: '#10B981', label: 'Online' },
    2: { iconName: 'circle', iconType: 'FontAwesome', color: '#8B0000', label: 'Busy' },
    3: { iconName: 'circle', iconType: 'FontAwesome', color: '#FF0000', label: 'Away' },
    0: { iconName: 'closecircleo', iconType: 'AntDesign', color: '#6B7280', label: 'Offline' },
};

const ListHeader: React.FC<ListHeaderProps> = ({
    onBackPress,
    onSettingsPress,
    status = 1,
    onStatusChange,
}) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [fadeAnim] = useState(new Animated.Value(0));
    const [scaleAnim] = useState(new Animated.Value(0.8));

    // Fallback to default status if provided status is invalid
    const selectedStatus = statusConfig[status as keyof typeof statusConfig] || statusConfig[1];

    const openModal = () => {
        setModalVisible(true);
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 200,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: true,
            }),
        ]).start();
    };

    const closeModal = () => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
                toValue: 0.8,
                duration: 200,
                useNativeDriver: true,
            }),
        ]).start(() => setModalVisible(false));
    };

    const handleStatusSelect = (statusKey: number) => {
        onStatusChange?.(statusKey);
        closeModal();
    };

    const renderIcon = (config: typeof statusConfig[0], size = 20) => {
        if (config.iconType === 'AntDesign') {
            return <AntDesign name={config.iconName} size={size} color={config.color} />;
        }
        return <FontAwesome name={config.iconName} size={size} color={config.color} />;
    };

    return (
        <View style={styles.header}>
            <View style={styles.headerTop}>
                {/* <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
                    <Icon name="arrow-back" size={20} color="#374151" />
                </TouchableOpacity> */}

                <Text style={styles.headerTitle}>Chats</Text>

                <View style={styles.headerRight}>
                    <TouchableOpacity onPress={openModal} style={styles.statusButton}>
                        {renderIcon(selectedStatus, 16)}
                        <Text style={styles.statusText}>{selectedStatus.label}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onSettingsPress} style={styles.settingsButton}>
                        <Icon name="settings-outline" style={styles.settingsIcon} color="#000" />
                    </TouchableOpacity>
                </View>
            </View>

            <Modal
                transparent
                visible={modalVisible}
                onRequestClose={closeModal}
            >
                <View style={[styles.modalOverlay]}>
                    <View style={[styles.modalContent]}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Set Status</Text>
                            <TouchableOpacity onPress={closeModal}>
                                <Icon name="close" size={24} color="#374151" />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.statusList}>
                            {Object.entries(statusConfig).map(([key, config]) => (
                                <TouchableOpacity
                                    key={key}
                                    style={[
                                        styles.statusOption,
                                        status === Number(key) && styles.selectedStatus,
                                    ]}
                                    onPress={() => handleStatusSelect(Number(key))}
                                >
                                    {renderIcon(config)}
                                    <Text style={styles.statusOptionText}>{config.label}</Text>
                                    {status === Number(key) && (
                                        <AntDesign name="check" size={20} color="#10B981" style={styles.checkIcon} />
                                    )}
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default ListHeader;

const styles = StyleSheet.create({
    header: {
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 14,
        paddingVertical: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    headerTop: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 8,
        marginBottom: 16,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#111827',
        flex: 1,
        marginLeft: 8,
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 8,
    },
    statusText: {
        fontSize: 14,
        color: '#374151',
        marginLeft: 6,
        fontWeight: '500',
    },
    settingsButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
        justifyContent: 'center',
    },
    settingsIcon: {
        fontSize: 18,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        width: '85%',
        maxWidth: 400,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#111827',
    },
    statusList: {
        gap: 8,
    },
    statusOption: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 12,
        backgroundColor: '#F9FAFB',
    },
    selectedStatus: {
        backgroundColor: '#E8F5E9',
    },
    statusOptionText: {
        fontSize: 16,
        color: '#374151',
        marginLeft: 12,
        flex: 1,
    },
    checkIcon: {
        marginLeft: 8,
    },
});

// import React from 'react';
// import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
// import Icon from 'react-native-vector-icons/Ionicons';

// interface ListHeaderProps {
//     onBackPress?: () => void;
//     onSettingsPress?: () => void;
//     status?: string;
// }

// const ListHeader: React.FC<ListHeaderProps> = ({
//     onBackPress,
//     onSettingsPress,
//     status = 'online',
// }) => {
//     const statusOptions = [
//         { value: 'online', label: 'Online', color: '#10B981' },
//         { value: 'away', label: 'Away', color: '#F59E0B' },
//         { value: 'busy', label: 'Busy', color: '#EF4444' },
//         { value: 'offline', label: 'Offline', color: '#6B7280' },
//         { value: 'donot_disturb', label: 'Do Not Disturb', color: '#8B5CF6' },
//     ];

//     const selectedStatus = statusOptions.find(
//         option => option.value === status.toLowerCase()
//     );

//     return (
//         <View style={styles.header}>
//             <View style={styles.headerTop}>
//                 <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
//                     <Icon name="arrow-back" size={20} color="#374151" />
//                 </TouchableOpacity>

//                 <Text style={styles.headerTitle}>Chats</Text>

//                 <View style={styles.headerRight}>
//                     {selectedStatus && (
//                         <View style={styles.statusButton}>
//                             <View
//                                 style={[
//                                     styles.statusDot,
//                                     { backgroundColor: selectedStatus.color },
//                                 ]}
//                             />
//                             <Text style={styles.statusText}>
//                                 {selectedStatus.label}
//                             </Text>
//                         </View>
//                     )}
//                     <TouchableOpacity onPress={onSettingsPress} style={styles.settingsButton}>
//                         <Icon name="settings-outline" style={styles.settingsIcon} color="#000" />
//                     </TouchableOpacity>
//                 </View>
//             </View>
//         </View>
//     );
// };

// export default ListHeader;

// const styles = StyleSheet.create({
//     header: {
//         backgroundColor: '#FFFFFF',
//         paddingHorizontal: 14,
//         paddingVertical: 4,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.1,
//         shadowRadius: 4,
//         elevation: 3,
//     },
//     headerTop: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'space-between',
//         paddingTop: 8,
//         marginBottom: 16,
//     },
//     backButton: {
//         width: 40,
//         height: 40,
//         borderRadius: 20,
//         backgroundColor: '#F3F4F6',
//         alignItems: 'center',
//         justifyContent: 'center',
//     },
//     headerTitle: {
//         fontSize: 24,
//         fontWeight: 'bold',
//         color: '#111827',
//         flex: 1,
//         marginLeft: 8,
//     },
//     headerRight: {
//         flexDirection: 'row',
//         alignItems: 'center',
//     },
//     statusButton: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         backgroundColor: '#F3F4F6',
//         paddingHorizontal: 12,
//         paddingVertical: 8,
//         borderRadius: 20,
//         marginRight: 8,
//     },
//     statusDot: {
//         width: 8,
//         height: 8,
//         borderRadius: 4,
//         marginRight: 6,
//     },
//     statusText: {
//         fontSize: 14,
//         color: '#374151',
//         textTransform: 'capitalize',
//     },
//     settingsButton: {
//         width: 40,
//         height: 40,
//         borderRadius: 20,
//         backgroundColor: '#F3F4F6',
//         alignItems: 'center',
//         justifyContent: 'center',
//     },
//     settingsIcon: {
//         fontSize: 18,
//     },
// });
