import { StyleSheet } from 'react-native';
import { DefaultTheme } from 'react-native-paper';

const theme = {
    ...DefaultTheme,
    roundness: 2,
    colors: {
        ...DefaultTheme.colors,
        primary: '#60B2E5',
        dark: '#1E1E24',
        secondary: '#71A2B6',
        accent: '#71A2B6',
    },
};

const commonStyles = StyleSheet.create({
    Card: {
        backgroundColor: 'white',
        borderRadius: 5,
        borderColor: 'black',
        paddingHorizontal: 10,
        paddingVertical: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.37,
        shadowRadius: 7.49,

        elevation: 12,
    },
    Text: {
        color: theme.colors.dark,
    },
});

export { commonStyles, theme };
