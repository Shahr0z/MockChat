import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

type Tab = 'chats' | 'requests' | 'blocked';

interface TabItem {
    key: Tab;
    label: string;
    icon: string;
    badgeCount?: number;
}

interface TabsProps {
    onTabChange?: (tab: Tab) => void;
    defaultTab?: Tab;
    badgeData?: Partial<Record<Tab, number>>;
}

const Tabs: React.FC<TabsProps> = ({ onTabChange, defaultTab = 'chats', badgeData = {} }) => {
    const [activeTab, setActiveTab] = useState<Tab>(defaultTab);

    const tabItems: TabItem[] = [
        { key: 'chats', label: 'Chats', icon: 'chatbubble-outline', badgeCount: badgeData.chats },
        { key: 'requests', label: 'Requests', icon: 'mail-open-outline', badgeCount: badgeData.requests },
        { key: 'blocked', label: 'Blocked', icon: 'ban-outline', badgeCount: badgeData.blocked },
    ];

    const handleTabPress = (tab: Tab) => {
        setActiveTab(tab);
        onTabChange?.(tab);
    };

    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scrollContainer}
        >
            {tabItems.map(({ key, label, icon, badgeCount }) => {
                const isActive = activeTab === key;
                return (
                    <TouchableOpacity
                        key={key}
                        onPress={() => handleTabPress(key)}
                        style={[
                            styles.tab,
                            isActive ? styles.activeTab : styles.inactiveTab,
                        ]}
                    >
                        <View style={styles.iconLabelWrapper}>
                            <Icon
                                name={icon}
                                size={16}
                                color={isActive ? '#FFFFFF' : '#4B5563'}
                                style={styles.icon}
                            />
                            <Text
                                style={[
                                    styles.label,
                                    isActive ? styles.activeLabel : styles.inactiveLabel,
                                ]}
                            >
                                {label}
                            </Text>
                        </View>

                        {badgeCount !== undefined && badgeCount > 0 && (
                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>
                                    {badgeCount > 99 ? '99+' : badgeCount}
                                </Text>
                            </View>
                        )}
                    </TouchableOpacity>
                );
            })}
        </ScrollView>
    );
};

export default Tabs;

const styles = StyleSheet.create({
    scrollContainer: {
        height: 50,
        paddingHorizontal: 8,
        paddingVertical: 8,
        marginHorizontal: 16,
    },
    tab: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 20,
        marginRight: 8,
        position: 'relative',
    },
    activeTab: {
        backgroundColor: '#3B82F6',
    },
    inactiveTab: {
        backgroundColor: '#F3F4F6',
    },
    iconLabelWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        marginRight: 6,
    },
    label: {
        fontSize: 14,
    },
    activeLabel: {
        color: '#FFFFFF',
        fontWeight: '600',
    },
    inactiveLabel: {
        color: '#4B5563',
    },
    badge: {
        backgroundColor: '#EF4444',
        minWidth: 18,
        paddingHorizontal: 5,
        height: 18,
        borderRadius: 9,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: -4,
        right: -4,
    },
    badgeText: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
    },
});
