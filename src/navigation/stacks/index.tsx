import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from "@react-navigation/native"
import ChatScreen from '../../screens/chatMessage';
import BottomTab from '../bottomTabs';
const Stack = createStackNavigator();

const StackNavigation = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false, }} initialRouteName='bottomTab'>
                <Stack.Screen name="bottomTab" component={BottomTab} />
                <Stack.Screen name="ChatScreen" component={ChatScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default StackNavigation