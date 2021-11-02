import React, { useState, useEffect} from 'react';
import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Card } from 'react-native-elements';
import { MaterialIcons } from '@expo/vector-icons';

import { db, auth } from '../../firebase_auth';


const StartingPointMarker = () => (
    <View style={{
        flexDirection: 'row'
    }}
    >
        <MaterialIcons name="directions-bike" size={35} color="green" />
        <View>
            <Text>Starting</Text>
            <Text>Point</Text>
        </View>
    </View>
);

const FinishPointMarker = () => (
    <View style={{
        flexDirection: 'row'
    }}
    >
        <MaterialIcons name="directions-bike" size={35} color="blue" />
        <View>
            <Text>Finishing</Text>
            <Text>Line</Text>
        </View>
    </View>
);
  
  

const EventsTab = () => {
    const [events, setEvents] =useState([]);
    const user = auth.currentUser;

    useEffect(() => {
        db.collection('events').get().then((dataSnapshot) => {
            setEvents(dataSnapshot.docs);
            dataSnapshot.docs.forEach((doc) => { console.log(doc.id)})
        })
    }, []);

    registerUser = (id) => {
        if (user) {
            db.collection('eventRegistration').add({
                event: id,
                participant: user.uid
            });
            console.log("Success")
        }
    }

    return (
        <ScrollView style={{ paddingTop: 30, backgroundColor: 'whitesmoke'}} contentContainerStyle={{ flexGrow: 1 }}>
            {
                events.map((event) => { 
                    return (
                        
                            <Card>
                                <Card.Title>{event.data().eventName}</Card.Title>
                                <TouchableOpacity onPress={() => {registerUser(event.id)}}>
                                    <Text>Register</Text>
                                </TouchableOpacity>
                                <Text>{event.data().participantsNo  || "unknown"}</Text>
                                <Card.Divider />
                                <MapView 
                                    style={styles.map} 
                                    initialRegion={{
                                        latitude: event.data().startingPoint.latitude,
                                        longitude: event.data().startingPoint.longitude,
                                        latitudeDelta: 0.009,
                                        longitudeDelta: 0.009
                                    }}
                                >
                                    <Marker coordinate={{
                                            latitude: event.data().startingPoint.latitude,
                                            longitude: event.data().startingPoint.longitude
                                        }}
                                    >
                                        <StartingPointMarker />
                                    </Marker>
                                    <Marker coordinate={{
                                            latitude: event.data().finishPoint.latitude,
                                            longitude: event.data().finishPoint.longitude
                                        }}
                                    >
                                        <FinishPointMarker />
                                    </Marker>
                                </MapView>
                                <Card.Divider />
                                <Text>{event.data().description}</Text>
                            </Card>
                    )
                })
            }
        </ScrollView>
    )
}

export default EventsTab;

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    map: {
        width: "100%",
        height: 200,
      },
})
