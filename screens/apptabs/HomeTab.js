import React, {useState, useEffect} from 'react'
import { StyleSheet, Text, View, Image, Button, ScrollView } from 'react-native'
import { Card } from 'react-native-elements';
import { auth, storage, db } from '../../firebase_auth';

const HomeTab = () => {

    const [bikes, setBikes] = useState([])
    useEffect(() => {
        db.collection('Bikes').where('isAvailable', "==", true).get().then((snapshot) => {
            snapshot.docs.forEach(doc => {
                setBikes(prevState => [...prevState, doc.data()])
            })
        });
        console.log("Bikes useEffect")
        console.log(bikes);
    }, []);

    const bikeCards = bikes.map((bike, index) => {
        console.log(index);
        return (
            <Card key={index}>
                <Image 
                    source={require("../../assets/bike-image.jpg")} 
                    style={styles.bikeImage}
                />
                <Card.Divider />
                <Text>{bike.name}</Text>
                <Button title="Hire"/>
            </Card>
        )
    })

    return (
        <View >
            <View style={styles.container}>
                <Text>Availabe Bikes</Text>
            </View>
            <ScrollView>
                    {bikeCards}
            </ScrollView>
        </View>
    )
}

export default HomeTab;

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 30,
        padding: 20
    },
    bikeImage: {
        width: '100%',
        height: 200
    }
})
