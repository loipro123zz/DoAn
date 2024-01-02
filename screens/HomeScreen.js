import React, { useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ProfileScreen from './ProfileScreen'
import UserListScreen from './UserListScreen';

const Tab = createBottomTabNavigator();

const HomeScreen = ( {navigation} ) => {
    useEffect(() => {
        navigation.setOptions({ headerShown: false });
    }, []);

    return (
        <Tab.Navigator>
            <Tab.Screen
                name="UserList"
                component={UserListScreen}
                initialParams={{ screenName: 'User List' }}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Icon name="people" color={color} size={size} />
                    ),
                }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                initialParams={{ screenName: 'Profile' }}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Icon name="face" color={color} size={size} />
                    ),
                }}
            />

        </Tab.Navigator>
    );
};

export default HomeScreen;
