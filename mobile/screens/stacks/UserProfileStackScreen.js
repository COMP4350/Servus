import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import UserProfileScreen from '../UserProfileScreen';
import { theme } from '../../styles';

const UserProfile = createStackNavigator();

const UserProfileStackScreen = ({ navigation }) => {
    return (
        <UserProfile.Navigator
            screenOptions={{
                headerStyle: {
                    backgroundColor: theme.colors.dark,
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
            }}>
            <UserProfile.Screen
                name="User Profile"
                component={UserProfileScreen}
            />
        </UserProfile.Navigator>
    );
};

export default UserProfileStackScreen;
