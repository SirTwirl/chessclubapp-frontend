import * as ImagePicker from 'expo-image-picker'
import { router } from 'expo-router'
import { useState } from 'react'
import {
    ActivityIndicator,
    Alert,
    Image,
    ScrollView,
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
      Alert.alert('Błąd', 'Uzupełnij wszystkie wymagane pola (Tytuł, Opis, Termin).')
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
    <ScrollView>
      <Text>Nowe Zadanie</Text>

      <Text>Tytuł zadania *</Text>
      <TextInput
        placeholder="Wpisz tytuł"
        value={title}
        onChangeText={setTitle}
      />

      <Text>Opis / Instrukcja *</Text>
      <TextInput
        placeholder="Opisz zadanie..."
        multiline
        numberOfLines={4}
        value={description}
        onChangeText={setDescription}
      />

      <Text>Grupa docelowa *</Text>
      <View>
        {TARGET_GROUPS.map((group) => (
          <TouchableOpacity
            key={group.id}
            onPress={() => setTargetGroup(group.id)}
          >
            <Text>
              {targetGroup === group.id ? `(X) ${group.label}` : `( ) ${group.label}`}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text>Termin wykonania (RRRR-MM-DD) *</Text>
      <TextInput
        placeholder="YYYY-MM-DD"
        value={dueDate}
        onChangeText={setDueDate}
      />

      <Text>Zdjęcie / Szachownica (opcjonalnie)</Text>
      <TouchableOpacity onPress={pickImage}>
        <Text>{imageUri ? 'Zmień zdjęcie z galerii' : 'Wybierz zdjęcie z galerii'}</Text>
      </TouchableOpacity>

      {imageUri && (
        <View>
          <Image source={{ uri: imageUri }} style={{ width: 150, height: 150 }} />
          <TouchableOpacity onPress={removeImage}>
            <Text>Usuń zdjęcie</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity onPress={handleSubmit} disabled={loading}>
        {loading ? <ActivityIndicator /> : <Text>Dodaj zadanie</Text>}
      </TouchableOpacity>
    </ScrollView>
  )
}