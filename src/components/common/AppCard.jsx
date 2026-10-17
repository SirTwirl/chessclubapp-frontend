import { StyleSheet, View } from 'react-native'
import { colors } from '../../constants/colors'

export default function AppCard({ children, style }) {
  return <View style={[styles.card, style]}>{children}</View>
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: colors.border,
    width: '100%',
    alignSelf: 'center',
  },
})
