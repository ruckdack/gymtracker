import React, { useState } from 'react'
import { FAB, Text, Title, withTheme } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'
import SessionCard from '../../components/SessionsList'
import { MuscleCounter } from '../../model/MuscleCounter'
import { Microcycle } from '../../model/Periodizations'

interface Props {
    navigation: any
    route: any
    theme: ReactNativePaper.Theme
}

const FillVolumeScreen = ({ navigation, route, theme }: Props) => {
    const microcycles: Microcycle[] = route.params
    const [currentMicrocycle, setCurrentMicrocycle] = useState(0)
    const [sessionsForCurrent, setSessionsForCurrent] = useState<
        MuscleCounter[]
    >([])

    return (
        <>
            <SafeAreaView style={{ padding: theme.margins.medium }}>
                <Title>{`microcycle ${currentMicrocycle + 1}`}</Title>
                <SessionCard />
            </SafeAreaView>
            <FAB
                style={{
                    position: 'absolute',
                    margin: theme.margins.large,
                    right: 0,
                    bottom: 0,
                }}
                icon='plus'
                onPress={() => console.log('add')}
            />
        </>
    )
}
export default withTheme(FillVolumeScreen)
