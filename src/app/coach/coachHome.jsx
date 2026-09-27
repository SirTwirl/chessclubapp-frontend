import { router } from 'expo-router'
import {
    Text,
    TouchableOpacity,
    View,
} from 'react-native'
export default function CoachHomeScreen() {

    const handleChangeToAttendanceScreen = () => router.push('/coach/coachAttendance')
    const handleChangeToStudentListScreen = () => router.push('/coach/coachStudentList')
    const handleChangeToSetTasksScreen = () => router.push('/coach/coachSetTasks')

    return (
        <View>
            <Text>CoachHome</Text>
            <TouchableOpacity onPress={handleChangeToAttendanceScreen}><Text>Sprawdź obecność</Text></TouchableOpacity>
            <TouchableOpacity onPress={handleChangeToStudentListScreen}><Text>Lista uczniów</Text></TouchableOpacity>
            <TouchableOpacity onPress={handleChangeToSetTasksScreen}><Text>Zadaj zadanie</Text></TouchableOpacity>
        </View>
    )
}