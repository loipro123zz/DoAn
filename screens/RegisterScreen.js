import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Input, Button } from 'react-native-elements';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { getDatabase, ref, set } from 'firebase/database';
import { getFirestore, doc, setDoc, docSnap } from 'firebase/firestore';
import { authentication } from '../firebaseConfig';
const RegisterScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [avatar, setAvatar] = useState('');

    const registerUser = async () => {
        try {
            const userCredentials = await createUserWithEmailAndPassword(authentication, email, password);
            const userUID = userCredentials.user.uid;
            const docRef = doc(getFirestore(), 'users', userUID);

            await setDoc(docRef, {
                avatarUrl: avatar ? avatar : 'https://thumbs.dreamstime.com/b/businessman-avatar-line-icon-vector-illustration-design-79327237.jpg',
                username,
                password, // Note: storing password in plaintext is not recommended for security reasons.
                userUID,
                email
            });

            console.log('Successful registration');
        } catch (error) {
            console.error('Error during registration:', error);
        }
    };


    return (
        <View style={styles.container}>
            <Input
                placeholder='Enter your Name'
                label='username'
                leftIcon={{ name: 'people', type: 'material' }}
                value={username}
                onChangeText={text => setUsername(text)}
            />

            <Input
                placeholder='Enter your Email'
                label='Email'
                leftIcon={{ name: 'email', type: 'material' }}
                value={email}
                onChangeText={text => setEmail(text)}
            />

            <Input
                placeholder='Enter your Password'
                label='Password'
                leftIcon={{ name: 'lock', type: 'material' }}
                value={password}
                onChangeText={text => setPassword(text)}
                secureTextEntry
            />

            <Input
                placeholder='Enter your Image URL'
                label='Avatar'
                leftIcon={{ name: 'link', type: 'material' }}
                value={avatar}
                onChangeText={text => setAvatar(text)}
            />

            <Button title='Register' buttonStyle={styles.button} onPress={registerUser} />
        </View>
    );
};

export default RegisterScreen;

const styles = StyleSheet.create({
    button: {
        width: 200,
        marginTop: 10,
    },
    container: {
        flex: 1,
        padding: 10,
        alignItems: 'center',
    },
});
