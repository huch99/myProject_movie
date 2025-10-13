CREATE TABLE reservations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,          -- 예매 고유 ID
    user_id BIGINT NOT NULL,                       -- 사용자 ID (users 테이블 참조)
    schedule_id BIGINT NOT NULL,                   -- 상영 일정 ID (schedules 테이블 참조)
    reservation_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, -- 예매 요청 시각
    total_price DECIMAL(10, 2) NOT NULL,           -- 총 결제 금액
    number_of_tickets INT NOT NULL,                -- 예매 티켓 수
    status ENUM('PENDING', 'CONFIRMED', 'CANCELED') NOT NULL DEFAULT 'PENDING', -- 예매 상태
    payment_method VARCHAR(50),                    -- 결제 수단 (예: CARD, MOBILE, POINTS)
    payment_status ENUM('PENDING', 'PAID', 'REFUNDED') NOT NULL DEFAULT 'PENDING', -- 결제 상태
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 생성 시각
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- 마지막 업데이트 시각
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,     -- 사용자 삭제 시 예매도 삭제
    FOREIGN KEY (schedule_id) REFERENCES schedules(id) ON DELETE CASCADE -- 상영 일정 삭제 시 예매도 삭제
);

INSERT INTO reservations (user_id, schedule_id, total_price, number_of_tickets, status, payment_method, payment_status) VALUES
-- 1. 사용자 1의 '헤어질 결심' 예매 (2장, 30000원)
(1, 1, 30000.00, 2, 'CONFIRMED', 'CARD', 'PAID'),

-- 2. 사용자 2의 '탑건: 매버릭' 예매 (1장, 18000원)
(2, 2, 18000.00, 1, 'CONFIRMED', 'MOBILE', 'PAID'),

-- 3. 사용자 1의 '독전 2' 예매 (3장, 51000원)
(1, 3, 51000.00, 3, 'PENDING', 'CARD', 'PENDING'), -- 결제 대기 중인 상태

-- 4. 사용자 2의 '헤어질 결심' 예매 (1장, 15000원)
(2, 1, 15000.00, 1, 'CANCELED', 'CARD', 'REFUNDED'), -- 취소 및 환불된 상태

-- 5. 사용자 1의 '탑건: 매버릭' 예매 (4장, 72000원)
(1, 2, 72000.00, 4, 'CONFIRMED', 'CARD', 'PAID');