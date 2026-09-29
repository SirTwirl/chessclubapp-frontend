import * as ImagePicker from 'expo-image-picker'
import { router } from 'expo-router'
import { useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { api } from '../../api/client'

const TARGET_GROUPS = [
  { id: 'beginner', label: 'Początkujący' },
  { id: 'intermediate', label: 'Średniozaawansowany' },
  { id: 'advanced', label: 'Zaawansowany' },
]

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
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.header}>Nowe Zadanie</Text>

      <Text style={styles.label}>Tytuł zadania *</Text>
      <TextInput
        style={styles.input}
        placeholder="Wpisz tytuł"
        placeholderTextColor="#777"
        value={title}
        onChangeText={setTitle}
      />

      <Text style={styles.label}>Opis / Instrukcja *</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Opisz zadanie..."
        placeholderTextColor="#777"
        multiline
        numberOfLines={4}
        value={description}
        onChangeText={setDescription}
      />

      <Text style={styles.label}>Grupa docelowa *</Text>
      <View style={styles.groupsContainer}>
        {TARGET_GROUPS.map((group) => (
          <TouchableOpacity
            key={group.id}
            style={styles.groupOption}
            onPress={() => setTargetGroup(group.id)}
          >
            <Text style={styles.groupOptionText}>
              {targetGroup === group.id
                ? `(X) ${group.label}`
                : `( ) ${group.label}`}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Termin wykonania (RRRR-MM-DD) *</Text>
      <TextInput
        style={styles.input}
        placeholder="RRRR-MM-DD"
        placeholderTextColor="#777"
        value={dueDate}
        onChangeText={setDueDate}
      />

      <Text style={styles.label}>Zdjęcie / Szachownica (opcjonalnie)</Text>
      <TouchableOpacity style={styles.pickerButton} onPress={pickImage}>
        <Text style={styles.pickerButtonText}>
          {imageUri ? 'Zmień zdjęcie z galerii' : 'Wybierz zdjęcie z galerii'}
        </Text>
      </TouchableOpacity>

      {imageUri && (
        <View style={styles.imageBox}>
          <Image
            source={{ uri: imageUri }}
            style={styles.image}
            resizeMode="contain"
          />
          <TouchableOpacity style={styles.removeButton} onPress={removeImage}>
            <Text style={styles.removeButtonText}>Usuń zdjęcie</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.submitButtonText}>Dodaj zadanie</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#121212',
  },
  container: {
    padding: 20,
    width: '100%',
    maxWidth: 500,
    alignSelf: 'center',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#3B8246',
    textAlign: 'center',
    margin: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#3B8246',
    marginTop: 14,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: '#1E1E1E',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#2C2C2C',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  groupsContainer: {
    marginVertical: 4,
  },
  groupOption: {
    paddingVertical: 8,
  },
  groupOptionText: {
    fontSize: 15,
    color: '#DDDDDD',
  },
  pickerButton: {
    backgroundColor: '#1E1E1E',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#2C2C2C',
    alignItems: 'center',
  },
  pickerButtonText: {
    color: '#CCCCCC',
    fontSize: 14,
  },
  imageBox: {
    marginTop: 12,
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2C2C2C',
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 6,
  },
  removeButton: {
    marginTop: 10,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#2A1818',
    borderRadius: 6,
  },
  removeButtonText: {
    color: '#FF8A8A',
    fontSize: 13,
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#3B8246',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 30,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
})