// src/pages/PaymentCompletePage.js
import React, { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaCheckCircle, FaTicketAlt, FaPrint, FaDownload, FaHome } from 'react-icons/fa';
import Container from '../components/layout/Container';
import Button from '../components/common/Button';
import ReservationSummary from '../components/reservation/ReservationSummary';
import PageTitle from '../components/common/PageTitle';
import ROUTE_PATHS from '../constants/routePaths';

/**
 * 결제 완료 페이지 컴포넌트
 */
const PaymentCompletePage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // location.state에서 결제 결과와 예매 정보 가져오기
    const { paymentResult, reservation } = location.state || {};

    // 결제 정보 없이 직접 URL 접근 시 홈으로 리다이렉트
    useEffect(() => {
        if (!paymentResult || !reservation) {
            navigate(ROUTE_PATHS.HOME);
        }
    }, [paymentResult, reservation, navigate]);

    // 결제 정보가 없는 경우 렌더링하지 않음
    if (!paymentResult || !reservation) {
        return null;
    }

    // 예매 번호 생성 (실제로는 서버에서 생성된 값 사용)
    const reservationNumber = paymentResult.reservationCode || 'UNKNOWN';

    return (
        <Container>
            <CompletePageWrapper>
                <PageTitle>결제 완료</PageTitle>

                <CompleteMessage>
                    <CheckIcon>
                        <FaCheckCircle />
                    </CheckIcon>
                    <MessageTitle>예매가 완료되었습니다!</MessageTitle>
                    <ReservationNumber>예매번호: {reservationNumber}</ReservationNumber>
                </CompleteMessage>

                <SummarySection>
                    <SectionTitle>예매 정보</SectionTitle>
                    <ReservationSummary
                        reservation={reservation}
                        selectedSeats={reservation.seats}
                        audienceCount={reservation.audienceCount}
                        priceDetails={{
                            totalPrice: paymentResult.amount
                        }}
                    />
                </SummarySection>

                <PaymentInfoSection>
                    <SectionTitle>결제 정보</SectionTitle>
                    <PaymentInfoGrid>
                        <PaymentInfoItem>
                            <InfoLabel>결제 수단</InfoLabel>
                            <InfoValue>{paymentResult.paymentMethod}</InfoValue>
                        </PaymentInfoItem>

                        <PaymentInfoItem>
                            <InfoLabel>결제 금액</InfoLabel>
                            <InfoValue>{paymentResult.amount?.toLocaleString()}원</InfoValue>
                        </PaymentInfoItem>

                        <PaymentInfoItem>
                            <InfoLabel>결제 일시</InfoLabel>
                            <InfoValue>{paymentResult.paymentDate}</InfoValue>
                        </PaymentInfoItem>

                        <PaymentInfoItem>
                            <InfoLabel>승인번호</InfoLabel>
                            <InfoValue>{paymentResult.approvalCode || '-'}</InfoValue>
                        </PaymentInfoItem>
                    </PaymentInfoGrid>
                </PaymentInfoSection>

                <NoticeSection>
                    <NoticeTitle>유의사항</NoticeTitle>
                    <NoticeList>
                        <NoticeItem>예매 내역은 마이페이지 &gt; 예매 내역에서 확인하실 수 있습니다.</NoticeItem>
                        <NoticeItem>상영 시작 시간 20분 전부터 입장이 가능합니다.</NoticeItem>
                        <NoticeItem>상영 시작 시간 이후에는 입장이 제한될 수 있습니다.</NoticeItem>
                        <NoticeItem>예매 취소는 상영 시작 20분 전까지 가능하며, 그 이후에는 취소 및 환불이 불가합니다.</NoticeItem>
                    </NoticeList>
                </NoticeSection>

                <ActionButtons>
                    <PrintButton>
                        <FaPrint />
                        <span>예매내역 출력</span>
                    </PrintButton>

                    <DownloadButton>
                        <FaDownload />
                        <span>티켓 다운로드</span>
                    </DownloadButton>

                    <HomeButton as={Link} to={ROUTE_PATHS.HOME}>
                        <FaHome />
                        <span>홈으로</span>
                    </HomeButton>

                    <MyPageButton as={Link} to={ROUTE_PATHS.RESERVATION_HISTORY}>
                        <FaTicketAlt />
                        <span>예매내역 보기</span>
                    </MyPageButton>
                </ActionButtons>
            </CompletePageWrapper>
        </Container>
    );
};

// 스타일 컴포넌트
const CompletePageWrapper = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: var(--spacing-lg) 0;
`;

const CompleteMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: var(--spacing-xl);
  padding: var(--spacing-lg);
  background-color: var(--color-surface);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--box-shadow-sm);
`;

const CheckIcon = styled.div`
  font-size: 48px;
  color: var(--color-success);
  margin-bottom: var(--spacing-md);
`;

const MessageTitle = styled.h2`
  font-size: var(--font-size-xl);
  font-weight: 700;
  margin-bottom: var(--spacing-sm);
  color: var(--color-text-primary);
`;

const ReservationNumber = styled.div`
  font-size: var(--font-size-md);
  font-weight: 600;
  color: var(--color-primary);
  background-color: var(--color-primary-light, rgba(229, 25, 55, 0.1));
  padding: var(--spacing-xs) var(--spacing-md);
  border-radius: var(--border-radius-full);
`;

const SummarySection = styled.section`
  margin-bottom: var(--spacing-lg);
`;

const SectionTitle = styled.h3`
  font-size: var(--font-size-lg);
  font-weight: 600;
  margin-bottom: var(--spacing-md);
  color: var(--color-text-primary);
`;

const PaymentInfoSection = styled.section`
  margin-bottom: var(--spacing-lg);
  padding: var(--spacing-lg);
  background-color: var(--color-surface);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--box-shadow-sm);
`;

const PaymentInfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-md);
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const PaymentInfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
`;

const InfoLabel = styled.div`
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
`;

const InfoValue = styled.div`
  font-weight: 500;
`;

const NoticeSection = styled.section`
  margin-bottom: var(--spacing-xl);
  padding: var(--spacing-lg);
  background-color: var(--color-surface-variant, rgba(0, 0, 0, 0.03));
  border-radius: var(--border-radius-lg);
`;

const NoticeTitle = styled.h4`
  font-size: var(--font-size-md);
  font-weight: 600;
  margin-bottom: var(--spacing-sm);
  color: var(--color-text-primary);
`;

const NoticeList = styled.ul`
  padding-left: var(--spacing-lg);
`;

const NoticeItem = styled.li`
  margin-bottom: var(--spacing-xs);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
`;

const ActionButtons = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-md);
  
  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
`;

const ActionButton = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  font-weight: 500;
`;

const PrintButton = styled(ActionButton)`
  background-color: var(--color-surface);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
  
  &:hover {
    background-color: var(--color-surface-variant, rgba(0, 0, 0, 0.03));
  }
`;

const DownloadButton = styled(ActionButton)`
  background-color: var(--color-surface);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
  
  &:hover {
    background-color: var(--color-surface-variant, rgba(0, 0, 0, 0.03));
  }
`;

const HomeButton = styled(ActionButton)`
  background-color: var(--color-surface);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
  
  &:hover {
    background-color: var(--color-surface-variant, rgba(0, 0, 0, 0.03));
  }
`;

const MyPageButton = styled(ActionButton)`
  background-color: var(--color-primary);
  color: white;
  
  &:hover {
    background-color: var(--color-primary-dark, #d01830);
  }
`;

export default PaymentCompletePage;