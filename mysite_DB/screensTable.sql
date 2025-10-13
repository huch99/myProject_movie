CREATE TABLE screens (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,          -- 상영관 고유 ID
    theater_id BIGINT NOT NULL,                    -- 극장 ID (theaters 테이블 참조)
    name VARCHAR(50) NOT NULL,                     -- 상영관 이름 (예: 1관, 2관, IMAX관 등)
    type VARCHAR(50),                              -- 상영관 타입 (일반, IMAX, 4DX, SCREENX 등)
    seats_count INT NOT NULL,                      -- 총 좌석 수
    row_count INT NOT NULL,                        -- 좌석 행 수
    column_count INT NOT NULL,                     -- 좌석 열 수
    screen_size VARCHAR(20),                       -- 스크린 크기 (대/중/소)
    audio_system VARCHAR(50),                      -- 음향 시스템 (돌비 애트모스, 일반 등)
    is_accessible BOOLEAN DEFAULT true,            -- 장애인 접근 가능 여부
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 생성 시각
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- 마지막 업데이트 시각
    FOREIGN KEY (theater_id) REFERENCES theaters(id) ON DELETE CASCADE -- 극장 삭제 시 상영관도 삭제
);


-- 예시 데이터 5개
INSERT INTO screens (theater_id, name, type, seats_count, row_count, column_count, screen_size, audio_system, is_accessible) VALUES
-- CGV 강남 (theater_id = 1)의 상영관
(1, '1관 IMAX', 'IMAX', 250, 15, 20, '대형', '돌비 애트모스', true),

-- 롯데시네마 월드타워 (theater_id = 2)의 상영관
(2, '1관 SUPERPLEX', 'SUPERPLEX', 400, 20, 20, '특대형', '돌비 애트모스', true),

-- 메가박스 코엑스 (theater_id = 3)의 상영관
(3, '1관 DOLBY CINEMA', 'DOLBY CINEMA', 300, 18, 17, '대형', '돌비 애트모스', true),

-- CGV 판교 (theater_id = 4)의 상영관
(4, '2관', '일반', 180, 15, 12, '중형', '돌비 디지털', true),

-- 인디스페이스 (theater_id = 5)의 상영관
(5, '1관', '독립영화', 120, 10, 12, '소형', '일반 스테레오', true);