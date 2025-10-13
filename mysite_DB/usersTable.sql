CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,          -- 사용자 고유 ID
    email VARCHAR(100) NOT NULL UNIQUE,            -- 이메일 (로그인 아이디)
    password VARCHAR(255) NOT NULL,                -- 암호화된 비밀번호
    name VARCHAR(50) NOT NULL,                     -- 사용자 이름
    nickname VARCHAR(50),                          -- 닉네임
    phone VARCHAR(20),                             -- 전화번호
    birth_date DATE,                               -- 생년월일
    gender ENUM('MALE', 'FEMALE', 'OTHER') NULL,   -- 성별
    profile_image_url VARCHAR(255),                -- 프로필 이미지 URL
    role ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER', -- 사용자 권한
    status ENUM('ACTIVE', 'INACTIVE', 'SUSPENDED') NOT NULL DEFAULT 'ACTIVE', -- 계정 상태
    last_login_at DATETIME,                        -- 마지막 로그인 시간
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 계정 생성 시각
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- 마지막 업데이트 시각
    marketing_agree BOOLEAN DEFAULT false,         -- 마케팅 정보 수신 동의
    terms_agree BOOLEAN NOT NULL DEFAULT true      -- 이용약관 동의
);

INSERT INTO users (email, password, name, nickname, phone, birth_date, gender, profile_image_url, role, status, last_login_at, marketing_agree, terms_agree) VALUES
-- 일반 사용자 1
('user1@example.com', '$2a$10$abcdefghijklmnopqrstuvwxyz123456', '김영화', '영화광', '010-1234-5678', '1995-05-15', 'MALE', '/images/profiles/user1.jpg', 'USER', 'ACTIVE', '2025-10-08 14:30:00', true, true),

-- 일반 사용자 2
('user2@example.com', '$2a$10$abcdefghijklmnopqrstuvwxyz789012', '이시네마', '팝콘먹는사람', '010-2345-6789', '1988-12-20', 'FEMALE', '/images/profiles/user2.jpg', 'USER', 'ACTIVE', '2025-10-07 19:45:00', false, true),

-- 일반 사용자 3
('user3@example.com', '$2a$10$abcdefghijklmnopqrstuvwxyz345678', '박관람', NULL, '010-3456-7890', '2000-03-10', 'MALE', NULL, 'USER', 'ACTIVE', '2025-10-05 10:15:00', true, true),

-- 휴면 계정 사용자
('inactive@example.com', '$2a$10$abcdefghijklmnopqrstuvwxyz901234', '최휴면', '오랜만이야', '010-4567-8901', '1992-08-25', 'FEMALE', '/images/profiles/inactive.jpg', 'USER', 'INACTIVE', '2025-08-15 11:20:00', false, true),

-- 관리자 계정
('admin@movieapp.com', '$2a$10$abcdefghijklmnopqrstuvwxyz567890', '관리자', '영화관리자', '010-9876-5432', '1985-01-30', 'MALE', '/images/profiles/admin.jpg', 'ADMIN', 'ACTIVE', '2025-10-09 08:45:00', true, true);