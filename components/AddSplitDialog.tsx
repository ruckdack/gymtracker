import React, { useState } from 'react'
import { ScrollView, View } from 'react-native'
import {
    Button,
    Dialog,
    TextInput,
    Snackbar,
    HelperText,
    withTheme,
    List,
    Divider,
    Checkbox,
} from 'react-native-paper'
import { Splits } from '../model/Splits'
import ErrorAlert from './ErrorAlert'
import ListItem from './ListItem'

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
    const [splitName, setSplitName] = useState('')
    const [snackbarVisible, setSnackbarVisible] = useState(false)
    const [snackbarText, setSnackbarText] = useState('')
    const [selectedMuscles, setSelectedMuscles] = useState<number[]>([])

    const nameIsNotAllowed = notAllowed.includes(splitName)

    const cleanUpAndClose = () => {
        setSplitName('')
        setVisible(false)
    }

    return (
        <Dialog visible={visible} onDismiss={cleanUpAndClose}>
            <ScrollView>
                <Dialog.Title>add new split</Dialog.Title>
                <Dialog.Content>
                    <TextInput
                        label='exercise name'
                        value={splitName}
                        mode='outlined'
                        onChangeText={setSplitName}
                    />
                    <HelperText type='error' visible={nameIsNotAllowed}>
                        This split already exists!
                    </HelperText>
                    <List.Section>
                        {musclesList.map((muscle) => (
                            <View key={muscle.key}>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        overflow: 'scroll',
                                    }}
                                >
                                    <Checkbox
                                        status={
                                            selectedMuscles.includes(muscle.key)
                                                ? 'checked'
                                                : 'unchecked'
                                        }
                                        onPress={() => {
                                            if (
                                                selectedMuscles.includes(
                                                    muscle.key
                                                )
                                            ) {
                                                setSelectedMuscles(
                                                    selectedMuscles.filter(
                                                        (m) => m !== muscle.key
                                                    )
                                                )
                                                return
                                            }
                                            setSelectedMuscles(
                                                selectedMuscles.concat([
                                                    muscle.key,
                                                ])
                                            )
                                        }}
                                    />
                                    <List.Item title={muscle.content} />
                                </View>
                                <Divider />
                            </View>
                        ))}
                    </List.Section>
                </Dialog.Content>
            </ScrollView>
            <Dialog.Actions>
                <Button onPress={cleanUpAndClose} color={theme.colors.text}>
                    cancel
                </Button>
                <Button
                    color={theme.colors.text}
                    disabled={splitName === '' || nameIsNotAllowed}
                    onPress={() => {
                        if (selectedMuscles.length === 0) {
                            setSnackbarText('Add at least one muscle!')
                            setSnackbarVisible(true)
                            return
                        }
                        cleanUpAndClose()
                        Splits.getInst()
                            .add({
                                id: 0,
                                name: splitName,
                                involvedMuscles: selectedMuscles.map((id) => [
                                    id,
                                    '',
                                ]),
                            })
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
