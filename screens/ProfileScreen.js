import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, Button, TouchableOpacity } from 'react-native'; // Import Button from 'react-native'
import { getAuth, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const ProfileScreen = ({ navigation }) => {
    const [userProfile, setUserProfile] = useState(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            const auth = getAuth();
            const user = auth.currentUser;

            if (user) {
                const userUID = user.uid;
                const docRef = doc(getFirestore(), 'users', userUID);

                try {
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        setUserProfile(docSnap.data());
                    }
                } catch (error) {
                    console.error('Error fetching user profile:', error);
                }
            }
        };

        fetchUserProfile();
    }, []);

    const logoutUser = async () => {
        const auth = getAuth();
        signOut(auth)
            .then(() => {
                navigation.replace('Login');
            });
    }

    return (
        <View style={styles.container}>
            {userProfile && (
                <>
                    <Image source={{ uri: userProfile.avatarUrl }} style={styles.avatar} />
                    <Text style={styles.text}>Username: {userProfile.username}</Text>
                    <Text style={styles.text}>Email: {userProfile.email}</Text>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            onPress={logoutUser}
                            style={styles.logoutButton}
                        >
                            <Text style={styles.buttonText}>Logout</Text>
                        </TouchableOpacity>
                    </View>
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        alignItems: 'center',
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 20,
    },
    text: {
        fontSize: 16,
        marginBottom: 10,
    },
    buttonContainer: {
        marginTop: 400,
        width: '100%',
        alignItems: 'center',
    },
    logoutButton: {
        backgroundColor: 'red',
        borderRadius: 30,
        paddingVertical: 10,
        paddingHorizontal: 20,
        width: 150,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default ProfileScreen;
