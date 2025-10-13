// src/components/reservation/ReservationHistory.js
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { fetchReservations, cancelReservation } from '../../store/slices/reservationSlice';
import { FaTicketAlt, FaCalendarAlt, FaClock, FaMapMarkerAlt, FaUsers, FaDownload } from 'react-icons/fa';
import Button from '../common/Button';
import Modal from '../common/Modal';
import Pagination from '../common/Pagination';
import dateUtils from '../../utils/dateUtils';
import ROUTE_PATHS from '../../constants/routePaths';

/**
 * 예매 내역 컴포넌트
 */
const ReservationHistory = () => {
    const dispatch = useDispatch();
    const { reservations, loading, error } = useSelector((state) => state.reservation);
    const [currentPage, setCurrentPage] = useState(0);
    const [selectedReservation, setSelectedReservation] = useState(null);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [showTicketModal, setShowTicketModal] = useState(false);
    const [cancelReason, setCancelReason] = useState('');
    const [cancelError, setCancelError] = useState('');

    const itemsPerPage = 5;

    // 예매 내역 로드
    useEffect(() => {
        dispatch(fetchReservations({ page: currentPage, size: itemsPerPage }));
    }, [dispatch, currentPage]);

    // 페이지 변경 핸들러
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // 예매 취소 모달 열기
    const handleOpenCancelModal = (reservation) => {
        setSelectedReservation(reservation);
        setShowCancelModal(true);
        setCancelReason('');
        setCancelError('');
    };

    // 티켓 보기 모달 열기
    const handleOpenTicketModal = (reservation) => {
        setSelectedReservation(reservation);
        setShowTicketModal(true);
    };

    // 예매 취소 이유 변경 핸들러
    const handleCancelReasonChange = (e) => {
        setCancelReason(e.target.value);
        setCancelError('');
    };

    // 예매 취소 처리
    const handleCancelReservation = async () => {
        if (!cancelReason.trim()) {
            setCancelError('취소 사유를 입력해주세요.');
            return;
        }

        try {
            await dispatch(cancelReservation({
                reservationId: selectedReservation.id,
                reason: cancelReason
            })).unwrap();

            setShowCancelModal(false);

            // 현재 페이지 다시 로드
            dispatch(fetchReservations({ page: currentPage, size: itemsPerPage }));
        } catch (err) {
            setCancelError('예매 취소에 실패했습니다. 다시 시도해주세요.');
        }
    };

    // 티켓 다운로드 처리
    const handleDownloadTicket = () => {
        // 티켓 다운로드 로직 (실제 구현 시 필요)
        // 예: 서버에서 PDF 생성 후 다운로드
        console.log('티켓 다운로드:', selectedReservation.id);

        // 다운로드 후 모달 닫기
        setShowTicketModal(false);
    };

    // 예매 상태에 따른 스타일 및 텍스트
    const getStatusInfo = (status) => {
        switch (status) {
            case 'COMPLETED':
                return { color: 'var(--color-success)', text: '예매 완료' };
            case 'CANCELED':
                return { color: 'var(--color-error)', text: '예매 취소' };
            case 'PENDING':
                return { color: 'var(--color-warning)', text: '결제 대기' };
            default:
                return { color: 'var(--color-text-secondary)', text: '상태 미정' };
        }
    };

    // 티켓 취소 가능 여부 확인
    const isCancelable = (reservation) => {
        if (reservation.status !== 'COMPLETED') {
            return false;
        }

        // 상영 시작 3시간 전까지만 취소 가능
        const screeningTime = new Date(reservation.screeningDateTime);
        const now = new Date();
        const timeDiff = screeningTime.getTime() - now.getTime();
        const hoursDiff = timeDiff / (1000 * 60 * 60);

        return hoursDiff >= 3;
    };

    return (
        <HistoryContainer>
            <HistoryTitle>예매 내역</HistoryTitle>

            {loading ? (
                <LoadingMessage>예매 내역을 불러오는 중입니다...</LoadingMessage>
            ) : error ? (
                <ErrorMessage>{error}</ErrorMessage>
            ) : reservations.content && reservations.content.length > 0 ? (
                <>
                    <ReservationList>
                        {reservations.content.map((reservation) => {
                            const statusInfo = getStatusInfo(reservation.status);

                            return (
                                <ReservationItem key={reservation.id}>
                                    <ReservationHeader>
                                        <MovieTitle>
                                            <FaTicketAlt />
                                            <span>{reservation.movie.title}</span>
                                        </MovieTitle>
                                        <ReservationStatus color={statusInfo.color}>
                                            {statusInfo.text}
                                        </ReservationStatus>
                                    </ReservationHeader>

                                    <ReservationDetails>
                                        <DetailItem>
                                            <DetailIcon>
                                                <FaCalendarAlt />
                                            </DetailIcon>
                                            <DetailContent>
                                                <DetailLabel>관람일</DetailLabel>
                                                <DetailValue>
                                                    {dateUtils.formatDate(reservation.screeningDateTime)}
                                                </DetailValue>
                                            </DetailContent>
                                        </DetailItem>

                                        <DetailItem>
                                            <DetailIcon>
                                                <FaClock />
                                            </DetailIcon>
                                            <DetailContent>
                                                <DetailLabel>상영 시간</DetailLabel>
                                                <DetailValue>
                                                    {dateUtils.formatTime(reservation.screeningDateTime)}
                                                </DetailValue>
                                            </DetailContent>
                                        </DetailItem>

                                        <DetailItem>
                                            <DetailIcon>
                                                <FaMapMarkerAlt />
                                            </DetailIcon>
                                            <DetailContent>
                                                <DetailLabel>극장/상영관</DetailLabel>
                                                <DetailValue>
                                                    {reservation.theater.name} / {reservation.screenName}
                                                </DetailValue>
                                            </DetailContent>
                                        </DetailItem>

                                        <DetailItem>
                                            <DetailIcon>
                                                <FaUsers />
                                            </DetailIcon>
                                            <DetailContent>
                                                <DetailLabel>인원</DetailLabel>
                                                <DetailValue>
                                                    {reservation.audienceCount} 명
                                                </DetailValue>
                                            </DetailContent>
                                        </DetailItem>

                                        <DetailItem>
                                            <DetailIcon>
                                                <span>🪑</span>
                                            </DetailIcon>
                                            <DetailContent>
                                                <DetailLabel>좌석</DetailLabel>
                                                <DetailValue>
                                                    {reservation.seats.join(', ')}
                                                </DetailValue>
                                            </DetailContent>
                                        </DetailItem>
                                    </ReservationDetails>

                                    <ReservationFooter>
                                        <ReservationPrice>
                                            결제 금액: <strong>{reservation.totalAmount.toLocaleString()}원</strong>
                                        </ReservationPrice>

                                        <ReservationActions>
                                            {reservation.status === 'COMPLETED' && (
                                                <ActionButton
                                                    onClick={() => handleOpenTicketModal(reservation)}
                                                    variant="outlined"
                                                >
                                                    티켓 보기
                                                </ActionButton>
                                            )}

                                            {isCancelable(reservation) && (
                                                <ActionButton
                                                    onClick={() => handleOpenCancelModal(reservation)}
                                                    variant="danger"
                                                >
                                                    예매 취소
                                                </ActionButton>
                                            )}

                                            <ActionButton
                                                as={Link}
                                                to={ROUTE_PATHS.MOVIE_DETAIL(reservation.movie.id)}
                                                variant="text"
                                            >
                                                영화 정보
                                            </ActionButton>
                                        </ReservationActions>
                                    </ReservationFooter>
                                </ReservationItem>
                            );
                        })}
                    </ReservationList>

                    <PaginationWrapper>
                        <Pagination
                            currentPage={currentPage}
                            totalPages={reservations.totalPages || 1}
                            onPageChange={handlePageChange}
                        />
                    </PaginationWrapper>
                </>
            ) : (
                <NoReservationMessage>
                    <FaTicketAlt size={32} />
                    <h3>예매 내역이 없습니다</h3>
                    <p>영화 예매 후 이용해 주세요</p>
                    <BookMovieButton as={Link} to={ROUTE_PATHS.MOVIES}>
                        영화 예매하기
                    </BookMovieButton>
                </NoReservationMessage>
            )}

            {/* 예매 취소 모달 */}
            <Modal
                isOpen={showCancelModal}
                onClose={() => setShowCancelModal(false)}
                title="예매 취소"
            >
                {selectedReservation && (
                    <CancelModalContent>
                        <CancelWarning>
                            예매를 취소하시겠습니까? 취소 시 예매 정보가 삭제되며, 환불 규정에 따라 처리됩니다.
                        </CancelWarning>

                        <CancelInfo>
                            <CancelInfoTitle>예매 정보</CancelInfoTitle>
                            <CancelInfoItem>
                                <span>영화</span>
                                <span>{selectedReservation.movie.title}</span>
                            </CancelInfoItem>
                            <CancelInfoItem>
                                <span>상영일시</span>
                                <span>
                                    {dateUtils.formatDate(selectedReservation.screeningDateTime)} {' '}
                                    {dateUtils.formatTime(selectedReservation.screeningDateTime)}
                                </span>
                            </CancelInfoItem>
                            <CancelInfoItem>
                                <span>극장/상영관</span>
                                <span>{selectedReservation.theater.name} / {selectedReservation.screenName}</span>
                            </CancelInfoItem>
                            <CancelInfoItem>
                                <span>결제금액</span>
                                <span>{selectedReservation.totalAmount.toLocaleString()}원</span>
                            </CancelInfoItem>
                        </CancelInfo>

                        <CancelReasonLabel>취소 사유</CancelReasonLabel>
                        <CancelReasonTextarea
                            value={cancelReason}
                            onChange={handleCancelReasonChange}
                            placeholder="취소 사유를 입력해 주세요."
                            rows={3}
                        />

                        {cancelError && <ErrorText>{cancelError}</ErrorText>}

                        <ModalActions>
                            <CancelButton onClick={() => setShowCancelModal(false)}>
                                돌아가기
                            </CancelButton>
                            <ConfirmButton onClick={handleCancelReservation}>
                                예매 취소하기
                            </ConfirmButton>
                        </ModalActions>
                    </CancelModalContent>
                )}
            </Modal>

            {/* 티켓 보기 모달 */}
            <Modal
                isOpen={showTicketModal}
                onClose={() => setShowTicketModal(false)}
                title="예매 티켓"
            >
                {selectedReservation && (
                    <TicketModalContent>
                        <Ticket>
                            <TicketHeader>
                                <MoviePoster
                                    src={selectedReservation.movie.posterUrl || '/images/default-poster.jpg'}
                                    alt={selectedReservation.movie.title}
                                />
                                <TicketInfo>
                                    <TicketTitle>{selectedReservation.movie.title}</TicketTitle>
                                    <TicketDetail>
                                        <FaCalendarAlt />
                                        <span>
                                            {dateUtils.formatDate(selectedReservation.screeningDateTime)} {' '}
                                            {dateUtils.formatTime(selectedReservation.screeningDateTime)}
                                        </span>
                                    </TicketDetail>
                                    <TicketDetail>
                                        <FaMapMarkerAlt />
                                        <span>{selectedReservation.theater.name} / {selectedReservation.screenName}</span>
                                    </TicketDetail>
                                    <TicketDetail>
                                        <FaUsers />
                                        <span>{selectedReservation.audienceCount}명</span>
                                    </TicketDetail>
                                    <TicketDetail>
                                        <span>🪑</span>
                                        <span>{selectedReservation.seats.join(', ')}</span>
                                    </TicketDetail>
                                </TicketInfo>
                            </TicketHeader>

                            <TicketDivider />

                            <TicketFooter>
                                <TicketBarcode>
                                    {/* 바코드 이미지 또는 컴포넌트 */}
                                    <TicketCode>{selectedReservation.reservationCode}</TicketCode>
                                </TicketBarcode>
                            </TicketFooter>
                        </Ticket>

                        <DownloadButton onClick={handleDownloadTicket}>
                            <FaDownload />
                            <span>티켓 다운로드</span>
                        </DownloadButton>
                    </TicketModalContent>
                )}
            </Modal>
        </HistoryContainer>
    );
};

