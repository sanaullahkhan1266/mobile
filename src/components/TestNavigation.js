import React from 'react';
import { View, StyleSheet } from 'react-native';
import { GradientButton } from './ui';
import { spacing } from '../styles/theme';

const TestNavigation = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <GradientButton
        title="Language Selection"
        onPress={() => navigation.navigate('LanguageSelection')}
        style={styles.button}
      />
      <GradientButton
        title="Permissions"
        onPress={() => navigation.navigate('Permissions')}
        style={styles.button}
      />
      <GradientButton
        title="Network Diagnostics"
        onPress={() => navigation.navigate('NetworkDiagnostics')}
        style={styles.button}
      />
      <GradientButton
        title="Help"
        onPress={() => navigation.navigate('Help')}
        style={styles.button}
      />
      <GradientButton
        title="Messages"
        onPress={() => navigation.navigate('Messages')}
        style={styles.button}
      />
      <GradientButton
        title="Help Support"
        onPress={() => navigation.navigate('HelpSupport')}
        style={styles.button}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    marginTop: spacing.lg,
  },
  button: {
    marginBottom: spacing.md,
  },
});

export default TestNavigation;