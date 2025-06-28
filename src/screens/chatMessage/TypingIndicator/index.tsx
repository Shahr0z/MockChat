import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    ViewStyle,
    TextStyle,
} from 'react-native';
import Avatar from '../Avatar';

const { width } = Dimensions.get('window');

const TypingIndicator: React.FC = () => (
    <View style={styles.typingContainer}>
        <Avatar letter="A" backgroundColor="#6366F1" style={styles.avatar} />
        <View style={styles.typingBubble}>
            <Text style={styles.typingText}>typing...</Text>
        </View>
    </View>
);

const styles = StyleSheet.create({
    typingContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        marginBottom: 16,
        maxWidth: width * 0.8,
    } as ViewStyle,
    avatar: {
        marginHorizontal: 8,
    } as ViewStyle,
    typingBubble: {
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        borderBottomRightRadius: 16,
        borderBottomLeftRadius: 0,
        paddingHorizontal: 16,
        paddingVertical: 10,
    } as ViewStyle,
    typingText: {
        color: '#666',
        fontSize: 14,
        fontStyle: 'italic',
    } as TextStyle,
});

export default TypingIndicator;
