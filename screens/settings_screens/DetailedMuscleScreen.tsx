import React, { useEffect, useState } from 'react'
import { Alert, View } from 'react-native'
import ListItem from '../../components/ListItem'
import ErrorAlert from '../../components/ErrorAlert'
import { Muscle, Muscles } from '../../model/Muscles'
import { SafeAreaView } from 'react-native-safe-area-context'
import {
    Button,
    TextInput,
    withTheme,
    Portal,
    Dialog,
    Divider,
} from 'react-native-paper'

interface Props {
    route: any
    navigation: any
    theme: ReactNativePaper.Theme
}

const DetailedMuscleScreen = ({ route, navigation, theme }: Props) => {
    const listItem: ListItem = route.params
    const [muscle, setMuscle] = useState<Muscle>(
        Muscles.getInst().listItemToMuscle(listItem)
    )
    const [input, setInput] = useState<string>(muscle.name)
    const [changeNameVisible, setChangeNameVisible] = useState(false)

    useEffect(() => navigation.setOptions({ title: muscle.name }), [])

    return (
        <SafeAreaView>
            <View
                style={{
                    margin: theme.margins.medium,
                }}
            >
                <Button
                    onPress={() => setChangeNameVisible(true)}
                    icon='pencil'
                >
                    edit name
                </Button>
                <Button
                    icon='delete'
                    onPress={async () => {
                        if (
                            !(await Muscles.getInst().isMuscleTargetedByExercise(
                                muscle.id
                            ))
                        ) {
                            // TODO might need to await the delete
                            Muscles.getInst().deleteByID(muscle.id)
                            navigation.goBack()
                        } else {
                            Alert.alert(
                                'Warning',
                                'This muscle is targeted by an exercise. Delete exercise first.',
                                [{ text: 'ok', style: 'default' }]
                            )
                        }
                    }}
                >
                    delete muscle
                </Button>
            </View>
            <Divider />
            <Portal>
                <Dialog
                    visible={changeNameVisible}
                    onDismiss={() => setChangeNameVisible(false)}
                >
                    <Dialog.Title>change name</Dialog.Title>
                    <Dialog.Content>
                        <TextInput
                            mode='outlined'
                            onChangeText={setInput}
                            value={input}
                        />
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => setChangeNameVisible(false)}>
                            cancel
                        </Button>
                        <Button
                            onPress={async () => {
                                try {
                                    if (input === muscle.name) {
                                        setChangeNameVisible(false)
                                        return
                                    }
                                    if (input !== '') {
                                        await Muscles.getInst().renameByID(
                                            muscle.id,
                                            input
                                        )
                                        const newMuscle = await Muscles.getInst().getByID(
                                            muscle.id
                                        )
                                        // WARNING: header is another component, thus cannot rely on state of muscle! Has to be changed explicitly
                                        navigation.setOptions({
                                            title: newMuscle.name,
                                        })
                                        setMuscle(newMuscle)
                                        setChangeNameVisible(false)
                                    }
                                } catch (err: any) {
                                    ErrorAlert(err.message)
                                }
                            }}
                        >
                            ok
                        </Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </SafeAreaView>
    )
}

export default withTheme(DetailedMuscleScreen)
