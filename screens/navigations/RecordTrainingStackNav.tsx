import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import ExerciseSelectionScreen from '../record_training_screens/ExerciseSelectionScreen'
import RecordExerciseScreen from '../shared_screens/RecordExerciseScreen'
import MuscleSelectionScreen from '../record_training_screens/MuscleSelectionScreen'
import { withTheme } from 'react-native-paper'
import { screenOptions } from './ScreenOptions'

interface Props {
    theme: ReactNativePaper.Theme
}

const RecordTrainingStackNav = ({ theme }: Props) => {
    const Stack = createStackNavigator()
    return (
        <Stack.Navigator
            initialRouteName='MuscleSelectionScreen'
            screenOptions={screenOptions(theme)}
        >
            <Stack.Screen
                name='MuscleSelectionScreen'
                options={{ title: 'Select muscle' }}
                component={MuscleSelectionScreen}
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

export default withTheme(RecordTrainingStackNav)
