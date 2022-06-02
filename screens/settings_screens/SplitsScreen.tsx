import React, { useEffect, useState } from 'react'
import { SafeAreaView, ScrollView } from 'react-native'
import { FAB, withTheme, Portal } from 'react-native-paper'
import AddSplitDialog from '../../components/AddSplitDialog'
import ClickableItemList from '../../components/ClickableItemList'
import ErrorAlert from '../../components/ErrorAlert'
import ListItem from '../../components/ListItem'
import LoadingSafeAreaView from '../../components/LoadingSafeAreaView'
import { Muscles } from '../../model/Muscles'
import { Splits } from '../../model/Splits'

interface Props {
    navigation: any
    theme: ReactNativePaper.Theme
}

const SplitsScreen = ({ navigation, theme }: Props) => {
    const [splits, setSplits] = useState<ListItem[]>([])
    const [loading, setLoading] = useState(false)
    const [addSplitDialogVisisble, setAddSplitDialogVisible] = useState(false)
    const [musclesList, setMusclesList] = useState<ListItem[]>([])

    const update = async () => {
        setLoading(true)
        await Splits.getInst()
            .getAllAsListItem()
            .then(setSplits)
            .catch((err) => {
                setLoading(false)
                ErrorAlert(err.message)
            })
        await Muscles.getInst()
            .getAllAsListItem()
            .then(setMusclesList)
            .catch((err) => {
                setLoading(false)
                ErrorAlert(err.message)
            })
        setLoading(false)
    }

    useEffect(() => {
        update()
        Splits.getInst().subscribe(update)
        return () => Splits.getInst().unsubscribe(update)
    }, [])

    if (loading) {
        return <LoadingSafeAreaView />
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView>
                <ClickableItemList
                    data={splits}
                    onPress={(item: ListItem) =>
                        navigation.navigate('DetailedSplitScreen', item)
                    }
                />
            </ScrollView>
            <FAB
                style={{
                    position: 'absolute',
                    margin: theme.margins.large,
                    right: 0,
                    bottom: 0,
                }}
                icon='plus'
                onPress={() => setAddSplitDialogVisible(true)}
            />
            <Portal>
                <AddSplitDialog
                    visible={addSplitDialogVisisble}
                    setVisible={setAddSplitDialogVisible}
                    notAllowed={splits.map((s) => s.content)}
                    musclesList={musclesList}
                />
            </Portal>
        </SafeAreaView>
    )
}

export default withTheme(SplitsScreen)
