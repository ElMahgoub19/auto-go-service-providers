import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Animated,
  Dimensions,
  Vibration,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';

const { width } = Dimensions.get('window');

interface Props {
  navigation: any;
  route: { params: { job: any } };
}

const RequestAcceptScreen: React.FC<Props> = ({ navigation, route }) => {
  const { job } = route.params;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(100)).current;
  const timerAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Vibration.vibrate([0, 500, 200, 500]);

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.1, duration: 800, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      ])
    ).start();

    Animated.spring(slideAnim, {
      toValue: 0,
      friction: 6,
      useNativeDriver: true,
    }).start();

    // Timer countdown (30 seconds to accept)
    Animated.timing(timerAnim, {
      toValue: 0,
      duration: 30000,
      useNativeDriver: false,
    }).start();
  }, []);

  const handleAccept = () => {
    navigation.replace('ActiveJob', { jobId: job.id });
  };

  const handleReject = () => {
    navigation.goBack();
  };

  const timerWidth = timerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <LinearGradient colors={['#0A1520', '#1A0E05', '#0A1520']} style={styles.gradient}>
        {/* Timer Bar */}
        <View style={styles.timerBar}>
          <Animated.View style={[styles.timerFill, { width: timerWidth }]} />
        </View>

        {/* Alert Header */}
        <Animated.View style={[styles.alertHeader, { transform: [{ scale: pulseAnim }] }]}>
          <View style={styles.alertIcon}>
            <Text style={styles.alertEmoji}>🚨</Text>
          </View>
          <Text style={styles.alertTitle}>طلب ونش جديد!</Text>
        </Animated.View>

        {/* Map Placeholder */}
        <View style={styles.mapContainer}>
          <LinearGradient
            colors={['rgba(245,158,11,0.1)', 'rgba(10,21,32,0.8)']}
            style={styles.mapPlaceholder}
          >
            <Text style={styles.mapIcon}>🗺️</Text>
            <Text style={styles.mapText}>خريطة الموقع</Text>
            <View style={styles.distanceBadge}>
              <Text style={styles.distanceValue}>{job.distance}</Text>
              <Text style={styles.distanceUnit}>كم</Text>
            </View>
          </LinearGradient>
        </View>

        {/* Request Details */}
        <Animated.View style={[styles.detailsCard, { transform: [{ translateY: slideAnim }] }]}>
          <LinearGradient
            colors={['rgba(30, 30, 30, 0.9)', 'rgba(13, 43, 45, 0.7)']}
            style={styles.detailsGradient}
          >
            {/* Customer Info */}
            <View style={styles.customerSection}>
              <View style={styles.customerAvatar}>
                <Text style={styles.customerAvatarText}>{job.customerName?.charAt(0) || 'م'}</Text>
              </View>
              <View style={styles.customerInfo}>
                <Text style={styles.customerName}>{job.customerName}</Text>
                <Text style={styles.carInfo}>{job.carType}</Text>
              </View>
              <View style={styles.priceBadge}>
                <Text style={styles.priceValue}>{job.estimatedPrice}</Text>
                <Text style={styles.priceUnit}>ج.م</Text>
              </View>
            </View>

            {/* Details Grid */}
            <View style={styles.detailsGrid}>
              <View style={styles.detailBox}>
                <Text style={styles.detailBoxIcon}>📍</Text>
                <Text style={styles.detailBoxLabel}>الموقع</Text>
                <Text style={styles.detailBoxValue}>{job.location}</Text>
              </View>
              <View style={styles.detailBox}>
                <Text style={styles.detailBoxIcon}>⚠️</Text>
                <Text style={styles.detailBoxLabel}>نوع العطل</Text>
                <Text style={styles.detailBoxValue}>{job.issueType}</Text>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.rejectButton} onPress={handleReject}>
                <Text style={styles.rejectButtonText}>رفض ✕</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.acceptButtonWrap} onPress={handleAccept}>
                <LinearGradient colors={['#D4A056', '#C4842D']} style={styles.acceptBtn}>
                  <Text style={styles.acceptBtnText}>قبول الطلب ←</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </Animated.View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  gradient: { flex: 1 },
  timerBar: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginTop: StatusBar.currentHeight ? StatusBar.currentHeight + 10 : 50,
    marginHorizontal: spacing.xl,
    borderRadius: 2,
    overflow: 'hidden',
  },
  timerFill: {
    height: '100%',
    backgroundColor: colors.role.winch,
    borderRadius: 2,
  },
  alertHeader: {
    alignItems: 'center',
    paddingTop: spacing['3xl'],
    paddingBottom: spacing.xl,
  },
  alertIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(245,158,11,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
    borderWidth: 2,
    borderColor: 'rgba(245,158,11,0.3)',
  },
  alertEmoji: { fontSize: 40 },
  alertTitle: {
    ...typography.h2,
    color: colors.role.winch,
    textAlign: 'center',
  },
  mapContainer: {
    flex: 1,
    marginHorizontal: spacing.xl,
    marginBottom: spacing.lg,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: 'rgba(245,158,11,0.15)',
  },
  mapIcon: { fontSize: 48, marginBottom: spacing.md },
  mapText: {
    ...typography.body,
    color: colors.text.tertiary,
  },
  distanceBadge: {
    flexDirection: 'row',
    alignItems: 'baseline',
    backgroundColor: 'rgba(245,158,11,0.15)',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.full,
    marginTop: spacing.lg,
    gap: spacing.xs,
  },
  distanceValue: {
    ...typography.h2,
    color: colors.role.winch,
  },
  distanceUnit: {
    ...typography.label,
    color: colors.role.winch,
  },
  detailsCard: {
    borderTopLeftRadius: borderRadius['2xl'],
    borderTopRightRadius: borderRadius['2xl'],
    overflow: 'hidden',
  },
  detailsGradient: {
    padding: spacing.xl,
    paddingBottom: spacing['4xl'],
    borderTopLeftRadius: borderRadius['2xl'],
    borderTopRightRadius: borderRadius['2xl'],
  },
  customerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  customerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(245,158,11,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  customerAvatarText: { ...typography.h4, color: colors.role.winch },
  customerInfo: { flex: 1 },
  customerName: { ...typography.h4, color: colors.text.primary },
  carInfo: { ...typography.bodySmall, color: colors.text.secondary },
  priceBadge: {
    alignItems: 'center',
    backgroundColor: 'rgba(212,160,86,0.12)',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
  },
  priceValue: { ...typography.h3, color: colors.accent.primary },
  priceUnit: { ...typography.caption, color: colors.accent.primary },
  detailsGrid: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  detailBox: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  detailBoxIcon: { fontSize: 16, marginBottom: spacing.xs },
  detailBoxLabel: {
    ...typography.caption,
    color: colors.text.muted,
    marginBottom: 2,
  },
  detailBoxValue: {
    ...typography.bodySmall,
    color: colors.text.primary,
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  rejectButton: {
    flex: 1,
    height: 54,
    borderRadius: borderRadius.lg,
    backgroundColor: 'rgba(239,68,68,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rejectButtonText: { ...typography.button, color: colors.status.error },
  acceptButtonWrap: {
    flex: 2,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    shadowColor: '#D4A056',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  acceptBtn: {
    height: 54,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: borderRadius.lg,
  },
  acceptBtnText: { ...typography.button, color: colors.background.primary },
});

export default RequestAcceptScreen;
