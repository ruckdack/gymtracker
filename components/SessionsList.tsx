import React from 'react'
import { View } from 'react-native'
import {
    Button,
    Card,
    IconButton,
    List,
    Text,
    withTheme,
} from 'react-native-paper'

interface Props {
    theme: ReactNativePaper.Theme
}

const SessionsList = ({ theme }: Props) => {
    return (
        <View>
            <List.Section>
                <List.Accordion title='acc'>
                    <View style={{ flexDirection: 'row' }}>
                        <Button
                            icon='arrow-up'
                            onPress={() => console.log('up')}
                        >
                            move up
                        </Button>
                        <Button
                            icon='arrow-down'
                            onPress={() => console.log('down')}
                        >
                            move down
                        </Button>
                    </View>
                    <List.Item title='hi' />
                </List.Accordion>
            </List.Section>
        </View>
    )
}

export default withTheme(SessionsList)
