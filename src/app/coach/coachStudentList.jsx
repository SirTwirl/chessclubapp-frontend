import { useEffect, useState } from 'react'
import { FlatList, StyleSheet } from 'react-native'
import { api } from '../../api/client'
import EmptyState from '../../components/common/EmptyState'
import LoadingScreen from '../../components/common/LoadingScreen'
import ScreenContainer from '../../components/common/ScreenContainer'
import ScreenHeader from '../../components/common/ScreenHeader'
import StudentCard from '../../components/students/StudentCard'

export default function CoachStudentListScreen() {
  const [studentList, setStudentList] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    api
      .get('/users')
      .then((response) => {
        if (isMounted) {
          const students = response.data.filter(
            (user) => user.role === 'student'
          )
          setStudentList(students)
        }
      })
      .catch((error) => {
        if (isMounted) {
          console.log('Błąd pobierania listy uczniów:', error)
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

  if (loading) {
    return <LoadingScreen />
  }

  return (
    <ScreenContainer>
      <ScreenHeader title="LISTA UCZNIÓW" style={styles.header} />
      <FlatList
        data={studentList}
        keyExtractor={(item) =>
          (item.id || item._id).toString()
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <StudentCard student={item} />}
        ListEmptyComponent={
          <EmptyState message="Brak zarejestrowanych uczniów." />
        }
      />
    </ScreenContainer>
  )
}

const styles = StyleSheet.create({
  header: {
    marginBottom: 20,
  },
  listContent: {
    paddingBottom: 24,
  },
})