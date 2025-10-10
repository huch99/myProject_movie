export interface Movie {
  id: number;
  title: string;
  originalTitle?: string; // title_en과 매칭
  posterUrl: string;      // poster_url과 매칭
  backdropUrl?: string;   // background_url과 매칭
  releaseDate: string;    // release_date와 매칭
  endDate?: string;       // DB의 end_date와 매칭
  runtime: number;        // running_time과 매칭
  rating: number;         // VARCHAR에서 숫자로 변환 필요
  genres: string[];       // genre 문자열을 배열로 분리 필요
  director?: string;
  actors?: string[];      // TEXT를 배열로 분리 필요
  synopsis: string;
  ageRating: string;
  isShowing: boolean;     // status 값에 따라 설정
}

export interface Review {
  id: number;
  movieId: number;
  userId: number;
  username: string;
  rating: number;
  content: string;
  createdAt: string;
}