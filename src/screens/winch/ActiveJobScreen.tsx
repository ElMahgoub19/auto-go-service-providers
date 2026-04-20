import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';

interface Props {
  navigation: any;
  route: { params: { jobId: string } };
}

const STATUS_STEPS = [
  { key: 'on_the_way', label: 'أنا في الطريق', icon: '🚜', description: 'إبلاغ العميل إنك في الطريق' },
  { key: 'arrived', label: 'وصلت للموقع', icon: '📍', description: 'تأكيد الوصول لموقع العميل' },
  { key: 'car_picked_up', label: 'تم رفع السيارة', icon: '🏗️', description: 'التقاط صورة للسيارة (توثيق)' },
  { key: 'delivered', label: 'تم التوصيل', icon: '✅', description: 'تسليم السيارة للوجهة المطلوبة' },
];

const ActiveJobScreen: React.FC<Props> = ({ navigation, route }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [photoTaken, setPhotoTaken] = useState(false);

  const handleNextStep = () => {
    if (currentStep === 2 && !photoTaken) {
      // Need photo before proceeding
      setPhotoTaken(true); // Mock: simulate photo capture
      return;
    }
    if (currentStep < STATUS_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Job completed
      navigation.replace('JobCompletion', { jobId: route.params.jobId });
    }
  };

  const isLastStep = currentStep === STATUS_STEPS.length - 1;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background.primary} />
      <LinearGradient colors={['#0A1520', '#0D2B2D', '#0A1520']} style={styles.gradient}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>🚜 رحلة جارية</Text>
            <View style={styles.liveBadge}>
              <View style={styles.liveIndicator} />
              <Text style={styles.liveText}>LIVE</Text>
            </View>
          </View>

          {/* Map Placeholder */}
          <View style={styles.mapContainer}>
            <LinearGradient
              colors={['rgba(16,185,129,0.08)', 'rgba(10,21,32,0.6)']}
              style={styles.mapPlaceholder}
            >
              <Text style={styles.mapIcon}>🗺️</Text>
              <Text style={styles.mapText}>التتبع اللحظي على الخريطة</Text>
            </LinearGradient>
          </View>

          {/* Customer Card */}
          <View style={styles.customerCard}>
            <View style={styles.customerAvatar}>
              <Text style={styles.customerAvatarText}>م</Text>
            </View>
            <View style={styles.customerInfo}>
              <Text style={styles.customerName}>محمود عبدالله</Text>
              <Text style={styles.customerCar}>BMW 320i - أبيض</Text>
            </View>
            <TouchableOpacity style={styles.callButton}>
              <Text style={styles.callIcon}>📞</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.chatButton}>
              <Text style={styles.chatIcon}>💬</Text>
            </TouchableOpacity>
          </View>

          {/* Progress Steps */}
          <View style={styles.stepsContainer}>
            <Text style={styles.stepsTitle}>مراحل الخدمة</Text>
            {STATUS_STEPS.map((step, index) => {
              const isCompleted = index < currentStep;
              const isActive = index === currentStep;
              const isPending = index > currentStep;

              return (
                <View key={step.key}>
                  <View style={styles.stepRow}>
                    <View style={[
                      styles.stepDot,
                      isCompleted && styles.stepDotCompleted,
                      isActive && styles.stepDotActive,
                    ]}>
                      <Text style={styles.stepDotText}>
                        {isCompleted ? '✓' : step.icon}
                      </Text>
                    </View>
                    <View style={styles.stepContent}>
                      <Text style={[
                        styles.stepLabel,
                        isCompleted && styles.stepLabelCompleted,
                        isActive && styles.stepLabelActive,
                      ]}>
                        {step.label}
                      </Text>
                      <Text style={styles.stepDescription}>{step.description}</Text>
                      {isActive && step.key === 'car_picked_up' && (
                        <TouchableOpacity
                          style={[styles.photoButton, photoTaken && styles.photoButtonDone]}
                          onPress={() => setPhotoTaken(true)}
                        >
                          <Text style={styles.photoButtonText}>
                            {photoTaken ? '✅ تم التصوير' : '📷 التقاط صورة السيارة'}
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                  {index < STATUS_STEPS.length - 1 && (
                    <View style={[
                      styles.stepConnector,
                      isCompleted && styles.stepConnectorCompleted,
                    ]} />
                  )}
                </View>
              );
            })}
          </View>

          {/* Action Button */}
          <TouchableOpacity
            style={[
              styles.actionButton,
              currentStep === 2 && !photoTaken && styles.actionButtonPhoto,
            ]}
            onPress={handleNextStep}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={
                isLastStep
                  ? ['#10B981', '#059669']
                  : currentStep === 2 && !photoTaken
                  ? ['#3B82F6', '#2563EB']
                  : ['#D4A056', '#C4842D']
              }
              style={styles.actionButtonGradient}
            >
              <Text style={styles.actionButtonText}>
                {isLastStep
                  ? 'إنهاء الرحلة ✓'
                  : currentStep === 2 && !photoTaken
                  ? 'التقط صورة السيارة أولاً 📷'
                  : `${STATUS_STEPS[currentStep + 1]?.label || 'التالي'} ←`}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  headerTitle: { ...typography.h3, color: colors.text.primary },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239,68,68,0.15)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    gap: spacing.xs,
  },
  liveIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
  liveText: {
    ...typography.caption,
    color: '#EF4444',
    fontWeight: '700',
  },
  mapContainer: {
    height: 180,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    marginBottom: spacing.lg,
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(16,185,129,0.15)',
    borderRadius: borderRadius.xl,
  },
  mapIcon: { fontSize: 40, marginBottom: spacing.sm },
  mapText: { ...typography.body, color: colors.text.tertiary },
  customerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.glass,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.background.glassBorder,
    padding: spacing.lg,
    gap: spacing.md,
    marginBottom: spacing['2xl'],
  },
  customerAvatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: 'rgba(245,158,11,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  customerAvatarText: { ...typography.label, color: colors.role.winch },
  customerInfo: { flex: 1 },
  customerName: { ...typography.label, color: colors.text.primary },
  customerCar: { ...typography.bodySmall, color: colors.text.secondary },
  callButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(16,185,129,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  callIcon: { fontSize: 20 },
  chatButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(59,130,246,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatIcon: { fontSize: 20 },
  stepsContainer: {
    backgroundColor: colors.background.glass,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.background.glassBorder,
    padding: spacing.xl,
    marginBottom: spacing['2xl'],
  },
  stepsTitle: {
    ...typography.h4,
    color: colors.text.primary,
    marginBottom: spacing.xl,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  stepDot: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.06)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  stepDotCompleted: {
    backgroundColor: 'rgba(16,185,129,0.15)',
    borderColor: colors.status.success,
  },
  stepDotActive: {
    backgroundColor: 'rgba(212,160,86,0.15)',
    borderColor: colors.accent.primary,
    shadowColor: colors.accent.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
  },
  stepDotText: { fontSize: 16 },
  stepContent: { flex: 1, paddingTop: spacing.xs },
  stepLabel: {
    ...typography.label,
    color: colors.text.tertiary,
    marginBottom: 2,
  },
  stepLabelCompleted: { color: colors.status.success },
  stepLabelActive: { color: colors.accent.primary },
  stepDescription: {
    ...typography.bodySmall,
    color: colors.text.muted,
  },
  photoButton: {
    marginTop: spacing.sm,
    backgroundColor: 'rgba(59,130,246,0.12)',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(59,130,246,0.25)',
  },
  photoButtonDone: {
    backgroundColor: 'rgba(16,185,129,0.12)',
    borderColor: 'rgba(16,185,129,0.25)',
  },
  photoButtonText: {
    ...typography.labelSmall,
    color: colors.status.info,
  },
  stepConnector: {
    width: 2,
    height: 24,
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginLeft: 19,
    marginVertical: spacing.xs,
  },
  stepConnectorCompleted: {
    backgroundColor: colors.status.success,
  },
  actionButton: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    shadowColor: '#D4A056',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  actionButtonPhoto: {
    shadowColor: '#3B82F6',
  },
  actionButtonGradient: {
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: borderRadius.lg,
  },
  actionButtonText: {
    ...typography.button,
    color: colors.background.primary,
  },
});

export default ActiveJobScreen;
