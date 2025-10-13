CREATE TABLE payments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,          -- 결제 고유 ID
    reservation_id BIGINT NOT NULL,                -- 예매 ID (reservations 테이블 참조)
    user_id BIGINT NOT NULL,                       -- 사용자 ID (users 테이블 참조)
    amount DECIMAL(10, 2) NOT NULL,                -- 결제 금액
    payment_method VARCHAR(50) NOT NULL,           -- 결제 수단 (CARD, MOBILE, BANK, POINT 등)
    payment_status ENUM('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED', 'CANCELED') NOT NULL, -- 결제 상태
    transaction_id VARCHAR(100),                   -- 외부 결제 시스템 트랜잭션 ID
    card_company VARCHAR(50),                      -- 카드사 (카드 결제 시)
    card_number VARCHAR(20),                       -- 마스킹된 카드번호 (카드 결제 시)
    installment INT DEFAULT 0,                     -- 할부 개월 수
    discount_amount DECIMAL(10, 2) DEFAULT 0.00,   -- 할인 금액
    coupon_id BIGINT,                              -- 사용한 쿠폰 ID
    payment_time TIMESTAMP,                        -- 결제 시간
    refund_time TIMESTAMP,                         -- 환불 시간 (환불 시)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 생성 시각
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- 마지막 업데이트 시각
    FOREIGN KEY (reservation_id) REFERENCES reservations(id) ON DELETE CASCADE, -- 예매 삭제 시 결제 정보도 삭제
    FOREIGN KEY (user_id) REFERENCES users(id)     -- 사용자 참조
);

INSERT INTO payments (reservation_id, user_id, amount, payment_method, payment_status, transaction_id, card_company, card_number, installment, discount_amount, payment_time) VALUES
-- 1. 사용자 1의 '헤어질 결심' 예매에 대한 결제 (30000원)
(1, 1, 30000.00, 'CARD', 'COMPLETED', 'TID2025100100001', 'KB국민카드', '5503-****-****-4321', 0, 0.00, '2025-10-08 14:35:22'),

-- 2. 사용자 2의 '탑건: 매버릭' 예매에 대한 결제 (18000원)
(2, 2, 18000.00, 'MOBILE', 'COMPLETED', 'TID2025100100002', '카카오페이', NULL, 0, 0.00, '2025-10-07 19:50:33'),

-- 3. 사용자 1의 '독전 2' 예매에 대한 결제 (아직 결제 대기 상태)
(3, 1, 51000.00, 'CARD', 'PENDING', NULL, NULL, NULL, 0, 0.00, NULL),

-- 4. 사용자 2의 '헤어질 결심' 예매 취소에 대한 환불 처리
(4, 2, 15000.00, 'CARD', 'REFUNDED', 'TID2025100100004', '신한카드', '4902-****-****-1234', 0, 0.00, '2025-10-05 10:20:15'),

-- 5. 사용자 1의 '탑건: 매버릭' 예매에 대한 결제 (할인 적용)
(5, 1, 62000.00, 'CARD', 'COMPLETED', 'TID2025100100005', '삼성카드', '3781-****-****-5678', 2, 10000.00, '2025-10-09 09:12:45');