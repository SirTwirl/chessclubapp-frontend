import * as ImagePicker from 'expo-image-picker'
import { router } from 'expo-router'
import { useState } from 'react'
import { Alert, StyleSheet } from 'react-native'
import { api } from '../../api/client'
import AppButton from '../../components/common/AppButton'
import AppInput from '../../components/common/AppInput'
import GroupSelector from '../../components/common/GroupSelector'
import ImageUploadPicker from '../../components/common/ImageUploadPicker'
import ScreenContainer from '../../components/common/ScreenContainer'
import ScreenHeader from '../../components/common/ScreenHeader'
import { CHESS_GROUPS } from '../../constants/groups'

export default function CoachSetTasksScreen() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [imageUri, setImageUri] = useState(null)
  const [imageBase64, setImageBase64] = useState(null)
  const [targetGroup, setTargetGroup] = useState('beginner')
  const [dueDate, setDueDate] = useState('')
  const [loading, setLoading] = useState(false)

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()

    if (status !== 'granted') {
      Alert.alert(
        'Brak uprawnień',
        'Potrzebujemy dostępu do galerii, aby dodać zdjęcie.'
      )
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
      setImageUri(asset.uri)

      const mimeType = asset.mimeType || 'image/jpeg'
      setImageBase64(`data:${mimeType};base64,${asset.base64}`)
    }
  }

  const removeImage = () => {
    setImageUri(null)
    setImageBase64(null)
  }

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim() || !dueDate.trim()) {
      Alert.alert(
        'Błąd',
        'Uzupełnij wszystkie wymagane pola (Tytuł, Opis, Termin).'
      )
      return
    }

    setLoading(true)

    try {
      await api.post('/tasks', {
        title,
        description,
        image: imageBase64,
        dueDate: new Date(dueDate).toISOString(),
        targetGroup,
      })

      Alert.alert('Sukces', 'Zadanie zostało dodane!', [
        { text: 'OK', onPress: () => router.back() },
      ])
    } catch (error) {
      console.log('Błąd podczas dodawania zadania:', error)
      Alert.alert(
        'Błąd',
        error.response?.data?.error || 'Nie udało się dodać zadania.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <ScreenContainer scrollable contentContainerStyle={styles.container}>
      <ScreenHeader title="Nowe Zadanie" style={styles.header} />

      <AppInput
        label="Tytuł zadania *"
        placeholder="Wpisz tytuł"
        value={title}
        onChangeText={setTitle}
      />

      <AppInput
        label="Opis / Instrukcja *"
        placeholder="Opisz zadanie..."
        multiline
        numberOfLines={4}
        value={description}
        onChangeText={setDescription}
      />

      <GroupSelector
        groups={CHESS_GROUPS}
        selectedGroup={targetGroup}
        onSelectGroup={setTargetGroup}
        mode="radio"
        label="Grupa docelowa *"
      />

      <AppInput
        label="Termin wykonania (RRRR-MM-DD) *"
        placeholder="RRRR-MM-DD"
        value={dueDate}
        onChangeText={setDueDate}
      />

      <ImageUploadPicker
        imageUri={imageUri}
        onPickImage={pickImage}
        onRemoveImage={removeImage}
      />

      <AppButton
        title="Dodaj zadanie"
        onPress={handleSubmit}
        loading={loading}
        style={styles.submitButton}
      />
    </ScreenContainer>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginVertical: 20,
  },
  submitButton: {
    marginTop: 16,
    marginBottom: 30,
  },
})