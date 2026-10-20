import * as ImagePicker from 'expo-image-picker'
import { useEffect, useState } from 'react'
import { Alert, Image, StyleSheet, Text, View } from 'react-native'
import { api } from '../../api/client'
import { colors } from '../../constants/colors'
import { formatDate } from '../../utils/date'
import AppButton from '../common/AppButton'
import AppInput from '../common/AppInput'
import ImageUploadPicker from '../common/ImageUploadPicker'

export default function TaskCard({ task, role, refreshKey = 0 }) {
  const [answers, setAnswers] = useState([])
  const [answerContent, setAnswerContent] = useState('')
  const [answerImageUri, setAnswerImageUri] = useState(null)
  const [answerImage, setAnswerImage] = useState(null)
  const [answersLoading, setAnswersLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const taskId = task?.id || task?._id

  useEffect(() => {
    let isMounted = true

    api.get(`/tasks/${taskId}/answers`)
      .then((response) => {
        if (isMounted) setAnswers(response.data)
      })
      .catch((error) => {
        console.log('Błąd podczas pobierania odpowiedzi:', error)
      })
      .finally(() => {
        if (isMounted) setAnswersLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [taskId, refreshKey])

  if (!task) return null

  const pickAnswerImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (!permission.granted) {
      Alert.alert('Brak uprawnień', 'Potrzebujemy dostępu do galerii, aby dodać zdjęcie.')
      return
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.7,
      base64: true,
    })

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0]
      setAnswerImageUri(asset.uri)
      setAnswerImage(`data:${asset.mimeType || 'image/jpeg'};base64,${asset.base64}`)
    }
  }

  const submitAnswer = async () => {
    const content = answerContent.trim()
    if (!content && !answerImage) {
      Alert.alert('Brak odpowiedzi', 'Wpisz odpowiedź lub dodaj zdjęcie.')
      return
    }

    setSubmitting(true)
    try {
      const response = await api.post(`/tasks/${taskId}/answers`, {
        content,
        image: answerImage,
      })
      setAnswers([response.data])
      setAnswerContent('')
      setAnswerImageUri(null)
      setAnswerImage(null)
      Alert.alert('Wysłano', 'Odpowiedź została przekazana trenerowi.')
    } catch (error) {
      Alert.alert(
        'Nie udało się wysłać',
        error.response?.data?.error || 'Spróbuj ponownie później.'
      )
    } finally {
      setSubmitting(false)
    }
  }

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

      {role === 'student' ? (
        answers.length > 0 ? (
          <AnswerList answers={answers} title="Twoja odpowiedź" />
        ) : (
          <View style={styles.answerForm}>
            <Text style={styles.sectionTitle}>Twoja odpowiedź</Text>
            <AppInput
              placeholder="Wpisz rozwiązanie..."
              value={answerContent}
              onChangeText={setAnswerContent}
              multiline
              numberOfLines={4}
              containerStyle={styles.answerInput}
            />
            <ImageUploadPicker
              label="Zdjęcie rozwiązania (opcjonalnie)"
              imageUri={answerImageUri}
              onPickImage={pickAnswerImage}
              onRemoveImage={() => {
                setAnswerImageUri(null)
                setAnswerImage(null)
              }}
            />
            <AppButton
              title="Wyślij odpowiedź"
              onPress={submitAnswer}
              loading={submitting || answersLoading}
              disabled={answersLoading || (!answerContent.trim() && !answerImage)}
            />
          </View>
        )
      ) : (
        <AnswerList answers={answers} loading={answersLoading} />
      )}
    </View>
  )
}

function AnswerList({ answers, loading = false, title = 'Odpowiedzi uczniów' }) {
  return (
    <View style={styles.answersSection}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {loading ? (
        <Text style={styles.answerMeta}>Ładowanie odpowiedzi...</Text>
      ) : answers.length === 0 ? (
        <Text style={styles.answerMeta}>Brak przesłanych odpowiedzi.</Text>
      ) : answers.map((answer) => (
        <View key={answer.id || answer._id} style={styles.answerItem}>
          {answer.student ? (
            <Text style={styles.answerStudent}>
              {answer.student.name} {answer.student.surname}
            </Text>
          ) : null}
          {answer.content ? <Text style={styles.answerContent}>{answer.content}</Text> : null}
          {answer.imageUrl ? (
            <Image source={{ uri: answer.imageUrl }} style={styles.answerImage} resizeMode="contain" />
          ) : null}
          <Text style={styles.answerMeta}>
            Wysłano: {formatDate(answer.submittedAt)}
          </Text>
        </View>
      ))}
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
  answerForm: {
    marginTop: 16,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  answersSection: {
    marginTop: 16,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 10,
  },
  answerInput: {
    marginBottom: 12,
  },
  answerItem: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  answerStudent: {
    color: colors.primaryLight,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 6,
  },
  answerContent: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },
  answerImage: {
    width: '100%',
    height: 220,
    marginTop: 10,
    borderRadius: 6,
    backgroundColor: colors.background,
  },
  answerMeta: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 8,
  },
})
