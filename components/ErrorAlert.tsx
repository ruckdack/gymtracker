import { Alert } from 'react-native'

const ErrorAlert = (errorMsg: string) => {
    Alert.alert('Error', errorMsg, [{ text: 'OK' }])
}

export default ErrorAlert
