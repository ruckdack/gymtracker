import React, { useEffect, useState } from 'react'
import { Alert, View } from 'react-native'
import ListItem from '../../components/ListItem'
import ErrorAlert from '../../components/ErrorAlert'
import { SafeAreaView } from 'react-native-safe-area-context'
import {
    Button,
    TextInput,
    withTheme,
    Portal,
    Dialog,
    Divider,
    List,
} from 'react-native-paper'
import { Split, Splits } from '../../model/Splits'
import LoadingSafeAreaView from '../../components/LoadingSafeAreaView'
import { Muscles } from '../../model/Muscles'
import ClickableItemList from '../../components/ClickableItemList'

interface Props {
    route: any
    navigation: any
    theme: ReactNativePaper.Theme
}

const DetailedSplitScreen = ({ route, navigation, theme }: Props) => {
    const [loading, setLoading] = useState(false)
    const listItem: ListItem = route.params
    const [split, setSplit] = useState<Split>({
        name: listItem.content,
        id: listItem.key,
        involvedMuscles: [],
    })
    const [input, setInput] = useState<string>(listItem.content)
    const [changeNameVisible, setChangeNameVisible] = useState(false)

    useEffect(() => {
        setLoading(true)
        Splits.getInst()
            .getByID(listItem.key)
            .then((split: Split) => {
                setSplit(split)
                setInput(split.name)
                setLoading(false)
            })
            .catch((err) => {
                setLoading(false)
                ErrorAlert(err.message)
            })
        navigation.setOptions({ title: listItem.content })
    }, [])

    if (loading) {
        return <LoadingSafeAreaView />
    }

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
                        Splits.getInst().deleteByID(split.id)
                        navigation.goBack()
                    }}
                >
                    delete split
                </Button>
            </View>
            <Divider />
            <ClickableItemList
                data={Splits.getInst().getInvolvedMusclesAsListItem(
                    split.involvedMuscles
                )}
                onPress={() => {}}
            />
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
                                    if (input === split.name) {
                                        setChangeNameVisible(false)
                                        return
                                    }
                                    if (input !== '') {
                                        await Splits.getInst().renameByID(
                                            split.id,
                                            input
                                        )
                                        const newSplit = await Splits.getInst().getByID(
                                            split.id
                                        )
                                        // WARNING: header is another component, thus cannot rely on state of muscle! Has to be changed explicitly
                                        navigation.setOptions({
                                            title: newSplit.name,
                                        })
                                        setSplit(newSplit)
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

export default withTheme(DetailedSplitScreen)
