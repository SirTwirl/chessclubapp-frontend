import { useEffect, useState } from 'react'
import { Alert, FlatList, StyleSheet } from 'react-native'
import { api } from '../../api/client'
import AttendanceStudentRow from '../../components/attendance/AttendanceStudentRow'
import AttendanceWarning from '../../components/attendance/AttendanceWarning'
import AppButton from '../../components/common/AppButton'
import EmptyState from '../../components/common/EmptyState'
import GroupSelector from '../../components/common/GroupSelector'
import LoadingScreen from '../../components/common/LoadingScreen'
import ScreenContainer from '../../components/common/ScreenContainer'
import ScreenHeader from '../../components/common/ScreenHeader'
import { CHESS_GROUPS, getGroupLabel } from '../../constants/groups'
import { getTodayDateString } from '../../utils/date'

export default function CoachAttendanceScreen() {
  const [selectedGroup, setSelectedGroup] = useState('beginner')
  const [students, setStudents] = useState([])
  const [attendance, setAttendance] = useState({})
  const [alreadyChecked, setAlreadyChecked] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const todayDate = getTodayDateString()

  useEffect(() => {
    let isMounted = true

    Promise.all([
      api.get('/users'),
      api.get(`/attendance?group=${selectedGroup}&date=${todayDate}`),
    ])
      .then(([usersResponse, attendanceResponse]) => {
        if (!isMounted) return

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

        if (attendanceResponse.data && attendanceResponse.data.length > 0) {
          setAlreadyChecked(true)
        } else {
          setAlreadyChecked(false)
        }
      })
      .catch((error) => {
        if (isMounted) {
          console.log('Błąd podczas pobierania danych:', error)
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
  }, [selectedGroup, todayDate])

  const handleSelectGroup = (groupId) => {
    if (groupId === selectedGroup) return
    setSelectedGroup(groupId)
    setLoading(true)
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
    <ScreenContainer>
      <ScreenHeader
        title="SPRAWDZANIE OBECNOŚCI 📋"
        date={todayDate}
      />

      <GroupSelector
        groups={CHESS_GROUPS}
        selectedGroup={selectedGroup}
        onSelectGroup={handleSelectGroup}
        mode="tabs"
      />

      {alreadyChecked && (
        <AttendanceWarning groupLabel={getGroupLabel(selectedGroup)} />
      )}

      {loading ? (
        <LoadingScreen fullScreen={false} />
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
              <AttendanceStudentRow
                student={item}
                isPresent={isPresent}
                onToggle={() => toggleAttendance(studentId)}
                disabled={alreadyChecked}
              />
            )
          }}
          ListEmptyComponent={
            <EmptyState message="Brak przypisanych uczniów do tej grupy." />
          }
        />
      )}

      {!loading && students.length > 0 && (
        <AppButton
          title={alreadyChecked ? 'Obecność już sprawdzona' : 'Wyślij obecność'}
          onPress={handleSubmit}
          loading={submitting}
          disabled={alreadyChecked || submitting}
          style={styles.submitButton}
        />
      )}
    </ScreenContainer>
  )
}

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: 16,
  },
  submitButton: {
    marginTop: 8,
    marginBottom: 12,
  },
})