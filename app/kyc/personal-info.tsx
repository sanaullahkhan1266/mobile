import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, StatusBar, TextInput, ScrollView, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import PhoneInput from 'react-native-phone-number-input';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import kycService, { KycPersonalInfo } from '@/services/KycService';
import AppHeader from '@/components/AppHeader';

export default function PersonalInfoScreen() {
  const router = useRouter();
  const [form, setForm] = useState<KycPersonalInfo>({});
  const [dobDate, setDobDate] = useState<Date | null>(null);
  const [showDOB, setShowDOB] = useState(false);
  const [dialCode, setDialCode] = useState<string>('+1');
  const [countryIso, setCountryIso] = useState<string>('US');
  const phoneRef = React.useRef<PhoneInput>(null);
  const [phoneRaw, setPhoneRaw] = useState<string>('');

  useEffect(() => {
    (async () => {
      const s = await kycService.getState();
      setForm(s.personal || {});
      if (s.personal?.dob) setDobDate(new Date(s.personal.dob));
      if (s.dialCode) setDialCode(s.dialCode);
      if (s.countryCode) setCountryIso(s.countryCode as string);
      // Prefill raw phone if saved E.164 exists
      if (s.personal?.phoneNumber && s.dialCode) {
        const raw = (s.personal.phoneNumber || '').replace(/\D/g, '');
        const dc = s.dialCode.replace('+', '');
        const stripped = raw.startsWith(dc) ? raw.slice(dc.length) : raw;
        setPhoneRaw(stripped);
      }
    })();
  }, []);

  const update = (k: keyof KycPersonalInfo, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const canContinue = !!(form.firstName && form.lastName && form.dob && (form.phoneNumber || phoneRaw));

  const saveAndNext = async () => {
    if (!canContinue) return;
    // Ensure we store E.164 formatted
    let formatted = form.phoneNumber;
    if (phoneRef.current) {
      const num = phoneRef.current.getNumberAfterPossiblyEliminatingZero();
      formatted = num?.formattedNumber || form.phoneNumber;
    }
    await kycService.save({ personal: { ...form, phoneCountryCode: dialCode, phoneNumber: formatted || '' } });
    router.push('/kyc/document-type' as any);
  };

  return (
    <SafeAreaView style={s.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <AppHeader title="Personal information" />

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <View style={s.welcomeCard}>
          <View style={s.iconContainer}>
            <Ionicons name="person-circle-outline" size={48} color="#000000" />
          </View>
          <Text style={s.welcomeTitle}>Tell us about yourself</Text>
          <Text style={s.helper}>Enter your legal name and basic details to verify your identity.</Text>
        </View>

        <View style={s.formSection}>
          <View style={s.field}>
            <Text style={s.label}>
              <Ionicons name="person-outline" size={16} color="#000000" /> First name
            </Text>
            <TextInput 
              style={s.input} 
              value={form.firstName || ''} 
              onChangeText={(v) => update('firstName', v)}
              placeholder="Enter your first name"
              placeholderTextColor="#9CA3AF"
            />
          </View>
          
          <View style={s.field}>
            <Text style={s.label}>
              <Ionicons name="person-outline" size={16} color="#000000" /> Last name
            </Text>
            <TextInput 
              style={s.input} 
              value={form.lastName || ''} 
              onChangeText={(v) => update('lastName', v)}
              placeholder="Enter your last name"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={s.field}>
            <Text style={s.label}>
              <Ionicons name="call-outline" size={16} color="#000000" /> Phone number
            </Text>
            <View style={s.phoneContainer}>
              <PhoneInput
                ref={phoneRef}
                defaultCode={countryIso as any}
                layout="first"
                containerStyle={s.phoneInputContainer}
                textContainerStyle={s.phoneTextContainer}
                textInputProps={{ placeholder: '300 1234567', placeholderTextColor: '#9CA3AF' }}
                value={phoneRaw}
                onChangeText={(text) => setPhoneRaw(text)}
                onChangeFormattedText={(text) => update('phoneNumber', text)}
                onChangeCountry={(ct) => {
                  setCountryIso(ct.cca2 as string);
                  const dial = `+${(ct.callingCode?.[0] || '')}`;
                  setDialCode(dial);
                }}
              />
            </View>
          </View>

          <View style={s.field}>
            <Text style={s.label}>
              <Ionicons name="calendar-outline" size={16} color="#000000" /> Date of birth
            </Text>
            <TouchableOpacity style={s.dateInput} onPress={() => setShowDOB(true)}>
              <Text style={[s.dateText, { color: form.dob ? '#111827' : '#9CA3AF' }]}>
                {form.dob || 'Select your date of birth'}
              </Text>
              <Ionicons name="chevron-down" size={20} color="#9CA3AF" />
            </TouchableOpacity>
            {showDOB && (
              <DateTimePicker
                value={dobDate || new Date(1990, 0, 1)}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(e, d) => {
                  setShowDOB(Platform.OS === 'ios');
                  if (d) { setDobDate(d); update('dob', d.toISOString().slice(0,10)); }
                }}
                maximumDate={new Date()}
              />
            )}
          </View>

          <View style={s.field}>
            <Text style={s.label}>
              <Ionicons name="location-outline" size={16} color="#000000" /> Address
            </Text>
            <TextInput 
              style={s.input} 
              value={form.address || ''} 
              onChangeText={(v) => update('address', v)}
              placeholder="Enter your full address"
              placeholderTextColor="#9CA3AF"
              multiline={true}
              numberOfLines={2}
            />
          </View>
          
          <View style={s.rowFields}>
            <View style={s.halfField}>
              <Text style={s.label}>
                <Ionicons name="business-outline" size={16} color="#000000" /> City
              </Text>
              <TextInput 
                style={s.input} 
                value={form.city || ''} 
                onChangeText={(v) => update('city', v)}
                placeholder="City"
                placeholderTextColor="#9CA3AF"
              />
            </View>
            
            <View style={s.halfField}>
              <Text style={s.label}>
                <Ionicons name="mail-outline" size={16} color="#000000" /> Postal code
              </Text>
              <TextInput 
                style={s.input} 
                value={form.postalCode || ''} 
                onChangeText={(v) => update('postalCode', v)}
                placeholder="12345"
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>
        </View>

        <View style={s.buttonContainer}>
          <TouchableOpacity style={[s.primaryBtn, !canContinue && s.btnDisabled]} disabled={!canContinue} onPress={saveAndNext}>
            <Ionicons name="arrow-forward" size={20} color="#FFFFFF" style={s.buttonIcon} />
            <Text style={s.primaryText}>Continue to Documents</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor: '#FAFAFA'
  },
  welcomeCard: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 20,
    marginBottom: 24,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#000000',
    borderStyle: 'dashed',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#000000',
    marginBottom: 8,
    textAlign: 'center',
  },
  helper: { 
    color: '#6B7280', 
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  formSection: {
    borderWidth: 2,
    borderColor: '#000000',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  field: { 
    marginBottom: 20,
  },
  label: { 
    color: '#000000', 
    marginBottom: 10, 
    fontWeight: '700',
    fontSize: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: { 
    borderWidth: 2, 
    borderColor: '#000000', 
    borderRadius: 16, 
    paddingHorizontal: 16, 
    paddingVertical: 14,
    fontSize: 16,
    minHeight: 52,
    textAlignVertical: 'center',
  },
  phoneContainer: {
    borderWidth: 2,
    borderColor: '#000000',
    borderRadius: 16,
    overflow: 'hidden',
  },
  phoneInputContainer: {
    width: '100%',
    borderRadius: 0,
    borderWidth: 0,
    height: 52,
  },
  phoneTextContainer: {
    borderRadius: 0,
    paddingVertical: 0,
    borderLeftWidth: 1,
    borderLeftColor: '#E5E7EB',
  },
  dateInput: {
    borderWidth: 2,
    borderColor: '#000000',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 52,
  },
  dateText: {
    fontSize: 16,
    flex: 1,
  },
  rowFields: { 
    flexDirection: 'row', 
    marginBottom: 20,
    gap: 12,
  },
  halfField: {
    flex: 1,
  },
  buttonContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  primaryBtn: { 
    backgroundColor: '#000000', 
    height: 56, 
    borderRadius: 28, 
    alignItems: 'center', 
    justifyContent: 'center',
    flexDirection: 'row',
    paddingHorizontal: 32,
    borderWidth: 2,
    borderColor: '#000000',
    minWidth: 200,
  },
  btnDisabled: { 
    backgroundColor: '#E5E7EB',
    borderColor: '#E5E7EB',
  },
  primaryText: { 
    color: '#FFFFFF', 
    fontWeight: '800',
    fontSize: 16,
    marginLeft: 8,
  },
  buttonIcon: {
    marginRight: 4,
  },
});
