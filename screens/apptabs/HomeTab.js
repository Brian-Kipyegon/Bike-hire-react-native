import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, Image, Button } from 'react-native'
import { Card } from 'react-native-elements';
import { FlatList } from 'react-native-gesture-handler';
import { auth, storage, db } from '../../firebase_auth';

const HomeTab = () => {

    const [bikes, setBikes] = useState([])
    const user = auth.currentUser

    useEffect(() => {
        const unsubscribe = db
            .collection('Bikes')
            .where("isAvailable", "==", true)
            .onSnapshot((snapshot) => {
                setBikes([])
                snapshot.docs.forEach(doc => {
                    setBikes(prevState => [...prevState, {
                        Id: doc.id,
                        data: doc.data()
                    }]);
                });
            })

        console.log(bikes);
        return () => unsubscribe();
    }, []);

    const handleHire = (id) => {
        db.doc(`Bikes/${id}`).update({
            isAvailable: false
        });
        db.collection("Hire").add({
            user: user.uid,
            bike: id
        });
        alert('Hired');
    }

    const renderItem = ({ item }) => {
        return (
            <Card>
                <Image
                    source={require("../../assets/bike-image.jpg")}
                    style={styles.bikeImage}
                />
                <Card.Divider />
                <Text>{item.data.name}</Text>
                <Button title="Hire" onPress={() => handleHire(item.Id)} />
            </Card>
        )
    };

    return (
        <View >
            <View style={styles.container}>
                <Text>Availabe Bikes</Text>
            </View>
            <FlatList
                data={bikes}
                renderItem={renderItem}
                keyExtractor={item => item.Id}
            />
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
