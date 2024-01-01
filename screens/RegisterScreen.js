import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Input, Button } from 'react-native-elements';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { authentication } from '../firebaseConfig';

const RegisterScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [avatar, setAvatar] = useState('');

    const registerUser = async () => {
        try {
            const auth = getAuth();
            const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredentials.user;
            const userUID = user.uid;
            const docRef = doc(getFirestore(), 'users', userUID);

            await setDoc(docRef, {
                avatarUrl: avatar ? avatar : 'https://thumbs.dreamstime.com/b/businessman-avatar-line-icon-vector-illustration-design-79327237.jpg',
                username,
                userUID,
                email
            });

            // Cập nhật photoURL trong Firebase Authentication
            await updateProfile(user, {
                photoURL: avatar ? avatar : 'https://thumbs.dreamstime.com/b/businessman-avatar-line-icon-vector-illustration-design-79327237.jpg',
            });

            // Log để kiểm tra
            console.log('Successful registration');
            console.log('User photoURL:', user.photoURL);
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

export default RegisterScreen;
