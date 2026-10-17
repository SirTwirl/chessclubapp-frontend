import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from 'react-native'
import { colors } from '../../constants/colors'

export default function AppButton({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
  textStyle,
  children,
  activeOpacity = 0.7,
}) {
  const isDisabled = disabled || loading

  const getVariantStyle = () => {
    switch (variant) {
      case 'secondary':
        return styles.secondaryButton
      case 'outline':
        return styles.outlineButton
      case 'danger':
        return styles.dangerButton
      case 'primary':
      default:
        return styles.primaryButton
    }
  }

  const getTextStyle = () => {
    switch (variant) {
      case 'secondary':
        return styles.secondaryButtonText
      case 'outline':
        return styles.outlineButtonText
      case 'danger':
        return styles.dangerButtonText
      case 'primary':
      default:
        return styles.primaryButtonText
    }
  }

  return (
    <TouchableOpacity
      style={[
        styles.baseButton,
        getVariantStyle(),
        isDisabled && styles.disabledButton,
        style,
      ]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={activeOpacity}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'danger' ? colors.danger : colors.text} />
      ) : children ? (
        children
      ) : (
        <Text style={[getTextStyle(), textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  baseButton: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  primaryButtonText: {
    color: colors.text,
    fontSize: 15,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  secondaryButton: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: 10,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginBottom: 14,
  },
  secondaryButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  outlineButton: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  outlineButtonText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  dangerButton: {
    backgroundColor: colors.dangerBg,
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  dangerButtonText: {
    color: colors.danger,
    fontSize: 13,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.6,
  },
})
