import { router } from 'expo-router'
import * as SecureStore from 'expo-secure-store'
import { useState } from 'react'
import {
  Alert,
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
    <View>
      <Text>
        Akademia Szachowa Zielona Góra
      </Text>
      <Text>
        Zaloguj się
      </Text>
      <Text>Email: </Text><TextInput value={email} onChangeText={setEmail} placeholder='Adres email' keyboardType='email-address' autoCapitalize='none'/>
      <Text>Hasło: </Text><TextInput value={password} onChangeText={setPassword} placeholder='Hasło' secureTextEntry/>
      <TouchableOpacity onPress={handleLogin} disabled={loading}><Text>Zaloguj się</Text></TouchableOpacity>
    </View>
  )
}