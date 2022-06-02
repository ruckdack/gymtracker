import React from 'react'
import { StyleProp, StyleSheet, ViewStyle } from 'react-native'
import { Button, Card, DataTable, withTheme, Text } from 'react-native-paper'
import { PerformedExercise, Set } from '../model/PerformedExercises'

interface Props {
    exerciseExecution: PerformedExercise
    title: string
    navigate: (exerciseID: number, date: string) => void
    theme: ReactNativePaper.Theme
    last: boolean
}

const PerformedExerciseCard = ({
    exerciseExecution,
    title,
    navigate,
    theme,
    last,
}: Props) => {
    return (
        <Card
            key={exerciseExecution.exercise.id}
            style={{
                margin: theme.margins.medium,
                marginBottom: last ? theme.margins.medium : 0,
            }}
            onPress={() =>
                navigate(
                    exerciseExecution.exercise.id,
                    exerciseExecution.workoutDate
                )
            }
        >
            <Card.Content>
                <Text>{title}</Text>
                <DataTable>
                    <DataTable.Header>
                        <DataTable.Title>set</DataTable.Title>
                        <DataTable.Title>reps</DataTable.Title>
                        <DataTable.Title>weight</DataTable.Title>
                        <DataTable.Title>rir</DataTable.Title>
                    </DataTable.Header>
                    {exerciseExecution.sets.map((set: Set, index) => {
                        const style: ViewStyle =
                            index === exerciseExecution.sets.length - 1
                                ? { borderBottomWidth: 0 }
                                : {}
                        return (
                            <DataTable.Row key={index} style={style}>
                                <DataTable.Cell>{`${
                                    index + 1
                                }.`}</DataTable.Cell>
                                <DataTable.Cell>{set.reps}</DataTable.Cell>
                                <DataTable.Cell>{set.weight}</DataTable.Cell>
                                <DataTable.Cell>{set.rir}</DataTable.Cell>
                            </DataTable.Row>
                        )
                    })}
                </DataTable>
            </Card.Content>
            {/* <Card.Actions>
                <Button
                    icon='pencil'
                    onPress={() =>
                        navigate(
                            exerciseExecution.exercise.id,
                            exerciseExecution.workoutDate
                        )
                    }
                >
                    Edit
                </Button>
            </Card.Actions> */}
        </Card>
    )
}

const styles = StyleSheet.create({})

export default withTheme(PerformedExerciseCard)
