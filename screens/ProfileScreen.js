import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, TextInput, ImageBackground } from 'react-native';
import { getAuth, signOut, updateProfile } from 'firebase/auth';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import { FontAwesome } from '@expo/vector-icons';

const ProfileScreen = ({ navigation }) => {
    const [userProfile, setUserProfile] = useState(null);
    const [editedUsername, setEditedUsername] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [newAvatar, setNewAvatar] = useState(null);

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
                        setEditedUsername(docSnap.data().username);
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

    const handleEditIconPress = () => {
        setIsEditing(true);
    }

    const handleUsernameEdit = async () => {
        const auth = getAuth();
        const user = auth.currentUser;

        if (user) {
            const userUID = user.uid;
            const docRef = doc(getFirestore(), 'users', userUID);

            try {
                if (!editedUsername.trim()) {
                    alert('Please enter a valid username.');
                    return;
                }

                await updateDoc(docRef, { username: editedUsername });
                setUserProfile({ ...userProfile, username: editedUsername });
                alert('Username updated successfully!');
            } catch (error) {
                console.error('Error updating username:', error);
                alert('Error updating username. Please try again.');
            } finally {
                setIsEditing(false);
            }
        }
    }

    const pickImage = async () => {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (status !== 'granted') {
                alert('Sorry, we need camera roll permissions to make this work!');
                return;
            }

            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 1,
            });

            if (!result.cancelled) {
                setNewAvatar(result.uri);
            }
        } catch (error) {
            console.error('Error picking an image:', error);
        }
    };

    const handleCancelAvatar = () => {
        setNewAvatar(null);
    }

    const handleSaveAvatar = async () => {
        const auth = getAuth();
        const user = auth.currentUser;

        if (user && newAvatar) {
            const userUID = user.uid;
            const docRef = doc(getFirestore(), 'users', userUID);

            try {
                await updateDoc(docRef, { avatarUrl: newAvatar });
                setUserProfile({ ...userProfile, avatarUrl: newAvatar });
                alert('Avatar updated successfully!');
            } catch (error) {
                console.error('Error updating avatar:', error);
                alert('Error updating avatar. Please try again.');
            } finally {
                setNewAvatar(null);
            }
        }
    }

    return (
        <ImageBackground
            source={{ uri: 'https://files.123freevectors.com/wp-content/original/154027-abstract-blue-and-white-background-design.jpg' }}
            style={styles.backgroundImage}
        >
            <View style={styles.container}>
                {userProfile && (
                    <>
                        <View style={styles.infoContainer}>
                            <Image source={{ uri: newAvatar || userProfile.avatarUrl }} style={styles.avatar} />
                            <View style={styles.nameContainer}>
                                <Text style={styles.name}>{userProfile.username}</Text>
                                <TouchableOpacity onPress={handleEditIconPress}>
                                    <FontAwesome name="pencil" size={20} color="blue" style={styles.editIcon} />
                                </TouchableOpacity>
                            </View>
                            <Text style={styles.email}>{userProfile.email}</Text>
                        </View>

                        <View style={styles.inputContainer}>
                            {isEditing ? (
                                <>
                                    <TextInput
                                        style={styles.editInput}
                                        placeholder="Edit Username"
                                        value={editedUsername}
                                        onChangeText={(text) => setEditedUsername(text)}
                                    />
                                    <TouchableOpacity
                                        onPress={handleUsernameEdit}
                                        style={[styles.button, styles.saveButton]}
                                    >
                                        <Text style={styles.buttonText}>Save</Text>
                                        <FontAwesome name="save" size={20} color="white" style={styles.buttonIcon} />
                                    </TouchableOpacity>
                                </>
                            ) : (
                                <>
                                    <TouchableOpacity
                                        onPress={pickImage}
                                        style={[styles.button, styles.changeAvatarButton]}
                                    >
                                        <Text style={styles.buttonText}>Change Avatar</Text>
                                        <FontAwesome name="image" size={20} color="white" style={styles.buttonIcon} />
                                    </TouchableOpacity>


                                    <View style={styles.buttonGap} />

                                    {newAvatar && (
                                        <View style={styles.buttonRow}>
                                            <TouchableOpacity
                                                onPress={handleSaveAvatar}
                                                style={[styles.button, styles.saveButton, styles.buttonMargin]}
                                            >
                                                <Text style={styles.buttonText}>Save Avatar</Text>
                                                <FontAwesome name="save" size={20} color="white" style={styles.buttonIcon} />
                                            </TouchableOpacity>

                                            <TouchableOpacity
                                                onPress={handleCancelAvatar}
                                                style={[styles.button, styles.cancelButton]}
                                            >
                                                <Text style={styles.buttonText}>Cancel</Text>
                                                <FontAwesome name="times" size={20} color="white" style={styles.buttonIcon} />
                                            </TouchableOpacity>
                                        </View>
                                    )}


                                    <View style={styles.buttonGap} />

                                    <TouchableOpacity
                                        onPress={logoutUser}
                                        style={[styles.button, styles.logoutButton]}
                                    >
                                        <Text style={styles.buttonText}>Logout</Text>
                                        <FontAwesome name="sign-out" size={20} color="white" style={styles.buttonIcon} />
                                    </TouchableOpacity>
                                </>
                            )}
                        </View>
                    </>
                )}
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
    },
    container: {
        flex: 1,
        padding: 20,
        alignItems: 'center',
    },
    avatar: {
        width: 150,
        height: 150,
        borderRadius: 75,
        marginBottom: 20,
    },
    infoContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    nameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        marginRight: 10,
    },
    email: {
        fontSize: 18,
        marginBottom: 10,
    },
    editIcon: {
        marginLeft: 10,
    },
    text: {
        fontSize: 16,
        marginBottom: 10,
    },
    inputContainer: {
        alignItems: 'center',
    },
    editInput: {
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        marginBottom: 20,
        width: '100%',
        fontSize: 30,
    },
    logoutButton: {
        backgroundColor: 'red',
    },
    changeAvatarButton: {
        backgroundColor: 'blue',
    },
    saveButton: {
        backgroundColor: 'green',
    },
    cancelButton: {
        backgroundColor: 'gray',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    buttonRow: {
        flexDirection: 'row',
    },
    buttonMargin: {
        marginRight: 10,
    },
    buttonGap: {
        marginTop: 10,
    },
    button: {
        borderRadius: 30,
        paddingVertical: 15,
        paddingHorizontal: 30,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10,
        flexDirection: 'row',
    },
    buttonIcon: {
        marginLeft: 10,
    },
});

export default ProfileScreen;
