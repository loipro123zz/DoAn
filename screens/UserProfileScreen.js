import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const UserProfileScreen = ({ route, navigation }) => {
    const { userData } = route.params;

    return (
        <View style={styles.container}>
            <Image source={{ uri: userData.avatarUrl }} style={styles.avatar} />
            <Text style={styles.username}>{userData.username}</Text>
            <Text style={styles.email}>{userData.email}</Text>
            <TouchableOpacity
                style={styles.goBackButton}
                onPress={() => {
                    navigation.goBack();
                }}
            >
                <Ionicons name="arrow-back-outline" size={20} color="white" />
                <Text style={styles.goBackButtonText}>Back to Chat</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    avatar: {
        width: 150,
        height: 150,
        borderRadius: 75,
        marginBottom: 20,
    },
    username: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    email: {
        fontSize: 18,
        marginBottom: 20,
        color: '#666',
    },
    goBackButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#007AFF',
        padding: 10,
        borderRadius: 5,
    },
    goBackButtonText: {
        color: 'white',
        fontWeight: 'bold',
        marginLeft: 10,
    },
});

export default UserProfileScreen;
