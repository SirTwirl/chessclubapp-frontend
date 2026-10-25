import { router } from 'expo-router'
import { useEffect, useState } from 'react'
import { Alert, StyleSheet, View } from 'react-native'
import { api } from '../../api/client'
import AppButton from '../../components/common/AppButton'
import AppCard from '../../components/common/AppCard'
import LoadingScreen from '../../components/common/LoadingScreen'
import ScreenContainer from '../../components/common/ScreenContainer'
import ScreenHeader from '../../components/common/ScreenHeader'

export default function AdminHomeScreen() {
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    let isMounted = true

    api
      .get('/users/me')
      .then(({ data }) => {
        if (data.role !== 'admin') {
          Alert.alert(
            'Brak dostępu',
            'Ten ekran jest dostępny tylko dla administratorów.'
          )
          router.replace('/')
          return
        }

        if (isMounted) {
          setAuthorized(true)
        }
      })
      .catch((error) => {
        if (!isMounted) return

        console.error('Błąd weryfikacji uprawnień administratora:', error)
        Alert.alert(
          'Błąd weryfikacji',
          'Nie udało się potwierdzić uprawnień administratora. Zaloguj się ponownie.'
        )
        router.replace('/')
      })

    return () => {
      isMounted = false
    }
  }, [])

  if (!authorized) {
    return <LoadingScreen message="Weryfikowanie uprawnień..." />
  }

  return (
    <ScreenContainer contentContainerStyle={styles.container}>
      <View style={styles.content}>
        <AppCard style={styles.card}>
          <ScreenHeader
            title="PANEL ADMINA"
            subtitle="Wybierz akcję do wykonania"
            subtitleStyle={styles.subtitle}
          />

          <AppButton
            variant="secondary"
            title="📋 Sprawdź obecność"
            onPress={() => router.push('/coach/coachAttendance')}
          />

          <AppButton
            variant="secondary"
            title="👥 Lista uczniów"
            onPress={() => router.push('/coach/coachStudentList')}
          />

          <AppButton
            variant="secondary"
            title="♟️ Zadaj zadanie"
            onPress={() => router.push('/coach/coachSetTasks')}
          />

          <AppButton
            variant="secondary"
            title="📨 Zobacz odpowiedzi"
            onPress={() => router.push('/coach/coachTasks')}
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
