import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, Image } from 'react-native'
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import { AntDesign } from '@expo/vector-icons';
import { Card } from 'react-native-elements';
import { auth, storage, db } from '../../firebase_auth';
import * as ImagePicker from 'expo-image-picker';

const ProfileTab = () => {

    const user = auth.currentUser;
    const [image, setImage] = useState(() => {
        if (user) {
            return user.photoURL
        }
        return null;
    });
    const [events, setEvents] = useState([]);
    const [bikes, setBikes] = useState([]);

    useEffect(() => {
        //console.log("running useEffect 1");
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
        //console.log("running useEffect 2");
        db.collection('eventRegistration').where('participant', '==', `${user.uid}`).get().then(dataSnapshot => {
            let eventIds = dataSnapshot.docs.map((doc) => {
                return doc.data().event
            })
            //let eventcache = []
            for (let i = 0; i < eventIds.length; i++) {
                db.doc(`events/${eventIds[i]}`).get().then(dataSnapshot => {
                    setEvents(prevState => [...prevState, dataSnapshot.data()]);
                    //eventcache.push(dataSnapshot.data());
                    //console.log(dataSnapshot.data());
                })
            }
            //setEvents(prevState => [...prevState, eventcache]); 
        }).catch((err) => { console.log(err) })
        //console.log('success'); 
    }, [])

    useEffect(() => {
        const unsubscribe = db.collection("Hire").where("user", "==", user.uid).onSnapshot((snapshot) => {
            let bikeIds = snapshot.docs.map((doc) => doc.data().bike);
            console.log(bikeIds);
            setBikes([]);

            for (let i = 0; i < bikeIds.length; i++) {
                db.doc(`Bikes/${bikeIds[i]}`).get().then(dataSnapshot => {
                    setBikes(prevState => [...prevState, dataSnapshot.data()]);
                    console.log(dataSnapshot.data());
                })
            }
            console.log(bikes);
        })

        return () => unsubscribe();
    }, []);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        console.log(result);

        if (!result.cancelled) {
            setImage(result.uri);
            let metadata = {
                contentType: result.type
            };
            const data = new FormData();
            data.append('photo', {
                type: result.type,
                image_file: Platform.OS === 'ios' ? result.uri.replace('file://', '') : result.uri,
            });

            fetch("http://154.159.75.137.146:5000/imageupload", {
                method: 'POST',
                body: data
            }).then((response) => response.json()).then((response) => {
                console.log('response', response);
            }).catch((error) => {
                console.log('error', error);
            });

            let reference = storage.ref("star.jpg");
            let task = reference.put(result.uri, metadata);

            task.then(() => {
                console.log('Image uploaded to the bucket!');
            }).catch((e) => console.log('uploading image error => ', e));

            /* task.snapshot.ref.getDownloadURL().then((downloadURL) => {
                if (user) {
                    user.updateProfile({
                        photoURL: downloadURL,
                    }).then(() => {
                        console.log(user.photoURL)
                        console.log("user's photoURL updated successfully")
                    }).catch((e) => console.log('uploading image error => ', e))
                }
            }); */

            user.updateProfile({
                photoURL: result.uri,
            }).then(() => {
                console.log(user.photoURL)
                console.log("user's photoURL updated successfully")
            }).catch((e) => console.log('uploading image error => ', e))

            console.log(user.photoURL)
            setImage(user.photoURL)
        }
    };

    /* const Item = ({ item, name }) => (
        <Card>
            <Card.Title>{name}</Card.Title>
            <Card.Divider />
            <Text>{item.description}</Text>
        </Card>
    ); */


    const renderItem = ({ item }) => {
        //console.log("renderItem func")
        //console.log(item)
        return (
            <Card>
                <Card.Title>{item.eventName}</Card.Title>
                <Card.Divider />
                <Text>{item.description}</Text>
            </Card>
        )
    }

    const renderBike = ({ item }) => {
        console.log(item)
        return (
            <Card>
                <Image
                    source={require("../../assets/bike-image.jpg")}
                />
                <Card.Divider />
                <Text>{item.name}</Text>
            </Card>
        )
    };

    return (
        <View style={styles.container}>
            <View style={styles.profilePicContainer}>

                <Image source={require('../../assets/default.png')} style={styles.profilePic} />
            </View>

            <View style={styles.feedContainer}>
                <View style={[styles.userInfo, styles.cardEffect]}>
                    <View style={[styles.infoContainer, styles.userNameContainer]}>
                        <Text>Username</Text>
                        <Text>{user.displayName || user.email}</Text>
                    </View>
                    <View style={[styles.infoContainer, styles.pointContainer]}>
                        <Text>Biking Points</Text>
                        <Text>200</Text>
                    </View>
                </View>

                <View style={[styles.eventFeed, styles.cardEffect]}>
                    <View style={[styles.headerContainer]}>
                        <Text>Events Registered</Text>
                    </View>
                    <FlatList
                        data={events}
                        renderItem={renderItem}
                    />
                </View>

                <View style={[styles.eventFeed, styles.cardEffect]}>
                    <View style={[styles.headerContainer]}>
                        <Text>Bikes</Text>
                    </View>
                    <FlatList
                        data={bikes}
                        renderItem={renderBike}
                        keyExtractor={item => item.Id}
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
        paddingBottom: 100,
    },
    profilePic: {
        width: 100,
        height: 100,
        borderRadius: 100,
    },
    feedContainer: {
        flex: 1,
        alignItems: 'center',
    },
    cardEffect: {
        elevation: 20,
        shadowColor: '#52006A',
    },
    userInfo: {
        width: '80%',
        backgroundColor: '#ecf0f1',
        marginTop: -60,
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
        width: '80%',
        height: 400,
        marginTop: 30,
        padding: 20,
        flex: 1,
    },
    headerContainer: {
        alignItems: 'center',
    },
    iconContainer: {
        padding: 5,
    }
})
