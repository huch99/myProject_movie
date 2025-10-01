import type { Movie } from "./movie.types";
import type { TheaterScreen, Screening, Theater } from "./theater.types";

export interface Seat {
  id: string; // 예: "A1", "B3" 등
  row: string;
  column: number;
  status: 'available' | 'occupied' | 'selected' | 'disabled';
  seatType?: 'regular' | 'premium' | 'couple' | 'wheelchair';
}

export interface Ticket {
  id: number;
  screeningId: number;
  userId: number;
  seats: string[];
  ticketTypes: {
    adult: number;
    teen: number;
    child: number;
  };
  totalPrice: number;
  paymentStatus: 'pending' | 'completed' | 'cancelled';
  bookingDate: string;
  movie?: {
    id: number;
    title: string;
    posterUrl: string;
  };
  theater?: {
    name: string;
    screen: string;
  };
  screening?: {
    movie : Movie;
    theater : Theater;
    screen : TheaterScreen;
    startTime: string | undefined;
  };
}

export interface BookingState {
  selectedMovie: Movie | null;
  selectedTheater: Theater | null;
  selectedDate: string | null;
  selectedScreening: Screening | null;
  selectedSeats: Seat[];
  ticketTypes: {
    adult: number;
    teen: number;
    child: number;
  };
  totalPrice: number;
  currentStep: number;
}