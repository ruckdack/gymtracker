import React from 'react'
import { View } from 'react-native'
import { Divider, List } from 'react-native-paper'
import ListItem from './ListItem'

interface Props {
    data: ListItem[]
    onPress: (item: ListItem) => void
    title?: string
}

const ClickableItemList = ({ data, onPress, title }: Props) => {
    return (
        <List.Section style={{ marginTop: 0 }}>
            {title ? <List.Subheader>{title}</List.Subheader> : null}
            {data.map((item: ListItem) => (
                <View key={item.key}>
                    <Divider />
                    <List.Item
                        title={item.content}
                        onPress={() => onPress(item)}
                    />
                </View>
            ))}
        </List.Section>
    )
}

export default ClickableItemList
