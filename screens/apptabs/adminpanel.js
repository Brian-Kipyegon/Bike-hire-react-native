import React, { useState, useEffect } from 'react'
import {
    FlatList,
    Image,
    StyleSheet,
    Text,
    View,
    Button,
    Modal,
    TouchableOpacity,
    ActivityIndicator
} from "react-native";
import {db} from "../../firebase_auth";
import { Card } from "react-native-elements";
import {Feather} from "@expo/vector-icons";

const Adminpanel = () => {
    const [hires, setHires] = useState([]);
    const [bikes, setBikes] = useState( {
        "isAvailable": false,
        "name": "Premier mtb",
        "photoURL": "https://firebasestorage.googleapis.com/v0/b/fir-auth-40bfa.appspot.com/o/bikes%2F1J1yKjS5px?alt=media&token=40138805-9700-45aa-b7c7-5dd6e6054253",
    });
    const [isModalVisible, setModalVisible] = useState(false);
    const [selected, setSelected] = useState();
    const [time, setTime] = useState();
    const [date, setDate] = useState();

    const handleModal = () => setModalVisible(() => !isModalVisible);

    const intercept = (txId, time, date) => {
        setSelected(txId);
        db.doc(`Bikes/${txId.bike}`).get().then(doc => {
            setBikes({...doc.data(), id: doc.id});
        });
        setTime(time);
        setDate(date);
        handleModal()
    }

    useEffect(() => {

        const unsubscribe = db
            .collection('Hire2')
            .where('isCheckedOut', '==', false)
            .onSnapshot( (snapshot) => {
                setHires([]);
                snapshot.docs.forEach(doc => {
                    setHires(prevState => [...prevState, {
                        id: doc.id,
                        ...doc.data()
                    }]);
                });
            })

        // for (let i = 0; i < hires.length; i++) {
        //     db.doc( `Bikes/${hires[i].bike}`).get().then((doc) => {
        //         setBikes(prevState => [...prevState, {...doc.data()}]);
        //     })
        // }
        //
        // console.log(bikes);
       return () => unsubscribe();
    }, []);

    const checkOut = (TxId, BikeId) => {
        db.doc(`Hire2/${TxId}`).update({
            isCheckedOut: true
        });

        db.doc(`Bikes/${BikeId}`).update({
            isAvailable: true
        });

        handleModal();
    }

    const  itemRenderer = ({ item }) => {
        const unixTs = item.date.seconds
        const date = new Date(unixTs * 1000);
        const unixTime = item.time.seconds
        const time = new Date(unixTime * 1000);

        return (
            <Card>
                <View>
                    <Text>Transaction id: {item.paymentId}</Text>
                    <Text>Transaction status: {item.paymentStatus}</Text>
                    <Text>Amount: {item.paymentValue}</Text>
                    <Text>Date:{date.getDate()}/{date.getMonth()+1}/{date.getFullYear()}</Text>
                    <Text>Time: {time.getHours()}:{time.getMinutes()}</Text>
                    <Button title="Transaction details" onPress={() => {intercept(item,time,date)}} />
                </View>
            </Card>
        );
    }

    return (
        <View style={styles.container}>
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
                    Admin Panel
                </Text>
            </View>

            <Modal visible={isModalVisible}>
                <View style={{flex: 1}}>
                    <View style={styles.wbHead}>
                        <TouchableOpacity
                            style={{padding: 13}}
                            onPress={handleModal}>
                            <Feather name={'x'} size={24} />
                        </TouchableOpacity>
                        <Text
                            style={{
                                flex: 1,
                                textAlign: 'center',
                                fontSize: 16,
                                fontWeight: 'bold',
                                color: '#00457C',
                            }}>
                            Transaction Details
                        </Text>
                        <View style={{padding: 13}}>
                            <ActivityIndicator size={24}  />
                        </View>
                    </View>
                    <Card>
                        <Image source={{uri: bikes.photoURL}} style={{
                            width: '100%',
                            height: 200
                        }} />
                    </Card>

                    {
                        selected &&
                            <Card>
                                <View style={styles.txContainer}>
                                    <Text style={styles.text}>Bike type: {bikes.name}</Text>
                                    <Text style={styles.text}>Transaction Id: {selected.paymentId}</Text>
                                    <Text style={styles.text}>Transaction Status: {selected.paymentStatus}</Text>
                                    <Text style={styles.text}>Amount: {selected.paymentValue}</Text>
                                    <Text style={styles.text}>Date:{date.getDate()}/{date.getMonth()+1}/{date.getFullYear()}</Text>
                                    <Text style={styles.text}>Time: {time.getHours()}:{time.getMinutes()}</Text>
                                </View>
                            </Card>
                    }
                    <TouchableOpacity style={{ paddingTop: 40}} onPress={() => checkOut(selected.id, bikes.id)}>
                        <View style={styles.button}>
                            <Text style={styles.buttonText}>CheckOut</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </Modal>
            <FlatList data={hires} renderItem={itemRenderer} keyExtractor={item => item.id}/>
        </View>
    )
}

export default Adminpanel;

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
    img: {
        width: '100%',
        height: 200
    },
    wbHead: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
        zIndex: 25,
        elevation: 2,
    },
    button: {
        width: 200,
        borderRadius: 8,
        paddingVertical: 7,
        paddingHorizontal: 10,
        backgroundColor: "#00ded6",
        margin: 5,
    },
    buttonText: {
        color: '#00457C',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        fontSize: 16,
        textAlign: 'center',
    },
    text: {
        fontSize: 14,
    },
})