import React from 'react'
import { Button, withTheme, Text } from 'react-native-paper'
import { initTablesWithData } from '../../database/InitTables'
import { clearDatabase } from '../../database/SQLCommandsWrapper'
import { SafeAreaView } from 'react-native-safe-area-context'

interface Props {
    navigation: any
    theme: ReactNativePaper.Theme
}

const SettingsScreen = ({ navigation, theme }: Props) => {
    return (
        <SafeAreaView>
            <Button
                mode='contained'
                style={{
                    marginHorizontal: theme.margins.medium,
                    marginTop: theme.margins.medium,
                }}
                onPress={async () => {
                    await clearDatabase()
                    await initTablesWithData()
                }}
            >
                wipe all data
            </Button>
            <Button
                mode='contained'
                onPress={() => navigation.navigate('MusclesScreen')}
                style={{
                    marginHorizontal: theme.margins.medium,
                    marginTop: theme.margins.medium,
                }}
            >
                muscles
            </Button>
            <Button
                mode='contained'
                onPress={() => navigation.navigate('SplitsScreen')}
                style={{ margin: theme.margins.medium }}
            >
                splits
            </Button>
            {/* <Button
                mode='contained'
                onPress={() => {
                    const sqliteToCsv = require('sqlite-to-csv')
                    var args = {
                        filePath: 'mysqlite3.db',
                        outputPath: 'filepath/mycsv',
                    }
                    sqliteToCsv.toCSV(args, (err: any) => console.debug(err))
                }}
            >
                export
            </Button> */}
        </SafeAreaView>
    )
}

export default withTheme(SettingsScreen)
