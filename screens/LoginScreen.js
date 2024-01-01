import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Input, Button } from 'react-native-elements';
import { } from '../firebaseConfig'
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const signIn = () => {
        const auth = getAuth();
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                // ...
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                alert(errorMessage);
                alert('Incorrect Email or Password');
            });
    }

    useEffect(() => {
        const auth = getAuth();
        const unsubcribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                navigation.replace('Home');
                // ...
            } else {
                // User is signed out
                // ...
            }
        });
        navigation.setOptions({ headerShown: false });
        return unsubcribe;
    })
    return (
        <SafeAreaView style={styles.container}>
            <Image
                source={{ uri: 'https://pics.freeicons.io/uploads/icons/png/1165514541601363739-512.png' }}
                style={styles.logo}
            />
            <Text style={styles.title}>Login to ChatApp!</Text>
            <View style={styles.inputContainer}>
                <Input
                    placeholder='Enter your Email'
                    label='Email'
                    labelStyle={styles.inputLabel}
                    leftIcon={{ name: 'email', type: 'material', marginRight: 10, marginLeft: 15, }}
                    value={email}
                    onChangeText={text => setEmail(text)}
                    inputContainerStyle={styles.inputField}
                />
                <Input
                    placeholder='Enter your Password'
                    label='Password'
                    labelStyle={styles.inputLabel}
                    leftIcon={{ name: 'lock', type: 'material', marginRight: 10, marginLeft: 15, }}
                    value={password}
                    onChangeText={text => setPassword(text)}
                    secureTextEntry
                    inputContainerStyle={styles.inputField}
                />
            </View>
            <Button title='Login' buttonStyle={styles.button} onPress={signIn} />
            <Text style={styles.registerText}>
                Don't have an account yet?
                <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                    <Text style={styles.registerLink}> Register now!</Text>
                </TouchableOpacity>
            </Text>
        </SafeAreaView>
    );
}
export default LoginScreen
const styles = StyleSheet.create({
    button: {
        width: 200,
        marginTop: 10,
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
    },
    inputContainer: {
        width: '100%',
        marginBottom: 10,
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
        marginBottom: 5,
    },
    button: {
        width: 150,
        marginTop: 10,
        borderRadius: 25,
    },
    registerText: {
        marginTop: 5,
        fontSize: 16,
        textAlign: 'center',
    },
    registerLink: {
        color: 'blue',
        fontSize: 16,
        marginLeft: 5,
        marginTop: 63,
        textDecorationLine: 'underline',
        marginBottom: -3,
    },
    logo: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 20,
    },
});