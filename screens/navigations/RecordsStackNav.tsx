import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import RecordsScreen from '../records_screens/RecordsScreen'
import RecordExerciseScreen from '../shared_screens/RecordExerciseScreen'
import ExerciseSelectionScreen from '../record_training_screens/ExerciseSelectionScreen'
import { withTheme } from 'react-native-paper'
import { screenOptions } from './ScreenOptions'

interface Props {
    theme: ReactNativePaper.Theme
}

const RecordsStackNav = ({ theme }: Props) => {
    const Stack = createStackNavigator()
    return (
        <Stack.Navigator
            initialRouteName='RecordsScreen'
            screenOptions={screenOptions(theme)}
        >
            <Stack.Screen
                name='RecordsScreen'
                options={{ title: 'Records' }}
                component={RecordsScreen}
            />
            <Stack.Screen
                name='ExerciseSelectionScreen'
                options={{ title: 'Select exercise' }}
                component={ExerciseSelectionScreen}
            />
            <Stack.Screen
                name='RecordExerciseScreen'
                options={{ title: '' }}
                component={RecordExerciseScreen}
            />
        </Stack.Navigator>
    )
}

export default withTheme(RecordsStackNav)
