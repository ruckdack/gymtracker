import React, { useState } from 'react'
import { ScrollView } from 'react-native'
import {
    Button,
    Dialog,
    TextInput,
    Snackbar,
    HelperText,
    withTheme,
} from 'react-native-paper'
import { Exercises } from '../model/Exercises'
import { MuscleCounter } from '../model/MuscleCounter'
import ErrorAlert from './ErrorAlert'
import ListItem from './ListItem'
import MuscleCounterPicker from './MuscleCounterPicker'

interface Props {
    visible: boolean
    setVisible: (newVis: boolean) => void
    notAllowed: string[]
    musclesList: ListItem[]
    theme: ReactNativePaper.Theme
}

const AddExerciseDialog = ({
    visible,
    setVisible,
    notAllowed,
    musclesList,
    theme,
}: Props) => {
    const [exerciseName, setExerciseName] = useState('')
    const [counter, setCounter] = useState(new MuscleCounter())
    const [snackbarVisible, setSnackbarVisible] = useState(false)
    const [snackbarText, setSnackbarText] = useState('')

    const nameIsNotAllowed = notAllowed.includes(exerciseName)

    const cleanUpAndClose = () => {
        setExerciseName('')
        setVisible(false)
    }

    return (
        <Dialog visible={visible} onDismiss={cleanUpAndClose}>
            <ScrollView>
                <Dialog.Title>add new exercise</Dialog.Title>
                <Dialog.Content>
                    <TextInput
                        label='exercise name'
                        value={exerciseName}
                        mode='outlined'
                        onChangeText={setExerciseName}
                    />
                    <HelperText type='error' visible={nameIsNotAllowed}>
                        This exercise already exists!
                    </HelperText>
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
                    disabled={exerciseName === '' || nameIsNotAllowed}
                    onPress={() => {
                        if (counter.isEmpty()) {
                            setSnackbarText('Add target muscle!')
                            setSnackbarVisible(true)
                            return
                        }
                        cleanUpAndClose()
                        Exercises.getInst()
                            .add(exerciseName, counter)
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

export default withTheme(AddExerciseDialog)
