import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';

interface Props {
  navigation: any;
  route: { params: { bookingId: string } };
}

const FUEL_LEVELS = [
  { key: 'empty', label: 'فاضي', icon: '🔴' },
  { key: 'quarter', label: 'ربع', icon: '🟠' },
  { key: 'half', label: 'نص', icon: '🟡' },
  { key: 'three_quarter', label: '٣/٤', icon: '🟢' },
  { key: 'full', label: 'فل', icon: '🟢' },
];

const CarReceptionScreen: React.FC<Props> = ({ navigation, route }) => {
  const [photos, setPhotos] = useState({
    front: false,
    back: false,
    left: false,
    right: false,
  });
  const [fuelLevel, setFuelLevel] = useState('');
  const [scratches, setScratches] = useState('');
  const [notes, setNotes] = useState('');

  const photoCount = Object.values(photos).filter(Boolean).length;
  const isComplete = photoCount === 4 && fuelLevel !== '';

  const handleTakePhoto = (side: string) => {
    setPhotos((prev) => ({ ...prev, [side]: true }));
  };

  const handleSubmit = () => {
    navigation.navigate('ProgressUpdate', { bookingId: route.params.bookingId });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background.primary} />
      <LinearGradient colors={['#0A1520', '#0D2B2D', '#0A1520']} style={styles.gradient}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Text style={styles.backArrow}>→</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>تيكيت استلام السيارة</Text>
          </View>

          {/* Customer Info Card */}
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>العميل</Text>
              <Text style={styles.infoValue}>كريم حسن</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>السيارة</Text>
              <Text style={styles.infoValue}>Toyota Corolla 2023</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>الخدمة</Text>
              <Text style={[styles.infoValue, { color: colors.accent.primary }]}>تغيير زيت + فلتر</Text>
            </View>
          </View>

          {/* Photo Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📷 تصوير السيارة ({photoCount}/4)</Text>
            <Text style={styles.sectionSubtitle}>صور السيارة من الأربع جهات للتوثيق</Text>
            
            <View style={styles.photoGrid}>
              {[
                { key: 'front', label: 'الأمام' },
                { key: 'back', label: 'الخلف' },
                { key: 'left', label: 'اليسار' },
                { key: 'right', label: 'اليمين' },
              ].map((side) => (
                <TouchableOpacity
                  key={side.key}
                  style={[
                    styles.photoBox,
                    photos[side.key as keyof typeof photos] && styles.photoBoxDone,
                  ]}
                  onPress={() => handleTakePhoto(side.key)}
                >
                  <Text style={styles.photoIcon}>
                    {photos[side.key as keyof typeof photos] ? '✅' : '📸'}
                  </Text>
                  <Text style={[
                    styles.photoLabel,
                    photos[side.key as keyof typeof photos] && styles.photoLabelDone,
                  ]}>
                    {side.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Fuel Level */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>⛽ مستوى الوقود</Text>
            <View style={styles.fuelContainer}>
              {FUEL_LEVELS.map((level) => (
                <TouchableOpacity
                  key={level.key}
                  style={[
                    styles.fuelOption,
                    fuelLevel === level.key && styles.fuelOptionSelected,
                  ]}
                  onPress={() => setFuelLevel(level.key)}
                >
                  <Text style={styles.fuelIcon}>{level.icon}</Text>
                  <Text style={[
                    styles.fuelLabel,
                    fuelLevel === level.key && styles.fuelLabelSelected,
                  ]}>
                    {level.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Scratches */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🔍 خدوش أو أضرار ظاهرة</Text>
            <TextInput
              style={styles.textArea}
              placeholder="مثال: خدش بسيط في الصدام الأمامي من الجهة اليمنى..."
              placeholderTextColor={colors.input.placeholder}
              value={scratches}
              onChangeText={setScratches}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              textAlign="right"
            />
          </View>

          {/* Notes */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📝 ملاحظات إضافية</Text>
            <TextInput
              style={styles.textArea}
              placeholder="أي ملاحظات تانية من العميل..."
              placeholderTextColor={colors.input.placeholder}
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              textAlign="right"
            />
          </View>

          {/* Submit */}
          <TouchableOpacity
            style={[styles.submitButton, !isComplete && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={!isComplete}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={isComplete ? ['#10B981', '#059669'] : ['rgba(16,185,129,0.2)', 'rgba(5,150,105,0.2)']}
              style={styles.submitGradient}
            >
              <Text style={[styles.submitText, !isComplete && styles.submitTextDisabled]}>
                تأكيد استلام السيارة ✓
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background.primary },
  gradient: { flex: 1 },
  scrollContent: {
    paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight + 16 : 56,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing['4xl'],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing['2xl'],
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background.glass,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.background.glassBorder,
  },
  backArrow: { color: colors.text.primary, fontSize: 18 },
  headerTitle: { ...typography.h3, color: colors.text.primary },
  infoCard: {
    backgroundColor: colors.background.glass,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.background.glassBorder,
    padding: spacing.xl,
    marginBottom: spacing['2xl'],
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  infoLabel: { ...typography.body, color: colors.text.secondary },
  infoValue: { ...typography.label, color: colors.text.primary },
  section: { marginBottom: spacing['2xl'] },
  sectionTitle: {
    ...typography.h4,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  sectionSubtitle: {
    ...typography.bodySmall,
    color: colors.text.tertiary,
    marginBottom: spacing.lg,
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  photoBox: {
    width: '47%',
    height: 100,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: borderRadius.lg,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.1)',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.sm,
  },
  photoBoxDone: {
    borderColor: 'rgba(16,185,129,0.3)',
    borderStyle: 'solid',
    backgroundColor: 'rgba(16,185,129,0.05)',
  },
  photoIcon: { fontSize: 28 },
  photoLabel: { ...typography.labelSmall, color: colors.text.tertiary },
  photoLabelDone: { color: colors.status.success },
  fuelContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  fuelOption: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    gap: spacing.xs,
  },
  fuelOptionSelected: {
    borderColor: colors.accent.primary,
    backgroundColor: 'rgba(212,160,86,0.08)',
  },
  fuelIcon: { fontSize: 16 },
  fuelLabel: { ...typography.caption, color: colors.text.tertiary },
  fuelLabelSelected: { color: colors.accent.primary },
  textArea: {
    backgroundColor: colors.input.background,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.input.border,
    padding: spacing.lg,
    ...typography.body,
    color: colors.text.primary,
    minHeight: 80,
  },
  submitButton: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  submitButtonDisabled: { shadowOpacity: 0, elevation: 0 },
  submitGradient: {
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitText: { ...typography.button, color: '#FFFFFF' },
  submitTextDisabled: { color: 'rgba(255,255,255,0.3)' },
});

export default CarReceptionScreen;
