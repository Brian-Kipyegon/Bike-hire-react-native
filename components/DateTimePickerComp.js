import {ActivityIndicator, Button, Image, Modal, Text, TouchableOpacity, View} from "react-native";
import {Feather} from "@expo/vector-icons";
import {WebView} from "react-native-webview";
import {Card} from "react-native-elements";
import NumericInput from "react-native-numeric-input";
import DateTimePicker from "@react-native-community/datetimepicker";
import React from "react";

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