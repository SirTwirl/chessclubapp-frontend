import { useEffect, useState } from 'react'
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { api } from '../../api/client'

export default function CoachStudentListScreen() {
  const [studentList, setStudentList] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/users')
      .then(response => {
        const students = response.data.filter(user => user.role === 'student')
        setStudentList(students)
      })
      .catch(error => {
        console.log('Błąd pobierania listy uczniów:', error)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3B8246" />
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.headerTitle}>LISTA UCZNIÓW</Text>

        <FlatList
          data={studentList}
          keyExtractor={item => item.id ? item.id.toString() : item._id.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.studentCard}>
              <Text style={styles.studentName}>
                {item.name} {item.surname}
              </Text>
              <Text style={styles.studentDetail}>
                <Text style={styles.detailLabel}>Telefon: </Text>
                {item.telephone || 'Brak'}
              </Text>
              <Text style={styles.studentDetail}>
                <Text style={styles.detailLabel}>Grupa: </Text>
                {item.group || 'Brak grupy'}
              </Text>
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Brak zarejestrowanych uczniów.</Text>
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
    marginBottom: 20,
  },
  listContent: {
    paddingBottom: 24,
  },
  studentCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2C2C2C',
    marginBottom: 12,
  },
  studentName: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  studentDetail: {
    fontSize: 14,
    color: '#CCCCCC',
    marginTop: 2,
  },
  detailLabel: {
    color: '#3B8246',
    fontWeight: '600',
  },
  emptyText: {
    color: '#888888',
    textAlign: 'center',
    marginTop: 40,
    fontSize: 15,
  },
})