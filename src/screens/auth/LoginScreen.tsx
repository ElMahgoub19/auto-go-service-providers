import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { UserRole } from '../../types';

interface Props {
  navigation: any;
  route: { params: { role: UserRole } };
}

const LoginScreen: React.FC<Props> = ({ navigation, route }) => {
  const { role } = route.params;
  const [phone, setPhone] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const roleLabel = role === 'winch_driver' ? 'سائق الونش' : 'مركز الصيانة';
  const roleColor = role === 'winch_driver' ? colors.role.winch : colors.role.workshop;

  const formatPhone = (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, '');
    if (cleaned.length <= 11) {
      setPhone(cleaned);
    }
  };

  const handleLogin = () => {
    if (phone.length !== 11) {
      // Shake animation
      Animated.sequence([
        Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
      ]).start();
      return;
    }
    navigation.navigate('OTPVerification', { phone, role });
  };

  return (
    <LinearGradient colors={['#060E17', '#0D2B2D', '#0A1520']} style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        {/* Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>→</Text>
        </TouchableOpacity>

        {/* Header */}
        <View style={styles.header}>
          <View style={[styles.roleBadge, { backgroundColor: `${roleColor}20` }]}>
            <Text style={[styles.roleBadgeText, { color: roleColor }]}>
              {role === 'winch_driver' ? '🚜' : '🏭'} {roleLabel}
            </Text>
          </View>
          <Text style={styles.title}>تسجيل الدخول</Text>
          <Text style={styles.subtitle}>
            ادخل رقم موبايلك وهنبعتلك كود التفعيل
          </Text>
        </View>

        {/* Phone Input */}
        <Animated.View
          style={[
            styles.inputContainer,
            isFocused && styles.inputFocused,
            { transform: [{ translateX: shakeAnim }] },
          ]}
        >
          <View style={styles.countryCode}>
            <Text style={styles.flag}>🇪🇬</Text>
            <Text style={styles.countryCodeText}>20+</Text>
          </View>
          <View style={styles.inputDivider} />
          <TextInput
            style={styles.input}
            placeholder="01X XXXX XXXX"
            placeholderTextColor={colors.input.placeholder}
            value={phone}
            onChangeText={formatPhone}
            keyboardType="phone-pad"
            maxLength={11}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            textAlign="left"
          />
        </Animated.View>

        {phone.length > 0 && phone.length < 11 && (
          <Text style={styles.hint}>الرقم لازم يكون 11 رقم</Text>
        )}

        {/* Login Button */}
        <TouchableOpacity
          style={[styles.loginButton, phone.length !== 11 && styles.loginButtonDisabled]}
          onPress={handleLogin}
          activeOpacity={0.8}
          disabled={phone.length !== 11}
        >
          <LinearGradient
            colors={phone.length === 11 ? ['#D4A056', '#C4842D'] : ['rgba(212,160,86,0.3)', 'rgba(196,132,45,0.3)']}
            style={styles.loginButtonGradient}
          >
            <Text style={[styles.loginButtonText, phone.length !== 11 && styles.loginButtonTextDisabled]}>
              ابعتلي الكود
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Info */}
        <View style={styles.infoBox}>
          <Text style={styles.infoIcon}>💡</Text>
          <Text style={styles.infoText}>
            هنبعتلك رسالة SMS فيها كود مكون من 4 أرقام للتحقق من رقمك
          </Text>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight + 20 : 60,
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
    marginBottom: spacing['3xl'],
  },
  backArrow: {
    color: colors.text.primary,
    fontSize: 20,
  },
  header: {
    marginBottom: spacing['4xl'],
  },
  roleBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    marginBottom: spacing.lg,
  },
  roleBadgeText: {
    ...typography.labelSmall,
  },
  title: {
    ...typography.h1,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    color: colors.text.secondary,
    lineHeight: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.input.background,
    borderRadius: borderRadius.lg,
    borderWidth: 1.5,
    borderColor: colors.input.border,
    paddingHorizontal: spacing.lg,
    height: 60,
    marginBottom: spacing.md,
  },
  inputFocused: {
    borderColor: colors.accent.primary,
    shadowColor: colors.accent.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 5,
  },
  countryCode: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  flag: {
    fontSize: 22,
  },
  countryCodeText: {
    ...typography.label,
    color: colors.text.primary,
  },
  inputDivider: {
    width: 1,
    height: 28,
    backgroundColor: colors.divider,
    marginHorizontal: spacing.md,
  },
  input: {
    flex: 1,
    ...typography.bodyLarge,
    color: colors.text.primary,
    letterSpacing: 2,
  },
  hint: {
    ...typography.bodySmall,
    color: colors.status.warning,
    marginBottom: spacing.lg,
    marginTop: -spacing.sm,
  },
  loginButton: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    marginTop: spacing.lg,
    shadowColor: '#D4A056',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  loginButtonDisabled: {
    shadowOpacity: 0,
    elevation: 0,
  },
  loginButtonGradient: {
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginButtonText: {
    ...typography.button,
    color: colors.button.primaryText,
  },
  loginButtonTextDisabled: {
    color: 'rgba(255,255,255,0.4)',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    marginTop: spacing['3xl'],
    backgroundColor: 'rgba(212, 160, 86, 0.08)',
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(212, 160, 86, 0.15)',
  },
  infoIcon: {
    fontSize: 18,
    marginTop: 2,
  },
  infoText: {
    ...typography.bodySmall,
    color: colors.text.secondary,
    flex: 1,
    lineHeight: 20,
  },
});

export default LoginScreen;
