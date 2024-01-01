
import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const ProfileScreen = () => {
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

    return (
        <View style={styles.container}>
            {userProfile && (
                <>
                    <Image source={{ uri: userProfile.avatarUrl }} style={styles.avatar} />
                    <Text style={styles.text}>Username: {userProfile.username}</Text>
                    <Text style={styles.text}>Email: {userProfile.email}</Text>
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
});

export default ProfileScreen;