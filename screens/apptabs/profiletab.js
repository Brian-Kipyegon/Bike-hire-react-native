import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, Image } from 'react-native'
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import { AntDesign } from '@expo/vector-icons';
import { Card } from 'react-native-elements';
import { auth, storage, db } from '../../firebase_auth';
import * as ImagePicker from 'expo-image-picker';

const ProfileTab = () => {

    const user = auth.currentUser;
    const [image, setImage] = useState(user.photoURL);
    const [events, setEvents] = useState([]);
    const [bikes, setBikes] = useState([]);
    const [points, setPoints] = useState(0);

    useEffect(() => {
        (async () => {
            if (Platform.OS !== 'web') {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== 'granted') {
                    alert('Sorry, we need camera roll permissions to make this work!');
                }
            }
        })();
    }, []);

    useEffect(() => {
        db.collection('eventRegistration').where('participant', '==', `${user.uid}`).get().then(dataSnapshot => {
            let eventIds = dataSnapshot.docs.map((doc) => {
                return doc.data().event
            })

            setEvents([]);
            for (let i = 0; i < eventIds.length; i++) {
                db.doc(`events/${eventIds[i]}`).get().then(dataSnapshot => {
                    setEvents(prevState => [...prevState, {
                        id: dataSnapshot.id,
                        ...dataSnapshot.data()
                    }]);
                })
            }
        }).catch((err) => { console.log(err) })

    }, []);

    useEffect(() => {
        const unsubscribe = db
            .collection('Points')
            .where('user', '==', user.uid)
            .onSnapshot(docs => {
                docs.forEach(doc => {
                    setPoints(doc.data().points);
                })
            });

        return () => unsubscribe();
    }, [])

    useEffect(() => {
        const unsubscribe = db.collection("Hire2").where("user", "==", user.uid).onSnapshot((snapshot) => {
            let hireEvents = snapshot.docs.map((doc) => doc.data());
            let tmp = hireEvents.filter((item) => {return item.isCheckedOut === false});
            let bikeIds=tmp.map((item) => item.bike);

            setBikes([]);
            for (let i = 0; i < bikeIds.length; i++) {
                db.doc(`Bikes/${bikeIds[i]}`).get().then(dataSnapshot => {
                    setBikes([]);
                    setBikes(prevState => [...prevState, {
                        id: dataSnapshot.id,
                        ...dataSnapshot.data()
                    }]);
                })
            }
            //console.log(bikes);
        })

        return () => unsubscribe();
    }, []);

    function getRandomString(length) {
        var randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var result = '';
        for ( var i = 0; i < length; i++ ) {
            result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
        }
        return result;
    }

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        console.log(result);

        if (!result.cancelled) {
            let resp = await fetch(result.uri);
            let  blob = await resp.blob();
            let filename = getRandomString(10);
            let reference = storage.ref().child("profilepics/" + filename);
            await reference.put(blob);
            
            const setURL = await storage.ref("profilepics/"+filename).getDownloadURL()
            console.log(setURL)
            if (user) {
                user.updateProfile({
                    photoURL: setURL,
                }).then(() => {
                    console.log(user.photoURL)
                    console.log("user's photoURL updated successfully")
                }).catch((e) => console.log('uploading image error => ', e))
            }

            setImage(user.photoURL)
        }
    };

    const renderItem = ({ item }) => {
        return (
            <Card>
                <Card.Title>{item.eventName}</Card.Title>
                <Card.Divider />
                <Text>{item.description}</Text>
            </Card>
        )
    }

    const renderBike = ({ item }) => {
        console.log(item);
        return (
            <Card>
                <Image
                    source={{ uri: item.photoURL}}
                    style={{width: 200, height: 100}}
                />
                <Card.Divider />
                <Text>{item.name}</Text>
                <Text>{item.id}</Text>
            </Card>
        )
    };

    return (
        <View style={styles.container}>
            <View style={styles.profilePicContainer}>
                {
                    image ?
                        <Image source={{ uri: image}} style={styles.profilePic} /> :
                        <Image source={require('../../assets/default.png')} style={styles.profilePic} />
                }
            </View>

            <View style={styles.feedContainer}>
                <View style={styles.userInfo}>
                    <View style={[styles.infoContainer, styles.userNameContainer]}>
                        <Text style={styles.title}>Email</Text>
                        <Text>{user.displayName || user.email}</Text>
                    </View>
                    <View style={[styles.infoContainer, styles.pointContainer]}>
                        <Text style={styles.title}>Points</Text>
                        <Text>{points}</Text>
                    </View>
                </View>

                <View style={[styles.eventFeed, styles.cardEffect]}>
                    <View style={[styles.headerContainer]}>
                        <Text style={styles.title}>Events Registered</Text>
                    </View>
                    <FlatList
                        data={events}
                        renderItem={renderItem}
                    />
                </View>

                <View style={[styles.eventFeed, styles.cardEffect, {height: 450}]}>
                    <View style={[styles.headerContainer]}>
                        <Text style={styles.title}>Bikes</Text>
                    </View>
                    <FlatList
                        data={bikes}
                        renderItem={renderBike}
                        horizontal={true}
                    />
                </View>

                <TouchableOpacity onPress={pickImage}>
                    <View styles={styles.iconContainer}>
                        <AntDesign name="edit" size={24} color="black" />
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default ProfileTab;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    profilePicContainer: {
        backgroundColor: "#00ded6",
        alignItems: 'center',
        paddingTop: 60,
        paddingBottom: 70,
    },
    profilePic: {
        width: 100,
        height: 100,
        borderRadius: 100,
    },
    feedContainer: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#d7dbd8'
    },
    userInfo: {
        width: '80%',
        backgroundColor: '#ecf0f1',
        marginTop: -60,
        marginBottom: 10,
        borderRadius: 5,
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    infoContainer: {
        padding: 20,
    },
    userNameContainer: {
        flex: 0.7,
        borderRightWidth: 1,
        borderRightColor: 'grey',
    },
    pointContainer: {
        flex: 0.3,
    },
    eventFeed: {
        backgroundColor: 'whitesmoke',
        width: '80%',
        height: 400,
        padding: 5,
        flex: 1,
        marginBottom: 10,
        borderRadius: 20
    },
    headerContainer: {
        alignItems: 'center',
    },
    iconContainer: {
        padding: 5,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#00457C',
    }
})