// 스타일 컴포넌트
const HistoryContainer = styled.div`
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
`;

const HistoryTitle = styled.h2`
  font-size: var(--font-size-2xl);
  font-weight: 700;
  margin-bottom: var(--spacing-lg);
  color: var(--color-text-primary);
`;

const ReservationList = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
`;

const ReservationItem = styled.div`
  background-color: var(--color-surface);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--box-shadow-sm);
  padding: var(--spacing-lg);
`;

const ReservationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
`;

const MovieTitle = styled.h3`
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: var(--font-size-lg);
  font-weight: 600;
  
  svg {
    color: var(--color-primary);
  }
`;

const ReservationStatus = styled.div`
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius-full);
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: white;
  background-color: ${props => props.color};
`;

const ReservationDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const DetailItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-sm);
`;

const DetailIcon = styled.div`
  color: var(--color-primary);
  font-size: var(--font-size-md);
`;

const DetailContent = styled.div`
  flex: 1;
`;

const DetailLabel = styled.div`
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin-bottom: 2px;
`;

const DetailValue = styled.div`
  font-weight: 500;
`;

const ReservationFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid var(--color-border);
  padding-top: var(--spacing-md);
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: var(--spacing-md);
    align-items: flex-start;
  }
`;

const ReservationPrice = styled.div`
  font-size: var(--font-size-md);
  
  strong {
    color: var(--color-primary);
    font-weight: 700;
  }
`;

