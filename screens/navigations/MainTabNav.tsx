import React from 'react'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { NavigationContainer } from '@react-navigation/native'
import DebugScreen from '../DebugScreen'
import RecordTrainingStackNav from './RecordTrainingStackNav'
import RecordsStackNav from './RecordsStackNav'
import PeriodizationStackNav from './PeriodizationStackNav'
import { withTheme } from 'react-native-paper'
import SettingsStackNav from './SettingsStackNav'
import ExercisesStackNav from './ExercisesStackNav'

interface Props {
    theme: ReactNativePaper.Theme
}

const MainTabNav = ({ theme }: Props) => {
    const Tab = createMaterialBottomTabNavigator()
    const iconSize = 26

    return (
        <NavigationContainer
            theme={{
                ...theme,
                colors: { ...theme.colors, card: 'white', border: 'white' },
            }}
        >
            <Tab.Navigator
                initialRouteName='PeriodizationStackNav'
                barStyle={{
                    backgroundColor: theme.colors.primary,
                }}
                keyboardHidesNavigationBar={true}
            >
                <Tab.Screen
                    name='RecordsStackNav'
                    options={{
                        title: 'Records',
                        tabBarIcon: ({ color }) => (
                            <MaterialCommunityIcons
                                name='database'
                                color={color}
                                size={iconSize}
                            />
                        ),
                    }}
                    component={RecordsStackNav}
                />
                <Tab.Screen
                    name='PeriodizationStackNav'
                    options={{
                        title: 'Periodization',
                        tabBarIcon: ({ color }) => (
                            <MaterialCommunityIcons
                                name='calendar-text'
                                color={color}
                                size={iconSize}
                            />
                        ),
                    }}
                    component={PeriodizationStackNav}
                />
                <Tab.Screen
                    name='RecordTrainingStackNav'
                    options={{
                        title: 'Record Training',
                        tabBarIcon: ({ color }) => (
                            <MaterialCommunityIcons
                                name='dumbbell'
                                color={color}
                                size={iconSize}
                            />
                        ),
                    }}
                    component={RecordTrainingStackNav}
                />
                <Tab.Screen
                    name='ExercisesStackNav'
                    options={{
                        title: 'Exercises',
                        tabBarIcon: ({ color }) => (
                            <MaterialCommunityIcons
                                name='playlist-plus'
                                color={color}
                                size={iconSize}
                            />
                        ),
                    }}
                    component={ExercisesStackNav}
                />
                <Tab.Screen
                    name='Settings'
                    options={{
                        title: 'Settings',
                        tabBarIcon: ({ color }) => (
                            <MaterialCommunityIcons
                                name='cog'
                                color={color}
                                size={iconSize}
                            />
                        ),
                    }}
                    component={SettingsStackNav}
                />
            </Tab.Navigator>
        </NavigationContainer>
    )
}

export default withTheme(MainTabNav)
