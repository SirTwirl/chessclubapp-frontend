import { router } from 'expo-router'
import { StyleSheet } from 'react-native'
import AppButton from '../../components/common/AppButton'
import AppCard from '../../components/common/AppCard'
import ScreenContainer from '../../components/common/ScreenContainer'
import ScreenHeader from '../../components/common/ScreenHeader'

export default function CoachHomeScreen() {
  const handleChangeToAttendanceScreen = () => router.push('/coach/coachAttendance')
  const handleChangeToStudentListScreen = () => router.push('/coach/coachStudentList')
  const handleChangeToSetTasksScreen = () => router.push('/coach/coachSetTasks')

  return (
    <ScreenContainer contentContainerStyle={styles.container}>
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
      </AppCard>
    </ScreenContainer>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    paddingVertical: 24,
  },
  card: {
    maxWidth: 400,
  },
  subtitle: {
    marginBottom: 24,
  },
})