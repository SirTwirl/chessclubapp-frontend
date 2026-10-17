export const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return isNaN(date.getTime()) ? dateString : date.toLocaleDateString('pl-PL')
}

export const getTodayDateString = () => {
  return new Date().toISOString().split('T')[0]
}
