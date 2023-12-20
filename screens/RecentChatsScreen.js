import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { getFirestore, collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';

const RecentChats = ({ currentUserId }) => {
    const [recentChats, setRecentChats] = useState([]);
    const navigation = useNavigation();
    const firestore = getFirestore();

    useEffect(() => {
        const unsubscribe = onSnapshot(
            query(collection(firestore, 'messages'), orderBy('createdAt', 'desc')),
            (snapshot) => {
                const uniqueUsers = {};
                const chats = snapshot.docs.reduce((acc, doc) => {
                    const userId = doc.data().userId;
                    if (userId !== currentUserId && !uniqueUsers[userId]) {
                        uniqueUsers[userId] = true;
                        acc.push({
                            userId,
                            userName: doc.data().userName,
                            text: doc.data().message,
                        });
                    }
                    return acc;
                }, []);
                setRecentChats(chats);
            }
        );

        return () => {
            unsubscribe();
        };
    }, [firestore, currentUserId]);

    const handleChatPress = (userId, userName) => {
        // You can navigate to the chat screen with the selected user
        navigation.navigate('ChatScreen', { userId, userName });
    };

    const renderChatItem = ({ item }) => (
        <TouchableOpacity
            style={styles.chatItem}
            onPress={() => handleChatPress(item.userId, item.userName)}>
            <Text>{item.userName}</Text>
            <Text>{item.text}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={recentChats}
                keyExtractor={(item) => item.userId}
                renderItem={renderChatItem}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    chatItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderColor: '#ccc',
    },
});

export default RecentChats;
