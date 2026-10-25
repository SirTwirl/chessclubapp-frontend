import { router } from 'expo-router'
import * as SecureStore from 'expo-secure-store'
import { useState } from 'react'
import { Alert, StyleSheet, View } from 'react-native'
import { setToken } from '../api/client'
import loginService from '../api/login'
import AppButton from '../components/common/AppButton'
import AppCard from '../components/common/AppCard'
import AppInput from '../components/common/AppInput'
import ScreenHeader from '../components/common/ScreenHeader'
import { colors } from '../constants/colors'

export default function LoginScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Błąd', 'Uzupełnij hasło i login')
      return
    }

    try {
      setLoading(true)
      const user = await loginService.login({ email, password })

      setToken(user.token)
      await SecureStore.setItemAsync('user', JSON.stringify(user))

      setEmail('')
      setPassword('')
      if (user.role === 'coach') {
        router.replace('/coach/coachHome')
      } else if (user.role === 'admin') {
        router.replace('/admin/adminHome')
      } else if (user.role === 'student') {
        router.replace('/student/studentHome')
      } else if (user.role === 'parent') {
        router.replace('/parent/parentHome')
      } else {
        Alert.alert('Błąd', 'Konto nie ma przypisanej prawidłowej roli')
      }
    } catch (error) {
      console.log('Szczegóły błędu:', error.response?.data || error.message)
      Alert.alert('Błąd logowania', 'Nieprawidłowe hasło lub email')
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <AppCard style={styles.card}>
        <ScreenHeader
          title="Akademia Szachowa Zielona Góra"
          subtitle="Zaloguj się"
          titleStyle={styles.headerTitle}
          subtitleStyle={styles.subtitle}
        />
        <AppInput
          label="Email: "
          value={email}
          onChangeText={setEmail}
          placeholder="Adres email"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <AppInput
          label="Hasło: "
          value={password}
          onChangeText={setPassword}
          placeholder="Hasło"
          secureTextEntry
        />
        <AppButton
          title="Zaloguj się"
          onPress={handleLogin}
          loading={loading}
          style={styles.button}
        />
      </AppCard>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  card: {
    maxWidth: 400,
  },
  headerTitle: {
    fontSize: 22,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    marginBottom: 24,
  },
  button: {
    marginTop: 10,
  },
})