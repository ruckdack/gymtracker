import React, { useEffect, useState } from 'react'
import { SafeAreaView, StyleSheet } from 'react-native'
import ClickableItemList from '../../components/ClickableItemList'
import ErrorAlert from '../../components/ErrorAlert'
import ListItem from '../../components/ListItem'
import { getDate } from '../../model/Helper'
import { Muscles } from '../../model/Muscles'

const MuscleSelectionScreen = ({ navigation }: any) => {
    const [itemList, setItemList] = useState<ListItem[]>([])

    const update = () => {
        Muscles.getInst()
            .getAllAsListItem()
            .then(setItemList)
            .catch((err) => ErrorAlert(err.message))
    }

    useEffect(() => {
        update()
        Muscles.getInst().subscribe(update)
        return () => Muscles.getInst().unsubscribe(update)
    }, [])

    return (
        <SafeAreaView>
            <ClickableItemList
                data={itemList}
                onPress={(item: ListItem) => {
                    navigation.navigate('ExerciseSelectionScreen', [
                        getDate(),
                        item.key,
                    ])
                }}
            />
        </SafeAreaView>
    )
}

export default MuscleSelectionScreen
