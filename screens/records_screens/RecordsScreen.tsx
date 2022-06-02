import React, { useRef, useState } from 'react'
import { useEffect } from 'react'
import { Calendar, DotMarking } from 'react-native-calendars'
import { ScrollView } from 'react-native-gesture-handler'
import { SafeAreaView } from 'react-native-safe-area-context'
import ErrorAlert from '../../components/ErrorAlert'
import PerformedExerciseCard from '../../components/PerformedExerciseCard'
import { getDate } from '../../model/Helper'
import {
    PerformedExercise,
    PerformedExercises,
} from '../../model/PerformedExercises'
import { Exercises } from '../../model/Exercises'
import {
    Card,
    FAB,
    withTheme,
    ActivityIndicator,
    Divider,
    Title,
} from 'react-native-paper'
import VolumeComponent from '../../components/VolumeComponent'
import LoadingSafeAreaView from '../../components/LoadingSafeAreaView'

interface Props {
    navigation: any
    theme: ReactNativePaper.Theme
}

interface markedDates {
    [date: string]: DotMarking
}

const RecordsScreen = ({ navigation, theme }: Props) => {
    const [initalRender, setInitialRender] = useState(true)
    const [allWorkoutDates, setAllWorkoutDates] = useState<string[]>([])
    const [selectedDate, setSelectedDate] = useState(getDate())
    const selectedDateRef = useRef(selectedDate)
    const [markedDates, setMarkedDates] = useState<markedDates>({})
    const [records, setRecords] = useState<PerformedExercise[]>([])
    const [volume, setVolume] = useState(0)
    const [perMuscleVol, setPerMuscleVol] = useState(
        new Map<number, [number, string]>()
    )
    const [loading, setLoading] = useState(false)

    const update = async () => {
        setLoading(true)
        await PerformedExercises.getInst()
            .getAllWorkoutDates()
            .then(setAllWorkoutDates)
            .catch((err) => ErrorAlert(err))
        await PerformedExercises.getInst()
            .getByDate(selectedDateRef.current)
            .then(setRecords)
            .catch((err) => ErrorAlert(err))
        await PerformedExercises.getInst()
            .getVolumeByDate(selectedDateRef.current)
            .then(setVolume)
            .catch((err) => ErrorAlert(err))
        await PerformedExercises.getInst()
            .getPerMuscleVolumeByDate(selectedDateRef.current)
            .then(setPerMuscleVol)
            .catch((err) => {
                ErrorAlert(err)
            })
        setLoading(false)
    }

    const updateMarkedDates = () => {
        let markedDates: any = {}
        allWorkoutDates.forEach(
            (date) => (markedDates[date] = { marked: true })
        )
        markedDates[selectedDate] = { selected: true }
        setMarkedDates(markedDates)
    }

    useEffect(() => {
        selectedDateRef.current = selectedDate
        update()
    }, [selectedDate])

    useEffect(updateMarkedDates, [allWorkoutDates])

    useEffect(() => {
        PerformedExercises.getInst().subscribe(update)
        Exercises.getInst().subscribe(update)
        setInitialRender(false)
        return () => {
            PerformedExercises.getInst().unsubscribe(update)
            Exercises.getInst().unsubscribe(update)
        }
    }, [])

    if (loading) {
        return <LoadingSafeAreaView />
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView>
                {initalRender ? null : (
                    <>
                        <Calendar
                            theme={{
                                arrowColor: theme.colors.text,
                                todayTextColor: theme.colors.accent,
                                dotColor: theme.colors.accent,
                                selectedDayBackgroundColor: theme.colors.accent,
                                calendarBackground: 'transparent',
                                monthTextColor: theme.colors.text,
                                dayTextColor: theme.colors.text,
                            }}
                            markedDates={markedDates}
                            onDayPress={(date) =>
                                setSelectedDate(date.dateString)
                            }
                        />
                        <Divider />
                    </>
                )}
                {volume === 0 ? null : (
                    <>
                        <VolumeComponent
                            volume={volume}
                            perMuscleVol={perMuscleVol}
                        />
                        <Divider />
                        <Title
                            style={{
                                marginHorizontal: theme.margins.medium,
                                marginTop: theme.margins.medium,
                            }}
                        >
                            records
                        </Title>
                        {records.map((e: PerformedExercise, index) => (
                            <PerformedExerciseCard
                                title={e.exercise.name}
                                last={index + 1 === records.length}
                                navigate={(exerciseID: number, date: string) =>
                                    navigation.navigate(
                                        'RecordExerciseScreen',
                                        [exerciseID, date]
                                    )
                                }
                                key={e.exercise.id}
                                exerciseExecution={e}
                            />
                        ))}
                    </>
                )}
            </ScrollView>
            <FAB
                style={{
                    position: 'absolute',
                    margin: theme.margins.large,
                    right: 0,
                    bottom: 0,
                }}
                icon='plus'
                onPress={() => {
                    if (selectedDate) {
                        navigation.navigate('ExerciseSelectionScreen', [
                            selectedDate,
                            null,
                        ])
                    }
                }}
            />
        </SafeAreaView>
    )
}

export default withTheme(RecordsScreen)
