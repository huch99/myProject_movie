import type { Movie } from "./movie.types";

export interface Theater {
  id: number;
  name: string;
  location: string; // 지역 (예: 서울, 경기, 인천 등)
  address: string;
  contact: string;
  facilities: string[]; // 편의시설 목록
  specialScreens: string[]; // 특별관 목록 (IMAX, 4DX 등)
  imageUrl: string;
  description?: string;
  features?: string[];
  phone?: string; 
  parking?: string;
  transportation?: string;
  capacity?: number;
  type?: string;
}

export interface TheaterScreen {
  id: number;
  name: string;
  capacity: number; // capacity가 필수 속성이면 이렇게, 옵셔널이면 capacity?: number
  type: string;     // type이 필수 속성이면 이렇게, 옵셔널이면 type?: string
  theaterId?: number; // 오류 메시지에 언급된 theaterId를 추가. API 응답에 따라 옵셔널이거나 필수일 수 있습니다.
  // API 응답에 'screen' 객체가 가지고 있는 다른 모든 속성들을 여기에 추가해 주세요.
}

export interface ScreenSeatLayout {
  screenId: number;
  layout: SeatPosition[][]; // 2차원 좌석 배열
}

export interface SeatPosition {
  id: string; // 예: "A1", "B5"
  row: string; // 예: "A", "B"
  column: number; // 예: 1, 2, 3
  type: 'regular' | 'premium' | 'disabled' | 'empty'; // 좌석 타입
  status: 'available' | 'occupied' | 'selected' | 'disabled'; // 좌석 상태
}

export interface TheaterSchedule {
  theaterId: number;
  date: string;
  schedules: Array<{
    id: number;
    movieId: number;
    movieTitle: string;
    screenName: string;
    startTime: string;
    endTime: string;
    availableSeats: number;
    totalSeats: number;
  }>;
}

export interface MovieSchedule {
  movie: Movie;
  screenings: Screening[];
}

export interface Screening {
  id: number;
  movieId: number;
  screenId: number;
  theaterId: number;
  startTime: string; // ISO 형식 (YYYY-MM-DDTHH:mm:ss)
  endTime: string; // ISO 형식 (YYYY-MM-DDTHH:mm:ss)
  price: number;
  availableSeats: number;
  totalSeats: number;
  screenType: string | null; // IMAX, 4DX, 일반 등
}