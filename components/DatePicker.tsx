import React from 'react'
import { Calendar } from 'react-native-calendars'
import { Button, Dialog, withTheme } from 'react-native-paper'

interface Props {
    visible: boolean
    setVisible: (newVis: boolean) => void
    setDate: (date: string) => void
    theme: ReactNativePaper.Theme
}

const DatePicker = ({ visible, setVisible, setDate, theme }: Props) => {
    return (
        <Dialog visible={visible} onDismiss={() => setVisible(false)}>
            <Dialog.Title>pick start date</Dialog.Title>
            <Dialog.Content>
                <Calendar
                    theme={{
                        arrowColor: theme.colors.accent,
                        todayTextColor: theme.colors.accent,
                        dotColor: theme.colors.accent,
                        selectedDayBackgroundColor: theme.colors.accent,
                        calendarBackground: 'transparent',
                        monthTextColor: theme.colors.text,
                        dayTextColor: theme.colors.text,
                    }}
                    onDayPress={(date) => {
                        setDate(date.dateString)
                        setVisible(false)
                    }}
                />
            </Dialog.Content>
            <Dialog.Actions>
                <Button onPress={() => setVisible(false)}>cancel</Button>
            </Dialog.Actions>
        </Dialog>
    )
}

export default withTheme(DatePicker)
