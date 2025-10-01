import styled from "styled-components";
import Spinner from "../common/Spinner";
import Button from "../common/Button";
import { useAuth } from "../../hooks/useAuth";
import { useEffect, useState } from "react";
import movieService from "../../service/movieService";

const Container = styled.div`
  margin: 20px 0;
`;

const RatingForm = styled.form`
  background-color: #f8f8f8;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 30px;
`;

const FormTitle = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 15px;
  color: #333;
`;

const FormRow = styled.div`
  margin-bottom: 15px;
`;

const StarRating = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
`;

const Star = styled.span<{ filled: boolean }>`
  font-size: 2rem;
  color: ${props => props.filled ? '#ffb400' : '#ddd'};
  cursor: pointer;
  margin-right: 5px;
`;

const RatingLabel = styled.span`
  margin-left: 10px;
  font-size: 1.2rem;
  color: #666;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  resize: vertical;
  min-height: 100px;
  
  &:focus {
    outline: none;
    border-color: #e51937;
  }
`;

const RatingList = styled.div`
  margin-top: 30px;
`;

const RatingItem = styled.div`
  padding: 15px 0;
  border-bottom: 1px solid #eee;
`;

const RatingHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const UserInfo = styled.div`
  font-weight: 500;
  color: #333;
`;

const RatingValue = styled.div`
  color: #ffb400;
  font-weight: 600;
`;

const RatingComment = styled.p`
  color: #555;
  line-height: 1.6;
`;

const RatingDate = styled.div`
  color: #999;
  font-size: 0.9rem;
  margin-top: 5px;
  text-align: right;
`;

const NoRatings = styled.div`
  text-align: center;
  padding: 30px 0;
  color: #666;
`;

const ErrorMessage = styled.div`
  color: #e51937;
  margin-top: 10px;
  font-size: 0.9rem;
`;

interface Rating {
  id: number;
  userId: number;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface MovieRatingsProps {
  movieId: number;
}

const MovieRatings: React.FC<MovieRatingsProps> = ({ movieId }) => {
  const { isLoggedIn, user } = useAuth();
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [userRating, setUserRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    const fetchRatings = async () => {
      setLoading(true);
      try {
        const response = await movieService.getMovieRatings(movieId);
        setRatings(response.ratings);
      } catch (err) {
        console.error('영화 평점 조회 실패:', err);
        setError('평점을 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchRatings();
  }, [movieId]);

  const handleRatingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (userRating === 0) {
      setFormError('평점을 선택해 주세요.');
      return;
    }
    
    setSubmitting(true);
    setFormError(null);
    
    try {
      await movieService.rateMovie(movieId, userRating, comment);
      
      // 평점 목록 다시 불러오기
      const response = await movieService.getMovieRatings(movieId);
      setRatings(response.ratings);
      
      // 폼 초기화
      setUserRating(0);
      setComment('');
    } catch (err) {
      console.error('평점 등록 실패:', err);
      setFormError('평점 등록에 실패했습니다. 다시 시도해 주세요.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container>
      {isLoggedIn && (
        <RatingForm onSubmit={handleRatingSubmit}>
          <FormTitle>이 영화에 대한 평점을 남겨주세요</FormTitle>
          
          <FormRow>
            <StarRating>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                <Star
                  key={star}
                  filled={star <= userRating}
                  onClick={() => setUserRating(star)}
                >
                  ★
                </Star>
              ))}
              <RatingLabel>{userRating > 0 ? `${userRating}점` : '평점 선택'}</RatingLabel>
            </StarRating>
          </FormRow>
          
          <FormRow>
            <TextArea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="영화에 대한 감상을 자유롭게 남겨주세요."
            />
          </FormRow>
          
          {formError && <ErrorMessage>{formError}</ErrorMessage>}
          
          <Button type="submit" variant="primary" disabled={submitting}>
            {submitting ? '등록 중...' : '평점 등록하기'}
          </Button>
        </RatingForm>
      )}
      
      <RatingList>
        {loading ? (
          <Spinner />
        ) : error ? (
          <ErrorMessage>{error}</ErrorMessage>
        ) : ratings.length === 0 ? (
          <NoRatings>아직 등록된 평점이 없습니다. 첫 번째 평점을 남겨보세요!</NoRatings>
        ) : (
          ratings.map((rating) => (
            <RatingItem key={rating.id}>
              <RatingHeader>
                <UserInfo>{rating.userName}</UserInfo>
                <RatingValue>★ {rating.rating.toFixed(1)}</RatingValue>
              </RatingHeader>
              <RatingComment>{rating.comment}</RatingComment>
              <RatingDate>{new Date(rating.createdAt).toLocaleDateString()}</RatingDate>
            </RatingItem>
          ))
        )}
      </RatingList>
    </Container>
  );
};

export default MovieRatings;