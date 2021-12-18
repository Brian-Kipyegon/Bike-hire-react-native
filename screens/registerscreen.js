import React, { useState, useEffect } from 'react'
import { TextInput, Image, Button, StyleSheet, View, Text, ImageBackground } from 'react-native';

import { auth, db } from '../firebase_auth';
import Button1 from '../components/button';

export default function RegisterScreen({ navigation }) {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleEmailChange = (text) => {
        setEmail(text);
    }

    const handlePasswordChange = (text) => {
        setPassword(text);
    }

    const registerUser = () => {
        auth
            .createUserWithEmailAndPassword(email, password)
            .then((userCredentials) => {
                const user = userCredentials.user;
                console.log(user);
                db.collection('Points').add({
                    user: user.uid,
                    points: 0
                })
                navigation.navigate('HomeScreen', {
                    screen: 'HomeTab',
                });

            })
            .catch((error) => {
                alert(error.message);
            })


    }

    const loginUser = () => {
        auth
            .signInWithEmailAndPassword(email, password)
            .then((userCredentials) => {
                const user = userCredentials.user;
                //console.log(user);
                navigation.navigate('HomeScreen', {
                    screen: 'HomeTab',
                });
            })
            .catch((error) => {
                alert(error.message);
            })
    }

    return (
        <View style={styles.container} behavior="padding">
            <ImageBackground
                style={styles.image}
                source={require('../assets/bike.jpg')}
                blurRadius={0.5}
            >
                <Image
                    style={styles.loginImage}
                    source={require('../assets/default.png')}
                />
                <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={handleEmailChange}
                    placeholder="Enter your email"
                    placeholderTextColor="grey"
                />
                <TextInput
                    style={styles.input}
                    value={password}
                    onChangeText={handlePasswordChange}
                    placeholder="Enter your password"
                    placeholderTextColor="grey"
                    secureTextEntry
                />

                <Button1 text='Login' onPressHandler={loginUser} />
                <Button1 text='Register' onPressHandler={registerUser} />
            </ImageBackground>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    input: {
        width: '70%',
        borderColor: 'gray',
        borderBottomWidth: 1,
        marginBottom: 15,
        color: 'white',
        fontSize: 20,
    },
    image: {
        flex: 1,
        resizeMode: 'stretch',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loginImage: {
        width: 150,
        height: 150,
        borderRadius: 100,
        marginBottom: 40,
    }
})
