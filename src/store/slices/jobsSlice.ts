import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { WinchJob, WorkshopBooking, WinchJobStatus, BookingStatus } from '../../types';

interface JobsState {
  // Winch
  activeWinchJob: WinchJob | null;
  winchHistory: WinchJob[];
  incomingRequest: WinchJob | null;
  
  // Workshop
  activeBookings: WorkshopBooking[];
  bookingHistory: WorkshopBooking[];
  todayBookings: WorkshopBooking[];

  // Stats
  todayEarnings: number;
  todayJobCount: number;
  weeklyEarnings: number;
}

const initialState: JobsState = {
  activeWinchJob: null,
  winchHistory: [],
  incomingRequest: null,
  activeBookings: [],
  bookingHistory: [],
  todayBookings: [],
  todayEarnings: 0,
  todayJobCount: 0,
  weeklyEarnings: 0,
};

const jobsSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    // Winch actions
    setIncomingRequest(state, action: PayloadAction<WinchJob | null>) {
      state.incomingRequest = action.payload;
    },
    acceptWinchJob(state, action: PayloadAction<WinchJob>) {
      state.activeWinchJob = action.payload;
      state.incomingRequest = null;
    },
    updateWinchJobStatus(state, action: PayloadAction<WinchJobStatus>) {
      if (state.activeWinchJob) {
        state.activeWinchJob.status = action.payload;
      }
    },
    completeWinchJob(state) {
      if (state.activeWinchJob) {
        state.activeWinchJob.status = 'completed';
        state.winchHistory.unshift(state.activeWinchJob);
        state.todayEarnings += state.activeWinchJob.finalPrice || state.activeWinchJob.estimatedPrice;
        state.todayJobCount += 1;
        state.activeWinchJob = null;
      }
    },
    rejectWinchJob(state) {
      state.incomingRequest = null;
    },

    // Workshop actions
    setActiveBookings(state, action: PayloadAction<WorkshopBooking[]>) {
      state.activeBookings = action.payload;
    },
    setTodayBookings(state, action: PayloadAction<WorkshopBooking[]>) {
      state.todayBookings = action.payload;
    },
    updateBookingStatus(state, action: PayloadAction<{ bookingId: string; status: BookingStatus }>) {
      const idx = state.activeBookings.findIndex(b => b.id === action.payload.bookingId);
      if (idx !== -1) {
        state.activeBookings[idx].status = action.payload.status;
      }
      const todayIdx = state.todayBookings.findIndex(b => b.id === action.payload.bookingId);
      if (todayIdx !== -1) {
        state.todayBookings[todayIdx].status = action.payload.status;
      }
    },
    completeBooking(state, action: PayloadAction<string>) {
      const idx = state.activeBookings.findIndex(b => b.id === action.payload);
      if (idx !== -1) {
        const booking = state.activeBookings[idx];
        booking.status = 'completed';
        state.bookingHistory.unshift(booking);
        state.activeBookings.splice(idx, 1);
        state.todayEarnings += booking.totalPrice;
        state.todayJobCount += 1;
      }
    },

    // Stats
    setDailyStats(state, action: PayloadAction<{ earnings: number; jobCount: number }>) {
      state.todayEarnings = action.payload.earnings;
      state.todayJobCount = action.payload.jobCount;
    },
    setWeeklyEarnings(state, action: PayloadAction<number>) {
      state.weeklyEarnings = action.payload;
    },
  },
});

export const {
  setIncomingRequest,
  acceptWinchJob,
  updateWinchJobStatus,
  completeWinchJob,
  rejectWinchJob,
  setActiveBookings,
  setTodayBookings,
  updateBookingStatus,
  completeBooking,
  setDailyStats,
  setWeeklyEarnings,
} = jobsSlice.actions;

export default jobsSlice.reducer;
