CREATE TABLE favorites (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,          -- 즐겨찾기 고유 ID
    user_id BIGINT NOT NULL,                       -- 사용자 ID (users 테이블 참조)
    favorite_type ENUM('MOVIE', 'THEATER') NOT NULL, -- 즐겨찾기 유형 (영화 또는 극장)
    movie_id BIGINT,                               -- 영화 ID (movies 테이블 참조, 영화 즐겨찾기일 경우)
    theater_id BIGINT,                             -- 극장 ID (theaters 테이블 참조, 극장 즐겨찾기일 경우)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 생성 시각
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- 마지막 업데이트 시각
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE, -- 사용자 삭제 시 즐겨찾기도 삭제
    FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE, -- 영화 삭제 시 해당 즐겨찾기도 삭제
    FOREIGN KEY (theater_id) REFERENCES theaters(id) ON DELETE CASCADE, -- 극장 삭제 시 해당 즐겨찾기도 삭제
    UNIQUE KEY unique_movie_favorite (user_id, movie_id), -- 사용자별 영화 즐겨찾기 중복 방지
    UNIQUE KEY unique_theater_favorite (user_id, theater_id) -- 사용자별 극장 즐겨찾기 중복 방지
);

INSERT INTO favorites (user_id, favorite_type, movie_id, theater_id) VALUES
-- 사용자 1의 영화 즐겨찾기
(1, 'MOVIE', 1, NULL),  -- 헤어질 결심
(1, 'MOVIE', 2, NULL),  -- 탑건: 매버릭

-- 사용자 1의 극장 즐겨찾기
(1, 'THEATER', NULL, 1),  -- CGV 강남

-- 사용자 2의 영화 즐겨찾기
(2, 'MOVIE', 5, NULL),  -- 독전 2

-- 사용자 2의 극장 즐겨찾기
(2, 'THEATER', NULL, 3);  -- 메가박스 코엑스