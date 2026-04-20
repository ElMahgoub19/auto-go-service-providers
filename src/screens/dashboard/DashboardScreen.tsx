import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Animated,
  Dimensions,
  Switch,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { useAppSelector, useAppDispatch } from '../../hooks';
import { toggleOnline } from '../../store/slices/authSlice';

const { width } = Dimensions.get('window');

interface Props {
  navigation: any;
}

// Mock data for active requests
const mockWinchRequests = [
  {
    id: '1',
    customerName: 'محمود عبدالله',
    carType: 'BMW 320i',
    distance: 3.2,
    location: 'المعادي - شارع 9',
    issueType: 'عطل في الموتور',
    estimatedPrice: 350,
    timeAgo: 'منذ دقيقتين',
  },
  {
    id: '2',
    customerName: 'أحمد سمير',
    carType: 'Mercedes C200',
    distance: 5.8,
    location: 'مدينة نصر - عباس العقاد',
    issueType: 'بانشر',
    estimatedPrice: 200,
    timeAgo: 'منذ 5 دقائق',
  },
];

const mockWorkshopBookings = [
  {
    id: '1',
    customerName: 'كريم حسن',
    carType: 'Toyota Corolla 2023',
    service: 'تغيير زيت + فلتر',
    scheduledTime: '10:00 ص',
    status: 'confirmed',
    statusLabel: 'مؤكد',
  },
  {
    id: '2',
    customerName: 'سارة أحمد',
    carType: 'Hyundai Accent 2022',
    service: 'فحص شامل',
    scheduledTime: '11:30 ص',
    status: 'in_progress',
    statusLabel: 'جاري العمل',
  },
  {
    id: '3',
    customerName: 'عمر خالد',
    carType: 'Nissan Sunny 2021',
    service: 'تغيير تيل فرامل',
    scheduledTime: '02:00 م',
    status: 'pending',
    statusLabel: 'في الانتظار',
  },
];

