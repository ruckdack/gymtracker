import React, { useState } from 'react'
import { ScrollView } from 'react-native'
import { Button, Dialog, Text, Snackbar, withTheme } from 'react-native-paper'
import { Exercise, Exercises } from '../model/Exercises'
import { MuscleCounter } from '../model/MuscleCounter'
import ErrorAlert from './ErrorAlert'
import ListItem from './ListItem'
import MuscleCounterPicker from './MuscleCounterPicker'

interface Props {
    visible: boolean
    setVisible: (newVis: boolean) => void
    exercise: Exercise
    musclesList: ListItem[]
    theme: ReactNativePaper.Theme
}

const ModifyRatiosDialog = ({
    visible,
    setVisible,
    exercise,
    musclesList,
    theme,
}: Props) => {
    const [counter, setCounter] = useState(exercise.ratios)
    const [snackbarVisible, setSnackbarVisible] = useState(false)
    const [snackbarText, setSnackbarText] = useState('')

    const cleanUpAndClose = () => {
        setVisible(false)
    }

    return (
        <Dialog visible={visible} onDismiss={cleanUpAndClose}>
            <ScrollView>
                <Dialog.Title>modify ratio</Dialog.Title>
                <Dialog.Content>
                    <MuscleCounterPicker
                        musclesList={musclesList}
                        counter={counter}
                        setCounter={setCounter}
                        firstListName='target muscles ratio'
                    />
                </Dialog.Content>
            </ScrollView>
            <Dialog.Actions>
                <Button onPress={cleanUpAndClose} color={theme.colors.text}>
                    cancel
                </Button>
                <Button
                    color={theme.colors.text}
                    onPress={() => {
                        if (counter.isEmpty()) {
                            setSnackbarText('Add target muscle!')
                            setSnackbarVisible(true)
                            return
                        }
                        cleanUpAndClose()
                        Exercises.getInst()
                            .exchangeRatios(exercise.id, counter)
                            .catch((err) => ErrorAlert(err.message))
                    }}
                >
                    OK
                </Button>
            </Dialog.Actions>
            <Snackbar
                duration={500}
                visible={snackbarVisible}
                onDismiss={() => setSnackbarVisible(false)}
            >
                {snackbarText}
            </Snackbar>
        </Dialog>
    )
}

export default withTheme(ModifyRatiosDialog)
