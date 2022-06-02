/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */
import 'react-native-gesture-handler'
import React, { useEffect } from 'react'
import { StatusBar, StyleSheet, useColorScheme } from 'react-native'
import {
    DarkTheme,
    DefaultTheme,
    Provider as PaperProvider,
} from 'react-native-paper'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import MainTabNav from './screens/navigations/MainTabNav'
import { initTablesWithData } from './database/InitTables'
import changeNavigationBarColor from 'react-native-navigation-bar-color'

declare global {
    namespace ReactNativePaper {
        interface Theme {
            margins: { small: number; medium: number; large: number }
            textColorOnPrimary: string
        }
    }
}

const isPrimaryDark = (color: string) => {
    const hasFullSpec = color.length == 7
    let m = color.substr(1).match(hasFullSpec ? /(\S{2})/g : /(\S{1})/g)!
    let r = parseInt(m[0] + (hasFullSpec ? '' : m[0]), 16)
    let g = parseInt(m[1] + (hasFullSpec ? '' : m[1]), 16)
    let b = parseInt(m[2] + (hasFullSpec ? '' : m[2]), 16)
    return (r * 299 + g * 587 + b * 114) / 1000 < 128
}

const App = () => {
    const primaryHex = '#753558'
    const isDark = useColorScheme() === 'dark'
    const theme = {
        ...(isDark ? DarkTheme : DefaultTheme),
        roundness: 4,
        margins: {
            small: 8,
            medium: 12,
            large: 16,
        },
        colors: {
            ...(isDark ? DarkTheme.colors : DefaultTheme.colors),
            primary: primaryHex,
            accent: primaryHex,
        },
        textColorOnPrimary: isPrimaryDark(primaryHex) ? 'white' : 'black',
    }

    useEffect(() => {
        changeNavigationBarColor(
            primaryHex,
            theme.textColorOnPrimary === 'black',
            true
        )
        initTablesWithData()
    }, [])

    return (
        <PaperProvider theme={theme}>
            <StatusBar
                backgroundColor={theme.colors.primary}
                barStyle={
                    theme.textColorOnPrimary === 'black'
                        ? 'dark-content'
                        : 'light-content'
                }
            />
            <SafeAreaProvider style={{ flex: 1 }}>
                <MainTabNav />
            </SafeAreaProvider>
        </PaperProvider>
    )
}

export default App
