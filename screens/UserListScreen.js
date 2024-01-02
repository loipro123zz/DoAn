import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View, ImageBackground } from 'react-native';
import { collection, onSnapshot, where, query, updateDoc, doc } from 'firebase/firestore';
import { authentication, db } from '../firebaseConfig';
import { ListItem } from '../components/ListItem';
import { Button, SearchBar } from 'react-native-elements';

export default function UserListScreen({ navigation }) {
    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    const logoutUser = async () => {
        authentication.signOut()
            .then(() => {
                navigation.replace('Login');
            });
    }

    const getUsers = () => {
        const docsRef = collection(db, 'users');
        const q = query(docsRef, where('userUID', '!=', authentication?.currentUser?.uid));
        onSnapshot(q, (onSnap) => {
            let data = [];
            onSnap.docs.forEach(user => {
                data.push({ ...user.data(), id: user.id });
            });
            setUsers(data);
        });
    }

    useEffect(() => {
        getUsers();

        const userRef = doc(db, 'users', authentication.currentUser.uid);
        updateDoc(userRef, { online: true });

        return () => {
            updateDoc(userRef, { online: false });
        };
    }, []);

    const handleSearch = (query) => {
        setSearchQuery(query);
    };

    const filteredUsers = users.filter(
        user =>
            user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <ImageBackground
            source={{ uri: 'https://files.123freevectors.com/wp-content/original/154027-abstract-blue-and-white-background-design.jpg' }}
            style={styles.backgroundImage}
        >
            <>
                <SearchBar
                    placeholder="Search by name or email"
                    onChangeText={handleSearch}
                    value={searchQuery}
                    containerStyle={styles.searchContainer}
                    inputContainerStyle={styles.searchInputContainer}
                />
                <FlatList
                    data={filteredUsers}
                    keyExtractor={(item) => item.email}
                    renderItem={({ item }) =>
                        <ListItem
                            onPress={() => navigation.navigate('Chat', { name: item.username, uid: item.userUID })}
                            title={item.username}
                            subTitle={item.email}
                            online={item.online}
                            image={item.avatarUrl}
                        />
                    }
                />
            </>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
    },
    searchContainer: {
        backgroundColor: 'transparent',
        borderBottomColor: 'transparent',
        borderTopColor: 'transparent',
    },
    searchInputContainer: {
        backgroundColor: 'white',
        borderRadius: 30,
    },
});
