CREATE TABLE user_coupons (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,          -- 사용자 쿠폰 고유 ID
    user_id BIGINT NOT NULL,                       -- 사용자 ID (users 테이블 참조)
    coupon_id BIGINT NOT NULL,                     -- 쿠폰 ID (coupons 테이블 참조)
    issue_date TIMESTAMP NOT NULL,                 -- 발급 일시
    expiry_date TIMESTAMP NOT NULL,                -- 만료 일시
    used BOOLEAN NOT NULL DEFAULT false,           -- 사용 여부
    expired BOOLEAN NOT NULL DEFAULT false,        -- 만료 여부
    used_date TIMESTAMP,                           -- 사용 일시
    reservation_id BIGINT,                         -- 예매 ID (reservations 테이블 참조, 사용된 경우)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 생성 시각
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- 마지막 업데이트 시각
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE, -- 사용자 삭제 시 사용자 쿠폰도 삭제
    FOREIGN KEY (coupon_id) REFERENCES coupons(id) ON DELETE CASCADE -- 쿠폰 삭제 시 사용자 쿠폰도 삭제
);

INSERT INTO user_coupons (user_id, coupon_id, issue_date, expiry_date, used, expired, used_date, reservation_id) VALUES
-- 사용자 1의 신규 가입 환영 쿠폰 (미사용)
(1, 1, '2025-09-15 10:30:00', '2025-12-31 23:59:59', false, false, NULL, NULL),

-- 사용자 1의 10% 할인 쿠폰 (사용됨)
(1, 2, '2025-09-20 14:25:00', '2025-11-30 23:59:59', true, false, '2025-10-05 18:42:15', 1),

-- 사용자 2의 영화 전용 할인 쿠폰 (미사용)
(2, 3, '2025-09-25 09:15:00', '2025-10-31 23:59:59', false, false, NULL, NULL),

-- 사용자 2의 만료된 쿠폰
(2, 1, '2025-08-01 12:00:00', '2025-09-30 23:59:59', false, true, NULL, NULL),

-- 사용자 3의 CGV 강남 전용 쿠폰 (미사용)
(3, 5, '2025-10-01 16:20:00', '2025-12-15 23:59:59', false, false, NULL, NULL);