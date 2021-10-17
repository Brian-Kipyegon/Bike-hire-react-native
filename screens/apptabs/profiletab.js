import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

const ProfileTab = () => {
    return (
        <View style={styles.container}>
            <Text>Profile tab</Text>
        </View>
    )
}

export default ProfileTab;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
})
