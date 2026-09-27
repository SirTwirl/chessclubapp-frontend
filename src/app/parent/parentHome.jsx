import { useEffect, useState } from 'react'
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { api } from '../../api/client'

export default function ParentHomeScreen() {
  const [children, setChildren] = useState([])
  const [selectedChildId, setSelectedChildId] = useState(null)
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchData = async () => {
    try {
      const meRes = await api.get('/users/me')
      const parentUser = meRes.data

      if (parentUser && parentUser.children && parentUser.children.length > 0) {
        setChildren(parentUser.children)
        const currentChild = parentUser.children[0]
        const currentChildId =
          selectedChildId || currentChild.id || currentChild._id || currentChild
        setSelectedChildId(currentChildId)

        const tasksRes = await api.get(`/tasks?studentId=${currentChildId}`)
        setTasks(tasksRes.data)
      } else {
        const tasksRes = await api.get('/tasks')
        setTasks(tasksRes.data)
      }
    } catch (error) {
      console.log('Błąd pobierania zadań rodzica:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [selectedChildId])

  const onRefresh = () => {
    setRefreshing(true)
    fetchData()
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
        <Text>Ładowanie zadań dziecka...</Text>
      </View>
    )
  }

  return (
    <View style={{ flex: 1 }}>
      <Text>Zadania szachowe Twojego dziecka ♟️</Text>

      {children.length > 1 && (
        <View style={{ marginVertical: 10 }}>
          <Text>Wybierz dziecko:</Text>
          {children.map((child) => {
            const childId = child.id || child._id || child
            const childName =
              typeof child === 'object'
                ? `${child.name} ${child.surname}`
                : 'Uczeń'

            return (
              <TouchableOpacity
                key={childId}
                onPress={() => setSelectedChildId(childId)}
              >
                <Text>
                  {selectedChildId === childId
                    ? `[X] ${childName}`
                    : `[ ] ${childName}`}
                </Text>
              </TouchableOpacity>
            )
          })}
        </View>
      )}

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
                Trener: {item.assignedBy.name} {item.assignedBy.surname}
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
        ListEmptyComponent={<Text>Brak aktualnych zadań do wykonania 🎉</Text>}
      />
    </View>
  )
}