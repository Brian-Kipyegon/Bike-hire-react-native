import React, { useState, useEffect } from 'react'
import {StyleSheet, Text, View, Image, Modal, TextInput, ActivityIndicator, TouchableOpacity, Button } from 'react-native'
import { WebView } from 'react-native-webview';
import { Card } from 'react-native-elements';
import { FlatList } from 'react-native-gesture-handler';
import {auth, db, storage} from '../../firebase_auth';
import {AntDesign, Feather} from "@expo/vector-icons";
import NumericInput from 'react-native-numeric-input';
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from '@react-native-community/datetimepicker';

const HomeTab = () => {

    const [bikes, setBikes] = useState([]);
    const [isModalVisible, setModalVisible] = useState(false);
    const [modalVisible, setModalVisible2] = useState(false);
    const [selectedBike, setSelectedBike] =useState(null);
    const [payableAmount, setPayableAmount] = useState(0);
    const [hours, setHours] = useState(0);
    const [showGateway, setShowGateway] = useState(false);
    const [prog, setProg] = useState(false);
    const [progClr, setProgClr] = useState('#000');
    const [isAdmin, setIsAdmin] = useState(() => {
        if (auth.currentUser.email  === "test2@gmail.com") {
            return true;
        }
        return false;
    });
    const [bikeType, setBikeType] = useState();
    const [bikeImageUrl, setBikeImageUrl] = useState();
    const user = auth.currentUser;
    const [date, setDate] = useState(new Date(Date.now()));
    const [time, setTime] = useState(new Date(Date.now()));
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [points, setPoints] = useState(1);
    const [pointsRef, setPointsRef] = useState();

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

        db
            .collection('Points')
            .where('user', '==', user.uid)
            .get()
            .then(docs => {
                docs.forEach(doc => {
                    setPoints(doc.data().points);
                    setPointsRef(doc.id);
                })
            })

        return () => unsubscribe();
    }, []);

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
            aspect: [5, 4],
            quality: 1,
        });

        console.log(result);

        if (!result.cancelled) {
            setBikeImageUrl(result.uri)
        }
    };

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

    const handleHire2 = (id, paymentStatus, paymentValue, paymentId) => {
        db.doc(`Bikes/${id}`).update({
            isAvailable: false
        });
        db.collection("Hire2").add({
            user: user.uid,
            bike: id,
            paymentStatus: paymentStatus,
            paymentValue: payableAmount,
            paymentId: paymentId,
            date: date,
            time: time,
            isCheckedOut: false
        });
        db.doc(`Points/${pointsRef}`).update({
            points: points + 10
        })
        alert('Hired');
    }

    const onMessage = (e) => {
        let data = e.nativeEvent.data;
        let payment = JSON.parse(data);
        setShowGateway(false);
        let paymentId = payment.id
        let amount = payment.purchase_units[0].amount.value
        let paymentStatus = payment.status

        console.log(paymentId);
        console.log(amount)
        console.log(paymentStatus)
        if (payment.status === 'COMPLETED') {
            alert('PAYMENT MADE SUCCESSFULLY!');
            handleHire2(selectedBike.Id, paymentStatus, amount,  paymentId);
            handleModal();
        } else {
            alert('PAYMENT FAILED. PLEASE TRY AGAIN.');
            handleModal();
        }
    }


    const handleModal = () => setModalVisible(() => !isModalVisible);

    const handleModal2 = () => setModalVisible2(() => !modalVisible);

    const handleGateway = () => { setShowGateway(() => !showGateway) }

    const intercept = (id) => {
        setSelectedBike(bikes.find(o => o.Id === id));
        handleModal();
    }

    const amountPayableCalculator = (numhours) => {
        let hourlyRate = 40;
        setHours(numhours);
        setPayableAmount(numhours * hourlyRate);
    }

    const handleBikeTypeChange = (text) => {
        setBikeType(text);
    }

    const addBike = async () => {
        let resp = await fetch(bikeImageUrl);
        let  blob = await resp.blob();
        let filename = getRandomString(10);
        let reference = storage.ref().child("bikes/" + filename);
        await reference.put(blob);

        const setURL = await storage.ref("bikes/"+filename).getDownloadURL()
        console.log(setURL)

        db.collection("Bikes/").add({
            isAvailable: true,
            name: bikeType,
            photoURL: setURL
        })

        handleModal2();
        setBikeType(null);
        setBikeImageUrl(null);
    }

    const onChange = (event, selectedDate) => {
        const date = selectedDate || new Date(Date.now());
        setDate(date);
        if (Platform.OS === 'android') {
            setShowDatePicker(false);
        }
    };

    const onChange2 = (event, selectedTime) => {
        const time = selectedTime || new Date(Date.now());
        setTime(time);
        if (Platform.OS === 'android') {
            setShowTimePicker(false);
        }
    };

    const timePicker = () => {
        setShowTimePicker(true);
    }

    const datePicker = () => {
        setShowDatePicker(true);
    }


    const renderItem = ({ item }) => {
        return (
            <Card>
                <Image
                    source={{
                        uri: item.data.photoURL
                    }}
                    style={styles.bikeImage}
                />
                <Card.Divider />
                <View style={styles.bottomContainer}>
                    <Text style={{
                        flex: 1,
                        fontSize: 16,
                        fontWeight: 'bold',
                        color: '#00457C',
                    }}>{item.data.name}</Text>
                    <TouchableOpacity onPress={() => intercept(item.Id)}>
                        <View style={styles.button}>
                            <Text style={styles.buttonText}>Hire</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </Card>
        )
    };

    return (
        <View style={styles.container}>

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
                            Confirm
                        </Text>
                        <View style={{padding: 13, opacity: prog ? 1 : 0}}>
                            <ActivityIndicator size={24} color={progClr} />
                        </View>
                    </View>

                    <Modal
                        visible={showGateway}
                        onDismiss={() => setShowGateway(false)}
                        onRequestClose={() => setShowGateway(false)}
                        animationType={"fade"}
                    >
                        <View style={styles.webViewCon}>
                            <View style={styles.wbHead}>
                                <TouchableOpacity
                                    style={{padding: 13}}
                                    onPress={() => setShowGateway(false)}>
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
                                    PayPal GateWay
                                </Text>
                                <View style={{padding: 13, opacity: prog ? 1 : 0}}>
                                    <ActivityIndicator size={24} color={progClr} />
                                </View>
                            </View>
                            <WebView
                                source={{uri: 'https://brian-kipyegon.github.io/react-paypal/'}}
                                style={{flex: 1}}
                                onMessage={onMessage}
                                onLoadStart={() => {
                                    setProg(true);
                                    setProgClr('#000');
                                }}
                                onLoadProgress={() => {
                                    setProg(true);
                                    setProgClr('#00457C');
                                }}
                                onLoadEnd={() => {
                                    setProg(false);
                                }}
                                onLoad={() => {
                                    setProg(false);
                                }}
                            />
                        </View>
                    </Modal>

                    {selectedBike &&
                    <Card>
                        <Image
                            source={{uri: selectedBike.data.photoURL}}
                            style={styles.bikeImage}
                        />
                        <Card.Divider />

                        <Text style={{
                            fontSize: 30,
                            textAlign: "center"
                        }}>{selectedBike.data.name}</Text>
                    </Card>
                    }
                    <View style={styles.paymentinfocontainer}>
                        <View style={{
                            flexDirection: "row",
                            justifyContent: "flex-start",
                            padding: 10,
                        }}>
                            <Text style={{
                                fontSize: 30,
                                fontWeight: 'bold',
                                color: '#00457C',
                                padding: 20,
                            }}>Total Amount:</Text>
                            <Text style={{
                                fontSize: 30,
                                fontWeight: 'bold',
                                color: '#00457C',
                                padding: 20,
                            }}>{payableAmount}</Text>
                        </View>
                        <NumericInput
                            value={hours}
                            onChange={hours => amountPayableCalculator(hours)}
                            minValue={0}
                            rounded
                            textColor='#B0228C'
                            iconStyle={{ color: 'white' }}
                            rightButtonBackgroundColor='#00ded6'
                            leftButtonBackgroundColor='#EA3788'
                        />
                        <View style={{
                            padding: 10
                        }}>
                            <View style={{flexDirection: 'row', alignItems: "center", justifyContent: "space-evenly"}}>
                                <Text>{date.getDate()}/{date.getMonth() + 1}/{date.getFullYear()}</Text>
                                <Button title="Pick up date" onPress={datePicker}/>
                            </View>
                            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: "space-evenly"}}>
                                <Text>{time.getHours()}:{time.getMinutes()}: {time.getSeconds()}</Text>
                                <Button title="Pick up time" onPress={timePicker}/>
                            </View>
                            {
                                showDatePicker &&
                                <DateTimePicker
                                    testID="dateTimePicker"
                                    value={date}
                                    mode='date'
                                    is24Hour={true}
                                    display="default"
                                    onChange={onChange}
                                />
                            }
                            {
                                showTimePicker &&
                                <DateTimePicker
                                    testID="dateTimePicker"
                                    value={time}
                                    mode='time'
                                    is24Hour={true}
                                    display="default"
                                    onChange={onChange2}
                                />
                            }
                        </View>
                        <TouchableOpacity style={{ paddingTop: 40}} onPress={handleGateway}>
                            <View style={styles.button}>
                                <Text style={styles.buttonText}>Pay</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <Modal visible={modalVisible}>
                <View style={{ flex:1 }}>

                    <View style={styles.wbHead}>
                        <TouchableOpacity
                            style={{padding: 13}}
                            onPress={handleModal2}>
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
                            Add Bike
                        </Text>
                        <View style={{padding: 13, opacity: prog ? 1 : 0}}>
                            <ActivityIndicator size={24} color={progClr} />
                        </View>
                    </View>

                    <View style={{ flex:1, alignItems: 'center', justifyContent: 'center' }}>
                        {
                            bikeImageUrl &&
                            <Image
                                source={{
                                    uri: bikeImageUrl
                                }}
                                style={{
                                    width: '80%',
                                    height: 200,
                                    marginBottom: 30
                                }}
                            />
                        }

                        <TextInput
                            style={styles.input}
                            value={bikeType}
                            onChangeText={handleBikeTypeChange}
                            placeholder="Enter type of bike"
                            placeholderTextColor="grey"
                        />

                        <TouchableOpacity style={{ paddingTop: 40}} onPress={pickImage}>
                            <View style={[styles.button, {flexDirection: 'row', width: 200, justifyContent: 'space-evenly'}]}>
                                <AntDesign name="upload" size={24} color="black" />
                                <Text style={styles.buttonText}>Upload Image</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity style={{ paddingTop: 40}} onPress={addBike}>
                            <View style={[styles.button, {width: 100}]}>
                                <Text style={styles.buttonText}>Upload</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                </View>
            </Modal>

            {isAdmin ?
                <TouchableOpacity style={[styles.addButton, {padding: 10, borderRadius: 10}]} onPress={handleModal2}>
                    <Text style={styles.buttonText}>Add bike</Text>
                </TouchableOpacity> : null
            }

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
                    Available bikes
                </Text>
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
    bikeImage: {
        width: '100%',
        height: 200
    },
    webViewCon: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    wbHead: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
        zIndex: 25,
        elevation: 2,
    },
    paymentinfocontainer: {
        margin: 5,
        padding: 10,
        justifyContent: "center",
        alignItems: "center"
    },
    input: {
        width: '70%',
        borderColor: 'gray',
        borderBottomWidth: 1,
        marginBottom: 15,
        fontSize: 20,
    },
    button: {
        width: 70,
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
    bottomContainer: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 30,
    },
    addButton: {
        position: "absolute",
        bottom: 50,
        right: 50,
        zIndex: 1,
        backgroundColor: "#00ded6"
    },
})
