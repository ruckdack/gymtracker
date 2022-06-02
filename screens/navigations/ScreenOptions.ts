import { StackNavigationOptions } from '@react-navigation/stack'

export const screenOptions: (
    theme: ReactNativePaper.Theme
) => StackNavigationOptions = (theme: ReactNativePaper.Theme) => {
    let headerStyle = theme.dark
        ? {
              backgroundColor: theme.colors.primary,
              elevation: 0,
              shadowOpacity: 0,
          }
        : {
              backgroundColor: theme.colors.primary,
          }
    return {
        headerStyle: headerStyle,
        headerTintColor: theme.textColorOnPrimary,
        animationEnabled: false,
    }
}
