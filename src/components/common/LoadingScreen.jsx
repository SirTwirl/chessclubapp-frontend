import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors } from '../../constants/colors'

export default function LoadingScreen({ message, fullScreen = true }) {
  const content = (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.primary} />
      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  )

  if (fullScreen) {
    return <SafeAreaView style={styles.safeArea}>{content}</SafeAreaView>
  }

  return content
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    color: colors.textSecondary,
    marginTop: 12,
    fontSize: 14,
  },
})
