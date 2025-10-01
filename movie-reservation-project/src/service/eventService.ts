import api from "./api";

// 이벤트 타입 정의
export interface AppEvent {
  id: number;
  title: string;
  imageUrl: string;
  startDate: string;
  endDate: string;
  category: string;
  content?: string;
}

// 이벤트 검색 매개변수 타입
interface EventSearchParams {
  category?: string;
  page?: number;
  limit?: number;
}

// 이벤트 검색 응답 타입
interface EventSearchResponse {
  events: AppEvent[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// 이벤트 서비스 클래스
class EventService {
  // 이벤트 목록 가져오기
  async getEvents(params: EventSearchParams = {}): Promise<EventSearchResponse> {
    try {
      const response = await api.get<EventSearchResponse>('/events', { params });
      return response.data;
    } catch (error) {
      console.error('이벤트 목록 조회 실패:', error);
      throw new Error('이벤트 목록을 불러오는데 실패했습니다.');
    }
  }
  
  // 이벤트 상세 정보 가져오기
  async getEventById(id: number): Promise<AppEvent> {
    try {
      const response = await api.get<AppEvent>(`/events/${id}`);
      return response.data;
    } catch (error) {
      console.error('이벤트 상세 정보 조회 실패:', error);
      throw new Error('이벤트 정보를 불러오는데 실패했습니다.');
    }
  }
}

// 싱글톤 인스턴스 생성 및 내보내기
const eventService = new EventService();
export default eventService;