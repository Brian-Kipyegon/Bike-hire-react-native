import React, { useState, useEffect } from 'react';
import {StyleSheet, Text, View, FlatList, TouchableOpacity, TextInput, Modal} from 'react-native';
import {ListItem} from 'react-native-elements';
import {Feather, MaterialIcons} from '@expo/vector-icons';
import Slideshow from 'react-native-image-slider-show';

import { db, auth } from '../../firebase_auth';

const EventsTab = () => {
    const [events, setEvents] = useState([]);
    const user = auth.currentUser;
    const [position, setPosition] = useState(0);
    const [isAdmin, setIsAdmin] = useState(() => {
        if (auth.currentUser.email  === "test2@gmail.com") {
            return true;
        }
        return false;
    });
    const [isModalVisible, setModalVisible] = useState(false);
    const [event, setEvent] = useState();
    const [description, setDescription] = useState();

    useEffect(() => {
        const unsubscribe = db
            .collection('events')
            .onSnapshot((snapshot) => {
                setEvents([])
                snapshot.docs.forEach(doc => {
                    setEvents(prevState => [...prevState, {
                        id: doc.id,
                        ...doc.data()
                    }]);
                });
            })

        console.log(events);
        return () => unsubscribe();
    }, []);

    // const changePosition = () => {
    //     if (position === 3) {
    //         setPosition(0);
    //     } else {
    //         setPosition(prevState => prevState+1)
    //     }
    // }

    // useState(() => {
    //     // let interval = setInterval(() => changePosition, 1000);
    //     //
    //     // return () => clearInterval(interval);
    // }, []);

    const registerUser = (id) => {
        if (user) {
            db
                .collection('eventRegistration')
                .where('participant', '==', user.uid)
                .get()
                .then((snapshot) => {
                    snapshot.docs.forEach((doc) => {
                        if (doc.data().event === id) {
                            throw "Already registered"
                        }
                    })
                })
                .catch((err) => {
                    alert(err)
                })

            db.collection('eventRegistration').add({
                event: id,
                participant: user.uid
            });
        }
    }

    const handleModal = () => setModalVisible(() => !isModalVisible);

    const handleTextChange = (text) => {
        setEvent(text);
    }

    const handleTextChange2 = (text) => {
        setDescription(text);
    }

    const uploadEvent = () => {
        db.collection("events").add({
            eventName: event,
            description:description
        });
        setEvent(null);
        setDescription(null);
        handleModal() ;
    }

    const RenderItem = ({ item }) => {
        return (
            <ListItem bottomDivider>
                <ListItem.Content>
                    <ListItem.Title>{item.eventName}</ListItem.Title>
                    <ListItem.Subtitle>{item.participantsNo}</ListItem.Subtitle>
                    <Text>{item.description}</Text>
                </ListItem.Content>
            </ListItem>
        )
    }

    return (
        <View style={styles.container}>

            {isAdmin ?
                <TouchableOpacity style={[styles.addButton, {padding: 10, borderRadius: 10}]} onPress={handleModal}>
                    <Text style={styles.buttonText}>Add Event</Text>
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
                            value={event}
                            onChangeText={handleTextChange}
                            placeholder="Event name"
                            placeholderTextColor="grey"
                            style={styles.input}
                        />
                        <TextInput
                            value={description}
                            onChangeText={handleTextChange2}
                            placeholder="Description"
                            placeholderTextColor="grey"
                            style={styles.input}
                        />
                        <TouchableOpacity style={{ paddingTop: 40}} onPress={uploadEvent}>
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
                    Events
                </Text>
            </View>
            <Slideshow
                dataSource={[
                    { url:'http://placeimg.com/640/480/any' },
                    { url:'http://placeimg.com/640/480/any' },
                    { url:'http://placeimg.com/640/480/any' }
                ]}
                position={position}
            />
            <FlatList
                data={events}
                renderItem={RenderItem}
            />
        </View>
    )
}

export default EventsTab;

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
        bottom: 15,
        right: 15,
        zIndex: 1,
        backgroundColor: "#00ded6",
        padding: 5,
        borderRadius: 10
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
