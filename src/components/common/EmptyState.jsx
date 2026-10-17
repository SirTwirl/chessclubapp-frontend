import { StyleSheet, Text } from 'react-native'
import { colors } from '../../constants/colors'

export default function EmptyState({ message, style }) {
  return <Text style={[styles.emptyText, style]}>{message}</Text>
}

const styles = StyleSheet.create({
  emptyText: {
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 35,
    fontSize: 14,
  },
})
