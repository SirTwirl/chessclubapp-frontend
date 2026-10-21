import { ScrollView, StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors } from '../../constants/colors'
import AppHeader from './AppHeader'

export default function ScreenContainer({
  children,
  scrollable = false,
  maxWidth = 500,
  contentContainerStyle,
  style,
  keyboardShouldPersistTaps = 'handled',
}) {
  if (scrollable) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={[styles.scrollHeader, { maxWidth }]}>
          <AppHeader />
        </View>
        <ScrollView
          style={[styles.scrollContainer, style]}
          contentContainerStyle={[
            styles.container,
            { maxWidth },
            contentContainerStyle,
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps={keyboardShouldPersistTaps}
        >
          {children}
        </ScrollView>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View
        style={[
          styles.container,
          { maxWidth },
          contentContainerStyle,
          style,
        ]}
      >
        <AppHeader />
        {children}
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollHeader: {
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
    width: '100%',
    alignSelf: 'center',
  },
})
