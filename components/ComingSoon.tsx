import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, StatusBar, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '@/constants/Theme';

interface Props {
  title: string;
  description?: string;
  icon?: keyof typeof Ionicons.glyphMap;
}

const ComingSoon: React.FC<Props> = ({ title, description = 'This page is coming soon.', icon = 'hourglass' }) => {
  const router = useRouter();
  const T = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: T.bg }]}> 
      <StatusBar barStyle={T.text === '#F9FAFB' ? 'light-content' : 'dark-content'} />

      <View style={[styles.header, { borderBottomColor: T.border }]}> 
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={T.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: T.text }]}>{title}</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.center}> 
        <View style={[styles.iconWrap, { borderColor: T.border, backgroundColor: T.card }]}> 
          <Ionicons name={icon as any} size={28} color={T.muted} />
        </View>
        <Text style={[styles.title, { color: T.text }]}>{title}</Text>
        <Text style={[styles.subtitle, { color: T.muted }]}>{description}</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 60, paddingBottom: 16, borderBottomWidth: 1 },
  backButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  iconWrap: { width: 64, height: 64, borderRadius: 32, borderWidth: 1, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  title: { fontSize: 22, fontWeight: '800', marginBottom: 8 },
  subtitle: { fontSize: 15, textAlign: 'center' },
});

export default ComingSoon;
