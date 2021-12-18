import React, { useState, useEffect } from 'react';
import {View, FlatList, StyleSheet, Text, TouchableOpacity, Modal, ActivityIndicator, TextInput} from 'react-native';
import { Card } from 'react-native-elements';
import { auth, db } from '../../firebase_auth';
import {Feather} from "@expo/vector-icons";

export default function Announcements() {
    const [announcements, setAnnouncements] = useState([]);
    const [user, setUser] = useState();
    const [isAdmin, setIsAdmin] = useState(() => {
        if (auth.currentUser.email  === "test2@gmail.com") {
            return true;
        }
        return false;
    });
    const [isModalVisible, setModalVisible] = useState(false);
    const [announcement, setAnnouncement] = useState();

    const handleModal = () => setModalVisible(() => !isModalVisible);

    useEffect(() => setUser(auth.currentUser));


    useEffect(() => {
        const unsubscribe = db
            .collection('Announcements')
            .onSnapshot((snapshot) => {
                setAnnouncements([])
                snapshot.docs.forEach(doc => {
                    setAnnouncements(prevState => [...prevState, {
                        Id: doc.id,
                        data: doc.data()
                    }]);
                });
            })

        console.log(announcements)

        return () => unsubscribe();
    }, []);

    const handleTextChange = (text) => {
        setAnnouncement(text);
    }

    const uploadAnnouncement = () => {
        db.collection("Announcements").add({
            message: announcement
        });
        handleModal();
        setAnnouncement(null)
    }

    const item = ({ item }) => {
        return (
            < Card >
                <Text>{item.data.message}</Text>
            </Card >
        )

    }

    return (
        <View styles={styles.container}>

            {isAdmin ?
                <TouchableOpacity style={styles.addButton} onPress={handleModal}>
                    <Text>Add bike</Text>
                </TouchableOpacity> : null
            }

            <Modal visible={isModalVisible} transparent>
                <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
                    <View style={styles.popupModal}>
                        <TouchableOpacity
                            style={{padding: 13, position: "absolute", top: 5, left: 5}}
                            onPress={handleModal}>
                            <Feather name={'x'} size={35} />
                        </TouchableOpacity>
                        <TextInput
                            value={announcement}
                            onChangeText={handleTextChange}
                            placeholder="Enter a new announcement"
                            placeholderTextColor="grey"
                            style={styles.input}
                        />
                        <TouchableOpacity style={{ paddingTop: 40}} onPress={uploadAnnouncement}>
                            <View style={styles.button}>
                                <Text style={styles.buttonText}>Upload</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <View   style={styles.header}>
                <Text
                    style={{
                        flex: 1,
                        textAlign: 'center',
                        fontSize: 16,
                        fontWeight: 'bold',
                        color: '#00457C',
                    }}
                >
                    Announcements
                </Text>
            </View>

            <FlatList
                renderItem={item}
                data={announcements}
                keyExtractor={item => item.Id}
            />

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    header: {
        paddingTop: 50,
        paddingBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: "#00ded6",
        zIndex: 25,
        elevation: 2,
    },
    addButton: {
        position: "absolute",
        bottom: 0,
        right: 50,
        zIndex: 1,
        backgroundColor: "#00ded6"
    },
    popupModal: {
        backgroundColor: 'white',
        width: '80%',
        height: 300,
        alignItems: 'center',
        justifyContent: "center",
        borderRadius: 30
    },
    button: {
        width: 120,
        borderRadius: 8,
        paddingVertical: 7,
        paddingHorizontal: 10,
        backgroundColor: "#00ded6",
        margin: 1,
    },
    buttonText: {
        color: '#00457C',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        fontSize: 16,
        textAlign: 'center',
    },
    input: {
        width: '70%',
        borderColor: 'gray',
        borderBottomWidth: 1,
        marginBottom: 15,
        fontSize: 15,
    }
})