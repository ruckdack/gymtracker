import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { SafeAreaView, StyleSheet, Text } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import ClickableItemList from '../../components/ClickableItemList'
import ErrorAlert from '../../components/ErrorAlert'
import ListItem from '../../components/ListItem'
import LoadingSafeAreaView from '../../components/LoadingSafeAreaView'
import { Exercises } from '../../model/Exercises'
import { getDate } from '../../model/Helper'

const ExerciseSelectionScreen = ({ navigation, route }: any) => {
    const [date, muscleIDToTarget]: [string, number] = route.params
    const [itemList, setItemList] = useState<ListItem[]>([])

    const update = async () => {
        muscleIDToTarget
            ? await Exercises.getInst()
                  .getExercisesTargetingMuscleAsListItem(muscleIDToTarget)
                  .then((list) => setItemList(list))
                  .catch((err) => ErrorAlert(err.message))
            : await Exercises.getInst()
                  .getAllAsListItem()
                  .then(setItemList)
                  .catch((err) => ErrorAlert(err.message))
    }

    useEffect(() => {
        update()
        Exercises.getInst().subscribe(update)
        return () => Exercises.getInst().unsubscribe(update)
    }, [])

    return (
        <SafeAreaView>
            <ScrollView>
                <ClickableItemList
                    data={itemList}
                    onPress={(item: ListItem) => {
                        navigation.navigate('RecordExerciseScreen', [
                            item.key,
                            date ?? getDate(),
                        ])
                    }}
                />
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    line: {
        width: '100%',
        height: 10,
    },
})

export default ExerciseSelectionScreen
