import React from 'react'
import { View } from 'react-native'
import {
    Card,
    DataTable,
    Divider,
    IconButton,
    Text,
    Title,
    withTheme,
} from 'react-native-paper'

interface Props {
    theme: ReactNativePaper.Theme
    volume: number
    perMuscleVol: Map<number, [number, string]>
}

const VolumeComponent = ({ theme, volume, perMuscleVol }: Props) => {
    const setString = (sets: number) => (sets === 1 ? 'set' : 'sets')

    return (
        <View
            style={{
                margin: theme.margins.medium,
            }}
        >
            <Title>volume</Title>
            <DataTable>
                {Array.from(perMuscleVol).map(
                    ([muscleID, [vol, muscleName]]) => {
                        const roundVol = Math.round(vol * 100) / 100
                        return (
                            <DataTable.Row key={muscleID}>
                                <DataTable.Cell>{muscleName}</DataTable.Cell>
                                <DataTable.Cell>
                                    {`${roundVol} ${setString(roundVol)}`}
                                </DataTable.Cell>
                            </DataTable.Row>
                        )
                    }
                )}
                <DataTable.Row style={{ borderBottomWidth: 0 }}>
                    <DataTable.Cell>
                        <IconButton icon='sigma' />
                    </DataTable.Cell>
                    <DataTable.Cell>
                        <Text style={{ fontWeight: 'bold' }}>
                            {`${volume} ${setString(volume)}`}
                        </Text>
                    </DataTable.Cell>
                </DataTable.Row>
            </DataTable>
        </View>
    )
}

export default withTheme(VolumeComponent)
