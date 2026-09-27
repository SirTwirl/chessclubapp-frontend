import { useEffect, useState } from 'react'
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Text,
    TouchableOpacity,
    View,
} from 'react-native'
import { api } from '../../api/client'

const GROUPS = [
  { id: 'beginner', label: 'Początkujący' },
  { id: 'intermediate', label: 'Średniozaawansowany' },
  { id: 'advanced', label: 'Zaawansowany' },
]

export default function CoachAttendanceScreen() {
  const [selectedGroup, setSelectedGroup] = useState('beginner')
  const [students, setStudents] = useState([])
  const [attendance, setAttendance] = useState({})
  const [alreadyChecked, setAlreadyChecked] = useState(false)
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const todayDate = new Date().toISOString().split('T')[0]

  useEffect(() => {
    fetchGroupData()
  }, [selectedGroup])

  const fetchGroupData = async () => {
    setLoading(true)
    setAlreadyChecked(false)
    setAttendance({})

    try {
      const usersResponse = await api.get('/users')
      const groupStudents = usersResponse.data.filter(
        (user) => user.role === 'student' && user.group === selectedGroup
      )
      setStudents(groupStudents)

      const initialAttendance = {}
      groupStudents.forEach((student) => {
        const id = student.id || student._id
        initialAttendance[id] = true
      })
      setAttendance(initialAttendance)

      const attendanceResponse = await api.get(
        `/attendance?group=${selectedGroup}&date=${todayDate}`
      )
      
      if (attendanceResponse.data && attendanceResponse.data.length > 0) {
        setAlreadyChecked(true)
      }
    } catch (error) {
      console.log('Błąd podczas pobierania danych:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleAttendance = (studentId) => {
    if (alreadyChecked) return

    setAttendance((prev) => ({
      ...prev,
      [studentId]: !prev[studentId],
    }))
  }

  const handleSubmit = async () => {
    if (students.length === 0) {
      Alert.alert('Informacja', 'Brak uczniów w tej grupie.')
      return
    }

    setSubmitting(true)

    try {
      const records = students.map((student) => {
        const id = student.id || student._id
        return {
          studentId: id,
          isPresent: !!attendance[id],
        }
      })

      await api.post('/attendance', {
        group: selectedGroup,
        date: todayDate,
        records,
      })

      Alert.alert('Sukces', 'Obecność została zapisana!')
      setAlreadyChecked(true)
    } catch (error) {
      console.log('Błąd podczas zapisywania obecności:', error)
      Alert.alert(
        'Błąd',
        error.response?.data?.error || 'Nie udało się zapisać obecności.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <View>
      <Text>Sprawdzanie Obecności 📋</Text>
      <Text>Data: {todayDate}</Text>

      <Text>Wybierz grupę:</Text>
      <View>
        {GROUPS.map((group) => (
          <TouchableOpacity
            key={group.id}
            onPress={() => setSelectedGroup(group.id)}
          >
            <Text>
              {selectedGroup === group.id ? `[X] ${group.label}` : `[ ] ${group.label}`}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {alreadyChecked && (
        <Text style={{ color: 'red' }}>
          ⚠️ Obecność dla grupy "{selectedGroup}" została już dzisiaj sprawdzona.
        </Text>
      )}

      {loading ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          data={students}
          keyExtractor={(item) => (item.id || item._id).toString()}
          renderItem={({ item }) => {
            const studentId = item.id || item._id
            const isPresent = !!attendance[studentId]

            return (
              <TouchableOpacity
                onPress={() => toggleAttendance(studentId)}
                disabled={alreadyChecked}
              >
                <Text>
                  {isPresent ? '✅' : '❌'} {item.name} {item.surname}
                </Text>
              </TouchableOpacity>
            )
          }}
          ListEmptyComponent={
            <Text>Brak przypisanych uczniów do tej grupy.</Text>
          }
        />
      )}

      {!loading && students.length > 0 && (
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={alreadyChecked || submitting}
        >
          {submitting ? (
            <ActivityIndicator />
          ) : (
            <Text>
              {alreadyChecked ? 'Obecność już sprawdzona' : 'Wyślij obecność'}
            </Text>
          )}
        </TouchableOpacity>
      )}
    </View>
  )
}