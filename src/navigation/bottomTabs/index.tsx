import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ProfileScreen from '../../screens/profileScreen';
import NewChatListScreen from '../../screens/chatList';

const ACTIVE_COLOR = '#007AFF';
const INACTIVE_COLOR = '#8E8E93';
const TAB_BAR_BACKGROUND = '#FFFFFF';

const Tab = createBottomTabNavigator();

const BottomTab: React.FC = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: ACTIVE_COLOR,
                tabBarInactiveTintColor: INACTIVE_COLOR,
                tabBarHideOnKeyboard: true,
                tabBarShowLabel: true,
                tabBarLabelStyle: {
                    fontSize: 12,
                    marginBottom: 5,
                },
                tabBarStyle: {
                    backgroundColor: TAB_BAR_BACKGROUND,
                    height: 60,
                    paddingBottom: 5,
                },
            }}
        >
            <Tab.Screen
                name="Home"
                component={NewChatListScreen}
                options={{
                    tabBarLabel: 'Chat',
                    tabBarIcon: ({ focused, color }: { focused: boolean; color: string }) => (
                        <FontAwesome
                            name={focused ? 'comments' : 'comments-o'}
                            size={22}
                            color={color}
                        />
                    ),
                }}
            />
            <Tab.Screen
                name="ProfileScreen"
                component={ProfileScreen}
                options={{
                    tabBarLabel: 'Profile',
                    tabBarIcon: ({ focused, color }: { focused: boolean; color: string }) => (
                        <MaterialIcons
                            name={focused ? 'person' : 'person-outline'}
                            size={24}
                            color={color}
                        />
                    ),
                }}
            />
        </Tab.Navigator>
    );
};

export default BottomTab;
