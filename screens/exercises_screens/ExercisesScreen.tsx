import React, { useEffect } from 'react'
import { useState } from 'react'
import { ScrollView, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import {
    Card,
    Divider,
    FAB,
    IconButton,
    List,
    Portal,
    withTheme,
} from 'react-native-paper'
import ListItem from '../../components/ListItem'
import ClickableItemList from '../../components/ClickableItemList'
import { Exercises } from '../../model/Exercises'
import ErrorAlert from '../../components/ErrorAlert'
import AddExerciseDialog from '../../components/AddExerciseDialog'
import { Muscles } from '../../model/Muscles'
import LoadingSafeAreaView from '../../components/LoadingSafeAreaView'

interface Props {
    navigation: any
    theme: ReactNativePaper.Theme
}

const ExercisesScreen = ({ navigation, theme }: Props) => {
    const [exercisesList, setExercisesList] = useState<ListItem[]>([])
    const [musclesList, setMusclesList] = useState<ListItem[]>([])
    const [addExerciseDialogVisible, setAddExerciseDialogVisible] = useState(
        false
    )
    const [loading, setLoading] = useState(false)

    const update = async () => {
        setLoading(true)
        await Exercises.getInst()
            .getAllAsListItem()
            .then(setExercisesList)
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
        Exercises.getInst().subscribe(update)
        Muscles.getInst().subscribe(update)
        return () => {
            Exercises.getInst().unsubscribe(update)
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
                    data={exercisesList}
                    onPress={(item: ListItem) => {
                        navigation.navigate('DetailedExerciseScreen', item)
                    }}
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
                onPress={() => setAddExerciseDialogVisible(true)}
            />
            <Portal>
                <AddExerciseDialog
                    visible={addExerciseDialogVisible}
                    setVisible={setAddExerciseDialogVisible}
                    notAllowed={exercisesList.map(({ content }) => content)}
                    musclesList={musclesList}
                />
            </Portal>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({})

export default withTheme(ExercisesScreen)
