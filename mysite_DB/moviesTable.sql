-- 영화 정보 테이블 (movies)
CREATE TABLE movies (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,          -- 영화 고유 ID
    title VARCHAR(255) NOT NULL,                    -- 한국어 제목
    title_en VARCHAR(255),                          -- 원제 (프론트엔드의 originalTitle)
    director VARCHAR(100),                          -- 감독
    actors TEXT,                                    -- 출연진 (프론트엔드의 actors[] - 백엔드에서 콤마(,)로 분리/조인)
    genre TEXT,                                     -- 장르 (프론트엔드의 genres[] - 백엔드에서 콤마(,)로 분리/조인)
    running_time INT NOT NULL,                      -- 상영 시간 (분 단위, 프론트엔드의 runtime)
    release_date DATE NOT NULL,                     -- 개봉일
    end_date DATE,                                  -- 상영 종료일 (프론트엔드의 endDate)
    rating DECIMAL(3,1) NOT NULL,                   -- 평점 (0.0~10.0, 프론트엔드의 rating - 숫자 타입)
    synopsis TEXT,                                  -- 줄거리
    poster_url VARCHAR(255),                        -- 포스터 이미지 URL (프론트엔드의 posterUrl)
    background_url VARCHAR(255),                    -- 배경 이미지 URL (프론트엔드의 backdropUrl)
    trailer_url VARCHAR(255),                       -- 예고편 URL
    status ENUM('COMING_SOON', 'NOW_SHOWING', 'ENDED') NOT NULL, -- 상영 상태 (프론트엔드의 isShowing과 연동)
    age_rating VARCHAR(10) NOT NULL,                -- 연령 등급
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 생성 시각
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP -- 마지막 업데이트 시각
);

INSERT INTO movies (title, title_en, director, actors, genre, running_time, release_date, end_date, rating, synopsis, poster_url, background_url, trailer_url, status, age_rating) VALUES
-- 1. 현재 상영작 (드라마)
('헤어질 결심', 'Decision to Leave', '박찬욱', '박해일,탕웨이', '멜로/로맨스,드라마,미스터리', 138, '2025-07-01', '2025-10-31', 8.7, '산에서 벌어진 변사 사건을 수사하게 된 형사 해준(박해일)이 사망자의 아내 서래(탕웨이)를 만나고 의심과 관심을 동시에 느끼며 시작되는 이야기.', '/images/posters/decision_to_leave.jpg', '/images/backgrounds/decision_to_leave_bg.jpg', 'https://youtu.be/hE_D-T1I6B8', 'NOW_SHOWING', '15세'),

-- 2. 현재 상영작 (액션/SF)
('탑건: 매버릭', 'Top Gun: Maverick', '조셉 코신스키', '톰 크루즈,마일즈 텔러,제니퍼 코넬리', '액션,드라마', 130, '2025-08-10', '2025-11-20', 9.1, '최고의 파일럿이자 교관으로 돌아온 매버릭이 새롭게 훈련생들을 가르치며 겪는 갈등과 성장, 그리고 위험한 임무를 수행하는 이야기.', '/images/posters/top_gun_maverick.jpg', '/images/backgrounds/top_gun_maverick_bg.jpg', 'https://youtu.be/example_topgun', 'NOW_SHOWING', '12세'),

-- 3. 상영 예정작 (애니메이션)
('인사이드 아웃 3', 'Inside Out 3', '켈시 맨', '에이미 포엘러,마야 호크,토니 헤일', '애니메이션,모험,코미디', 110, '2025-12-05', NULL, 0.0, '성장한 라일리의 새로운 감정들과 함께 찾아오는 혼돈 속에서 기쁨, 슬픔, 불안, 당황 등 다양한 감정들이 펼치는 또 한 번의 경이로운 모험.', '/images/posters/inside_out_3.jpg', '/images/backgrounds/inside_out_3_bg.jpg', 'https://youtu.be/example_insideout', 'COMING_SOON', '전체'),

-- 4. 상영 예정작 (히어로/SF)
('슈퍼맨', 'Superman', '제임스 건', '데이비드 코렌스웻,레이첼 브로스나한', '액션,공상과학,모험', 145, '2026-07-11', NULL, 0.0, '완전히 새로워진 DC 유니버스의 시작을 알리는 슈퍼맨의 이야기. 평범한 기자 클라크 켄트로서의 삶과 세상을 구하는 슈퍼 히어로로서의 삶을 그린다.', '/images/posters/superman.jpg', '/images/backgrounds/superman_bg.jpg', 'https://youtu.be/example_superman', 'COMING_SOON', '12세'),

-- 5. 현재 상영작 (스릴러/미스터리)
('독전 2', 'Believer 2', '백종열', '조진웅,차승원,한효주,오승훈', '범죄,액션,스릴러', 114, '2025-09-15', '2025-11-10', 7.5, '사라진 이선생의 실체를 쫓는 형사 원호와 아시아 최대 마약 조직을 둘러싼 인물들의 숨 막히는 전쟁이 다시 시작된다.', '/images/posters/believer_2.jpg', '/images/backgrounds/believer_2_bg.jpg', 'https://youtu.be/example_believer', 'NOW_SHOWING', '청소년 관람불가');
