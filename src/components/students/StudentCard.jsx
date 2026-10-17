import { StyleSheet, Text, View } from 'react-native'
import { colors } from '../../constants/colors'
import { getGroupLabel } from '../../constants/groups'

export default function StudentCard({ student }) {
  if (!student) return null

  return (
    <View style={styles.studentCard}>
      <Text style={styles.studentName}>
        {student.name} {student.surname}
      </Text>
      <Text style={styles.studentDetail}>
        <Text style={styles.detailLabel}>Telefon: </Text>
        {student.telephone || 'Brak'}
      </Text>
      <Text style={styles.studentDetail}>
        <Text style={styles.detailLabel}>Grupa: </Text>
        {getGroupLabel(student.group) || 'Brak grupy'}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  studentCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
  },
  studentName: {
    fontSize: 17,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  studentDetail: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  detailLabel: {
    color: colors.primary,
    fontWeight: '600',
  },
})
