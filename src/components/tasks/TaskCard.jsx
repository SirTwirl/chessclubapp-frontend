import { Image, StyleSheet, Text, View } from 'react-native'
import { colors } from '../../constants/colors'
import { formatDate } from '../../utils/date'

export default function TaskCard({ task }) {
  if (!task) return null

  return (
    <View style={styles.taskCard}>
      <Text style={styles.taskTitle}>{task.title}</Text>

      {task.description ? (
        <Text style={styles.taskDescription}>{task.description}</Text>
      ) : null}

      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Grupa: </Text>
        <Text style={styles.infoValue}>
          {task.targetGroup || 'Wszystkie'}
        </Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Termin oddania: </Text>
        <Text style={styles.dueDateValue}>
          {formatDate(task.dueDate)}
        </Text>
      </View>

      {task.assignedBy ? (
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Zadający: </Text>
          <Text style={styles.infoValue}>
            {task.assignedBy.name} {task.assignedBy.surname}
          </Text>
        </View>
      ) : null}

      {task.imageUrl ? (
        <Image
          source={{ uri: task.imageUrl }}
          style={styles.taskImage}
          resizeMode="contain"
        />
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  taskCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 14,
  },
  taskTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 6,
  },
  taskDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
    lineHeight: 20,
  },
  infoRow: {
    flexDirection: 'row',
    marginTop: 4,
  },
  infoLabel: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 13,
    color: colors.textTertiary,
  },
  dueDateValue: {
    fontSize: 13,
    color: colors.danger,
    fontWeight: '600',
  },
  taskImage: {
    width: '100%',
    height: 220,
    marginTop: 12,
    borderRadius: 8,
    backgroundColor: colors.background,
  },
})
