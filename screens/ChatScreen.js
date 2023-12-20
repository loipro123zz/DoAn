import { StyleSheet, Text, View } from 'react-native'
import React, { useState, useCallback, useEffect } from 'react'
import { GiftedChat, Bubble, Send } from 'react-native-gifted-chat'
import { authentication } from '../firebaseConfig';
import { addDoc, collection, serverTimestamp, doc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const renderBubble = (props) => {
    return (
        <Bubble
            {...props}
            wrapperStyle={{
                right: {
                    backgroundColor: '#3ECE00',
                },
                left: {
                    backgroundColor: '#E5E5EA',
                },
            }}
        />
    );
};

const renderSend = (props) => {
    return (
        <Send {...props}>
            <View style={styles.sendButton}>
                <Text style={styles.sendButtonText}>Send</Text>
            </View>
        </Send>
    );
};

export default function ChatScreen({ route }) {
    const uid = route.params.uid
    const [messages, setMessages] = useState([]);
    const currentUser = authentication?.currentUser?.uid;

    useEffect(() => {
        const chatId = uid > currentUser ? `${uid + '-' + currentUser}` : `${currentUser + '-' + uid}`;
        const docref = doc(db, 'chatrooms', chatId);
        const colRef = collection(docref, 'messages');
        const q = query(colRef, orderBy('createdAt', "desc"));
        const unsubcribe = onSnapshot(q, (onSnap) => {
            const allMsg = onSnap.docs.map(mes => {
                if (mes.data().createdAt) {
                    return {
                        ...mes.data(),
                        createdAt: mes.data().createdAt.toDate()
                    }
                } else {
                    return {
                        ...mes.data(),
                        createdAt: new Date()
                    }
                }
            })
            setMessages(allMsg)
        })

        return () => {
            unsubcribe()
        }
    }, [])

    const onSend = useCallback((messagesArray) => {
        const msg = messagesArray[0];
        const myMsg = {
            ...msg,
            sentBy: currentUser,
            sentTo: uid
        }
        setMessages(previousMessages => GiftedChat.append(previousMessages, myMsg))
        const chatId = uid > currentUser ? `${uid + '-' + currentUser}` : `${currentUser + '-' + uid}`;
        const docref = doc(db, 'chatrooms', chatId);
        const colRef = collection(docref, 'messages');
        const chatSnap = addDoc(colRef, {
            ...myMsg,
            createdAt: serverTimestamp(),
        })
    }, [])

    return (
        <View style={styles.container}>
            <GiftedChat
                messages={messages}
                onSend={text => onSend(text)}
                user={{
                    _id: currentUser,
                }}
                containerStyle={styles.chatContainer}
                renderBubble={renderBubble}
                renderSend={renderSend}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f0f0',
    },
    chatContainer: {
        flex: 1,
        marginBottom: 0,
    },
    sendButton: {
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
        height: '100%',
        backgroundColor: '#007BFF',
        borderRadius: 15,
        paddingHorizontal: 15,
        width: 100,
    },
    sendButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
    },
});
