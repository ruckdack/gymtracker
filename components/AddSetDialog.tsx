import React, { useEffect, useRef, useState } from 'react'
import { View } from 'react-native'
import {
    Button,
    Dialog,
    TextInput,
    HelperText,
    IconButton,
    Text,
    withTheme,
} from 'react-native-paper'
import { Set } from '../model/PerformedExercises'
import usePrevious from '../model/usePrevious'

interface Props {
    visible: boolean
    setVisible: (newVis: boolean) => void
    addCardSet: (newSet: Set) => void
    prevSet: Set | null
    theme: ReactNativePaper.Theme
}

const AddSetDialog = ({
    visible,
    setVisible,
    addCardSet,
    prevSet,
    theme,
}: Props) => {
    const [repsString, setRepsString] = useState('')
    const repsRegex = /^\d+$/
    const [weightString, setWeightString] = useState('')
    const weightRegex = /^\d+(.\d+)?$/
    const [rir, setRir] = useState(0)
    const prevVisible = usePrevious(visible)

    useEffect(() => {
        if (!prevVisible && visible) {
            if (prevSet) {
                setRepsString(`${prevSet.reps}`)
                setWeightString(`${prevSet.weight}`)
                setRir(prevSet.rir)
            } else {
                setRepsString('')
                setWeightString('')
                setRir(0)
            }
        }
    }, [visible])

    const addToRir = (x: number) => setRir(Math.max(rir + x, 0))

    const repsMatch = repsRegex.test(repsString)
    const weightMatch = weightRegex.test(weightString)

    return (
        <Dialog visible={visible} onDismiss={() => setVisible(false)}>
            <Dialog.Title>add set</Dialog.Title>
            <Dialog.Content>
                <TextInput
                    mode='outlined'
                    keyboardType='numeric'
                    label='reps'
                    value={repsString}
                    onChangeText={setRepsString}
                />
                <HelperText type='error' visible={!repsMatch}>
                    Invalid format!
                </HelperText>
                <TextInput
                    mode='outlined'
                    keyboardType='numeric'
                    label='weight'
                    value={weightString}
                    onChangeText={setWeightString}
                />
                <HelperText type='error' visible={!weightMatch}>
                    Invalid format, use dot for decimals!
                </HelperText>
                <View style={{ flexDirection: 'row' }}>
                    <Text
                        style={{
                            marginHorizontal: 16,
                            fontSize: 16,
                            textAlignVertical: 'center',
                        }}
                    >
                        rir
                    </Text>
                    <IconButton onPress={() => addToRir(-1)} icon='minus' />
                    <Text style={{ textAlignVertical: 'center' }}>{rir}</Text>
                    <IconButton onPress={() => addToRir(1)} icon='plus' />
                </View>
            </Dialog.Content>
            <Dialog.Actions>
                <Button
                    onPress={() => setVisible(false)}
                    color={theme.colors.text}
                >
                    cancel
                </Button>
                <Button
                    color={theme.colors.text}
                    disabled={!(repsMatch && weightMatch)}
                    onPress={() => {
                        addCardSet({
                            weight: parseFloat(weightString),
                            reps: parseInt(repsString, 10),
                            rir: rir,
                        })
                        setVisible(false)
                    }}
                >
                    ok
                </Button>
            </Dialog.Actions>
        </Dialog>
    )
}

export default withTheme(AddSetDialog)
