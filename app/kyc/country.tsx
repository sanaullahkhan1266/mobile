import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import CountryPicker, { Country as Cty } from 'react-native-country-picker-modal';
import kycService from '@/services/KycService';
import AppHeader from '@/components/AppHeader';

export default function KycCountry() {
  const router = useRouter();
  const [pickerVisible, setPickerVisible] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [selectedIso, setSelectedIso] = useState<string | null>(null);
  const [selectedDial, setSelectedDial] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const s = await kycService.getState();
      if (s.country) {
        setSelected(s.country);
        setSelectedIso(s.countryCode || null);
        setSelectedDial(s.dialCode || null);
      }
    })();
  }, []);

  const saveAndNext = async () => {
    if (!selected || !selectedIso || !selectedDial) return;
    await kycService.save({ country: selected, countryCode: selectedIso, dialCode: selectedDial });
    router.push('/kyc/personal-info' as any);
  };

  return (
    <SafeAreaView style={s.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <AppHeader title="Select country/region" />

      <View style={{ paddingHorizontal: 16 }}>
        <TouchableOpacity style={s.selector} onPress={() => setPickerVisible(true)}>
          <Text style={s.selectorText}>{selected ? `${selected} (${selectedDial})` : 'Choose your country'}</Text>
          <Ionicons name="chevron-down" size={18} color="#000000" />
        </TouchableOpacity>
        <CountryPicker
          visible={pickerVisible}
          withFilter
          withCallingCode
          withFlag
          withCountryNameButton={false}
          onClose={() => setPickerVisible(false)}
          onSelect={(cty: Cty) => {
            setPickerVisible(false);
            setSelected(cty.name as string);
            setSelectedIso(cty.cca2 as string);
            const dial = `+${(cty.callingCode?.[0] || '')}`;
            setSelectedDial(dial);
          }}
        />

        <TouchableOpacity style={[s.primaryBtn, !selected && s.btnDisabled]} disabled={!selected} onPress={saveAndNext}>
          <Text style={s.primaryText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#F3F4F6' },
  backButton: { padding: 8 },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#111827' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#F3F4F6' },
  rowText: { fontSize: 15, color: '#111827' },
  selector: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderColor: '#E5E7EB', paddingHorizontal: 12, height: 46, borderRadius: 10 },
  selectorText: { color: '#111827', fontWeight: '600' },
  primaryBtn: { marginTop: 18, backgroundColor: '#000000', height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  btnDisabled: { backgroundColor: '#E5E7EB' },
  primaryText: { color: '#FFFFFF', fontWeight: '700' },
});
