CREATE TABLE coupons (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,             -- 쿠폰 고유 ID
    coupon_code VARCHAR(50) NOT NULL UNIQUE,          -- 쿠폰 코드 (사용자가 입력 또는 자동 생성)
    name VARCHAR(100) NOT NULL,                       -- 쿠폰 이름 (예: 신규 가입 할인, N주년 기념 할인)
    description TEXT,                                 -- 쿠폰 설명
    discount_type ENUM('PERCENT', 'AMOUNT') NOT NULL, -- 할인 유형 (정률 할인, 정액 할인)
    discount_value DECIMAL(10, 2) NOT NULL,           -- 할인 값 (예: 10% 할인이면 10.0, 5000원 할인이면 5000.00)
    min_order_price DECIMAL(10, 2) DEFAULT 0.00,      -- 최소 주문 금액 (이 금액 이상 시 쿠폰 적용 가능)
    max_discount_amount DECIMAL(10, 2),               -- 최대 할인 금액 (PERCENT 타입의 경우 유효)
    issue_date DATETIME NOT NULL,                     -- 쿠폰 발행 시작일
    expiry_date DATETIME NOT NULL,                    -- 쿠폰 만료일
    usage_limit_per_user INT DEFAULT 1,               -- 사용자당 사용 가능 횟수
    total_usage_limit INT,                            -- 전체 사용 가능 횟수 (NULL이면 무제한)
    coupon_type ENUM('GENERAL', 'WELCOME', 'EVENT', 'MOVIE_SPECIFIC', 'THEATER_SPECIFIC') NOT NULL DEFAULT 'GENERAL', -- 쿠폰 종류
    target_movie_id BIGINT,                           -- 특정 영화에 적용되는 쿠폰일 경우 영화 ID
    target_theater_id BIGINT,                         -- 특정 극장에 적용되는 쿠폰일 경우 극장 ID
    status ENUM('ACTIVE', 'EXPIRED', 'DISABLED') NOT NULL DEFAULT 'ACTIVE', -- 쿠폰 상태
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,   -- 생성 시각
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- 마지막 업데이트 시각
    FOREIGN KEY (target_movie_id) REFERENCES movies(id) ON DELETE SET NULL, -- 영화 삭제 시 해당 쿠폰 참조값 NULL 처리
    FOREIGN KEY (target_theater_id) REFERENCES theaters(id) ON DELETE SET NULL -- 극장 삭제 시 해당 쿠폰 참조값 NULL 처리
);

INSERT INTO coupons (coupon_code, name, description, discount_type, discount_value, min_order_price, max_discount_amount, issue_date, expiry_date, usage_limit_per_user, total_usage_limit, coupon_type, target_movie_id, target_theater_id, status) VALUES
-- 1. 신규 가입 환영 5,000원 할인 쿠폰 (총 5개만 사용 가능)
('WELCOME5000', '신규 가입 환영 쿠폰', '영화 예매 시 5,000원 즉시 할인', 'AMOUNT', 5000.00, 15000.00, NULL, '2025-01-01 00:00:00', '2026-12-31 23:59:59', 1, 5, 'WELCOME', NULL, NULL, 'ACTIVE'),

-- 2. 10% 할인 쿠폰 (최대 10,000원 할인)
('MOVIE10PERCENT', '영화 예매 10% 할인', '모든 영화 예매 시 10% 할인 (최대 1만원)', 'PERCENT', 10.00, 10000.00, 10000.00, '2025-09-01 00:00:00', '2025-11-30 23:59:59', 1, NULL, 'GENERAL', NULL, NULL, 'ACTIVE'),

-- 3. '인터스텔라' 전용 3,000원 할인 쿠폰
('INTERSTELLAR3K', '인터스텔라 전용 할인', '영화 인터스텔라 예매 시 3,000원 할인', 'AMOUNT', 3000.00, 10000.00, NULL, '2025-10-01 00:00:00', '2025-11-15 23:59:59', 1, NULL, 'MOVIE_SPECIFIC', 1, NULL, 'ACTIVE'),

-- 4. 만료된 쿠폰
('EXPIREDCOUPON', '기간 만료 쿠폰', '사용 기간이 만료된 테스트 쿠폰', 'AMOUNT', 2000.00, 5000.00, NULL, '2025-01-01 00:00:00', '2025-09-30 23:59:59', 1, NULL, 'GENERAL', NULL, NULL, 'EXPIRED'),

-- 5. 'CGV 강남' 전용 2,000원 할인 쿠폰 (전체 50개 사용 가능)
('CGVGANGNAM2K', 'CGV 강남 할인', 'CGV 강남점에서만 사용 가능한 2,000원 할인', 'AMOUNT', 2000.00, 12000.00, NULL, '2025-10-10 00:00:00', '2025-12-31 23:59:59', 1, 50, 'THEATER_SPECIFIC', NULL, 1, 'ACTIVE');