import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Agenda } from 'react-native-calendars';
import { Card, Text, Portal, Dialog, Button } from 'react-native-paper';

const BookScreen = ({ navigation, route }) => {
    const [items, setItems] = useState({});
    const [dialogVisible, setDialogVisible] = useState(false);
    const [time, setTime] = useState('');
    const [day, setDay] = useState('');

    const showDialog = time => {
        setTime(time);
        setDialogVisible(true);
    };

    const hideDialog = () => setDialogVisible(false);

    const loadItems = day => {
        // set the availabilites on the calendar
    };

    const bookAppointment = () => {
        // book appointment with API
        navigation.popToTop();
        navigation.navigate('Upcoming Appointments');
    };

    const renderItem = item => {
        return (
            <TouchableOpacity
                style={{ marginRight: 10, marginTop: 30, height: 60 }}
                onPress={() => showDialog(item.time, item.type)}>
                <Card style={{ height: '100%' }}>
                    <Card.Content>
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}>
                            <Text>{item.time}</Text>
                            <Text>{item.type}</Text>
                        </View>
                    </Card.Content>
                </Card>
            </TouchableOpacity>
        );
    };

    return (
        <View style={{ flex: 1 }}>
            <Agenda
                minDate={new Date()}
                items={items}
                loadItemsForMonth={loadItems}
                selected={new Date()}
                renderItem={renderItem}
                onDayPress={day => {
                    setDay(day);
                }}
            />
            <Portal>
                <Dialog visible={dialogVisible} onDismiss={hideDialog}>
                    <Dialog.Title>Confirm</Dialog.Title>
                    <Dialog.Content>
                        <Text>Book Appointment on:</Text>
                        <Text>
                            {day} at {time}?
                        </Text>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={hideDialog}>Cancel</Button>
                        <Button onPress={bookAppointment}>Ok</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </View>
    );
};

export default BookScreen;
