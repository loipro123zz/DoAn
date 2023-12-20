import React, { useState, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, TouchableOpacity, Text } from 'react-native';
import { Input, Button } from 'react-native-elements';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
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

    useEffect(() => {
        navigation.setOptions({ headerShown: false });
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Create an account today!</Text>

            <Input
                placeholder='Enter your Name'
                label='Username'
                labelStyle={styles.inputLabel}
                leftIcon={{ name: 'people', type: 'material', marginRight: 10, marginLeft: 15 }}
                value={username}
                onChangeText={text => setUsername(text)}
                inputContainerStyle={styles.inputField}
            />

            <Input
                placeholder='Enter your Email'
                label='Email'
                labelStyle={styles.inputLabel}
                leftIcon={{ name: 'email', type: 'material', marginRight: 10, marginLeft: 15 }}
                value={email}
                onChangeText={text => setEmail(text)}
                inputContainerStyle={styles.inputField}
            />

            <Input
                placeholder='Enter your Password'
                label='Password'
                labelStyle={styles.inputLabel}
                leftIcon={{ name: 'lock', type: 'material', marginRight: 10, marginLeft: 15 }}
                value={password}
                onChangeText={text => setPassword(text)}
                secureTextEntry
                inputContainerStyle={styles.inputField}
            />

            <Input
                placeholder='Enter your Image URL'
                label='Avatar'
                labelStyle={styles.inputLabel}
                leftIcon={{ name: 'link', type: 'material', marginRight: 10, marginLeft: 15 }}
                value={avatar}
                onChangeText={text => setAvatar(text)}
                inputContainerStyle={styles.inputField}
            />

            <Button title='Register' buttonStyle={styles.button} onPress={registerUser} />

            <Text style={styles.loginText}>
                Already have an account?
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.loginLink}> Login now!</Text>
                </TouchableOpacity>
            </Text>
        </SafeAreaView>
    );
};

export default RegisterScreen;

const styles = StyleSheet.create({
    button: {
        width: 200,
        marginTop: 10,
        borderRadius: 25,
    },
    container: {
        flex: 1,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 36,
        fontWeight: 'bold',
        marginBottom: 30,
        textAlign: 'center',
    },
    inputLabel: {
        fontSize: 20,
        marginLeft: 10,
        marginBottom: 5,
    },
    inputField: {
        borderWidth: 1,
        borderRadius: 50,
        borderColor: '#000000',
        marginBottom: 10,
    },
    loginText: {
        marginTop: 5,
        fontSize: 16,
        textAlign: 'center',
    },
    loginLink: {
        color: 'blue',
        fontSize: 16,
        marginLeft: 5,
        marginTop: 63,
        textDecorationLine: 'underline',
        marginBottom: -3,
    },
});
