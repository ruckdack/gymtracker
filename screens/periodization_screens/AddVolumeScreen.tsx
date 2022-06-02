import React, { useEffect, useState } from 'react'
import { Alert, ScrollView, View } from 'react-native'
import {
    Button,
    Dialog,
    Text,
    TextInput,
    withTheme,
    Portal,
    HelperText,
    IconButton,
    DataTable,
    Snackbar,
    Divider,
} from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'
import ErrorAlert from '../../components/ErrorAlert'
import ListItem from '../../components/ListItem'
import LoadingSafeAreaView from '../../components/LoadingSafeAreaView'
import MuscleCounterPicker from '../../components/MuscleCounterPicker'
import NumberPicker from '../../components/NumberPicker'
import { MuscleCounter } from '../../model/MuscleCounter'
import { Muscles } from '../../model/Muscles'
import { Microcycle } from '../../model/Periodizations'

interface Props {
    navigation: any
    route: any
    theme: ReactNativePaper.Theme
}

const AddVolumeScreen = ({ navigation, theme, route }: Props) => {
    const [loading, setLoading] = useState(false)
    const [snackbar, setSnackbar] = useState('')
    const [musclesList, setMusclesList] = useState<ListItem[]>([])
    const notAllowed: string[] = route.params
    const [periodizationName, setPeriodizationName] = useState('')
    const [microcycles, setMicrocycles] = useState<Microcycle[]>([
        {
            sets: new MuscleCounter(),
            singleMuscleExerciseRir: 3,
            multiMuscleExerciseRir: 3,
        },
    ])
    const [selectedMicrocycle, setSelectedMicrocycle] = useState(-1)

    const nameIsNotAllowed = notAllowed.includes(periodizationName)

    const copyMicrocycles = (m: Microcycle[]) => {
        let newMicrocycles: Microcycle[] = JSON.parse(
            JSON.stringify(microcycles)
        )
        // copying the sets manually as they are not stringified at all
        newMicrocycles.forEach((newM: Microcycle, i) => {
            newM.sets = new MuscleCounter(microcycles[i].sets)
        })
        return newMicrocycles
    }

    const setMuscleCounterAt = (newCounter: MuscleCounter, index: number) => {
        let newMicrocycles = copyMicrocycles(microcycles)
        newMicrocycles[index].sets = newCounter
        setMicrocycles(newMicrocycles)
    }

    const addExerciseRirAt = (
        rirToAdd: number,
        index: number,
        type: 'single' | 'multi'
    ) => {
        let newMicrocycles = copyMicrocycles(microcycles)
        let newRir = Math.max(
            (type === 'single'
                ? newMicrocycles[index].singleMuscleExerciseRir
                : newMicrocycles[index].multiMuscleExerciseRir) + rirToAdd,
            0
        )
        if (type === 'single') {
            newMicrocycles[index].singleMuscleExerciseRir = newRir
        } else {
            newMicrocycles[index].multiMuscleExerciseRir = newRir
        }
        setMicrocycles(newMicrocycles)
    }

    const update = async () => {
        setLoading(true)
        await Muscles.getInst()
            .getAllAsListItem()
            .then(setMusclesList)
            .catch((err) => ErrorAlert(err.message))
        setLoading(false)
    }

    useEffect(() => {
        update()
        Muscles.getInst().subscribe(update)
        return () => Muscles.getInst().unsubscribe(update)
    }, [])

    if (loading) {
        return <LoadingSafeAreaView />
    }

    return (
        <SafeAreaView>
            <ScrollView>
                <TextInput
                    style={{ margin: theme.margins.medium }}
                    mode='outlined'
                    label='periodization name'
                    value={periodizationName}
                    onChangeText={setPeriodizationName}
                />
                {nameIsNotAllowed ? (
                    <HelperText type='error' visible={nameIsNotAllowed}>
                        This periodization name is not allowed!
                    </HelperText>
                ) : null}
                <View
                    style={{
                        flex: 1,
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}
                ></View>
                <DataTable>
                    <DataTable.Header>
                        <DataTable.Title>{''}</DataTable.Title>
                        {microcycles.map((_, index) => (
                            <DataTable.Title
                                key={index}
                                style={{ justifyContent: 'center' }}
                            >
                                {`micro ${index + 1}`}
                            </DataTable.Title>
                        ))}
                    </DataTable.Header>
                    <DataTable.Row>
                        <DataTable.Cell>
                            <IconButton
                                icon='plus'
                                onPress={() => {
                                    setMicrocycles([
                                        ...microcycles,
                                        {
                                            sets: new MuscleCounter(
                                                microcycles.slice(-1)[0].sets
                                            ),
                                            singleMuscleExerciseRir: 3,
                                            multiMuscleExerciseRir: 3,
                                        },
                                    ])
                                    setSelectedMicrocycle(microcycles.length)
                                }}
                            />
                        </DataTable.Cell>
                        {microcycles.map((_, index) => (
                            <DataTable.Cell
                                key={index}
                                style={{ justifyContent: 'center' }}
                            >
                                <IconButton
                                    icon='pencil'
                                    onPress={() => setSelectedMicrocycle(index)}
                                />
                            </DataTable.Cell>
                        ))}
                    </DataTable.Row>
                    <DataTable.Row onPress={() => setSnackbar('compound rir')}>
                        <DataTable.Cell>
                            <Text style={{ fontWeight: 'bold' }}>
                                compound rir
                            </Text>
                        </DataTable.Cell>
                        {microcycles.map(
                            ({ multiMuscleExerciseRir }, index) => (
                                <DataTable.Cell
                                    key={index}
                                    style={{ justifyContent: 'center' }}
                                >
                                    <Text style={{ fontWeight: 'bold' }}>
                                        {multiMuscleExerciseRir}
                                    </Text>
                                </DataTable.Cell>
                            )
                        )}
                    </DataTable.Row>
                    <DataTable.Row onPress={() => setSnackbar('iso rir')}>
                        <DataTable.Cell>
                            <Text style={{ fontWeight: 'bold' }}>iso rir</Text>
                        </DataTable.Cell>
                        {microcycles.map(
                            ({ singleMuscleExerciseRir }, index) => (
                                <DataTable.Cell
                                    key={index}
                                    style={{ justifyContent: 'center' }}
                                >
                                    <Text style={{ fontWeight: 'bold' }}>
                                        {singleMuscleExerciseRir}
                                    </Text>
                                </DataTable.Cell>
                            )
                        )}
                    </DataTable.Row>
                    {musclesList.map(({ key, content }) => (
                        <DataTable.Row
                            key={key}
                            onPress={() => setSnackbar(content)}
                        >
                            <DataTable.Cell>{content}</DataTable.Cell>
                            {microcycles.map(({ sets }, index) => {
                                let diff: number | null = null
                                if (index > 0) {
                                    diff =
                                        sets.getCount(key) -
                                        microcycles[index - 1].sets.getCount(
                                            key
                                        )
                                }
                                return (
                                    <DataTable.Cell
                                        key={key * index}
                                        style={{ justifyContent: 'center' }}
                                    >
                                        {`${sets.getCount(key)}${
                                            diff
                                                ? `(${
                                                      diff >= 0
                                                          ? `+${diff}`
                                                          : diff
                                                  })`
                                                : ''
                                        }`}
                                    </DataTable.Cell>
                                )
                            })}
                        </DataTable.Row>
                    ))}
                </DataTable>
                <Button
                    style={{ margin: theme.margins.medium }}
                    onPress={() => {
                        if (periodizationName.length) {
                            navigation.navigate('FillVolumeScreen', microcycles)
                        } else {
                            Alert.alert(
                                'Warning',
                                'Add periodization name to continue.',
                                [{ text: 'ok', style: 'default' }]
                            )
                        }
                    }}
                    mode='contained'
                    disabled={nameIsNotAllowed}
                    icon='arrow-right'
                >
                    continue
                </Button>
            </ScrollView>
            <Portal>
                <Snackbar
                    visible={snackbar !== ''}
                    duration={300}
                    onDismiss={() => setSnackbar('')}
                >
                    {snackbar}
                </Snackbar>
                {selectedMicrocycle !== -1 ? (
                    <Dialog
                        visible={selectedMicrocycle !== -1}
                        onDismiss={() => setSelectedMicrocycle(-1)}
                    >
                        <ScrollView>
                            <Dialog.Title>
                                edit microcycle {selectedMicrocycle + 1}
                            </Dialog.Title>
                            <Dialog.Content>
                                <NumberPicker
                                    counter={
                                        microcycles[selectedMicrocycle]
                                            .multiMuscleExerciseRir
                                    }
                                    addToCounter={(rirToAdd) =>
                                        addExerciseRirAt(
                                            rirToAdd,
                                            selectedMicrocycle,
                                            'multi'
                                        )
                                    }
                                    text='compound exercises rir'
                                />
                                <NumberPicker
                                    counter={
                                        microcycles[selectedMicrocycle]
                                            .singleMuscleExerciseRir
                                    }
                                    addToCounter={(rirToAdd) =>
                                        addExerciseRirAt(
                                            rirToAdd,
                                            selectedMicrocycle,
                                            'single'
                                        )
                                    }
                                    text='iso exercises rir'
                                />
                                <MuscleCounterPicker
                                    musclesList={musclesList}
                                    counter={
                                        microcycles[selectedMicrocycle].sets
                                    }
                                    setCounter={(newCounter: MuscleCounter) =>
                                        setMuscleCounterAt(
                                            newCounter,
                                            selectedMicrocycle
                                        )
                                    }
                                    firstListName={'volume in sets'}
                                />
                            </Dialog.Content>
                        </ScrollView>
                        <Dialog.Actions>
                            <Button
                                style={{ marginRight: 'auto' }}
                                disabled={microcycles.length === 1}
                                color={theme.colors.text}
                                onPress={() => {
                                    setMicrocycles(
                                        microcycles.filter(
                                            (_, index) =>
                                                index !== selectedMicrocycle
                                        )
                                    )
                                    setSelectedMicrocycle(-1)
                                }}
                            >
                                {selectedMicrocycle + 1 === microcycles.length
                                    ? 'cancel'
                                    : 'delete'}
                            </Button>
                            <Button
                                onPress={() => setSelectedMicrocycle(-1)}
                                color={theme.colors.text}
                            >
                                ok
                            </Button>
                        </Dialog.Actions>
                    </Dialog>
                ) : null}
            </Portal>
        </SafeAreaView>
    )
}

export default withTheme(AddVolumeScreen)
