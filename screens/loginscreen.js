import React, { useState, useEffect } from 'react';
import { TextInput, Text, View, Button, StyleSheet, ImageBackground } from 'react-native';
import { auth } from '../firebase_auth';

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleEmailChange = (text) => {
        setEmail(text);
    }

    const handlePasswordChange = (text) => {
        setPassword(text);
    }

    const loginUser = () => {
        auth
            .signInWithEmailAndPassword(email, password)
            .then((userCredentials) => {
                const user = userCredentials.user;
                console.log(user.email);
                navigation.navigate('HomeScreen', {
                    screen: 'HomeTab',
                    params: {
                        user: user,
                    }
                });
            })
            .catch((error) => {
                alert(error.message);
            })
    }

    return (
        <View style={styles.container}>
            <ImageBackground
                style={styles.image}
                source={require('../assets/bike.jpg')}
                blurRadius={0.5}
            >
                <Text style={styles.text}>Email</Text>
                <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={handleEmailChange}
                />
                <Text style={styles.text}>Password</Text>
                <TextInput
                    style={styles.input}
                    value={password}
                    onChangeText={handlePasswordChange}
                    secureTextEntry
                />

                <Button
                    title='Login'
                    onPress={loginUser}
                />
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
        borderBottomWidth: 3,
        marginBottom: 5,
    },
    image: {
        flex: 1,
        resizeMode: 'stretch',
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        color: 'white',
        fontSize: 20,
    }
})