import React from 'react'
import { View } from 'react-native'
import { IconButton, Text } from 'react-native-paper'

interface Props {
    counter: number
    addToCounter: (x: number) => void
    text: string
}

const NumberPicker = ({ counter, addToCounter: addToCounter, text }: Props) => {
    return (
        <View style={{ flexDirection: 'row' }}>
            <IconButton onPress={() => addToCounter(-1)} icon='minus' />
            <Text style={{ textAlignVertical: 'center' }}>{counter}</Text>
            <IconButton onPress={() => addToCounter(1)} icon='plus' />
            <Text
                style={{
                    fontSize: 16,
                    textAlignVertical: 'center',
                }}
            >
                {text}
            </Text>
        </View>
    )
}

export default NumberPicker
