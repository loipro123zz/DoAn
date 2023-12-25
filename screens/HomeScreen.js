// Trong HomeScreen.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Hoặc sử dụng một thư viện icon khác tùy chọn

import RecentChatsScreen from './RecentChatsScreen'; // Tạo các màn hình con tương ứng
import UserListScreen from './UserListScreen';


const Tab = createBottomTabNavigator();

const HomeScreen = () => {
    return (
        <Tab.Navigator>
            <Tab.Screen
                name="RecentChats"
                component={RecentChatsScreen}
                options={{
                    tabBarLabel: 'Recent Chats',
                    tabBarIcon: ({ color, size }) => (
                        <Icon name="chat-bubble" color={color} size={size} />
                    ),
                }}
            />
            <Tab.Screen
                name="UserList"
                component={UserListScreen}
                options={{
                    tabBarLabel: 'User List',
                    tabBarIcon: ({ color, size }) => (
                        <Icon name="people" color={color} size={size} />
                    ),
                }}
            />

        </Tab.Navigator>
    );
};

export default HomeScreen;
