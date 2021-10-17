import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

const HomeTab = () => {
    return (
        <View style={styles.container}>
            <Text>HomeTab</Text>
        </View>
    )
}

export default HomeTab;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
})
