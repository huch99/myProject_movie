-- 극장 정보 테이블 (theaters)
CREATE TABLE theaters (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,          -- 극장 고유 ID
    name VARCHAR(100) NOT NULL,                    -- 극장 이름
    location VARCHAR(255) NOT NULL,                -- 지역 (예: 서울, 경기, 인천)
    address VARCHAR(255) NOT NULL,                 -- 상세 주소
    contact VARCHAR(50),                           -- 대표 연락처 (인터페이스의 contact)
    phone VARCHAR(20),                             -- 일반 전화번호 (인터페이스의 phone)
    facilities TEXT,                               -- 편의시설 (프론트엔드의 facilities[] - 백엔드에서 콤마(,)로 분리/조인)
    special_screens TEXT,                          -- 특별관 목록 (프론트엔드의 specialScreens[] - 백엔드에서 콤마(,)로 분리/조인)
    image_url VARCHAR(255),                        -- 극장 대표 이미지 URL (프론트엔드의 imageUrl)
    description TEXT,                              -- 상세 설명
    features TEXT,                                 -- 특징 또는 부가 정보 (프론트엔드의 features[] - 백엔드에서 콤마(,)로 분리/조인)
    parking TEXT,                                  -- 주차 정보
    transportation TEXT,                           -- 대중교통 정보
    capacity INT,                                  -- 총 좌석 수 또는 규모
    type VARCHAR(50),                              -- 극장 유형 (예: 멀티플렉스, 단관)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 생성 시각
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP -- 마지막 업데이트 시각
);


INSERT INTO theaters (name, location, address, contact, phone, facilities, special_screens, image_url, description, features, parking, transportation, capacity, type) VALUES
-- 1. CGV 강남
('CGV 강남', '서울', '서울특별시 강남구 강남대로 422 씨티 건물', 'CGV 고객센터', '02-1544-1122', '매점,카페,게임센터,흡연실', 'IMAX,4DX,SCREENX', '/images/theaters/cgv_gangnam.jpg', '강남역 근처에 위치한 최신 시설의 멀티플렉스 영화관입니다. 다양한 특별관에서 영화를 더욱 생생하게 즐길 수 있습니다.', '지하철역 인접,최신 시설,편안한 좌석', '지하 주차장 이용 (유료, 영화 관람 시 할인)', '강남역 11번 출구', 1500, '멀티플렉스'),

-- 2. 롯데시네마 월드타워
('롯데시네마 월드타워', '서울', '서울특별시 송파구 올림픽로 300 롯데월드몰 5~11층', '롯데시네마 고객센터', '02-1544-8855', '매점,카페,복합쇼핑몰,VIP라운지', 'SUPERPLEX,SUPER S,SUPER 4D', '/images/theaters/lotte_worldtower.jpg', '아시아 최대 규모의 스크린을 자랑하는 SUPERPLEX를 비롯하여 다양한 특별관을 갖춘 랜드마크 영화관입니다. 쇼핑, 식사, 영화 관람을 한 번에 즐길 수 있습니다.', '최대 스크린,복합 문화 공간,쇼핑몰 연계', '롯데월드몰 지하 주차장 이용 (유료, 영화 관람 시 할인)', '잠실역 (2, 8호선) 10, 11번 출구', 3000, '멀티플렉스'),

-- 3. 메가박스 코엑스
('메가박스 코엑스', '서울', '서울특별시 강남구 봉은사로 524 스타필드 코엑스몰 B1', '메가박스 고객센터', '02-1544-0070', '매점,카페,식당가,게임존', 'DOLBY CINEMA,MX,THE BOUTIQUE', '/images/theaters/megabox_coex.jpg', '도심 속 문화생활을 즐길 수 있는 코엑스몰 내에 위치한 메가박스입니다. 돌비 시네마 등 프리미엄 상영관에서 최고의 몰입감을 경험하세요.', '최고급 사운드,프리미엄 상영관,접근성 우수', '스타필드 코엑스몰 지하 주차장 이용 (유료, 영화 관람 시 할인)', '삼성역 (2호선) 5, 6번 출구', 2000, '멀티플렉스'),

-- 4. CGV 판교
('CGV 판교', '경기 성남', '경기도 성남시 분당구 판교역로146번길 20 현대백화점 판교점 5층', 'CGV 고객센터', '031-1544-1122', '매점,백화점,키즈존,VR체험', 'IMAX,SWEETBOX', '/images/theaters/cgv_pangyo.jpg', '현대백화점 판교점에 위치하여 쇼핑과 영화 관람을 동시에 즐길 수 있는 극장입니다. 아이맥스 관에서 압도적인 스케일을 느껴보세요.', '백화점 연계,아이맥스,편의시설', '현대백화점 판교점 주차장 이용 (유료, 영화 관람 시 할인)', '판교역 (신분당선) 3, 4번 출구', 1200, '멀티플렉스'),

-- 5. 독립영화전용관 인디스페이스
('인디스페이스', '서울', '서울특별시 종로구 돈화문로 13', '인디스페이스 사무국', '02-738-0328', '카페', '', '/images/theaters/indiespace.jpg', '한국 독립영화를 상시 상영하는 국내 최초의 독립영화전용관입니다. 다양하고 실험적인 영화들을 만날 수 있는 특별한 공간입니다.', '독립영화 전문,다양성 영화,정겨운 분위기', '주차 불가 (인근 유료 주차장 이용)', '종로3가역 (1, 3, 5호선) 6번 출구', 150, '단관')
