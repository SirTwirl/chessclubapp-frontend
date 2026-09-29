import { router } from 'expo-router'
import * as SecureStore from 'expo-secure-store'
import { useState } from 'react'
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native'
import { setToken } from '../api/client'
import loginService from '../api/login'

export default function LoginScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async() => {
    if(!email || !password) {
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
      <View style={styles.card}>
        <Text style={styles.headerTitle}>
        Akademia Szachowa Zielona Góra
      </Text>
      <Text style={styles.subtitle}>
        Zaloguj się
      </Text>
      <Text style={styles.label}>Email: </Text><TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder='Adres email' keyboardType='email-address' autoCapitalize='none'/>
      <Text style={styles.label}>Hasło: </Text><TextInput style={styles.input} value={password} onChangeText={setPassword} placeholder='Hasło' secureTextEntry/>
      <TouchableOpacity style={[styles.button, loading && styles.buttonDisabled]} onPress={handleLogin} disabled={loading}>
        <Text style={styles.buttonText}>Zaloguj się</Text>
        </TouchableOpacity>
    </View>
      </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  card: {
    backgroundColor: '#1E1E1E',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: '#2C2C2C',
    maxWidth: 400,
    alignSelf: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#3B8246', 
    textAlign: 'center',
    letterSpacing: 1,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: '#CCCCCC',
    textAlign: 'center',
    marginBottom: 24,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#3B8246', 
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: '#2A2A2A',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#FFFFFF',
    placeholderTextColor: "#666666",
    borderWidth: 1,
    borderColor: '#3A3A3A',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#3B8246', 
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
})