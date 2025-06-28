import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    SafeAreaView,
    TouchableOpacity,
    Animated,
    Linking,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import styles from './styles';

const ProfileScreen = () => {
    const [selectedContact, setSelectedContact] = useState(null);
    const [animatedValue] = useState(new Animated.Value(0));

    const contactInfo = [
        {
            id: 'email',
            icon: 'email',
            iconFamily: 'MaterialIcons',
            label: 'Email',
            value: 'shahrozkhalid999@gmail.com',
            color: '#EA4335',
            backgroundColor: '#FEF2F2',
        },
        {
            id: 'linkedin',
            icon: 'linkedin',
            iconFamily: 'FontAwesome',
            label: 'LinkedIn',
            value: 'linkedin.com/in/shahrozkhalid',
            color: '#0A66C2',
            backgroundColor: '#EFF6FF',
        },
        {
            id: 'github',
            icon: 'github',
            iconFamily: 'FontAwesome',
            label: 'GitHub',
            value: 'github.com/Shahr0z',
            color: '#333333',
            backgroundColor: '#F9FAFB',
        },
    ];

    const handleContactPress = (contactId) => {
        setSelectedContact(contactId);

        if (contactId === 'linkedin') {
            Linking.openURL(`https://www.linkedin.com/in/shahrozkhalid/`);
        } else if (contactId === 'github') {
            Linking.openURL(`https://github.com/Shahr0z`);
        } else {
            Linking.openURL(`mailto:shahrozkhalid999@gmail.com`);
        }

        Animated.sequence([
            Animated.timing(animatedValue, {
                toValue: 1,
                duration: 150,
                useNativeDriver: true,
            }),
            Animated.timing(animatedValue, {
                toValue: 0,
                duration: 150,
                useNativeDriver: true,
            }),
        ]).start();

        setTimeout(() => setSelectedContact(null), 300);
    };

    const renderContactItem = (item) => {
        const isSelected = selectedContact === item.id;
        const scale = isSelected ? animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 0.95],
        }) : 1;

        return (
            <Animated.View
                key={item.id}
                style={[
                    styles.contactItem,
                    { backgroundColor: item.backgroundColor },
                    isSelected && styles.selectedItem,
                    { transform: [{ scale }] }
                ]}
            >
                <TouchableOpacity
                    style={styles.contactTouchable}
                    onPress={() => handleContactPress(item.id)}
                    activeOpacity={0.7}
                >
                    <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
                        {item.iconFamily === 'FontAwesome' ? (
                            <FontAwesome name={item.icon} size={20} color="#FFFFFF" />
                        ) : (
                            <Icon name={item.icon} size={20} color="#FFFFFF" />
                        )}
                    </View>
                    <View style={styles.contactInfo}>
                        <Text style={styles.contactLabel}>{item.label}</Text>
                        <Text style={styles.contactValue}>{item.value}</Text>
                    </View>
                    <Icon name="chevron-right" size={24} color="#9CA3AF" />
                </TouchableOpacity>
            </Animated.View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Header with Gradient */}
                <View style={styles.header}>
                    <View style={styles.headerGradient}>
                        <Text style={styles.headerTitle}>Profile</Text>
                        <Text style={styles.headerSubtitle}>Personal Information</Text>
                    </View>
                </View>

                <View style={styles.avatarSection}>
                    <View style={styles.avatarContainer}>
                        <View style={styles.avatarGlow}>
                            <View style={styles.avatar}>
                                <Text style={styles.avatarText}>SH</Text>
                            </View>
                        </View>
                        <View style={styles.statusIndicator}>
                            <View style={styles.onlineStatus} />
                            <View style={styles.onlinePulse} />
                        </View>
                    </View>

                    <Text style={styles.userName}>Shahroz Khalid</Text>
                    <Text style={styles.userHandle}>@shahr0z</Text>
                    <View style={styles.roleContainer}>
                        <Icon name="code" size={18} color="#8B5CF6" style={styles.roleIcon} />
                        <Text style={styles.userRole}>React Native Developer</Text>
                    </View>

                    {/* Stats Row */}
                    <View style={styles.statsContainer}>
                        <View style={styles.statItem}>
                            <Text style={styles.statNumber}>3.6+</Text>
                            <Text style={styles.statLabel}>Years Exp</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statNumber}>26+</Text>
                            <Text style={styles.statLabel}>Projects</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statNumber}>2022</Text>
                            <Text style={styles.statLabel}>Since</Text>
                        </View>
                    </View>
                </View>

                {/* Contact Information */}
                <View style={styles.contactSection}>
                    <Text style={styles.sectionTitle}>Get in Touch</Text>
                    <Text style={styles.sectionSubtitle}>Feel free to reach out through any platform</Text>

                    <View style={styles.contactList}>
                        {contactInfo.map(renderContactItem)}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default ProfileScreen;