const DashboardScreen: React.FC<Props> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const provider = useAppSelector((state) => state.auth.provider);
  const role = provider?.role || 'winch_driver';
  const isOnline = provider?.isOnline || false;
  const isWinch = role === 'winch_driver';

  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    // Start layout animations without mixing native drivers in parallel to avoid hangs
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleToggleOnline = () => {
    dispatch(toggleOnline());
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return colors.status.info;
      case 'in_progress': return colors.status.warning;
      case 'pending': return colors.status.pending;
      default: return colors.text.tertiary;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background.primary} />
      <LinearGradient colors={['#0A1520', '#0D2B2D', '#0A1520']} style={styles.gradient}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Header */}
          <Animated.View style={[styles.header, { transform: [{ translateY: slideAnim }] }]}>
            <View style={styles.headerTop}>
              <View>
                <Text style={styles.greeting}>أهلاً يا</Text>
                <Text style={styles.name}>{provider?.name || 'شريك أوتو جو'}</Text>
              </View>
              <TouchableOpacity style={styles.avatarContainer}>
                <LinearGradient colors={['#D4A056', '#C4842D']} style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {(provider?.name || 'أ').charAt(0)}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {/* Online Toggle */}
            <TouchableOpacity
              style={[styles.onlineToggle, isOnline && styles.onlineToggleActive]}
              onPress={handleToggleOnline}
              activeOpacity={0.8}
            >
              <View style={[styles.statusDot, isOnline && styles.statusDotOnline]} />
              <Text style={[styles.onlineText, isOnline && styles.onlineTextActive]}>
                {isOnline ? 'متاح لاستقبال الطلبات' : 'غير متاح حالياً'}
              </Text>
              <Switch
                value={isOnline}
                onValueChange={handleToggleOnline}
                trackColor={{ false: 'rgba(255,255,255,0.1)', true: 'rgba(16,185,129,0.3)' }}
                thumbColor={isOnline ? colors.status.online : '#6B7280'}
                style={styles.switch}
              />
            </TouchableOpacity>
          </Animated.View>

          {/* Stats Cards */}
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <LinearGradient
                colors={['rgba(212,160,86,0.12)', 'rgba(212,160,86,0.04)']}
                style={styles.statGradient}
              >
                <Text style={styles.statIcon}>💰</Text>
                <Text style={styles.statValue}>١,٢٠٠</Text>
                <Text style={styles.statUnit}>ج.م</Text>
                <Text style={styles.statLabel}>أرباح اليوم</Text>
              </LinearGradient>
            </View>
            <View style={styles.statCard}>
              <LinearGradient
                colors={['rgba(16,185,129,0.12)', 'rgba(16,185,129,0.04)']}
                style={styles.statGradient}
              >
                <Text style={styles.statIcon}>{isWinch ? '🚜' : '🔧'}</Text>
                <Text style={styles.statValue}>٧</Text>
                <Text style={styles.statUnit}>عملية</Text>
                <Text style={styles.statLabel}>{isWinch ? 'رحلات اليوم' : 'حجوزات اليوم'}</Text>
              </LinearGradient>
            </View>
            <View style={styles.statCard}>
              <LinearGradient
                colors={['rgba(245,158,11,0.12)', 'rgba(245,158,11,0.04)']}
                style={styles.statGradient}
              >
                <Text style={styles.statIcon}>⭐</Text>
                <Text style={styles.statValue}>٤.٨</Text>
                <Text style={styles.statUnit}>من ٥</Text>
                <Text style={styles.statLabel}>التقييم</Text>
              </LinearGradient>
            </View>
          </View>

          {/* Active Requests / Bookings */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {isWinch ? '🔔 طلبات جديدة' : '📅 حجوزات اليوم'}
            </Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>عرض الكل</Text>
            </TouchableOpacity>
          </View>

          {isWinch ? (
            // Winch Requests
            mockWinchRequests.map((req) => (
              <TouchableOpacity
                key={req.id}
                style={styles.requestCard}
                activeOpacity={0.85}
                onPress={() => navigation.navigate('RequestAccept', { job: req })}
              >
                <LinearGradient
                  colors={['rgba(245,158,11,0.08)', 'rgba(10,21,32,0.6)']}
                  style={styles.requestGradient}
                >
                  <View style={styles.requestHeader}>
                    <View style={styles.requestCustomer}>
                      <View style={styles.customerAvatar}>
                        <Text style={styles.customerAvatarText}>
                          {req.customerName.charAt(0)}
                        </Text>
                      </View>
                      <View>
                        <Text style={styles.customerName}>{req.customerName}</Text>
                        <Text style={styles.carType}>{req.carType}</Text>
                      </View>
                    </View>
                    <Text style={styles.timeAgo}>{req.timeAgo}</Text>
                  </View>

                  <View style={styles.requestDetails}>
                    <View style={styles.detailItem}>
                      <Text style={styles.detailIcon}>📍</Text>
                      <Text style={styles.detailText}>{req.location}</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Text style={styles.detailIcon}>⚠️</Text>
                      <Text style={styles.detailText}>{req.issueType}</Text>
                    </View>
                  </View>

                  <View style={styles.requestFooter}>
                    <View style={styles.distanceBadge}>
                      <Text style={styles.distanceText}>{req.distance} كم</Text>
                    </View>
                    <Text style={styles.priceText}>{req.estimatedPrice} ج.م</Text>
                    <TouchableOpacity style={styles.acceptButton}>
                      <Text style={styles.acceptButtonText}>قبول ←</Text>
                    </TouchableOpacity>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            ))
          ) : (
            // Workshop Bookings
            mockWorkshopBookings.map((booking) => (
              <TouchableOpacity
                key={booking.id}
                style={styles.bookingCard}
                activeOpacity={0.85}
                onPress={() => navigation.navigate('CarReception', { bookingId: booking.id })}
              >
                <View style={styles.bookingTime}>
                  <Text style={styles.bookingTimeText}>{booking.scheduledTime}</Text>
                </View>
                <View style={styles.bookingInfo}>
                  <Text style={styles.bookingCustomer}>{booking.customerName}</Text>
                  <Text style={styles.bookingCar}>{booking.carType}</Text>
                  <Text style={styles.bookingService}>{booking.service}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(booking.status)}20` }]}>
                  <View style={[styles.statusIndicator, { backgroundColor: getStatusColor(booking.status) }]} />
                  <Text style={[styles.statusText, { color: getStatusColor(booking.status) }]}>
                    {booking.statusLabel}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          )}

          {/* Quick Actions */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>⚡ إجراءات سريعة</Text>
          </View>
          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.quickAction} onPress={() => navigation.navigate('Wallet')}>
              <LinearGradient
                colors={['rgba(212,160,86,0.12)', 'rgba(212,160,86,0.04)']}
                style={styles.quickActionGradient}
              >
                <Text style={styles.quickActionIcon}>💳</Text>
                <Text style={styles.quickActionText}>المحفظة</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickAction}>
              <LinearGradient
                colors={['rgba(16,185,129,0.12)', 'rgba(16,185,129,0.04)']}
                style={styles.quickActionGradient}
              >
                <Text style={styles.quickActionIcon}>📊</Text>
                <Text style={styles.quickActionText}>الإحصائيات</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickAction}>
              <LinearGradient
                colors={['rgba(59,130,246,0.12)', 'rgba(59,130,246,0.04)']}
                style={styles.quickActionGradient}
              >
                <Text style={styles.quickActionIcon}>💬</Text>
                <Text style={styles.quickActionText}>الرسائل</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickAction}>
              <LinearGradient
                colors={['rgba(239,68,68,0.12)', 'rgba(239,68,68,0.04)']}
                style={styles.quickActionGradient}
              >
                <Text style={styles.quickActionIcon}>🆘</Text>
                <Text style={styles.quickActionText}>الدعم</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
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
  // Header
  header: { marginBottom: spacing['2xl'] },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  greeting: {
    ...typography.body,
    color: colors.text.secondary,
  },
  name: {
    ...typography.h3,
    color: colors.text.primary,
  },
  avatarContainer: {},
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    ...typography.h4,
    color: colors.background.primary,
  },
  // Online Toggle
  onlineToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  onlineToggleActive: {
    borderColor: 'rgba(16,185,129,0.3)',
    backgroundColor: 'rgba(16,185,129,0.05)',
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.status.offline,
  },
  statusDotOnline: {
    backgroundColor: colors.status.online,
    shadowColor: colors.status.online,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 6,
    elevation: 4,
  },
  onlineText: {
    ...typography.label,
    color: colors.text.tertiary,
    flex: 1,
  },
  onlineTextActive: {
    color: colors.status.online,
  },
  switch: { transform: [{ scaleX: 0.85 }, { scaleY: 0.85 }] },
  // Stats
  statsRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing['2xl'],
  },
  statCard: { flex: 1, borderRadius: borderRadius.lg, overflow: 'hidden' },
  statGradient: {
    padding: spacing.lg,
    alignItems: 'center',
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  statIcon: { fontSize: 22, marginBottom: spacing.sm },
  statValue: {
    ...typography.h3,
    color: colors.text.primary,
  },
  statUnit: {
    ...typography.caption,
    color: colors.text.tertiary,
    marginBottom: spacing.xs,
  },
  statLabel: {
    ...typography.caption,
    color: colors.text.muted,
    textAlign: 'center',
  },
  // Section Header
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.h4,
    color: colors.text.primary,
  },
  seeAll: {
    ...typography.labelSmall,
    color: colors.accent.primary,
  },
  // Request Card (Winch)
  requestCard: {
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(245,158,11,0.15)',
  },
  requestGradient: { padding: spacing.lg },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  requestCustomer: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  customerAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(245,158,11,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  customerAvatarText: {
    ...typography.label,
    color: colors.role.winch,
  },
  customerName: {
    ...typography.label,
    color: colors.text.primary,
  },
  carType: {
    ...typography.bodySmall,
    color: colors.text.secondary,
  },
  timeAgo: {
    ...typography.caption,
    color: colors.text.muted,
  },
  requestDetails: { gap: spacing.sm, marginBottom: spacing.lg },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  detailIcon: { fontSize: 14 },
  detailText: {
    ...typography.bodySmall,
    color: colors.text.secondary,
  },
  requestFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  distanceBadge: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  distanceText: {
    ...typography.labelSmall,
    color: colors.text.secondary,
  },
  priceText: {
    ...typography.h4,
    color: colors.accent.primary,
  },
  acceptButton: {
    backgroundColor: colors.accent.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
  },
  acceptButtonText: {
    ...typography.label,
    color: colors.background.primary,
  },
  // Booking Card (Workshop)
  bookingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.glass,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.background.glassBorder,
    padding: spacing.lg,
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  bookingTime: {
    backgroundColor: 'rgba(16,185,129,0.1)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    minWidth: 65,
    alignItems: 'center',
  },
  bookingTimeText: {
    ...typography.labelSmall,
    color: colors.accent.emerald,
  },
  bookingInfo: { flex: 1 },
  bookingCustomer: {
    ...typography.label,
    color: colors.text.primary,
  },
  bookingCar: {
    ...typography.bodySmall,
    color: colors.text.secondary,
  },
  bookingService: {
    ...typography.caption,
    color: colors.accent.primary,
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  statusIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    ...typography.caption,
    fontWeight: '600',
  },
  // Quick Actions
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  quickAction: {
    width: (width - spacing.xl * 2 - spacing.md) / 2,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  quickActionGradient: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  quickActionIcon: { fontSize: 28, marginBottom: spacing.sm },
  quickActionText: {
    ...typography.label,
    color: colors.text.primary,
  },
});

export default DashboardScreen;
