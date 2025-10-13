CREATE TABLE review_likes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,          -- 좋아요 고유 ID
    user_id BIGINT NOT NULL,                       -- 사용자 ID (users 테이블 참조)
    review_id BIGINT NOT NULL,                     -- 리뷰 ID (reviews 테이블 참조)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 생성 시각
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE, -- 사용자 삭제 시 좋아요도 삭제
    FOREIGN KEY (review_id) REFERENCES reviews(id) ON DELETE CASCADE, -- 리뷰 삭제 시 좋아요도 삭제
    UNIQUE KEY unique_user_review (user_id, review_id) -- 사용자가 같은 리뷰에 중복 좋아요 방지
);

INSERT INTO review_likes (user_id, review_id) VALUES
-- 사용자 1이 리뷰 1에 좋아요
(1, 1),

-- 사용자 2가 리뷰 1에 좋아요
(2, 1),

-- 사용자 1이 리뷰 3에 좋아요
(1, 3),

-- 사용자 3이 리뷰 2에 좋아요
(3, 2),

-- 사용자 2가 리뷰 4에 좋아요
(2, 4);