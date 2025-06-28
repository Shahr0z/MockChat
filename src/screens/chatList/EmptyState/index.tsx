import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

interface EmptyStateProps {
    icon: string;
    message: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ icon, message }) => {
    return (
        <View style={styles.container}>
            <View style={styles.iconWrapper}>
                <MaterialIcons name={icon} size={42} color="#9CA3AF" />
            </View>
            <Text style={styles.message}>{message}</Text>
        </View>
    );
};

export default EmptyState;

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
    container: {
        width: screenWidth - 40,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 32,
        borderRadius: 12,
        marginTop: screenHeight * 0.2,
    },
    iconWrapper: {
        backgroundColor: '#F3F4F6',
        borderRadius: 32,
        padding: 12,
        marginBottom: 12,
    },
    message: {
        color: '#6B7280',
        fontSize: 14,
        fontWeight: '500',
        textAlign: 'center',
    },
});
