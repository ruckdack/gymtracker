import React from 'react'
import { useState } from 'react'
import { Text, TextInput, SafeAreaView } from 'react-native'
import { Button, ScrollView, StyleSheet } from 'react-native'
import { clearDatabase, executeQuery } from '../database/SQLCommandsWrapper'
import { getDate } from '../model/Helper'

const DebugScreen = () => {
    const [queryInput, setQueryInput] = useState('')
    return (
        <SafeAreaView>
            <ScrollView style={styles.container}>
                <Button title='clear db' onPress={clearDatabase} />
                <Text>Database querys:</Text>
                <TextInput
                    placeholder='query'
                    value={queryInput}
                    onChangeText={setQueryInput}
                />
                <Button
                    title='run query'
                    onPress={() => {
                        executeQuery(queryInput).catch(console.log)
                    }}
                />
                <Button
                    title='get date'
                    onPress={() => console.log(getDate())}
                />
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 50,
    },
})

export default DebugScreen
