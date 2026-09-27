import { useEffect, useState } from 'react'
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  Text,
  View,
} from 'react-native'
import { api } from '../../api/client'

export default function ParentHomeScreen() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchTasks = async () => {
    try {
      const response = await api.get('/tasks')
      setTasks(response.data || [])
    } catch (error) {
      console.log('Błąd podczas pobierania zadań rodzica:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  const onRefresh = () => {
    setRefreshing(true)
    fetchTasks()
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('pl-PL')
  }

  if (loading) {
    return (
      <View>
        <ActivityIndicator />
        <Text>Ładowanie zadań...</Text>
      </View>
    )
  }

  return (
    <View>
      <Text>Zadania szachowe ♟️</Text>

      <FlatList
        data={tasks}
        keyExtractor={(item) => (item.id || item._id).toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={({ item }) => (
          <View>
            <Text>Tytuł: {item.title}</Text>
            <Text>Opis: {item.description}</Text>
            <Text>Grupa: {item.targetGroup}</Text>
            <Text>Termin oddania: {formatDate(item.dueDate)}</Text>

            {item.assignedBy && (
              <Text>
                Trener: {item.assignedBy.name} {item.assignedBy.surname}
              </Text>
            )}

            {item.imageUrl && (
              <Image
                source={{ uri: item.imageUrl }}
                resizeMode="contain"
              />
            )}
          </View>
        )}
        ListEmptyComponent={<Text>Brak aktualnych zadań do wykonania 🎉</Text>}
      />
    </View>
  )
}