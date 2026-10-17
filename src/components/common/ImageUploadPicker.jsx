import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { colors } from '../../constants/colors'
import AppButton from './AppButton'

export default function ImageUploadPicker({
  imageUri,
  onPickImage,
  onRemoveImage,
  label = 'Zdjęcie / Szachownica (opcjonalnie)',
}) {
  return (
    <View style={styles.container}>
      {label ? <Text style={styles.label}>{label}</Text> : null}

      <TouchableOpacity
        style={styles.pickerButton}
        onPress={onPickImage}
        activeOpacity={0.7}
      >
        <Text style={styles.pickerButtonText}>
          {imageUri ? 'Zmień zdjęcie z galerii' : 'Wybierz zdjęcie z galerii'}
        </Text>
      </TouchableOpacity>

      {imageUri && (
        <View style={styles.imageBox}>
          <Image
            source={{ uri: imageUri }}
            style={styles.image}
            resizeMode="contain"
          />
          <AppButton
            variant="danger"
            title="Usuń zdjęcie"
            onPress={onRemoveImage}
            style={styles.removeButton}
          />
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: '100%',
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
    marginTop: 4,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  pickerButton: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  pickerButtonText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  imageBox: {
    marginTop: 12,
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 6,
  },
  removeButton: {
    marginTop: 10,
  },
})
