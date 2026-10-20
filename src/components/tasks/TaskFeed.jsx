import * as SecureStore from 'expo-secure-store'
import { useEffect, useState } from 'react'
import { FlatList, RefreshControl, StyleSheet } from 'react-native'
import { api } from '../../api/client'
import { colors } from '../../constants/colors'
import EmptyState from '../common/EmptyState'
import LoadingScreen from '../common/LoadingScreen'
import ScreenContainer from '../common/ScreenContainer'
import ScreenHeader from '../common/ScreenHeader'
import TaskCard from './TaskCard'

export default function TaskFeed({ title = 'TWOJE ZADANIA DO WYKONANIA ♟️' }) {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [role, setRole] = useState(null)
  const [refreshKey, setRefreshKey] = useState(0)

  const fetchTasks = async () => {
    try {
      const response = await api.get('/tasks')
      setTasks(response.data)
    } catch (error) {
      console.log('Błąd podczas pobierania zadań:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
      setRefreshKey((current) => current + 1)
    }
  }

  useEffect(() => {
    let isMounted = true

    SecureStore.getItemAsync('user')
      .then((storedUser) => {
        if (isMounted && storedUser) setRole(JSON.parse(storedUser).role)
      })
      .catch((error) => console.log('Błąd podczas odczytu roli użytkownika:', error))

    api
      .get('/tasks')
      .then((response) => {
        if (isMounted) {
          setTasks(response.data)
        }
      })
      .catch((error) => {
        if (isMounted) {
          console.log('Błąd podczas pobierania zadań:', error)
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [])

  const onRefresh = () => {
    setRefreshing(true)
    fetchTasks()
  }

  if (loading) {
    return <LoadingScreen message="Ładowanie zadań..." />
  }

  return (
    <ScreenContainer>
      <ScreenHeader title={title} />
      <FlatList
        data={tasks}
        extraData={role}
        keyExtractor={(item) => (item.id || item._id).toString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
        renderItem={({ item }) => (
          <TaskCard task={item} role={role} refreshKey={refreshKey} />
        )}
        ListEmptyComponent={
          <EmptyState message="Brak zadań do wykonania 🎉" />
        }
      />
    </ScreenContainer>
  )
}

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: 24,
  },
})
