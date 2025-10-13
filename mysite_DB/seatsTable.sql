CREATE TABLE seats (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,          -- 좌석 고유 ID
    screen_id BIGINT NOT NULL,                     -- 상영관 ID (screens 테이블 참조)
    row_name VARCHAR(5) NOT NULL,                  -- 좌석 행 이름 (예: A, B, C...)
    column_number INT NOT NULL,                    -- 좌석 열 번호 (예: 1, 2, 3...)
    seat_type ENUM('STANDARD', 'PREMIUM', 'HANDICAPPED', 'COUPLE') NOT NULL DEFAULT 'STANDARD', -- 좌석 타입
    is_active BOOLEAN NOT NULL DEFAULT true,       -- 사용 가능 여부 (고장, 수리 등의 상태 표시)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 생성 시각
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- 마지막 업데이트 시각
    FOREIGN KEY (screen_id) REFERENCES screens(id) ON DELETE CASCADE, -- 상영관 삭제 시 좌석도 삭제
    UNIQUE KEY unique_seat (screen_id, row_name, column_number) -- 상영관 내 좌석 중복 방지
);

INSERT INTO seats (screen_id, row_name, column_number, seat_type, is_active) VALUES
-- CGV 강남 IMAX관(screen_id = 1)의 좌석
(1, 'G', 10, 'STANDARD', true),  -- 중앙 좌석
(1, 'J', 5, 'PREMIUM', true),    -- 프리미엄석
(1, 'A', 3, 'HANDICAPPED', true), -- 장애인석
(1, 'K', 15, 'COUPLE', true),    -- 커플석
(1, 'E', 8, 'STANDARD', false);  -- 수리 중인 좌석