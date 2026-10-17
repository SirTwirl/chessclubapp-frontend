import { StyleSheet, Text, View } from 'react-native'
import { colors } from '../../constants/colors'

export default function ScreenHeader({
  title,
  subtitle,
  date,
  style,
  titleStyle,
  subtitleStyle,
}) {
  return (
    <View style={[styles.headerContainer, style]}>
      {title ? (
        <Text style={[styles.title, titleStyle]}>{title}</Text>
      ) : null}
      {subtitle ? (
        <Text style={[styles.subtitle, subtitleStyle]}>{subtitle}</Text>
      ) : null}
      {date ? (
        <Text style={styles.dateText}>Data: {date}</Text>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  headerContainer: {
    marginBottom: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'center',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 6,
  },
  dateText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
  },
})
