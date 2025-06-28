// FeatureDevelopmentModal.tsx
import React from 'react';
import {
    Modal,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ViewStyle,
    TextStyle,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface FeatureDevelopmentModalProps {
    visible: boolean;
    onClose: () => void;
}

const FeatureDevelopmentModal: React.FC<FeatureDevelopmentModalProps> = ({
    visible,
    onClose,
}) => {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalHeader}>
                        <Icon name="construction" size={48} color="#FF9500" />
                    </View>

                    <Text style={styles.modalTitle}>Feature in Development</Text>
                    <Text style={styles.modalMessage}>
                        This feature is currently under construction and will be available in a future update.
                    </Text>

                    <TouchableOpacity style={styles.modalButton} onPress={onClose}>
                        <Text style={styles.modalButtonText}>Got it</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    } as ViewStyle,

    modalContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 24,
        alignItems: 'center',
        maxWidth: 300,
        width: '100%',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 8,
    } as ViewStyle,

    modalHeader: {
        marginBottom: 16,
    } as ViewStyle,

    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333333',
        marginBottom: 12,
        textAlign: 'center',
    } as TextStyle,

    modalMessage: {
        fontSize: 16,
        color: '#666666',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 24,
    } as TextStyle,

    modalButton: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 32,
        paddingVertical: 12,
        borderRadius: 8,
        minWidth: 100,
    } as ViewStyle,

    modalButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    } as TextStyle,
});

export default FeatureDevelopmentModal;
