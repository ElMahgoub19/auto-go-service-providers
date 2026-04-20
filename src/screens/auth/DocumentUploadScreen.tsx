import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { UserRole } from '../../types';
import { useAppDispatch } from '../../hooks';
import { loginSuccess } from '../../store/slices/authSlice';

interface Props {
  navigation: any;
  route: { params: { role: UserRole } };
}

interface DocumentItem {
  id: string;
  label: string;
  description: string;
  icon: string;
  isUploaded: boolean;
}

const DocumentUploadScreen: React.FC<Props> = ({ navigation, route }) => {
  const { role } = route.params;
  const isWinch = role === 'winch_driver';
  const dispatch = useAppDispatch();

  const [documents, setDocuments] = useState<DocumentItem[]>(
    isWinch
      ? [
          { id: 'national_id', label: 'البطاقة الشخصية', description: 'صورة واضحة للبطاقة - وش وضهر', icon: '🪨', isUploaded: false },
          { id: 'license', label: 'رخصة القيادة', description: 'رخصة سارية المفعول', icon: '📄', isUploaded: false },
          { id: 'winch_photo', label: 'صورة الونش', description: 'صورة كاملة للونش من الأمام', icon: '🚜', isUploaded: false },
          { id: 'winch_plate', label: 'لوحة الونش', description: 'صورة واضحة للوحة المعدنية', icon: '🔢', isUploaded: false },
        ]
      : [
          { id: 'commercial_register', label: 'السجل التجاري', description: 'صورة سجل تجاري ساري', icon: '📋', isUploaded: false },
          { id: 'workshop_front', label: 'واجهة المركز', description: 'صورة لواجهة مركز الصيانة', icon: '🏭', isUploaded: false },
          { id: 'workshop_inside', label: 'صورة من الداخل', description: 'صورة لمنطقة العمل', icon: '🔧', isUploaded: false },
          { id: 'location', label: 'موقع المركز', description: 'تحديد الموقع على الخريطة', icon: '📍', isUploaded: false },
        ]
  );

  const handleUpload = (docId: string) => {
    // Mock upload
    setDocuments((prev) =>
      prev.map((d) => (d.id === docId ? { ...d, isUploaded: true } : d))
    );
  };

  const allUploaded = documents.every((d) => d.isUploaded);

  const handleSubmit = () => {
    if (allUploaded) {
      // التحويل مباشرة للتطبيق (الموافقة التلقائية للتجربة)
      dispatch(
        loginSuccess({
          id: 'provider_123',
          name: 'شريك أوتو جو',
          phone: '+201012345678',
          role: role,
          rating: 4.8,
          totalJobs: 0,
          isOnline: false,
          isVerified: true,
          verificationStatus: 'approved',
          createdAt: new Date().toISOString(),
        })
      );
    } else {
      Alert.alert('تنبيه', 'لازم ترفع كل المستندات المطلوبة');
    }
  };

  return (
    <LinearGradient colors={['#060E17', '#0D2B2D', '#0A1520']} style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Back */}
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>→</Text>
        </TouchableOpacity>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.stepBadge}>الخطوة الأخيرة ✨</Text>
          <Text style={styles.title}>رفع المستندات</Text>
          <Text style={styles.subtitle}>
            {isWinch
              ? 'ارفع الأوراق المطلوبة عشان نقدر نفعّل حسابك كسائق ونش'
              : 'ارفع بيانات المركز عشان نقدر نفعّل حسابك على المنصة'}
          </Text>
        </View>

        {/* Progress */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${(documents.filter((d) => d.isUploaded).length / documents.length) * 100}%`,
                },
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            {documents.filter((d) => d.isUploaded).length} / {documents.length} مستند
          </Text>
        </View>

        {/* Document Cards */}
        <View style={styles.documentsContainer}>
          {documents.map((doc) => (
            <TouchableOpacity
              key={doc.id}
              style={[styles.docCard, doc.isUploaded && styles.docCardUploaded]}
              onPress={() => handleUpload(doc.id)}
              activeOpacity={0.8}
            >
              <View style={[styles.docIconContainer, doc.isUploaded && styles.docIconUploaded]}>
                <Text style={styles.docIcon}>{doc.isUploaded ? '✅' : doc.icon}</Text>
              </View>
              <View style={styles.docInfo}>
                <Text style={styles.docLabel}>{doc.label}</Text>
                <Text style={styles.docDescription}>{doc.description}</Text>
              </View>
              <View style={[styles.uploadBadge, doc.isUploaded && styles.uploadBadgeDone]}>
                <Text style={[styles.uploadBadgeText, doc.isUploaded && styles.uploadBadgeTextDone]}>
                  {doc.isUploaded ? 'تم ✓' : 'ارفع'}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Submit */}
        <TouchableOpacity
          style={[styles.submitButton, !allUploaded && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={allUploaded ? ['#D4A056', '#C4842D'] : ['rgba(212,160,86,0.2)', 'rgba(196,132,45,0.2)']}
            style={styles.submitGradient}
          >
            <Text style={[styles.submitText, !allUploaded && styles.submitTextDisabled]}>
              دخول التطبيق 🚀
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1 },
  scrollContent: {
    paddingHorizontal: spacing.xl,
    paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight + 20 : 60,
    paddingBottom: spacing['4xl'],
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background.glass,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.background.glassBorder,
    alignSelf: 'flex-start',
    marginBottom: spacing['2xl'],
  },
  backArrow: { color: colors.text.primary, fontSize: 20 },
  header: { marginBottom: spacing['2xl'] },
  stepBadge: {
    ...typography.labelSmall,
    color: colors.accent.primary,
    backgroundColor: 'rgba(212,160,86,0.12)',
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    marginBottom: spacing.md,
  },
  title: {
    ...typography.h2,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    color: colors.text.secondary,
    lineHeight: 24,
  },
  progressContainer: {
    marginBottom: spacing['2xl'],
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginBottom: spacing.sm,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: colors.accent.primary,
  },
  progressText: {
    ...typography.bodySmall,
    color: colors.text.tertiary,
    textAlign: 'left',
  },
  documentsContainer: {
    gap: spacing.md,
    marginBottom: spacing['3xl'],
  },
  docCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.glass,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.background.glassBorder,
    padding: spacing.lg,
    gap: spacing.md,
  },
  docCardUploaded: {
    borderColor: 'rgba(16, 185, 129, 0.3)',
    backgroundColor: 'rgba(16, 185, 129, 0.05)',
  },
  docIconContainer: {
    width: 50,
    height: 50,
    borderRadius: borderRadius.md,
    backgroundColor: 'rgba(255,255,255,0.06)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  docIconUploaded: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
  },
  docIcon: { fontSize: 24 },
  docInfo: { flex: 1 },
  docLabel: {
    ...typography.label,
    color: colors.text.primary,
    marginBottom: 2,
  },
  docDescription: {
    ...typography.bodySmall,
    color: colors.text.tertiary,
  },
  uploadBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: 'rgba(212,160,86,0.15)',
  },
  uploadBadgeDone: {
    backgroundColor: 'rgba(16,185,129,0.15)',
  },
  uploadBadgeText: {
    ...typography.labelSmall,
    color: colors.accent.primary,
  },
  uploadBadgeTextDone: {
    color: colors.status.success,
  },
  submitButton: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    shadowColor: '#D4A056',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  submitButtonDisabled: {
    shadowOpacity: 0,
    elevation: 0,
  },
  submitGradient: {
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitText: {
    ...typography.button,
    color: colors.button.primaryText,
  },
  submitTextDisabled: {
    color: 'rgba(255,255,255,0.3)',
  },
});

export default DocumentUploadScreen;
