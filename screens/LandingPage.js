import React from 'react'
import { Text, View, Button, ImageBackground, StyleSheet } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler';

export default function LandingPage({ navigation }) {
    return (
        <View style={styles.container}>
            <ImageBackground 
                style={styles.image} 
                source={require('../assets/bike.jpg')}
                blurRadius={0.4}
            >
                <View style={styles.contentArea}>
                    <View style={styles.loginForm}>
                        <Text style={styles.text}>Bike Hire</Text>
                    </View>
                    <View style={styles.cont}>
                        <TouchableOpacity
                            onPress = {() => {
                                navigation.navigate('RegisterScreen')
                            }}
                            style={styles.links}
                        >
                            <Text style={{ color: 'white', fontSize: 20}}>Register</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress = {() => {
                                navigation.navigate('LoginScreen')
                            }}
                            style={styles.links}
                        >
                            <Text style={{ color: 'white', fontSize: 20}}>Login</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                
            </ImageBackground>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    image: {
        flex: 1,
        resizeMode: 'stretch',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    loginForm: {
        backgroundColor: 'transparent',
        alignItems: 'center',
    },
    contentArea: {
        padding: 20,
        marginBottom: 30,
    },
    text: {
        fontSize: 50,
        fontWeight: 'bold',
        color: 'white',
    },
    cont: {
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    links: {
        margin: 5,
    }
})
