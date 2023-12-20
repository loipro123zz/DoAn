import { Image, StyleSheet, View, TouchableWithoutFeedback } from 'react-native';
import React from 'react';
import { AppText } from './AppText';
import { MaterialCommunityIcons } from "@expo/vector-icons";

export function ListItem({ title, subTitle, image, ImageComponent, onPress }) {
    return (
        <TouchableWithoutFeedback
            underlayColor='#eee'
            onPress={onPress}
        >
            <View style={styles.container}>
                {image && <Image source={{ uri: image }} style={styles.image} />}
                <View style={styles.textContainer}>
                    <AppText inputText={title} stylesLing={styles.name} numberOfLines={1} />
                    {subTitle && <AppText inputText={subTitle} stylesLing={styles.listing} numberOfLines={2} />}
                </View>
                <MaterialCommunityIcons name='chevron-right' size={24} style={styles.chevron} />
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        backgroundColor: '#ffffff',
        alignItems: "center",
        justifyContent: "space-between",
        marginHorizontal: 15,
        marginVertical: 10,
        padding: 15,
        borderRadius: 15,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 15,
    },
    textContainer: {
        flex: 1,
        marginRight: 15,
    },
    name: {
        fontWeight: "bold",
        fontSize: 16,
    },
    listing: {
        color: "#6e6969",
        fontSize: 14,
        marginTop: 5,
    },
    chevron: {
        color: '#7f7f7f',
    },
});

export default styles;
