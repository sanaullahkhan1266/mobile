import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Animated,
  Alert,
} from 'react-native';
import { MaterialIcons as Icon } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { CustomHeader, GradientButton } from '../components/ui';
import { colors, typography, spacing, borderRadius } from '../styles/theme';
import NetInfo from '@react-native-community/netinfo';

const NetworkDiagnosticsScreen = ({ navigation }) => {
  const { theme, isDarkMode } = useTheme();
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(100);
  const [diagnostics, setDiagnostics] = useState({
    appNetworkPermission: 'success',
    networkConnection: 'success',
    networkProxy: 'success',
    signalStrength: 'warning',
    mainServer: 'success',
  });

  const progressAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Initial progress animation
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, []);

  const runDiagnostics = async () => {
    setIsRunning(true);
    setProgress(0);
    
    try {
      // Reset progress
      progressAnim.setValue(0);
      
      // Animate progress
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: false,
      }).start();

      // Update progress incrementally
      const progressSteps = [20, 40, 60, 80, 100];
      const diagnosticsSteps = [
        'appNetworkPermission',
        'networkConnection', 
        'networkProxy',
        'signalStrength',
        'mainServer'
      ];

      for (let i = 0; i < progressSteps.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 600));
        setProgress(progressSteps[i]);
        
        // Simulate diagnostic checks
        const newDiagnostics = { ...diagnostics };
        
        if (diagnosticsSteps[i] === 'networkConnection') {
          const netInfo = await NetInfo.fetch();
          newDiagnostics.networkConnection = netInfo.isConnected ? 'success' : 'error';
        } else if (diagnosticsSteps[i] === 'signalStrength') {
          // Simulate signal strength check
          const signalStrength = Math.random();
          newDiagnostics.signalStrength = signalStrength > 0.7 ? 'success' : 
                                        signalStrength > 0.3 ? 'warning' : 'error';
        } else {
          // Other checks - simulate success most of the time
          newDiagnostics[diagnosticsSteps[i]] = Math.random() > 0.1 ? 'success' : 'warning';
        }
        
        setDiagnostics(newDiagnostics);
      }
      
      // Pulse animation when complete
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

    } catch (error) {
      console.error('Error running diagnostics:', error);
      Alert.alert('Error', 'Failed to run network diagnostics');
    } finally {
      setIsRunning(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return { name: 'check-circle', color: colors.success };
      case 'warning':
        return { name: 'warning', color: colors.warning };
      case 'error':
        return { name: 'error', color: colors.error };
      default:
        return { name: 'help', color: colors.text.disabled };
    }
  };

  const renderDiagnosticItem = (iconName, title, status) => {
    const statusIcon = getStatusIcon(status);
    
    return (
      <View key={title} style={[
        styles.diagnosticItem,
        { borderBottomColor: isDarkMode ? theme.colors.gray[700] : theme.colors.gray[200] }
      ]}>
        <View style={styles.diagnosticLeft}>
          <Icon 
            name={iconName} 
            size={24} 
            color={isDarkMode ? theme.colors.text.secondary : colors.text.secondary} 
          />
          <Text style={[
            styles.diagnosticTitle,
            { color: isDarkMode ? theme.colors.text.primary : colors.text.primary }
          ]}>
            {title}
          </Text>
        </View>
        
        <View style={[
          styles.statusBadge,
          { backgroundColor: statusIcon.color }
        ]}>
          <Icon name={statusIcon.name} size={16} color="#FFFFFF" />
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={[
      styles.container,
      { backgroundColor: isDarkMode ? theme.colors.background.primary : colors.surface }
    ]}>
      <StatusBar 
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor={isDarkMode ? theme.colors.background.primary : colors.surface}
      />
      
      <CustomHeader
        title="Network Diagnostics"
        onBackPress={() => navigation.goBack()}
        backgroundColor={isDarkMode ? theme.colors.background.primary : colors.surface}
      />

      <View style={styles.content}>
        {/* Progress Circle */}
        <View style={styles.progressContainer}>
          <Animated.View style={[
            styles.progressCircle,
            { transform: [{ scale: scaleAnim }] }
          ]}>
            <View style={styles.progressBackground}>
              <Animated.View 
                style={[
                  styles.progressForeground,
                  {
                    transform: [{
                      rotate: progressAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0deg', '360deg'],
                      }),
                    }],
                  },
                ]}
              />
            </View>
            <View style={styles.progressInner}>
              <Text style={[
                styles.progressText,
                { color: isDarkMode ? theme.colors.text.primary : colors.text.primary }
              ]}>
                {progress}%
              </Text>
            </View>
          </Animated.View>
        </View>

        {/* Diagnostics List */}
        <View style={[
          styles.diagnosticsContainer,
          { backgroundColor: isDarkMode ? theme.colors.surface : '#FFFFFF' }
        ]}>
          {renderDiagnosticItem('apps', 'App Network Permission', diagnostics.appNetworkPermission)}
          {renderDiagnosticItem('wifi', 'Network Connection', diagnostics.networkConnection)}
          {renderDiagnosticItem('hub', 'Network Proxy', diagnostics.networkProxy)}
          {renderDiagnosticItem('signal-cellular-alt', 'Signal Strength', diagnostics.signalStrength)}
          {renderDiagnosticItem('dns', 'Main Server', diagnostics.mainServer)}
        </View>

        {/* Diagnose Button */}
        <View style={styles.buttonContainer}>
          <GradientButton
            title={isRunning ? "Running..." : "Diagnose"}
            onPress={runDiagnostics}
            disabled={isRunning}
            gradient={colors.gradients.primary}
            style={styles.diagnoseButton}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xl,
  },
  progressContainer: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  progressCircle: {
    width: 160,
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressBackground: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 8,
    borderColor: colors.text.disabled + '20',
  },
  progressForeground: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 8,
    borderColor: colors.success,
    borderLeftColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  progressInner: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  progressText: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  diagnosticsContainer: {
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    ...colors.shadows.light,
    marginBottom: spacing.xl,
  },
  diagnosticItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md + 4,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 0.5,
    minHeight: 64,
  },
  diagnosticLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  diagnosticTitle: {
    fontSize: 16,
    fontWeight: '400',
    marginLeft: spacing.md,
  },
  statusBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    paddingHorizontal: spacing.md,
  },
  diagnoseButton: {
    marginBottom: spacing.lg,
  },
});

export default NetworkDiagnosticsScreen;