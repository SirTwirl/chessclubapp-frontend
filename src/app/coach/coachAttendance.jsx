import { useEffect, useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { api } from '../../api/client'

const GROUPS = [
  { id: 'beginner', label: 'Początkujący' },
  { id: 'intermediate', label: 'Średniozaawansowani' },
  { id: 'advanced', label: 'Zaawansowani' },
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
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.headerTitle}>SPRAWDZANIE OBECNOŚCI 📋</Text>
        <Text style={styles.dateText}>Data: {todayDate}</Text>

        <Text style={styles.sectionLabel}>Wybierz grupę:</Text>
        <View style={styles.groupsContainer}>
          {GROUPS.map((group) => {
            const isSelected = selectedGroup === group.id
            return (
              <TouchableOpacity
                key={group.id}
                style={[
                  styles.groupTab,
                  isSelected && styles.groupTabSelected,
                ]}
                onPress={() => setSelectedGroup(group.id)}
              >
                <Text
                  style={[
                    styles.groupTabText,
                    isSelected && styles.groupTabTextSelected,
                  ]}
                >
                  {group.label}
                </Text>
              </TouchableOpacity>
            )
          })}
        </View>

        {alreadyChecked && (
          <View style={styles.warningBox}>
            <Text style={styles.warningText}>
              ⚠️ Obecność dla grupy "{GROUPS.find(g => g.id === selectedGroup)?.label}" została już dzisiaj sprawdzona.
            </Text>
          </View>
        )}

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#3B8246" />
          </View>
        ) : (
          <FlatList
            data={students}
            keyExtractor={(item) => (item.id || item._id).toString()}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => {
              const studentId = item.id || item._id
              const isPresent = !!attendance[studentId]

              return (
                <TouchableOpacity
                  style={[
                    styles.studentRow,
                    isPresent ? styles.studentRowPresent : styles.studentRowAbsent,
                    alreadyChecked && styles.studentRowDisabled,
                  ]}
                  onPress={() => toggleAttendance(studentId)}
                  disabled={alreadyChecked}
                  activeOpacity={0.7}
                >
                  <Text style={styles.studentName}>
                    {item.name} {item.surname}
                  </Text>
                  <View
                    style={[
                      styles.statusBadge,
                      isPresent ? styles.statusBadgePresent : styles.statusBadgeAbsent,
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusBadgeText,
                        isPresent ? styles.statusBadgeTextPresent : styles.statusBadgeTextAbsent,
                      ]}
                    >
                      {isPresent ? 'OBECNY' : 'NIEOBECNY'}
                    </Text>
                  </View>
                </TouchableOpacity>
              )
            }}
            ListEmptyComponent={
              <Text style={styles.emptyText}>
                Brak przypisanych uczniów do tej grupy.
              </Text>
            }
          />
        )}

        {!loading && students.length > 0 && (
          <TouchableOpacity
            style={[
              styles.submitButton,
              (alreadyChecked || submitting) && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={alreadyChecked || submitting}
          >
            {submitting ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.submitButtonText}>
                {alreadyChecked ? 'Obecność już sprawdzona' : 'Wyślij obecność'}
              </Text>
            )}
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#121212',
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
  },
  dateText: {
    fontSize: 14,
    color: '#CCCCCC',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#3B8246',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  groupsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  groupTab: {
    flex: 1,
    backgroundColor: '#1E1E1E',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderWidth: 1,
    borderColor: '#2C2C2C',
    alignItems: 'center',
  },
  groupTabSelected: {
    backgroundColor: '#3B8246',
    borderColor: '#3B8246',
  },
  groupTabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#CCCCCC',
    textAlign: 'center',
  },
  groupTabTextSelected: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  warningBox: {
    backgroundColor: '#2A1818',
    borderWidth: 1,
    borderColor: '#5A2424',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  warningText: {
    color: '#FF8A8A',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingBottom: 16,
  },
  studentRow: {
    backgroundColor: '#1E1E1E',
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  studentRowPresent: {
    borderColor: '#3B8246',
  },
  studentRowAbsent: {
    borderColor: '#2C2C2C',
    opacity: 0.7,
  },
  studentRowDisabled: {
    opacity: 0.6,
  },
  studentName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
    flex: 1,
  },
  statusBadge: {
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  statusBadgePresent: {
    backgroundColor: '#1E3822',
  },
  statusBadgeAbsent: {
    backgroundColor: '#2A2A2A',
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  statusBadgeTextPresent: {
    color: '#3B8246',
  },
  statusBadgeTextAbsent: {
    color: '#888888',
  },
  emptyText: {
    color: '#888888',
    textAlign: 'center',
    marginTop: 30,
    fontSize: 14,
  },
  submitButton: {
    backgroundColor: '#3B8246',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 12,
  },
  submitButtonDisabled: {
    backgroundColor: '#2A2A2A',
    borderColor: '#3A3A3A',
    borderWidth: 1,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
})