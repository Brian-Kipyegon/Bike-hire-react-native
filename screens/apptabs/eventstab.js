import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

const EventsTab = () => {
    return (
        <View style={styles.container}>
            <Text>Events</Text>
        </View>
    )
}

export default EventsTab;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
})
