import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import PeriodizationOverviewScreen from '../periodization_screens/PeriodizationOverviewScreen'
import AddVolumeScreen from '../periodization_screens/AddVolumeScreen'
import { withTheme } from 'react-native-paper'
import { screenOptions } from './ScreenOptions'
import FillVolumeScreen from '../periodization_screens/FillVolumeScreen'

interface Props {
    theme: ReactNativePaper.Theme
}

const PeriodizationStackNav = ({ theme }: Props) => {
    const Stack = createStackNavigator()
    return (
        <Stack.Navigator
            initialRouteName='PeriodizationOverviewScreen'
            screenOptions={screenOptions(theme)}
        >
            <Stack.Screen
                name='PeriodizationOverviewScreen'
                options={{ title: 'Overview' }}
                component={PeriodizationOverviewScreen}
            />
            <Stack.Screen
                name='AddVolumeScreen'
                options={{ title: 'Add periodization' }}
                component={AddVolumeScreen}
            />
            <Stack.Screen
                name='FillVolumeScreen'
                options={{ title: 'Add sessions' }}
                component={FillVolumeScreen}
            />
        </Stack.Navigator>
    )
}

export default withTheme(PeriodizationStackNav)
