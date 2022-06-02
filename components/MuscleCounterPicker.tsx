import React, { useState, MutableRefObject, useEffect } from 'react'
import { View } from 'react-native'
import {
    List,
    Text,
    IconButton,
    TouchableRipple,
    Divider,
} from 'react-native-paper'
import _ from 'underscore'
import { MuscleCounter } from '../model/MuscleCounter'
import ListItem from './ListItem'

interface Props {
    musclesList: ListItem[]
    counter: MuscleCounter
    setCounter: (newCounter: MuscleCounter) => void
    firstListName: string
}

const MuscleCounterPicker = ({
    musclesList,
    counter,
    setCounter,
    firstListName,
}: Props) => {
    const addToCounter = (x: -1 | 1 | -10 | 10, { key, content }: ListItem) => {
        const newMuscleCounter: MuscleCounter = new MuscleCounter(counter)
        const count = Math.max(counter.getCount(key) + x, 0)
        newMuscleCounter.set_(key, [count, content])
        setCounter(newMuscleCounter)
    }

    return (
        <>
            <List.Section>
                <List.Subheader>{firstListName}</List.Subheader>
                <Divider />
                {musclesList
                    .filter((item: ListItem) => counter.getCount(item.key))
                    .map((item: ListItem) => (
                        <View key={item.key}>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    overflow: 'scroll',
                                }}
                            >
                                <IconButton
                                    onPress={() => addToCounter(-1, item)}
                                    onLongPress={() => addToCounter(-10, item)}
                                    icon='minus'
                                />
                                <List.Item
                                    title={counter.getCount(item.key)}
                                    style={{
                                        // ugly but saves space
                                        marginLeft: -20,
                                        marginRight: -10,
                                    }}
                                />
                                <IconButton
                                    onPress={() => addToCounter(1, item)}
                                    onLongPress={() => addToCounter(10, item)}
                                    icon='plus'
                                />
                                <List.Item title={item.content} />
                            </View>
                            <Divider />
                        </View>
                    ))}
            </List.Section>
            <List.Section>
                <List.Subheader>select muscles from</List.Subheader>
                <Divider />
                {musclesList
                    .filter((item: ListItem) => !counter.getCount(item.key))
                    .map((item: ListItem) => (
                        <TouchableRipple
                            key={item.key}
                            onPress={() => addToCounter(1, item)}
                        >
                            <>
                                <List.Item title={item.content} />
                                <Divider />
                            </>
                        </TouchableRipple>
                    ))}
            </List.Section>
        </>
    )
}

/* <FlatList
                data={data.filter((item: ListItem) =>
                    ratios.getRatio(item.key)
                )}
                renderItem={({ item }) => (
                    <>
                        <View>
                            <Text>{item.content}</Text>
                            <Button
                                title='-'
                                onPress={() => addToCounter(-1, item)}
                            />
                            <Text>{ratios.getRatio(item.key)}</Text>
                            <Button
                                title='+'
                                onPress={() => addToCounter(1, item)}
                            />
                        </View>
                    </>
                )}
            />
            <FlatList
                data={data.filter(
                    (item: ListItem) => !ratios.getRatio(item.key)
                )}
                renderItem={({ item }) => (
                    <>
                        <TouchableHighlight
                            onPress={() => addToCounter(1, item)}
                        >
                            <Text>{item.content}</Text>
                        </TouchableHighlight>
                    </>
                )}
            /> */

export default MuscleCounterPicker
