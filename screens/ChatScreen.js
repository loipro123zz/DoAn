// ChatScreen.js
import React, { useState, useCallback, useEffect } from 'react';
import { StyleSheet, View, Image, TouchableOpacity, Text } from 'react-native';
import { GiftedChat, InputToolbar, Composer, Bubble } from 'react-native-gifted-chat';
import { Icon } from 'react-native-elements';
import { authentication } from '../firebaseConfig';
import {
    addDoc,
    collection,
    serverTimestamp,
    doc,
    onSnapshot,
    query,
    orderBy,
} from 'firebase/firestore';
import { db } from '../firebaseConfig';
import * as ImagePicker from 'expo-image-picker';
import { createStackNavigator } from '@react-navigation/stack';
import UserProfileScreen from './UserProfileScreen';

const Stack = createStackNavigator();

const ChatScreen = ({ route, navigation }) => {
    const uid = route.params.uid;
    const [messages, setMessages] = useState([]);
    const [otherUserOnline, setOtherUserOnline] = useState(false);
    const currentUser = authentication?.currentUser?.uid;

    useEffect(() => {
        const chatId =
            uid > currentUser ? `${uid + '-' + currentUser}` : `${currentUser + '-' + uid}`;
        const docref = doc(db, 'chatrooms', chatId);
        const colRef = collection(docref, 'messages');
        const q = query(colRef, orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (onSnap) => {
            const allMsg = onSnap.docs.map((mes) => {
                if (mes.data().createdAt) {
                    return {
                        ...mes.data(),
                        createdAt: mes.data().createdAt.toDate(),
                    };
                } else {
                    return {
                        ...mes.data(),
                        createdAt: new Date(),
                    };
                }
            });
            setMessages(allMsg);
        });

        const otherUserDocRef = doc(db, 'users', uid);
        const unsubscribeUser = onSnapshot(otherUserDocRef, (userSnap) => {
            if (userSnap.exists()) {
                const userData = userSnap.data();
                setOtherUserOnline(userData.online || false);
                navigation.setOptions({
                    title: (
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text>{userData.username}</Text>
                            {otherUserOnline ? (
                                <View style={styles.onlineIndicator} />
                            ) : (
                                <View style={styles.offlineIndicator} />
                            )}
                        </View>
                    ),
                    headerLeft: () => (
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 10 }}>
                            <Icon
                                name="arrow-back"
                                type="material"
                                size={30}
                                onPress={() => navigation.goBack()}
                            />
                            <TouchableOpacity
                                onPress={() => {
                                    navigation.navigate('UserProfile', { userData });
                                }}
                            >
                                <Image
                                    source={{ uri: userData.avatarUrl }}
                                    style={{ width: 40, height: 40, borderRadius: 20, marginLeft: 10, borderWidth: 1, borderColor: 'black' }}
                                />
                            </TouchableOpacity>
                        </View>
                    ),
                });
            }
        });

        return () => {
            unsubscribe();
            unsubscribeUser();
        };
    }, [uid, currentUser, otherUserOnline]);

    const onSend = useCallback(async (messagesArray) => {
        const msg = messagesArray[0];
        const myMsg = {
            ...msg,
            sentBy: currentUser,
            sentTo: uid,
        };

        if (msg.image) {
            const imageUri = msg.image;
            myMsg.image = imageUri;
        }

        setMessages((previousMessages) => GiftedChat.append(previousMessages, myMsg));

        const chatId =
            uid > currentUser ? `${uid + '-' + currentUser}` : `${currentUser + '-' + uid}`;

        const docref = doc(db, 'chatrooms', chatId);
        const colRef = collection(docref, 'messages');
        await addDoc(colRef, {
            ...myMsg,
            createdAt: serverTimestamp(),
        });
    }, [currentUser, uid]);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            aspect: [4, 3],
            quality: 0.1,
        });

        if (!result.canceled) {
            const imageUri = result.assets ? result.assets[0].uri : result.uri;

            const imageMessage = {
                _id: new Date().getTime(),
                text: '',
                image: imageUri,
                createdAt: new Date(),
                user: {
                    _id: currentUser,
                },
            };

            onSend([imageMessage]);
        }
    };

    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen
                name="ChatMain"
                children={() => (
                    <GiftedChat
                        messages={messages}
                        onSend={(text) => onSend(text)}
                        user={{
                            _id: currentUser,
                        }}
                        renderInputToolbar={(props) => (
                            <InputToolbar {...props} containerStyle={styles.inputToolbar} />
                        )}
                        renderComposer={(props) => (
                            <Composer
                                {...props}
                                placeholder="Type a message..."
                                textInputStyle={styles.textInput}
                            />
                        )}
                        renderActions={() => (
                            <View style={styles.imageIconContainer}>
                                <Icon name="image" style={styles.imageIcon} onPress={pickImage} />
                            </View>
                        )}
                        renderBubble={(props) => (
                            <Bubble
                                {...props}
                                textStyle={{
                                    right: {
                                        color: 'white',
                                    },
                                    left: {
                                        color: 'black',
                                    },
                                }}
                                wrapperStyle={{
                                    left: {
                                        backgroundColor: '#FFFFFF',
                                    },
                                    right: {
                                        backgroundColor: '#1CC3E8',
                                    },
                                }}
                            />
                        )}
                    />
                )}
            />
            <Stack.Screen
                name="UserProfile"
                component={UserProfileScreen}
                options={{
                    headerShown: false,
                }}
            />
        </Stack.Navigator>
    );
};

const styles = StyleSheet.create({
    inputToolbar: {
        borderTopWidth: 1,
        borderTopColor: '#E8E8E8',
        backgroundColor: 'white',
        paddingBottom: 10,
    },
    textInput: {
        color: 'black',
        minHeight: 50,
    },
    onlineIndicator: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: 'green',
        marginLeft: 5,
    },
    offlineIndicator: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: 'gray',
        marginLeft: 5,
    },
    imageIconContainer: {
        marginLeft: 20,
        marginBottom: 20,
        width: 40,
        height: 40,
        borderRadius: 30,
        backgroundColor: '#1CC3E8',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 5,
    },
    imageIcon: {
        fontSize: 50,
        color: 'white',
    },

});

export default ChatScreen;
