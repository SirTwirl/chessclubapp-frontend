import { useEffect, useState } from 'react'
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { api } from '../../api/client'

export default function ParentHomeScreen() {
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
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3B8246" />
          <Text style={styles.loadingText}>Ładowanie zadań...</Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.headerTitle}>TWOJE ZADANIA DO WYKONANIA ♟️</Text>

        <FlatList
          data={tasks}
          keyExtractor={(item) => (item.id || item._id).toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#3B8246"
            />
          }
          renderItem={({ item }) => (
            <View style={styles.taskCard}>
              <Text style={styles.taskTitle}>{item.title}</Text>

              {item.description ? (
                <Text style={styles.taskDescription}>{item.description}</Text>
              ) : null}

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Grupa: </Text>
                <Text style={styles.infoValue}>
                  {item.targetGroup || 'Wszystkie'}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Termin oddania: </Text>
                <Text style={styles.dueDateValue}>
                  {formatDate(item.dueDate)}
                </Text>
              </View>

              {item.assignedBy && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Zadający: </Text>
                  <Text style={styles.infoValue}>
                    {item.assignedBy.name} {item.assignedBy.surname}
                  </Text>
                </View>
              )}

              {item.imageUrl && (
                <Image
                  source={{ uri: item.imageUrl }}
                  style={styles.taskImage}
                  resizeMode="contain"
                />
              )}
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Brak zadań do wykonania 🎉</Text>
          }
        />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#121212',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#CCCCCC',
    marginTop: 12,
    fontSize: 14,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
    width: '100%',
    maxWidth: 500,
    alignSelf: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3B8246',
    textAlign: 'center',
    letterSpacing: 1,
    marginBottom: 16,
  },
  listContent: {
    paddingBottom: 24,
  },
  taskCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2C2C2C',
    marginBottom: 14,
  },
  taskTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  taskDescription: {
    fontSize: 14,
    color: '#CCCCCC',
    marginBottom: 12,
    lineHeight: 20,
  },
  infoRow: {
    flexDirection: 'row',
    marginTop: 4,
  },
  infoLabel: {
    fontSize: 13,
    color: '#3B8246',
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 13,
    color: '#DDDDDD',
  },
  dueDateValue: {
    fontSize: 13,
    color: '#FF8A8A',
    fontWeight: '600',
  },
  taskImage: {
    width: '100%',
    height: 220,
    marginTop: 12,
    borderRadius: 8,
    backgroundColor: '#121212',
  },
  emptyText: {
    color: '#888888',
    textAlign: 'center',
    marginTop: 40,
    fontSize: 15,
  },
})