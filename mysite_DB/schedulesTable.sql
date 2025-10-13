CREATE TABLE schedules (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,          -- 상영 일정 고유 ID
    movie_id BIGINT NOT NULL,                      -- 영화 ID (movies 테이블 참조)
    screen_id BIGINT NOT NULL,                     -- 상영관 ID (screens 테이블 참조)
    start_time DATETIME NOT NULL,                  -- 상영 시작 시간
    end_time DATETIME NOT NULL,                    -- 상영 종료 시간
    price INT NOT NULL,                            -- 기본 티켓 가격
    available_seats INT NOT NULL,                  -- 잔여 좌석 수
    status ENUM('OPEN', 'CLOSED', 'CANCELED') NOT NULL DEFAULT 'OPEN', -- 예매 가능 상태
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 생성 시각
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- 마지막 업데이트 시각
    FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE, -- 영화 삭제 시 일정도 삭제
    FOREIGN KEY (screen_id) REFERENCES screens(id) ON DELETE CASCADE -- 상영관 삭제 시 일정도 삭제
);

INSERT INTO schedules (movie_id, screen_id, start_time, end_time, price, available_seats, status) VALUES
-- 헤어질 결심 (movie_id = 1)을 CGV 강남 IMAX관(screen_id = 1)에서 상영
(1, 1, '2025-10-15 10:30:00', '2025-10-15 12:48:00', 15000, 230, 'OPEN'),

-- 탑건: 매버릭 (movie_id = 2)을 롯데시네마 월드타워 SUPERPLEX관(screen_id = 2)에서 상영
(2, 2, '2025-10-15 14:00:00', '2025-10-15 16:10:00', 18000, 350, 'OPEN'),

-- 독전 2 (movie_id = 5)을 메가박스 코엑스 DOLBY CINEMA관(screen_id = 3)에서 상영
(5, 3, '2025-10-15 19:30:00', '2025-10-15 21:24:00', 17000, 280, 'OPEN'),

-- 헤어질 결심 (movie_id = 1)을 CGV 판교 일반관(screen_id = 4)에서 상영
(1, 4, '2025-10-15 16:20:00', '2025-10-15 18:38:00', 12000, 160, 'OPEN'),

-- 탑건: 매버릭 (movie_id = 2)을 인디스페이스(screen_id = 5)에서 특별 상영 (매진됨)
(2, 5, '2025-10-15 20:00:00', '2025-10-15 22:10:00', 10000, 0, 'CLOSED');