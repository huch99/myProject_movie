import type { ScreenSeatLayout, Theater, TheaterSchedule } from "../types/theater.types";
import api from "./api";

// 극장 검색 매개변수 타입
interface TheaterSearchParams {
  query?: string;
  location?: string;
  page?: number;
  limit?: number;
}

// 극장 검색 응답 타입
interface TheaterSearchResponse {
  theaters: Theater[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// 극장 서비스 클래스
class TheaterService {
  // 극장 목록 가져오기 (검색 조건 포함)
  async getTheaters(params: TheaterSearchParams = {}): Promise<TheaterSearchResponse> {
    try {
      const response = await api.get<TheaterSearchResponse>('/theaters', { params });
      return response.data;
    } catch (error) {
      console.error('극장 목록 조회 실패:', error);
      throw new Error('극장 목록을 불러오는데 실패했습니다.');
    }
  }

  // 극장 상세 정보 가져오기
  async getTheaterById(id: number): Promise<Theater> {
    try {
      const response = await api.get<Theater>(`/theaters/${id}`);
      return response.data;
    } catch (error) {
      console.error('극장 상세 정보 조회 실패:', error);
      throw new Error('극장 정보를 불러오는데 실패했습니다.');
    }
  }

  // 지역별 극장 목록 가져오기
  async getTheatersByLocation(location: string): Promise<Theater[]> {
    try {
      const response = await api.get<Theater[]>('/theaters', {
        params: { location }
      });
      return response.data;
    } catch (error) {
      console.error('지역별 극장 목록 조회 실패:', error);
      throw new Error('지역별 극장 목록을 불러오는데 실패했습니다.');
    }
  }

  // 특별관 보유 극장 목록 가져오기
  async getTheatersWithSpecialScreens(screenType: string): Promise<Theater[]> {
    try {
      const response = await api.get<Theater[]>('/theaters/special', {
        params: { screenType }
      });
      return response.data;
    } catch (error) {
      console.error('특별관 보유 극장 목록 조회 실패:', error);
      throw new Error('특별관 보유 극장 목록을 불러오는데 실패했습니다.');
    }
  }

  // 지역 목록 가져오기
  async getLocations(): Promise<string[]> {
    try {
      const response = await api.get<string[]>('/theaters/locations');
      return response.data;
    } catch (error) {
      console.error('지역 목록 조회 실패:', error);
      throw new Error('지역 목록을 불러오는데 실패했습니다.');
    }
  }

  // 특정 영화 상영 극장 목록 가져오기
  async getTheatersByMovie(movieId: number): Promise<Theater[]> {
    try {
      const response = await api.get<Theater[]>(`/movies/${movieId}/theaters`);
      return response.data;
    } catch (error) {
      console.error('영화 상영 극장 목록 조회 실패:', error);
      throw new Error('영화 상영 극장 목록을 불러오는데 실패했습니다.');
    }
  }

  // 극장 상영 일정 가져오기
  async getTheaterSchedule(theaterId: number, date: string): Promise<TheaterSchedule> {
    try {
      const response = await api.get<TheaterSchedule>(`/theaters/${theaterId}/schedule`, {
        params: { date }
      });
      return response.data;
    } catch (error) {
      console.error('극장 상영 일정 조회 실패:', error);
      throw new Error('극장 상영 일정을 불러오는데 실패했습니다.');
    }
  }

  // 상영관 정보 가져오기
  async getScreens(theaterId: number): Promise<Screen[]> {
    try {
      const response = await api.get<Screen[]>(`/theaters/${theaterId}/screens`);
      return response.data;
    } catch (error) {
      console.error('상영관 정보 조회 실패:', error);
      throw new Error('상영관 정보를 불러오는데 실패했습니다.');
    }
  }

  // 상영관 좌석 배치도 가져오기
  async getScreenSeatLayout(screenId: number): Promise<ScreenSeatLayout> {
    try {
      const response = await api.get<ScreenSeatLayout>(`/screens/${screenId}/layout`);
      return response.data;
    } catch (error) {
      console.error('상영관 좌석 배치도 조회 실패:', error);
      throw new Error('상영관 좌석 배치도를 불러오는데 실패했습니다.');
    }
  }
}

// 싱글톤 인스턴스 생성 및 내보내기
const theaterService = new TheaterService();
export default theaterService;