const ReservationActions = styled.div`
  display: flex;
  gap: var(--spacing-sm);
  
  @media (max-width: 768px) {
    width: 100%;
    justify-content: flex-end;
  }
`;

const ActionButton = styled(Button)`
  white-space: nowrap;
`;

const PaginationWrapper = styled.div`
  margin-top: var(--spacing-lg);
  display: flex;
  justify-content: center;
`;

const NoReservationMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-xl);
  background-color: var(--color-surface);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--box-shadow-sm);
  color: var(--color-text-secondary);
  gap: var(--spacing-md);
  
  h3 {
    font-size: var(--font-size-lg);
    font-weight: 600;
    margin: var(--spacing-sm) 0 0;
  }
  
  p {
    margin: 0;
  }
`;

const BookMovieButton = styled(Button)`
  margin-top: var(--spacing-md);
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: var(--spacing-xl);
  color: var(--color-text-secondary);
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: var(--spacing-xl);
  color: var(--color-error);
  background-color: var(--color-surface);
  border-radius: var(--border-radius-md);
  border-left: 4px solid var(--color-error);
`;

const CancelModalContent = styled.div`
  padding: var(--spacing-md);
`;

const CancelWarning = styled.div`
  background-color: #fff0f0;
  color: var(--color-error);
  padding: var(--spacing-md);
  border-radius: var(--border-radius-md);
  margin-bottom: var(--spacing-md);
  font-size: var(--font-size-sm);
