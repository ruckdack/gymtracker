import React, { useEffect, useState } from 'react'
import { SafeAreaView, ScrollView } from 'react-native'
import { FAB, IconButton, Portal, withTheme } from 'react-native-paper'
import AddMuscleDialog from '../../components/AddMuscleDialog'
import ClickableItemList from '../../components/ClickableItemList'
import ErrorAlert from '../../components/ErrorAlert'
import ListItem from '../../components/ListItem'
import LoadingSafeAreaView from '../../components/LoadingSafeAreaView'
import { Muscles } from '../../model/Muscles'

interface Props {
    navigation: any
    theme: ReactNativePaper.Theme
}

const MusclesScreen = ({ navigation, theme }: Props) => {
    const [musclesList, setMusclesList] = useState<ListItem[]>([])
    const [addMuscleDialogVisible, setAddMuscleDialogVisible] = useState(false)
    const [loading, setLoading] = useState(false)

    const update = async () => {
        setLoading(true)
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
        Muscles.getInst().subscribe(update)
        return () => {
            Muscles.getInst().unsubscribe(update)
        }
    }, [])

    if (loading) {
        return <LoadingSafeAreaView />
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView>
                <ClickableItemList
                    data={musclesList}
                    onPress={(item: ListItem) =>
                        navigation.navigate('DetailedMuscleScreen', item)
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
                onPress={() => setAddMuscleDialogVisible(true)}
            />
            <Portal>
                <AddMuscleDialog
                    visible={addMuscleDialogVisible}
                    setVisible={setAddMuscleDialogVisible}
                    notAllowed={musclesList.map(({ content }) => content)}
                />
            </Portal>
        </SafeAreaView>
    )
}

export default withTheme(MusclesScreen)
