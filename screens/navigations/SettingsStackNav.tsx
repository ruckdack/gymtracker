import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import ExercisesAndMusclesScreen from '../exercises_screens/ExercisesScreen'
import DetailedExerciseScreen from '../exercises_screens/DetailedExerciseScreen'
import RecordExerciseScreen from '../shared_screens/RecordExerciseScreen'
import { withTheme } from 'react-native-paper'
import { screenOptions } from './ScreenOptions'
import DetailedMuscleScreen from '../settings_screens/DetailedMuscleScreen'
import SettingsScreen from '../settings_screens/SettingsScreen'
import MusclesScreen from '../settings_screens/MusclesScreen'
import SplitsScreen from '../settings_screens/SplitsScreen'
import DetailedSplitScreen from '../settings_screens/DetailedSplitScreen'

interface Props {
    theme: ReactNativePaper.Theme
}

const SettingsStackNav = ({ theme }: Props) => {
    const Stack = createStackNavigator()
    return (
        <Stack.Navigator
            initialRouteName='SettingsScreen'
            screenOptions={screenOptions(theme)}
        >
            <Stack.Screen
                name='SettingsScreen'
                options={{ title: 'Settings' }}
                component={SettingsScreen}
            />
            <Stack.Screen
                name='MusclesScreen'
                options={{ title: 'Muscles' }}
                component={MusclesScreen}
            />
            <Stack.Screen
                name='DetailedMuscleScreen'
                options={{ title: '' }}
                component={DetailedMuscleScreen}
            />
            <Stack.Screen
                name='SplitsScreen'
                options={{ title: 'Splits' }}
                component={SplitsScreen}
            />
            <Stack.Screen
                name='DetailedSplitScreen'
                options={{ title: 'Splits' }}
                component={DetailedSplitScreen}
            />
        </Stack.Navigator>
    )
}

export default withTheme(SettingsStackNav)
