import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import SearchScreen from '../SearchScreen';
import { theme } from '../../styles';

const SearchStack = createStackNavigator();

const SearchStackScreen = ({ navigation }) => {
    return (
        <SearchStack.Navigator
            screenOptions={{
                headerStyle: {
                    backgroundColor: theme.colors.dark,
                },
                cardStyle: {
                    backgroundColor: 'white',
                },
                headerTintColor: '#FFF',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
            }}>
            <SearchStack.Screen name="Search" component={SearchScreen} />
        </SearchStack.Navigator>
    );
};

export default SearchStackScreen;
