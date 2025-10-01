import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Modal from '../common/Modal';
import Button from '../common/Button';

interface MovieTrailerProps {
    movieId: number;
    title: string;
    onClose: () => void;
}

const TrailerContainer = styled.div`
  position: relative;
  width: 100%;
  padding-bottom: 56.25%; /* 16:9 비율 */
  height: 0;
  overflow: hidden;
`;

const TrailerIframe = styled.iframe`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: none;
`;

const LoadingMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 300px;
  color: #666;
`;

const ErrorMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  color: #e51937;
  text-align: center;
  padding: 20px;
`;

const MovieTrailer: React.FC<MovieTrailerProps> = ({ movieId, title, onClose }) => {
    const [trailerUrl, setTrailerUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // 실제 구현에서는 API에서 예고편 URL을 가져오는 로직이 필요합니다
        // 여기서는 예시로 영화 ID를 기반으로 가상의 URL을 생성합니다
        const fetchTrailer = async () => {
            try {
                setLoading(true);
                // 실제 API 호출 대신 타임아웃으로 시뮬레이션
                await new Promise(resolve => setTimeout(resolve, 1000));

                // 예시 YouTube 동영상 ID (실제로는 API에서 받아와야 함)
                const mockTrailerIds = [
                    'dQw4w9WgXcQ', // 예시 YouTube ID 1
                    'jNQXAC9IVRw', // 예시 YouTube ID 2
                    'UGc5Tzz19UY'  // 예시 YouTube ID 3
                ];

                // 영화 ID를 기반으로 가상의 예고편 선택
                const trailerIndex = movieId % mockTrailerIds.length;
                const youtubeId = mockTrailerIds[trailerIndex];

                setTrailerUrl(`https://www.youtube.com/embed/${youtubeId}?autoplay=1`);
                setLoading(false);
            } catch (err) {
                setError('예고편을 불러오는 데 실패했습니다. 잠시 후 다시 시도해 주세요.');
                setLoading(false);
            }
        };

        fetchTrailer();

        // 컴포넌트가 언마운트될 때 YouTube 동영상 정지를 위한 cleanup
        return () => {
            setTrailerUrl(null);
        };
    }, [movieId]);

    return (
        <Modal
            isOpen={true}
            onClose={onClose}
            title={`${title} 예고편`}
            width="800px"
        >
            {loading ? (
                <LoadingMessage>예고편을 불러오는 중입니다...</LoadingMessage>
            ) : error ? (
                <ErrorMessage>
                    <p>{error}</p>
                    <Button variant="outline" onClick={onClose}>닫기</Button>
                </ErrorMessage>
            ) : (
                <TrailerContainer>
                    <TrailerIframe
                        src={trailerUrl || ''}
                        title={`${title} 예고편`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                </TrailerContainer>
            )}
        </Modal>
    );
};

export default MovieTrailer;