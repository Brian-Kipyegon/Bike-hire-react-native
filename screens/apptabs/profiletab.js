import React, { useState, useEffect }from 'react'
import { StyleSheet, Text, View, Image } from 'react-native'
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import { AntDesign } from '@expo/vector-icons';
import { Card } from 'react-native-elements';
import { auth, storage } from '../../firebase_auth';
import * as ImagePicker from 'expo-image-picker';

const ProfileTab = () => {

    const user = auth.currentUser;
    const [image, setImage] = useState(() => {
        if (user) {
            return user.photoURL
        }
        return null;
    });

    const [events, setEvents] = useState([
        {key:'1', name: 'Sunday-Ride', date: new Date(2020, 10, 23)},
        {key:'2', name: 'Tuesday-Ride', date: new Date(2020, 10, 23)},
        {key:'3', name: 'Tuesday-Ride', date: new Date(2020, 10, 23)}
    ]);

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

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        //console.log(result);

        if (!result.cancelled) {
            setImage(result.uri);
            let metadata = {
                contentType: result.type
            };

            let reference = storage.ref("star.jpg");         // 2
            let task = reference.put(result.uri, metadata);  

            task.then(() => {                                 // 4
                console.log('Image uploaded to the bucket!');
            }).catch((e) => console.log('uploading image error => ', e));

            task.snapshot.ref.getDownloadURL().then((downloadURL) => {
                if (user) {
                    user.updateProfile({
                        photoURL: downloadURL,
                    }).then(() => {
                        console.log(user.photoURL)
                        console.log("user's photoURL updated successfully")
                    }).catch((e) => console.log('uploading image error => ', e))
                }
            });
            setImage(user.photoURL)
        }
    };

    const Item = ({ title, date }) => (
        <Card>
            <Card.Title>{title}</Card.Title>
            <Card.Divider />
            <Text>{date}</Text>
        </Card>
    );
      

    const renderItem = ({ item }) => (
        <Item title={item.name} />
    );

    return (
        <View style={styles.container}>
            <View style={styles.profilePicContainer}>
            {image ? (
                <Image source={{ uri: image }} style={styles.profilePic} /> 
            ):(
                <Image source={require('../../assets/default.png')} style={styles.profilePic} />
            )
            }
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
        padding : 20,
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
        width : '80%',
        height : 400,
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
