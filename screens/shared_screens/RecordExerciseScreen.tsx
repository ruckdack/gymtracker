import React, { useState, useRef, useEffect } from 'react'
import { ScrollView, StyleSheet } from 'react-native'
import { View } from 'react-native'
import {
    Card,
    withTheme,
    Button,
    Text,
    IconButton,
    TextInput,
    DataTable,
    Portal,
    Title,
    Divider,
} from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'
import AddSetDialog from '../../components/AddSetDialog'
import ErrorAlert from '../../components/ErrorAlert'
import LoadingSafeAreaView from '../../components/LoadingSafeAreaView'
import ModifySetDialog from '../../components/ModifySetDialog'
import PerformedExerciseCard from '../../components/PerformedExerciseCard'
import {
    PerformedExercise,
    PerformedExercises,
    Set,
} from '../../model/PerformedExercises'
import { MuscleCounter } from '../../model/MuscleCounter'
import { getDate } from '../../model/Helper'
import { Exercises } from '../../model/Exercises'

interface Props {
    navigation: any
    route: any
    theme: ReactNativePaper.Theme
}

const RecordExerciseScreen = ({ navigation, route, theme }: Props) => {
    const [exerciseID, date]: [number, string] = route.params
    const [
        performedExercise,
        setPerformedExercise,
    ] = useState<PerformedExercise>({
        // dummy exercise execution
        workoutDate: date,
        exercise: {
            name: '',
            id: exerciseID,
            ratios: new MuscleCounter(),
        },
        sets: [],
    })
    const [modifySetDialogVisible, setModifySetDialogVisible] = useState(false)
    const [modifySetIndex, setModifySetIndex] = useState(0)
    const [addSetDialogVisible, setAddSetDialogVisible] = useState(false)

    const [oldRecords, setOldRecords] = useState<PerformedExercise[]>([])
    const [loading, setLoading] = useState(false)

    const update = async () => {
        setLoading(true)
        await Exercises.getInst()
            .getByID(exerciseID)
            .then(({ name }) => navigation.setOptions({ title: name }))
            .catch((err) => ErrorAlert(err))
        await PerformedExercises.getInst()
            .getByExerciseID(exerciseID, performedExercise.workoutDate)
            .then(setOldRecords)
            .catch((err) => {
                ErrorAlert(err)
            })
        await PerformedExercises.getInst()
            .getByDateAndExerciseID(date, exerciseID)
            .then((ex: PerformedExercise) => {
                setPerformedExercise(ex)
                setLoading(false)
            })
            .catch((err) => {
                setLoading(false)
                ErrorAlert(err)
            })
        setLoading(false)
    }

    const setSets = (sets: Set[]) => {
        setPerformedExercise({
            workoutDate: performedExercise.workoutDate,
            exercise: performedExercise.exercise,
            sets: sets,
        })
    }

    const setSingleSet = (setIndex: number, set: Set) => {
        let setsCopy = JSON.parse(JSON.stringify(performedExercise.sets))
        setsCopy[setIndex] = set
        setSets(setsCopy)
    }

    const deleteSet = (setIndex: number) => {
        let setsCopy = JSON.parse(JSON.stringify(performedExercise.sets))
        setsCopy.splice(setIndex, 1)
        setSets(setsCopy)
    }

    useEffect(() => {
        update()
    }, [])

    useEffect(() => {
        PerformedExercises.getInst().exchangeByDateAndExerciseID(
            performedExercise
        )
    }, [performedExercise])

    if (loading) {
        return <LoadingSafeAreaView />
    }

    return (
        <SafeAreaView>
            <ScrollView>
                <View
                    style={{
                        marginHorizontal: theme.margins.medium,
                        marginTop: theme.margins.medium,
                    }}
                >
                    <Title>
                        {performedExercise.workoutDate === getDate()
                            ? 'today'
                            : performedExercise.workoutDate}
                    </Title>
                    <DataTable>
                        <DataTable.Header>
                            <DataTable.Title>set</DataTable.Title>
                            <DataTable.Title>reps</DataTable.Title>
                            <DataTable.Title>weight</DataTable.Title>
                            <DataTable.Title>rir</DataTable.Title>
                        </DataTable.Header>
                        {performedExercise.sets.map((set: Set, index) => (
                            <DataTable.Row
                                key={index}
                                onPress={() => {
                                    setModifySetIndex(index)
                                    setModifySetDialogVisible(true)
                                }}
                            >
                                <DataTable.Cell>{index + 1}</DataTable.Cell>
                                <DataTable.Cell>
                                    <Text>{set.reps}</Text>
                                </DataTable.Cell>
                                <DataTable.Cell>
                                    <Text>{set.weight}</Text>
                                </DataTable.Cell>
                                <DataTable.Cell>
                                    <Text>{set.rir}</Text>
                                </DataTable.Cell>
                            </DataTable.Row>
                        ))}
                    </DataTable>
                    <IconButton
                        icon='plus'
                        onPress={() => setAddSetDialogVisible(true)}
                    />
                </View>
                <Divider />
                {oldRecords.length ? (
                    <>
                        {/* <Divider style={{ marginTop: theme.margins.small }} /> */}
                        <Title
                            style={{
                                marginHorizontal: theme.margins.medium,
                                marginTop: theme.margins.medium,
                            }}
                        >
                            past records
                        </Title>
                        {oldRecords.map((e: PerformedExercise, index) => (
                            <PerformedExerciseCard
                                title={e.workoutDate}
                                last={index + 1 === oldRecords.length}
                                navigate={(
                                    exerciseID: number,
                                    date: string
                                ) => {
                                    navigation.goBack()
                                    navigation.navigate(
                                        'RecordExerciseScreen',
                                        [exerciseID, date]
                                    )
                                }}
                                key={index}
                                exerciseExecution={e}
                            />
                        ))}
                    </>
                ) : null}
            </ScrollView>
            <Portal>
                <ModifySetDialog
                    visible={modifySetDialogVisible}
                    setVisible={setModifySetDialogVisible}
                    set={performedExercise.sets[modifySetIndex]}
                    deleteSet={() => deleteSet(modifySetIndex)}
                    setCardSet={(modifiedSet: Set) =>
                        setSingleSet(modifySetIndex, modifiedSet)
                    }
                />
                <AddSetDialog
                    visible={addSetDialogVisible}
                    setVisible={setAddSetDialogVisible}
                    prevSet={
                        performedExercise.sets.length === 0
                            ? null
                            : performedExercise.sets[
                                  performedExercise.sets.length - 1
                              ]
                    }
                    addCardSet={(set: Set) =>
                        setSets([...performedExercise.sets, set])
                    }
                />
            </Portal>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    vertAlign: {
        textAlignVertical: 'center',
    },
})

export default withTheme(RecordExerciseScreen)
