import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { colors } from '../../constants/colors'

export default function AttendanceStudentRow({
  student,
  isPresent,
  onToggle,
  disabled = false,
}) {
  return (
    <TouchableOpacity
      style={[
        styles.studentRow,
        isPresent ? styles.studentRowPresent : styles.studentRowAbsent,
        disabled && styles.studentRowDisabled,
      ]}
      onPress={onToggle}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Text style={styles.studentName}>
        {student.name} {student.surname}
      </Text>
      <View
        style={[
          styles.statusBadge,
          isPresent ? styles.statusBadgePresent : styles.statusBadgeAbsent,
        ]}
      >
        <Text
          style={[
            styles.statusBadgeText,
            isPresent
              ? styles.statusBadgeTextPresent
              : styles.statusBadgeTextAbsent,
          ]}
        >
          {isPresent ? 'OBECNY' : 'NIEOBECNY'}
        </Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  studentRow: {
    backgroundColor: colors.surface,
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  studentRowPresent: {
    borderColor: colors.primary,
  },
  studentRowAbsent: {
    borderColor: colors.border,
    opacity: 0.7,
  },
  studentRowDisabled: {
    opacity: 0.6,
  },
  studentName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  statusBadge: {
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  statusBadgePresent: {
    backgroundColor: colors.badgePresentBg,
  },
  statusBadgeAbsent: {
    backgroundColor: colors.badgeAbsentBg,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  statusBadgeTextPresent: {
    color: colors.badgePresentText,
  },
  statusBadgeTextAbsent: {
    color: colors.badgeAbsentText,
  },
})
