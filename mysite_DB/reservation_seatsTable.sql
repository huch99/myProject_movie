CREATE TABLE reservation_seats (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,          -- 예매 좌석 고유 ID
    reservation_id BIGINT NOT NULL,                -- 예매 ID (reservations 테이블 참조)
    seat_id BIGINT NOT NULL,                       -- 좌석 ID (seats 테이블 참조)
    price DECIMAL(10, 2) NOT NULL,                 -- 해당 좌석의 가격 (일반/우대/장애인석 등에 따라 다를 수 있음)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 생성 시각
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- 마지막 업데이트 시각
    FOREIGN KEY (reservation_id) REFERENCES reservations(id) ON DELETE CASCADE, -- 예매 삭제 시 예매 좌석도 삭제
    FOREIGN KEY (seat_id) REFERENCES seats(id),     -- 좌석 참조
    UNIQUE KEY unique_reservation_seat (reservation_id, seat_id) -- 하나의 예매에서 중복 좌석 방지
);

INSERT INTO reservation_seats (reservation_id, seat_id, price) VALUES
-- 예매 1(사용자 1의 '헤어질 결심' 2장)에 대한 좌석
(1, 1, 15000.00),  -- G10 좌석 (일반석)
(1, 2, 15000.00),  -- J5 좌석 (프리미엄석이지만 동일 가격으로 가정)

-- 예매 2(사용자 2의 '탑건: 매버릭' 1장)에 대한 좌석
(2, 3, 18000.00),  -- A3 좌석 (장애인석이지만 동일 가격으로 가정)

-- 예매 3(사용자 1의 '독전 2' 3장)에 대한 좌석 (아직 결제 전)
(3, 4, 17000.00),  -- K15 좌석 (커플석)
(3, 5, 17000.00);  -- E8 좌석 (일반석)