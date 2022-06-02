import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ActivityIndicator, withTheme } from 'react-native-paper'

interface Props {
    theme: ReactNativePaper.Theme
}

const LoadingSafeAreaView = ({ theme }: Props) => {
    return (
        <SafeAreaView
            style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <ActivityIndicator
                size='large'
                animating={true}
                color={theme.colors.accent}
            />
        </SafeAreaView>
    )
}

export default withTheme(LoadingSafeAreaView)
