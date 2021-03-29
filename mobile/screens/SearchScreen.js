import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Searchbar } from 'react-native-paper';
import { theme } from '../styles';

const SearchScreen = ({ navigation }) => {
    const [searchQuery, setSearchQuery] = React.useState('');

    const onChangeSearch = query => setSearchQuery(query);
    return (
        <View style={styles.container}>
            <Searchbar
                style={styles.searchbar}
                placeholder="Search"
                value={searchQuery}
                onChangeText={onChangeSearch}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: '5%',
        justifyContent: 'center',
    },
    searchbar: {
        width: '90%',
        marginHorizontal: '5%',
        marginBottom: '5%',
    },
});

export default SearchScreen;
