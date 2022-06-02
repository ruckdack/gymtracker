import React from 'react'
import { Button, Text, withTheme } from 'react-native-paper'
import ListItem from '../../components/ListItem'
import { Periodizations } from '../../model/Periodizations'

interface Props {
    navigation: any
    theme: ReactNativePaper.Theme
}

const PeriodizationOverviewScreen = ({ navigation, theme }: Props) => {
    return (
        <>
            <Button
                style={{ margin: theme.margins.medium }}
                mode='contained'
                icon='plus'
                onPress={async () => {
                    const notAllowed = (
                        await Periodizations.getInst().getAllAsListItem()
                    ).map((item: ListItem) => item.content)
                    navigation.navigate('AddVolumeScreen', notAllowed)
                }}
            >
                add periodization
            </Button>
        </>
    )
}

export default withTheme(PeriodizationOverviewScreen)
