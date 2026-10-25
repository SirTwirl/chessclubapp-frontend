import { router } from 'expo-router'
import { StyleSheet, View } from 'react-native'
import AppButton from '../../components/common/AppButton'
import AppCard from '../../components/common/AppCard'
import ScreenContainer from '../../components/common/ScreenContainer'
import ScreenHeader from '../../components/common/ScreenHeader'

export default function CoachHomeScreen() {
  const handleChangeToAttendanceScreen = () => router.push('/coach/coachAttendance')
  const handleChangeToStudentListScreen = () => router.push('/coach/coachStudentList')
  const handleChangeToSetTasksScreen = () => router.push('/coach/coachSetTasks')
  const handleChangeToTaskAnswersScreen = () => router.push('/coach/coachTasks')

  return (
    <ScreenContainer contentContainerStyle={styles.container}>
      <View style={styles.content}>
        <AppCard style={styles.card}>
          <ScreenHeader
            title="PANEL TRENERA"
            subtitle="Wybierz akcję do wykonania"
            subtitleStyle={styles.subtitle}
          />

          <AppButton
            variant="secondary"
            title="📋 Sprawdź obecność"
            onPress={handleChangeToAttendanceScreen}
          />

          <AppButton
            variant="secondary"
            title="👥 Lista uczniów"
            onPress={handleChangeToStudentListScreen}
          />

          <AppButton
            variant="secondary"
            title="♟️ Zadaj zadanie"
            onPress={handleChangeToSetTasksScreen}
          />

          <AppButton
            variant="secondary"
            title="📨 Zobacz odpowiedzi"
            onPress={handleChangeToTaskAnswersScreen}
          />
        </AppCard>
      </View>
    </ScreenContainer>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 24,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  card: {
    maxWidth: 400,
  },
  subtitle: {
    marginBottom: 24,
  },
})