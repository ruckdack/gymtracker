import React, { useEffect, useState } from 'react'
import { Alert, ScrollView, View } from 'react-native'
import {
    Button,
    TextInput,
    withTheme,
    Portal,
    Dialog,
    Divider,
    Title,
    IconButton,
} from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'
import ErrorAlert from '../../components/ErrorAlert'
import ListItem from '../../components/ListItem'
import {
    PerformedExercise,
    PerformedExercises,
} from '../../model/PerformedExercises'
import { Exercises, Exercise } from '../../model/Exercises'
import { MuscleCounter } from '../../model/MuscleCounter'
import RatioComponent from '../../components/RatioComponent'
import LoadingSafeAreaView from '../../components/LoadingSafeAreaView'
import PerformedExerciseCard from '../../components/PerformedExerciseCard'
import { Muscles } from '../../model/Muscles'
import ModifyRatiosDialog from '../../components/ModifyRatiosDialog'

interface Props {
    route: any
    navigation: any
    theme: ReactNativePaper.Theme
}

const DetailedExerciseScreen = ({ route, navigation, theme }: Props) => {
    const listItem: ListItem = route.params
    const [exercise, setExercise] = useState<Exercise>({
        // dummy exercise
        id: listItem.key,
        name: listItem.content,
        ratios: new MuscleCounter(),
    })
    const [records, setRecords] = useState<PerformedExercise[]>([])
    const [input, setInput] = useState<string>(exercise.name)
    const [changeNameVisible, setChangeNameVisible] = useState(false)
    const [loading, setLoading] = useState(false)
    const [musclesList, setMusclesList] = useState<ListItem[]>([])
    const [modifyRatiosVisible, setModifyRatiosVisible] = useState(false)

    const update = async () => {
        setLoading(true)
        await Exercises.getInst()
            .getByID(listItem.key)
            .then(async (ex: Exercise) => {
                setExercise(ex)
                setInput(ex.name)
                navigation.setOptions({ title: ex.name })
            })
        await PerformedExercises.getInst()
            .getAllByExerciseID(exercise.id)
            .then(setRecords)
            .catch((err) => {
                setLoading(false)
                ErrorAlert(err)
            })
        await Muscles.getInst()
            .getAllAsListItem()
            .then(setMusclesList)
            .catch((err) => {
                setLoading(false)
                ErrorAlert(err)
            })
        setLoading(false)
    }

    useEffect(() => {
        update()
        Exercises.getInst().subscribe(update)
        PerformedExercises.getInst().subscribe(update)
        Muscles.getInst().subscribe(update)
        return () => {
            Exercises.getInst().unsubscribe(update)
            PerformedExercises.getInst().unsubscribe(update)
            Muscles.getInst().unsubscribe(update)
        }
    }, [])

    if (loading) {
        return <LoadingSafeAreaView />
    }

    return (
        <SafeAreaView>
            <ScrollView>
                <RatioComponent
                    ratios={exercise.ratios}
                    onEdit={() => setModifyRatiosVisible(true)}
                />
                <Divider />
                <View
                    style={{
                        margin: theme.margins.medium,
                        flexDirection: 'row',
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
                            const deleteAndLeave = () => {
                                Exercises.getInst().deleteByID(exercise.id)
                                navigation.goBack()
                            }
                            if (
                                await PerformedExercises.getInst().exerciseExecuted(
                                    exercise.id
                                )
                            ) {
                                Alert.alert(
                                    'Warning',
                                    'This exercise has records. Deleting this exercise will delete all records as well.',
                                    [
                                        { text: 'cancel', style: 'cancel' },
                                        {
                                            text: 'delete',
                                            onPress: deleteAndLeave,
                                        },
                                    ],
                                    { cancelable: false }
                                )
                            } else {
                                deleteAndLeave()
                            }
                        }}
                    >
                        delete exercise
                    </Button>
                </View>
                <Divider />
                {records.length ? (
                    <Title
                        style={{
                            marginHorizontal: theme.margins.medium,
                            marginTop: theme.margins.medium,
                        }}
                    >
                        records
                    </Title>
                ) : null}
                {records.map((e: PerformedExercise, index) => (
                    <PerformedExerciseCard
                        title={e.workoutDate}
                        last={index + 1 === records.length}
                        navigate={(exerciseID: number, date: string) =>
                            navigation.navigate('RecordExerciseScreen', [
                                exerciseID,
                                date,
                            ])
                        }
                        key={index}
                        exerciseExecution={e}
                    />
                ))}
                <Portal>
                    <ModifyRatiosDialog
                        visible={modifyRatiosVisible}
                        setVisible={setModifyRatiosVisible}
                        exercise={exercise}
                        musclesList={musclesList}
                    />
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
                                        if (input === exercise.name) {
                                            setChangeNameVisible(false)
                                            return
                                        }
                                        if (input !== '') {
                                            await Exercises.getInst().renameByID(
                                                exercise.id,
                                                input
                                            )
                                            const newExercise = await Exercises.getInst().getByID(
                                                exercise.id
                                            )
                                            // WARNING: header is another component, thus cannot rely on state exercise! Has to be changed explicitly
                                            navigation.setOptions({
                                                title: newExercise.name,
                                            })
                                            setExercise(newExercise)
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
            </ScrollView>
        </SafeAreaView>
    )
}

export default withTheme(DetailedExerciseScreen)
