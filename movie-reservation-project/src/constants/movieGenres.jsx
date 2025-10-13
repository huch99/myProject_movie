// 영화 장르 상수
/**
 * 영화 장르 상수 정의
 * 영화 장르 ID와 이름을 매핑하여 일관된 사용을 보장합니다.
 */

// 장르 ID와 이름 매핑
const MOVIE_GENRES = {
  // 주요 장르
  ACTION: { id: 28, name: '액션' },
  ADVENTURE: { id: 12, name: '모험' },
  ANIMATION: { id: 16, name: '애니메이션' },
  COMEDY: { id: 35, name: '코미디' },
  CRIME: { id: 80, name: '범죄' },
  DOCUMENTARY: { id: 99, name: '다큐멘터리' },
  DRAMA: { id: 18, name: '드라마' },
  FAMILY: { id: 10751, name: '가족' },
  FANTASY: { id: 14, name: '판타지' },
  HISTORY: { id: 36, name: '역사' },
  HORROR: { id: 27, name: '공포' },
  MUSIC: { id: 10402, name: '음악' },
  MYSTERY: { id: 9648, name: '미스터리' },
  ROMANCE: { id: 10749, name: '로맨스' },
  SCIENCE_FICTION: { id: 878, name: 'SF' },
  THRILLER: { id: 53, name: '스릴러' },
  WAR: { id: 10752, name: '전쟁' },
  WESTERN: { id: 37, name: '서부' },
};

// ID로 장르 찾기
const getGenreById = (id) => {
  return Object.values(MOVIE_GENRES).find(genre => genre.id === id) || { id, name: '기타' };
};

// 이름으로 장르 찾기
const getGenreByName = (name) => {
  return Object.values(MOVIE_GENRES).find(genre => genre.name === name) || null;
};

// ID 배열을 장르 이름 배열로 변환
const getGenreNamesByIds = (ids) => {
  if (!ids || !Array.isArray(ids)) return [];
  return ids.map(id => getGenreById(id).name);
};

// 장르 목록 배열 (필터링 등에 사용)
const GENRE_LIST = Object.values(MOVIE_GENRES).sort((a, b) => a.name.localeCompare(b.name, 'ko'));

export { 
  MOVIE_GENRES, 
  GENRE_LIST,
  getGenreById, 
  getGenreByName, 
  getGenreNamesByIds 
};

export default MOVIE_GENRES;