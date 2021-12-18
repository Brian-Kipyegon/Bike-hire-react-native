import React, { useState } from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';
import HomeTab from './apptabs/HomeTab';
import EventsTab from './apptabs/eventstab';
import ProfileTab from './apptabs/profiletab';
import Announcements from './apptabs/announcements';
import Adminpanel from "./apptabs/adminpanel";
import { auth } from '../firebase_auth';

const Tab = createBottomTabNavigator();

const HomeScreen = ({ navigation }) => {

    const [isAdmin, setIsAdmin] = useState(() => {
        if (auth.currentUser.email  === "test2@gmail.com") {
            return true;
        }
        return false;
    })

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                let iconName;
    
                if (route.name === 'Home') {
                    iconName = focused? 'home' : 'home-outline';
                } else if (route.name === 'Events') {
                    iconName = focused ? 'bicycle-sharp' : 'bicycle-outline';
                } else if (route.name === 'Profile') {
                    iconName = focused ? 'person-outline' : 'person-sharp';
                } else if (route.name === 'Announcements') {
                    iconName = focused ? 'person-outline' : 'person-outline';
                } else if (route.name === 'AdminPanel') {
                    iconName = focused ? 'person-outline' : 'person-outline';
                }
    
                // You can return any component that you like here!
                return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#00ded6',
                tabBarInactiveTintColor: 'gray',
                headerShown: false
            })}
        >
            <Tab.Screen name="Home" component={HomeTab} />
            <Tab.Screen name="Events" component={EventsTab} />
            <Tab.Screen name="Announcements" component={Announcements} />
            <Tab.Screen name="Profile" component={ProfileTab} />
            { isAdmin ? (<Tab.Screen name="AdminPanel" component={Adminpanel} />) : null }
        </Tab.Navigator>
    )
}

export default HomeScreen;


