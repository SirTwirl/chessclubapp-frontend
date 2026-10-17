export const CHESS_GROUPS = [
  { id: 'beginner', label: 'Początkujący' },
  { id: 'intermediate', label: 'Średniozaawansowani' },
  { id: 'advanced', label: 'Zaawansowani' },
]

export const getGroupLabel = (groupId) => {
  const found = CHESS_GROUPS.find((g) => g.id === groupId)
  return found ? found.label : groupId || 'Wszystkie'
}
