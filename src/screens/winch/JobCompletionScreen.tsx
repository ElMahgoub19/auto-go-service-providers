import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';

interface Props {
  navigation: any;
  route: { params: { jobId: string } };
}

const JobCompletionScreen: React.FC<Props> = ({ navigation }) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(scaleAnim, { toValue: 1, friction: 4, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background.primary} />
      <LinearGradient colors={['#060E17', '#0D2B2D', '#0A1520']} style={styles.gradient}>
        <View style={styles.content}>
          {/* Success Icon */}
          <Animated.View style={[styles.successIcon, { transform: [{ scale: scaleAnim }] }]}>
            <LinearGradient colors={['#10B981', '#059669']} style={styles.successGradient}>
              <Text style={styles.checkIcon}>✓</Text>
            </LinearGradient>
          </Animated.View>

          <Text style={styles.title}>تمام يا معلم! 🎉</Text>
          <Text style={styles.subtitle}>الرحلة خلصت بنجاح</Text>

          {/* Invoice Summary */}
          <Animated.View style={[styles.invoiceCard, { opacity: fadeAnim }]}>
            <Text style={styles.invoiceTitle}>ملخص الفاتورة</Text>
            
            <View style={styles.invoiceRow}>
              <Text style={styles.invoiceLabel}>سحب السيارة</Text>
              <Text style={styles.invoiceValue}>٢٥٠ ج.م</Text>
            </View>
            <View style={styles.invoiceRow}>
              <Text style={styles.invoiceLabel}>المسافة (3.2 كم)</Text>
              <Text style={styles.invoiceValue}>١٠٠ ج.م</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.invoiceRow}>
              <Text style={styles.invoiceTotalLabel}>الإجمالي</Text>
              <Text style={styles.invoiceTotalValue}>٣٥٠ ج.م</Text>
            </View>
            <View style={styles.invoiceRow}>
              <Text style={styles.invoiceLabel}>عمولة أوتو جو (15%)</Text>
              <Text style={[styles.invoiceValue, { color: colors.status.error }]}>-٥٢.٥٠ ج.م</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.invoiceRow}>
              <Text style={styles.netLabel}>صافي الربح</Text>
              <Text style={styles.netValue}>٢٩٧.٥٠ ج.م</Text>
            </View>
          </Animated.View>

          {/* Actions */}
          <Animated.View style={[styles.actions, { opacity: fadeAnim }]}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => navigation.popToTop()}
            >
              <LinearGradient colors={['#D4A056', '#C4842D']} style={styles.primaryGradient}>
                <Text style={styles.primaryText}>رجوع للوحة التحكم</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background.primary },
  gradient: { flex: 1 },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing['3xl'],
  },
  successIcon: { marginBottom: spacing['2xl'] },
  successGradient: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 15,
  },
  checkIcon: { fontSize: 50, color: '#FFFFFF' },
  title: {
    ...typography.h2,
    color: colors.text.primary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.body,
    color: colors.text.secondary,
    marginBottom: spacing['3xl'],
  },
  invoiceCard: {
    width: '100%',
    backgroundColor: colors.background.glass,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.background.glassBorder,
    padding: spacing.xl,
    marginBottom: spacing['3xl'],
  },
  invoiceTitle: {
    ...typography.h4,
    color: colors.text.primary,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  invoiceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  invoiceLabel: {
    ...typography.body,
    color: colors.text.secondary,
  },
  invoiceValue: {
    ...typography.label,
    color: colors.text.primary,
  },
  invoiceTotalLabel: {
    ...typography.label,
    color: colors.text.primary,
  },
  invoiceTotalValue: {
    ...typography.h4,
    color: colors.text.primary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.divider,
    marginVertical: spacing.md,
  },
  netLabel: {
    ...typography.h4,
    color: colors.accent.emerald,
  },
  netValue: {
    ...typography.h3,
    color: colors.accent.emerald,
  },
  actions: { width: '100%' },
  primaryButton: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    shadowColor: '#D4A056',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  primaryGradient: {
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: borderRadius.lg,
  },
  primaryText: {
    ...typography.button,
    color: colors.background.primary,
  },
});

export default JobCompletionScreen;
