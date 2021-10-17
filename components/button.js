import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'

const Button = ({ text, onPressHandler}) => {
    return (
        <TouchableOpacity onPress={onPressHandler}>
            <View style={styles.button}>
                <Text style={styles.buttonText}>{text}</Text>
            </View>
        </TouchableOpacity>
    )
}

export default Button;

const styles = StyleSheet.create({
    button: {
        width: 200,
        borderRadius: 8,
        paddingVertical: 7,
        paddingHorizontal: 10,
        backgroundColor: '#3bf793',
        margin: 5,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        fontSize: 16,
        textAlign: 'center',
    }
})
