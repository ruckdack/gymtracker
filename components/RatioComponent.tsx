import React from 'react'
import { View, ViewStyle } from 'react-native'
import { Text, withTheme, Surface, Title, Button } from 'react-native-paper'
import { MuscleCounter } from '../model/MuscleCounter'

interface Props {
    ratios: MuscleCounter
    onEdit: () => void
    theme: ReactNativePaper.Theme
}

const colors = [
    '#b71c1c',
    '#f47e17',
    '#4a148c',
    '#0d47a1',
    '#006064',
    '#1b5e20',
    '#827717',
    '#f57f17',
]

const RatioComponent = ({ ratios, onEdit, theme }: Props) => {
    return (
        <View
            style={{
                margin: theme.margins.medium,
            }}
        >
            <Title>target muscles</Title>
            <View style={{ flexDirection: 'row', marginTop: 15 }}>
                {ratios.map((key, [ratio, _], index) => {
                    let surfaceStyle: ViewStyle = {
                        backgroundColor: colors[index ?? 0 % colors.length],
                        margin: 2,
                        flexDirection: 'row',
                        justifyContent: 'center',
                        padding: theme.margins.small,
                    }
                    if (index === 0) {
                        surfaceStyle.borderTopLeftRadius = 1000
                        surfaceStyle.borderBottomLeftRadius = 1000
                    }
                    if (index === ratios.size - 1) {
                        surfaceStyle.borderTopRightRadius = 1000
                        surfaceStyle.borderBottomRightRadius = 1000
                    }
                    return (
                        <View key={key} style={{ flex: ratio }}>
                            <Surface style={surfaceStyle}>
                                <Text
                                    style={{
                                        textAlign: 'center',
                                        color: theme.colors.background,
                                    }}
                                >
                                    {ratio}
                                </Text>
                            </Surface>
                        </View>
                    )
                })}
                <Button icon='pencil' onPress={onEdit}>
                    edit
                </Button>
            </View>
            {ratios.map((key, [ratio, name], index) => (
                <View
                    style={{
                        flex: 1,
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginTop: theme.margins.medium,
                    }}
                    key={key}
                >
                    <View
                        style={{
                            width: 12,
                            height: 12,
                            borderRadius: 1000,
                            marginHorizontal: 10,
                            backgroundColor: colors[index ?? 0 % colors.length],
                        }}
                    />
                    <Text>{`${name} (${Math.round(
                        (ratio / ratios.getCountersSum()) * 100
                    )}%)`}</Text>
                </View>
            ))}
        </View>
    )
}

export default withTheme(RatioComponent)
