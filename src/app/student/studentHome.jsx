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

export default function StudentHomeScreen() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchTasks = async () => {
    try {
      const response = await api.get('/tasks')
      setTasks(response.data)
    } catch (error) {
      console.log('Błąd podczas pobierania zadań:', error)
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
    <View style={{ flex: 1 }}>
      <Text>Twoje zadania do wykonania ♟️</Text>

      <FlatList
        data={tasks}
        keyExtractor={(item) => (item.id || item._id).toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={({ item }) => (
          <View style={{ borderWidth: 1, marginVertical: 8, padding: 8 }}>
            <Text>Tytuł: {item.title}</Text>
            <Text>Opis: {item.description}</Text>
            <Text>Grupa: {item.targetGroup}</Text>
            <Text>Termin oddania: {formatDate(item.dueDate)}</Text>

            {item.assignedBy && (
              <Text>
                Zadający: {item.assignedBy.name} {item.assignedBy.surname}
              </Text>
            )}

            {item.imageUrl && (
              <Image
                source={{ uri: item.imageUrl }}
                style={{ width: 200, height: 200, marginTop: 8 }}
                resizeMode="contain"
              />
            )}
          </View>
        )}
        ListEmptyComponent={<Text>Brak zadań do wykonania 🎉</Text>}
      />
    </View>
  )
}