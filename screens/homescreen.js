import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';
import HomeTab from './apptabs/HomeTab';
import EventsTab from './apptabs/eventstab';
import ProfileTab from './apptabs/profiletab';

const Tab = createBottomTabNavigator();

const HomeScreen = ({ navigation }) => {
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
            <Tab.Screen name="Profile" component={ProfileTab} />
        </Tab.Navigator>
    )
}

export default HomeScreen;


