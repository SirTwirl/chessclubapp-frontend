import { router } from 'expo-router'
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
export default function CoachHomeScreen() {

    const handleChangeToAttendanceScreen = () => router.push('/coach/coachAttendance')
    const handleChangeToStudentListScreen = () => router.push('/coach/coachStudentList')
    const handleChangeToSetTasksScreen = () => router.push('/coach/coachSetTasks')

    return (
        <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.headerTitle}>PANEL TRENERA</Text>
          <Text style={styles.subtitle}>Wybierz akcję do wykonania</Text>

          <TouchableOpacity style={styles.button} onPress={handleChangeToAttendanceScreen}>
            <Text style={styles.buttonText}>📋 Sprawdź obecność</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={handleChangeToStudentListScreen}>
            <Text style={styles.buttonText}>👥 Lista uczniów</Text>
          </TouchableOpacity>

          <TouchableOpacity style= {styles.button} onPress={handleChangeToSetTasksScreen}>
            <Text style={styles.buttonText}>♟️ Zadaj zadanie</Text>
          </TouchableOpacity>

        </View>
      </View>
    </SafeAreaView>
    )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#121212',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  card: {
    backgroundColor: '#1E1E1E',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: '#2C2C2C',
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3B8246',
    textAlign: 'center',
    letterSpacing: 1,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#CCCCCC',
    textAlign: 'center',
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#2A2A2A',
    borderRadius: 10,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#3A3A3A',
    marginBottom: 14,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
})