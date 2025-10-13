CREATE TABLE screenings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,          -- 상영 정보 고유 ID
    movie_id BIGINT NOT NULL,                      -- 영화 ID (movies 테이블 참조)
    screen_id BIGINT NOT NULL,                     -- 상영관 ID (screens 테이블 참조)
    schedule_id BIGINT NOT NULL,                   -- 상영 일정 ID (schedules 테이블 참조)
    screening_date DATE NOT NULL,                  -- 상영 날짜
    screening_time TIME NOT NULL,                  -- 상영 시작 시간
    end_time TIME NOT NULL,                        -- 상영 종료 시간
    is_full BOOLEAN NOT NULL DEFAULT false,        -- 만석 여부
    available_seats INT NOT NULL,                  -- 잔여 좌석 수
    status ENUM('ACTIVE', 'CANCELED', 'COMPLETED') NOT NULL DEFAULT 'ACTIVE', -- 상영 상태
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 생성 시각
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- 마지막 업데이트 시각
    FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE,   -- 영화 삭제 시 상영 정보도 삭제
    FOREIGN KEY (screen_id) REFERENCES screens(id) ON DELETE CASCADE, -- 상영관 삭제 시 상영 정보도 삭제
    FOREIGN KEY (schedule_id) REFERENCES schedules(id) ON DELETE CASCADE -- 일정 삭제 시 상영 정보도 삭제
);

INSERT INTO screenings (movie_id, screen_id, schedule_id, screening_date, screening_time, end_time, is_full, available_seats, status) VALUES
-- 1. 헤어질 결심 (movie_id = 1)을 CGV 강남 IMAX관(screen_id = 1)에서 상영
(1, 1, 1, '2025-10-15', '10:30:00', '12:48:00', false, 230, 'ACTIVE'),

-- 2. 탑건: 매버릭 (movie_id = 2)을 롯데시네마 월드타워 SUPERPLEX관(screen_id = 2)에서 상영
(2, 2, 2, '2025-10-15', '14:00:00', '16:10:00', false, 350, 'ACTIVE'),

-- 3. 독전 2 (movie_id = 5)을 메가박스 코엑스 DOLBY CINEMA관(screen_id = 3)에서 상영
(5, 3, 3, '2025-10-15', '19:30:00', '21:24:00', false, 280, 'ACTIVE'),

-- 4. 헤어질 결심 (movie_id = 1)을 CGV 판교 일반관(screen_id = 4)에서 상영 (매진)
(1, 4, 4, '2025-10-15', '16:20:00', '18:38:00', true, 0, 'ACTIVE'),

-- 5. 탑건: 매버릭 (movie_id = 2)을 인디스페이스(screen_id = 5)에서 특별 상영 (취소됨)
(2, 5, 5, '2025-10-15', '20:00:00', '22:10:00', false, 120, 'CANCELED');