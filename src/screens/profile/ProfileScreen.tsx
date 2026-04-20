import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { useAppSelector, useAppDispatch } from '../../hooks';
import { logout } from '../../store/slices/authSlice';

interface Props {
  navigation: any;
}

const ProfileScreen: React.FC<Props> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const provider = useAppSelector((state) => state.auth.provider);

  const isWinch = provider?.role === 'winch_driver';

  const menuItems = [
    { icon: '👤', label: 'تعديل البيانات الشخصية', screen: 'EditProfile' },
    { icon: '📄', label: 'المستندات والتوثيق', screen: 'Documents' },
    { icon: '📊', label: 'إحصائيات الأداء', screen: 'Stats' },
    { icon: '⭐', label: 'التقييمات', screen: 'Reviews' },
    { icon: '🔔', label: 'إعدادات الإشعارات', screen: 'Notifications' },
    { icon: '🆘', label: 'الدعم والمساعدة', screen: 'Support' },
    { icon: '📜', label: 'الشروط والأحكام', screen: 'Terms' },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background.primary} />
      <LinearGradient colors={['#0A1520', '#0D2B2D', '#0A1520']} style={styles.gradient}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Profile Card */}
          <View style={styles.profileCard}>
            <LinearGradient
              colors={['rgba(212,160,86,0.12)', 'rgba(13,43,45,0.5)']}
              style={styles.profileGradient}
            >
              <View style={styles.avatarLarge}>
                <LinearGradient colors={['#D4A056', '#C4842D']} style={styles.avatarGradient}>
                  <Text style={styles.avatarText}>
                    {(provider?.name || 'أ').charAt(0)}
                  </Text>
                </LinearGradient>
              </View>
              <Text style={styles.profileName}>{provider?.name || 'شريك أوتو جو'}</Text>
              <Text style={styles.profileRole}>
                {isWinch ? '🚜 سائق ونش' : '🏭 مركز صيانة'}
              </Text>
              
              <View style={styles.statsRow}>
                <View style={styles.profileStat}>
                  <Text style={styles.profileStatValue}>⭐ {provider?.rating || 4.8}</Text>
                  <Text style={styles.profileStatLabel}>التقييم</Text>
                </View>
                <View style={styles.profileStatDivider} />
                <View style={styles.profileStat}>
                  <Text style={styles.profileStatValue}>{provider?.totalJobs || 156}</Text>
                  <Text style={styles.profileStatLabel}>عملية</Text>
                </View>
                <View style={styles.profileStatDivider} />
                <View style={styles.profileStat}>
                  <View style={[
                    styles.verifiedBadge,
                    provider?.isVerified ? styles.verifiedBadgeActive : styles.verifiedBadgePending,
                  ]}>
                    <Text style={styles.verifiedText}>
                      {provider?.isVerified ? '✅ موثق' : '⏳ قيد المراجعة'}
                    </Text>
                  </View>
                  <Text style={styles.profileStatLabel}>الحالة</Text>
                </View>
              </View>
            </LinearGradient>
          </View>

          {/* Menu Items */}
          <View style={styles.menuContainer}>
            {menuItems.map((item, index) => (
              <TouchableOpacity key={index} style={styles.menuItem} activeOpacity={0.7}>
                <View style={styles.menuIconContainer}>
                  <Text style={styles.menuIcon}>{item.icon}</Text>
                </View>
                <Text style={styles.menuLabel}>{item.label}</Text>
                <Text style={styles.menuArrow}>←</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Logout */}
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() => dispatch(logout())}
            activeOpacity={0.8}
          >
            <Text style={styles.logoutIcon}>🚪</Text>
            <Text style={styles.logoutText}>تسجيل الخروج</Text>
          </TouchableOpacity>

          {/* Version */}
          <Text style={styles.version}>AutoGo Partners v1.0.0</Text>
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
    paddingBottom: 100,
  },
  // Profile Card
  profileCard: {
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    marginBottom: spacing['2xl'],
    borderWidth: 1,
    borderColor: 'rgba(212,160,86,0.15)',
  },
  profileGradient: {
    alignItems: 'center',
    paddingVertical: spacing['3xl'],
    paddingHorizontal: spacing.xl,
  },
  avatarLarge: { marginBottom: spacing.lg },
  avatarGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#D4A056',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  avatarText: { fontSize: 32, color: colors.background.primary, fontWeight: '700' },
  profileName: {
    ...typography.h3,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  profileRole: {
    ...typography.label,
    color: colors.text.secondary,
    marginBottom: spacing.xl,
  },
  statsRow: {
    flexDirection: 'row',
    width: '100%',
  },
  profileStat: {
    flex: 1,
    alignItems: 'center',
  },
  profileStatValue: {
    ...typography.h4,
    color: colors.text.primary,
    marginBottom: 2,
  },
  profileStatLabel: {
    ...typography.caption,
    color: colors.text.muted,
  },
  profileStatDivider: {
    width: 1,
    backgroundColor: colors.divider,
  },
  verifiedBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    marginBottom: 2,
  },
  verifiedBadgeActive: { backgroundColor: 'rgba(16,185,129,0.15)' },
  verifiedBadgePending: { backgroundColor: 'rgba(245,158,11,0.15)' },
  verifiedText: { ...typography.caption, color: colors.text.primary },
  // Menu
  menuContainer: {
    backgroundColor: colors.background.glass,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.background.glassBorder,
    overflow: 'hidden',
    marginBottom: spacing['2xl'],
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
    gap: spacing.md,
  },
  menuIconContainer: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.md,
    backgroundColor: 'rgba(255,255,255,0.06)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuIcon: { fontSize: 18 },
  menuLabel: {
    ...typography.body,
    color: colors.text.primary,
    flex: 1,
  },
  menuArrow: {
    ...typography.body,
    color: colors.text.muted,
  },
  // Logout
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    backgroundColor: 'rgba(239,68,68,0.08)',
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.2)',
    paddingVertical: spacing.lg,
    marginBottom: spacing.xl,
  },
  logoutIcon: { fontSize: 20 },
  logoutText: {
    ...typography.label,
    color: colors.status.error,
  },
  version: {
    ...typography.caption,
    color: colors.text.muted,
    textAlign: 'center',
    marginBottom: spacing['3xl'],
  },
});

export default ProfileScreen;
