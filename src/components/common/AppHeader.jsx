import * as SecureStore from 'expo-secure-store'
import { router } from 'expo-router'
import { useEffect, useState } from 'react'
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native'
import { setToken } from '../../api/client'
import { colors } from '../../constants/colors'

export default function AppHeader() {
  const [userName, setUserName] = useState('Użytkowniku')
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  useEffect(() => {
    let isMounted = true

    SecureStore.getItemAsync('user')
      .then((storedUser) => {
        if (!isMounted || !storedUser) return

        const user = JSON.parse(storedUser)
        setUserName(user.name || user.email || 'Użytkowniku')
      })
      .catch((error) => {
        console.log('Błąd podczas odczytu użytkownika:', error)
        if (isMounted) {
          Alert.alert('Błąd', 'Nie udało się odczytać danych użytkownika.')
        }
      })

    return () => {
      isMounted = false
    }
  }, [])

  const handleLogout = async () => {
    if (isLoggingOut) return

    setIsLoggingOut(true)

    try {
      await SecureStore.deleteItemAsync('user')
      setToken(null)
      router.replace('/')
    } catch (error) {
      console.log('Błąd podczas wylogowywania:', error)
      Alert.alert('Błąd', 'Nie udało się wylogować. Spróbuj ponownie.')
      setIsLoggingOut(false)
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.greeting} numberOfLines={1}>
        Witaj, {userName}
      </Text>
      <View style={styles.actions}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Powiadomienia"
          accessibilityState={{ disabled: true }}
          disabled
          style={styles.actionButton}
        >
          <Text style={styles.actionIcon}>🔔</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Wyloguj się"
          disabled={isLoggingOut}
          onPress={handleLogout}
          style={({ pressed }) => [
            styles.actionButton,
            pressed && styles.pressed,
          ]}
        >
          <View style={styles.logoutIcon} accessible={false}>
            <View style={styles.logoutDoor} />
            <View style={styles.logoutArrowStem} />
            <View style={styles.logoutArrowTop} />
            <View style={styles.logoutArrowBottom} />
          </View>
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    minHeight: 52,
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  greeting: {
    flex: 1,
    color: colors.text,
    fontSize: 18,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: colors.surface,
  },
  actionIcon: {
    color: colors.text,
    fontSize: 20,
  },
  logoutIcon: {
    width: 22,
    height: 22,
    position: 'relative',
  },
  logoutDoor: {
    position: 'absolute',
    left: 3,
    top: 3,
    width: 10,
    height: 16,
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderColor: colors.text,
    borderTopLeftRadius: 2,
    borderBottomLeftRadius: 2,
  },
  logoutArrowStem: {
    position: 'absolute',
    left: 7,
    top: 10,
    width: 11,
    height: 2,
    backgroundColor: colors.text,
  },
  logoutArrowTop: {
    position: 'absolute',
    left: 14,
    top: 5,
    width: 2,
    height: 8,
    backgroundColor: colors.text,
    transform: [{ rotate: '-45deg' }],
  },
  logoutArrowBottom: {
    position: 'absolute',
    left: 14,
    top: 9,
    width: 2,
    height: 8,
    backgroundColor: colors.text,
    transform: [{ rotate: '45deg' }],
  },
  pressed: {
    opacity: 0.7,
  },
})
