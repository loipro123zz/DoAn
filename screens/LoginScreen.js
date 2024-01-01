import { View, Text, StyleSheet, SafeAreaView } from 'react-native'
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
        return unsubcribe;
    })

    return (
        <View style={styles.container}>

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

            <Button title='Sign in' buttonStyle={styles.button} onPress={signIn} />
            <Button title='Register' buttonStyle={styles.button}
                onPress={() => navigation.navigate('Register')}
            />

        </View>
    )
}

export default LoginScreen
const styles = StyleSheet.create({
    button: {
        width: 200,
        marginTop: 10,
    },
    container: {
        flex: 1,
        padding: 10,
        alignItems: 'center',
    }
})

