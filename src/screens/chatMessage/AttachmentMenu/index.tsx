import React, { useRef, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Animated,
    ViewStyle,
    TextStyle,
    Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');

interface AttachmentOption {
    id: 'camera' | 'gallery' | 'location' | 'document' | 'audio' | 'contact';
    icon: string;
    label: string;
    color: string;
}

interface AttachmentMenuProps {
    visible: boolean;
    onSelectAttachment: (id: AttachmentOption['id']) => void;
}

const AttachmentMenu: React.FC<AttachmentMenuProps> = ({
    visible,
    onSelectAttachment,
}) => {

    const slideAnim = useRef(new Animated.Value(200)).current;

    useEffect(() => {
        if (visible) {
            // Slide up animation
            Animated.spring(slideAnim, {
                toValue: 0,
                useNativeDriver: true,
                tension: 100,
                friction: 8,
            }).start();
        } else {
            // Slide down animation
            Animated.spring(slideAnim, {
                toValue: 200,
                useNativeDriver: true,
                tension: 100,
                friction: 8,
            }).start();
        }
    }, [visible, slideAnim]);

    const attachmentOptions: AttachmentOption[] = [
        {
            id: 'camera',
            icon: 'photo-camera',
            label: 'Camera',
            color: '#FF6B6B',
        },
        {
            id: 'gallery',
            icon: 'photo-library',
            label: 'Gallery',
            color: '#4ECDC4',
        },
        {
            id: 'location',
            icon: 'location-on',
            label: 'Location',
            color: '#45B7D1',
        },
        {
            id: 'document',
            icon: 'description',
            label: 'Document',
            color: '#96CEB4',
        },
        {
            id: 'audio',
            icon: 'mic',
            label: 'Audio',
            color: '#FFEAA7',
        },
        {
            id: 'contact',
            icon: 'person',
            label: 'Contact',
            color: '#DDA0DD',
        },
    ];

    const handleOptionPress = (optionId: AttachmentOption['id']) => {
        onSelectAttachment(optionId);
    };

    if (!visible) return null;

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    transform: [{ translateY: slideAnim }],
                },
            ]}
        >
            <View style={styles.header}>
                <View style={styles.indicator} />
            </View>

            <View style={styles.optionsContainer}>
                {attachmentOptions.map((option, index) => (
                    <TouchableOpacity
                        key={option.id}
                        style={styles.option}
                        onPress={() => handleOptionPress(option.id)}
                        activeOpacity={0.8}
                    >
                        <View style={[styles.iconContainer, { backgroundColor: option.color }]}>
                            <Icon name={option.icon} size={24} color="#FFFFFF" />
                        </View>
                        <Text style={styles.optionText}>{option.label}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 65,
        left: 0,
        right: 0,
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingBottom: 20,
        zIndex: 10,
    } as ViewStyle,

    header: {
        alignItems: 'center',
        paddingTop: 12,
        paddingBottom: 16,
    } as ViewStyle,

    indicator: {
        width: 40,
        height: 4,
        backgroundColor: '#E0E0E0',
        borderRadius: 2,
    } as ViewStyle,

    optionsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 20,
        justifyContent: 'space-between',
    } as ViewStyle,

    option: {
        alignItems: 'center',
        width: (width - 80) / 3,
        marginBottom: 20,
    } as ViewStyle,

    iconContainer: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 4,
    } as ViewStyle,

    optionText: {
        fontSize: 13,
        color: '#333333',
        fontWeight: '500',
        textAlign: 'center',
    } as TextStyle,
});

export default AttachmentMenu;
