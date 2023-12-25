import { StyleSheet, Text, View, Platform } from 'react-native';
import React, { useState, useCallback, useEffect } from 'react';
import { GiftedChat, InputToolbar, Composer } from 'react-native-gifted-chat';
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

export default function ChatScreen({ route }) {
    const uid = route.params.uid;
    const [messages, setMessages] = useState([]);
    const currentUser = authentication?.currentUser?.uid;

    useEffect(() => {
        const chatId =
            uid > currentUser ? `${uid + '-' + currentUser}` : `${currentUser + '-' + uid}`;
        const docref = doc(db, 'chatrooms', chatId);
        const colRef = collection(docref, 'messages');
        const q = query(colRef, orderBy('createdAt', 'desc'));
        const unsubcribe = onSnapshot(q, (onSnap) => {
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

        return () => {
            unsubcribe();
        };
    }, []);

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

        setMessages((previousMessages) =>
            GiftedChat.append(previousMessages, myMsg)
        );

        const chatId =
            uid > currentUser ? `${uid + '-' + currentUser}` : `${currentUser + '-' + uid}`;

        const docref = doc(db, 'chatrooms', chatId);
        const colRef = collection(docref, 'messages');
        const chatSnap = await addDoc(colRef, {
            ...myMsg,
            createdAt: serverTimestamp(),
        });
    }, []);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            aspect: [4, 3],
            quality: 0.1,
        });

        if (!result.canceled) {
            // Sử dụng "canceled" thay vì "cancelled"
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
                <Icon name="image" size={30} color="#007AFF" onPress={pickImage} />
            )}
        />
    );
}

const styles = StyleSheet.create({
    inputToolbar: {
        borderTopWidth: 1,
        borderTopColor: '#E8E8E8',
        backgroundColor: 'white',
    },
    textInput: {
        color: 'black',
    },
});
