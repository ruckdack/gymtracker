import React, { useEffect, useState } from 'react'
import {
    Button,
    Dialog,
    Divider,
    HelperText,
    TextInput,
    withTheme,
} from 'react-native-paper'
import { Muscles } from '../model/Muscles'
import ErrorAlert from './ErrorAlert'

interface Props {
    visible: boolean
    setVisible: (newVis: boolean) => void
    notAllowed: string[]
    theme: ReactNativePaper.Theme
}

const AddMuscleDialog = ({ visible, setVisible, notAllowed, theme }: Props) => {
    const [muscleName, setMuscleName] = useState('')

    const nameIsNotAllowed = notAllowed.includes(muscleName)

    const cleanUpAndClose = () => {
        setMuscleName('')
        setVisible(false)
    }

    return (
        <Dialog visible={visible} onDismiss={cleanUpAndClose}>
            <Dialog.Title>add new muscle</Dialog.Title>
            <Dialog.Content>
                <TextInput
                    label='muscle name'
                    value={muscleName}
                    onChangeText={setMuscleName}
                />
                <HelperText type='error' visible={nameIsNotAllowed}>
                    This muscle already exists!
                </HelperText>
            </Dialog.Content>
            <Dialog.Actions>
                <Button onPress={cleanUpAndClose} color={theme.colors.text}>
                    cancel
                </Button>
                <Button
                    color={theme.colors.text}
                    disabled={muscleName === '' || nameIsNotAllowed}
                    onPress={() => {
                        cleanUpAndClose()
                        Muscles.getInst()
                            .add(muscleName)
                            .catch((err) => ErrorAlert(err.message))
                    }}
                >
                    ok
                </Button>
            </Dialog.Actions>
        </Dialog>
    )
}

export default withTheme(AddMuscleDialog)
