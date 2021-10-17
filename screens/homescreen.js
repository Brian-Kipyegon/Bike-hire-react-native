import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeTab from './apptabs/HomeTab';
import EventsTab from './apptabs/eventstab';
import ProfileTab from './apptabs/profiletab';

const Tab = createBottomTabNavigator();

const HomeScreen = ({ navigation }) => {
    return (
        <Tab.Navigator>
            <Tab.Screen name="Home" component={HomeTab} />
            <Tab.Screen name="Events" component={EventsTab} />
            <Tab.Screen name="Profile" component={ProfileTab} />
        </Tab.Navigator>
    )
}

export default HomeScreen;


