import { StyleSheet, Text, View } from 'react-native'
import { colors } from '../../constants/colors'

export default function AttendanceWarning({ groupLabel }) {
  return (
    <View style={styles.warningBox}>
      <Text style={styles.warningText}>
        ⚠️ Obecność dla grupy &quot;{groupLabel}&quot; została już dzisiaj sprawdzona.
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  warningBox: {
    backgroundColor: colors.dangerBg,
    borderWidth: 1,
    borderColor: colors.dangerBorder,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  warningText: {
    color: colors.danger,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },
})