`;

const CancelInfo = styled.div`
  background-color: var(--color-background);
  padding: var(--spacing-md);
  border-radius: var(--border-radius-md);
  margin-bottom: var(--spacing-md);
`;

const CancelInfoTitle = styled.h4`
  font-size: var(--font-size-md);
  font-weight: 600;
  margin-bottom: var(--spacing-sm);
`;

const CancelInfoItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--spacing-xs);
  font-size: var(--font-size-sm);
  
  span:first-child {
    color: var(--color-text-secondary);
  }
  
  span:last-child {
    font-weight: 500;
  }
`;

const CancelReasonLabel = styled.label`
  display: block;
  font-weight: 500;
  margin-bottom: var(--spacing-xs);
`;

const CancelReasonTextarea = styled.textarea`
  width: 100%;
  padding: var(--spacing-sm);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  resize: vertical;
  min-height: 80px;
  font-family: inherit;
  
  &:focus {
    outline: none;
    border-color: var(--color-primary);
  }
`;

const ErrorText = styled.div`
  color: var(--color-error);
  font-size: var(--font-size-sm);
  margin-top: var(--spacing-xs);
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-md);
  margin-top: var(--spacing-lg);
`;

const CancelButton = styled(Button)`
  background-color: transparent;
  border: 1px solid var(--color-border);
  color: var(--color-text-primary);
  
  &:hover {
    background-color: var(--color-surface-variant, rgba(0, 0, 0, 0.03));
  }
`;

const ConfirmButton = styled(Button)`
  background-color: var(--color-error);
  color: white;
  
  &:hover {
    background-color: var(--color-error-dark, #c41c1c);
  }
`;

const TicketModalContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--spacing-md);
`;

const Ticket = styled.div`
  width: 100%;
  max-width: 500px;
  background-color: white;
  border-radius: var(--border-radius-lg);
  box-shadow: var(--box-shadow-md);
  overflow: hidden;
  margin-bottom: var(--spacing-lg);
`;

const TicketHeader = styled.div`
  display: flex;
  padding: var(--spacing-md);
`;

const MoviePoster = styled.img`
  width: 100px;
  height: 150px;
  object-fit: cover;
  border-radius: var(--border-radius-md);
  margin-right: var(--spacing-md);
`;

const TicketInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
`;

const TicketTitle = styled.h3`
  font-size: var(--font-size-lg);
  font-weight: 600;
  margin-bottom: var(--spacing-sm);
`;

const TicketDetail = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: var(--font-size-sm);
  
  svg {
    color: var(--color-primary);
  }
`;

const TicketDivider = styled.div`
  height: 1px;
  background: repeating-linear-gradient(
    to right,
    var(--color-border),
    var(--color-border) 5px,
    transparent 5px,
    transparent 10px
  );
  position: relative;
  
  &::before, &::after {
    content: '';
    position: absolute;
    width: 20px;
    height: 20px;
    background-color: var(--color-background);
    border-radius: 50%;
    top: -10px;
  }
  
  &::before {
    left: -10px;
  }
  
  &::after {
    right: -10px;
  }
`;

const TicketFooter = styled.div`
  padding: var(--spacing-md);
`;

const TicketBarcode = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-sm);
  
  &::before {
    content: '';
    width: 80%;
    height: 40px;
    background-image: linear-gradient(
      to right,
      #000 0px,
      #000 1px,
      transparent 1px,
      transparent 3px,
      #000 3px,
      #000 5px,
      transparent 5px,
      transparent 8px,
      #000 8px,
      #000 9px,
      transparent 9px,
      transparent 12px
    );
    background-size: 12px 100%;
    background-repeat: repeat-x;
  }
`;

const TicketCode = styled.div`
  font-family: monospace;
  font-size: var(--font-size-lg);
  letter-spacing: 2px;
`;

const DownloadButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  background-color: var(--color-primary);
  color: white;
  
  &:hover {
    background-color: var(--color-primary-dark, #d01830);
  }
`;

export default ReservationHistory;