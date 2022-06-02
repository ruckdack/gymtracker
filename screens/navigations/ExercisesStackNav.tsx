import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import ExercisesAndMusclesScreen from '../exercises_screens/ExercisesScreen'
import DetailedExerciseScreen from '../exercises_screens/DetailedExerciseScreen'
import RecordExerciseScreen from '../shared_screens/RecordExerciseScreen'
import { withTheme } from 'react-native-paper'
import { screenOptions } from './ScreenOptions'
import DetailedMuscleScreen from '../settings_screens/DetailedMuscleScreen'

interface Props {
    theme: ReactNativePaper.Theme
}

const ExercisesStackNav = ({ theme }: Props) => {
    const Stack = createStackNavigator()
    return (
        <Stack.Navigator
            initialRouteName='ExercisesScreen'
            screenOptions={screenOptions(theme)}
        >
            <Stack.Screen
                name='ExercisesScreen'
                options={{ title: 'Exercises' }}
                component={ExercisesAndMusclesScreen}
            />
            <Stack.Screen
                name='DetailedExerciseScreen'
                options={{ title: '' }}
                component={DetailedExerciseScreen}
            />
            <Stack.Screen
                name='RecordExerciseScreen'
                options={{ title: '' }}
                component={RecordExerciseScreen}
            />
        </Stack.Navigator>
    )
}

export default withTheme(ExercisesStackNav)
