import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { TextInput, Avatar, FAB, Card } from 'react-native-paper';
import { commonStyles, theme } from '../styles';

const UserProfileScreen = ({ navigation }) => {
    const [editing, setEditing] = useState(false);
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');

    const startEditing = () => {
        setEditing(true);
    };

    const update = () => {
        setEditing(false);
    };

    return (
        <View style={styles.Container}>
            <FAB
                color={'blue'}
                style={styles.fab}
                icon={editing ? 'content-save' : 'pencil'}
                onPress={editing ? update : startEditing}
            />
            <Card style={styles.infoForm}>
                <Card.Title titleStyle={styles.Title} title="Your Details" />
                <Card.Content>
                    <TextInput
                        label="Name"
                        value={name}
                        editable={editing}
                        style={styles.Textbox}
                        onChangeText={text => setName(text)}
                    />
                    <TextInput
                        label="Address"
                        editable={editing}
                        value={address}
                        style={styles.Textbox}
                        onChangeText={text => setAddress(text)}
                    />
                    <TextInput
                        label="Phone Number"
                        editable={editing}
                        value={phone}
                        style={styles.Textbox}
                        onChangeText={text => setPhone(text)}
                    />
                    <TextInput
                        label="Contact"
                        editable={editing}
                        value={email}
                        style={styles.Textbox}
                        onChangeText={text => setEmail(text)}
                    />
                </Card.Content>
            </Card>
        </View>
    );
};

const styles = StyleSheet.create({
    Container: {
        flex: 1,
        alignItems: 'center',
    },
    infoForm: {
        justifyContent: 'flex-start',
        width: '90%',
        ...commonStyles.Card,
        paddingBottom: 0,
    },
    Title: {
        fontSize: 16,
        margin: 0,
        padding: 0,
    },
    Textbox: {
        width: '100%',
        marginBottom: 5,
        marginHorizontal: 0,
    },
    Avatar: {
        marginTop: 5,
    },
    fab: {
        position: 'absolute',
        margin: 16,
        top: 0,
        right: 0,
        zIndex: 1000,
    },
});

export default UserProfileScreen;
