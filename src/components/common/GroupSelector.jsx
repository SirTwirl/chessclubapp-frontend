import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { colors } from '../../constants/colors'
import { CHESS_GROUPS } from '../../constants/groups'

export default function GroupSelector({
  groups = CHESS_GROUPS,
  selectedGroup,
  onSelectGroup,
  mode = 'tabs',
  label = 'Wybierz grupę:',
}) {
  if (mode === 'radio') {
    return (
      <View style={styles.radioContainer}>
        {label ? <Text style={styles.sectionLabel}>{label}</Text> : null}
        <View style={styles.radioList}>
          {groups.map((group) => {
            const isSelected = selectedGroup === group.id
            return (
              <TouchableOpacity
                key={group.id}
                style={styles.radioOption}
                onPress={() => onSelectGroup(group.id)}
              >
                <Text style={styles.radioOptionText}>
                  {isSelected ? `(X) ${group.label}` : `( ) ${group.label}`}
                </Text>
              </TouchableOpacity>
            )
          })}
        </View>
      </View>
    )
  }

  return (
    <View style={styles.tabsWrapper}>
      {label ? <Text style={styles.sectionLabel}>{label}</Text> : null}
      <View style={styles.groupsContainer}>
        {groups.map((group) => {
          const isSelected = selectedGroup === group.id
          return (
            <TouchableOpacity
              key={group.id}
              style={[
                styles.groupTab,
                isSelected && styles.groupTabSelected,
              ]}
              onPress={() => onSelectGroup(group.id)}
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
    </View>
  )
}

const styles = StyleSheet.create({
  tabsWrapper: {
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  groupsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  groupTab: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  groupTabSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  groupTabText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    textAlign: 'center',
  },
  groupTabTextSelected: {
    color: colors.text,
    fontWeight: 'bold',
  },
  radioContainer: {
    marginBottom: 10,
  },
  radioList: {
    marginVertical: 4,
  },
  radioOption: {
    paddingVertical: 8,
  },
  radioOptionText: {
    fontSize: 15,
    color: colors.textTertiary,
  },
})
