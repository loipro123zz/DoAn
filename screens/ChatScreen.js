import { StyleSheet, Text, View, Button, TouchableOpacity } from 'react-native'
import React, { useState, useCallback, useEffect } from 'react'
import { GiftedChat } from 'react-native-gifted-chat'
import { authentication } from '../firebaseConfig';
import { addDoc, collection, serverTimestamp, doc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../firebaseConfig';

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
        <GiftedChat
            messages={messages}
            onSend={text => onSend(text)}
            user={{
                _id: currentUser,
            }}
            renderSend={(props) => (
                <TouchableOpacity
                    {...props}
                    style={styles.sendButton}
                    onPress={() => {
                        if (props.text && props.onSend) {
                            props.onSend({ text: props.text.trim() }, true);
                        }
                    }}
                >
                    <Text style={styles.sendButtonText}>Send</Text>
                </TouchableOpacity>
            )}
        />
    )
}

const styles = StyleSheet.create({
    sendButton: {
        marginTop: 10,
        marginRight: 10,
        marginBottom: 10,
        borderRadius: 20,
        padding: 10,
        backgroundColor: '#007AFF',
    },
    sendButtonText: {
        color: '#fff',
    }
})