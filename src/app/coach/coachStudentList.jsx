import { useEffect, useState } from 'react'
import {
    ActivityIndicator,
    FlatList,
    Text,
    View
} from 'react-native'
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
      <View>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    )
  }

  return (
    <View>
      <Text>Lista uczniów</Text>
      
      <FlatList
        data={studentList}
        keyExtractor={item => item.id ? item.id.toString() : item._id.toString()}
        renderItem={({ item }) => (
          <View>
            <Text>{item.name} {item.surname}</Text>
            <Text>Telefon: {item.telephone || 'Brak'}</Text>
            <Text>Grupa: {item.group || 'Brak grupy'}</Text>
          </View>
        )}
        ListEmptyComponent={
          <Text>Brak zarejestrowanych uczniów.</Text>
        }
      />
    </View>
  )
}