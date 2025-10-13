CREATE TABLE reviews (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,          -- 리뷰 고유 ID
    user_id BIGINT NOT NULL,                       -- 사용자 ID (users 테이블 참조)
    movie_id BIGINT NOT NULL,                      -- 영화 ID (movies 테이블 참조)
    rating DECIMAL(2,1) NOT NULL,                  -- 평점 (0.5~5.0)
    content TEXT,                                  -- 리뷰 내용
    spoiler BOOLEAN NOT NULL DEFAULT false,        -- 스포일러 포함 여부
    likes INT NOT NULL DEFAULT 0,                  -- 좋아요 수
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 작성 시각
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- 마지막 수정 시각
    status ENUM('ACTIVE', 'DELETED', 'HIDDEN') NOT NULL DEFAULT 'ACTIVE', -- 리뷰 상태
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,     -- 사용자 삭제 시 리뷰도 삭제
    FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE    -- 영화 삭제 시 리뷰도 삭제
);

INSERT INTO reviews (user_id, movie_id, rating, content, spoiler, likes) VALUES
-- 1. 헤어질 결심에 대한 리뷰
(1, 1, 4.5, '박찬욱 감독의 섬세한 연출이 돋보이는 작품이에요. 탕웨이와 박해일의 연기 호흡이 정말 좋았고, 특히 산에서의 장면들이 인상적이었습니다. 미스터리와 로맨스가 절묘하게 어우러진 영화였어요.', false, 23),

-- 2. 탑건: 매버릭에 대한 리뷰
(1, 2, 5.0, '오리지널보다 더 재미있었어요! 톰 크루즈의 직접 비행 장면들은 정말 압도적인 스케일을 자랑합니다. 특히 IMAX로 봤는데 소리와 영상의 조화가 완벽했습니다. 액션 영화의 교과서라고 할 수 있어요.', false, 45),

-- 3. 독전 2에 대한 리뷰
(1, 5, 3.5, '1편에 비해 조금 아쉬운 면이 있지만, 여전히 긴장감 넘치는 전개가 좋았습니다. 조진웅의 연기는 역시 일품이에요. 다만 후반부 전개가 조금 산만하게 느껴졌어요.', true, 8),

-- 4. 인사이드 아웃 3에 대한 리뷰 (아직 개봉 전이지만 시사회로 본 것으로 가정)
(1, 3, 4.0, '픽사의 감성이 잘 녹아있는 애니메이션입니다. 1, 2편의 감동을 이어가면서도 새로운 감정 캐릭터들의 등장으로 신선함을 더했어요. 가족들과 함께 보기 좋은 영화입니다.', false, 12),

-- 5. 슈퍼맨에 대한 리뷰 (아직 개봉 전이지만 해외 시사회로 본 것으로 가정)
(1, 4, 4.0, 'DC의 새로운 시작을 알리는 작품으로 기대 이상이었습니다. 데이비드 코렌스웻의 슈퍼맨 연기가 인상적이었고, 제임스 건 감독의 색깔이 잘 드러난 영화였어요. 액션 장면들도 시원시원하게 잘 표현되었습니다.', false, 17);