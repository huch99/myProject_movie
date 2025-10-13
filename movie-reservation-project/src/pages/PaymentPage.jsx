// src/pages/PaymentPage.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { fetchReservationDetails, processPayment } from '../store/slices/reservationSlice';
import PaymentForm from '../components/reservation/PaymentForm';
import ReservationSummary from '../components/reservation/ReservationSummary';
import PageTitle from '../components/common/PageTitle';
import Container from '../components/layout/Container';
import { FaArrowLeft, FaCreditCard } from 'react-icons/fa';
import ROUTE_PATHS from '../constants/routePaths';

/**
 * 결제 페이지 컴포넌트
 */
const PaymentPage = () => {
    const { reservationId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    // 예매 정보와 선택된 좌석 정보는 location state에서 가져오거나 API로 조회
    const reservationData = location.state?.reservationData;
    const selectedSeats = location.state?.selectedSeats || [];

    // 리덕스 상태
    const { reservation, loading, error } = useSelector(state => state.reservation);
    const { user } = useSelector(state => state.auth);

    // 로컬 상태
    const [paymentProcessing, setPaymentProcessing] = useState(false);
    const [paymentError, setPaymentError] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState(null);

    // 결제 정보 초기화
    const initialReservation = reservationData || reservation;

    // 예매 정보 로드
    useEffect(() => {
        if (reservationId && !reservationData) {
            dispatch(fetchReservationDetails(reservationId));
        }
    }, [dispatch, reservationId, reservationData]);

    // 로그인 여부 확인
    useEffect(() => {
        if (!user) {
            navigate(ROUTE_PATHS.LOGIN, {
                state: {
                    from: location.pathname,
                    message: '결제를 진행하려면 로그인이 필요합니다.'
                }
            });
        }
    }, [user, navigate, location]);

    // 결제 처리 핸들러
    const handlePayment = async (paymentData) => {
        try {
            setPaymentProcessing(true);
            setPaymentError('');

            // 결제 요청 데이터 구성
            const paymentRequest = {
                reservationId: initialReservation.id,
                paymentMethod: paymentData.method,
                amount: paymentData.amount,
                cardInfo: paymentData.cardInfo,
                phoneInfo: paymentData.phoneInfo,
                couponId: appliedCoupon?.id
            };

            // 결제 처리 액션 디스패치
            const result = await dispatch(processPayment(paymentRequest)).unwrap();

            // 결제 성공 시 완료 페이지로 이동
            navigate(ROUTE_PATHS.PAYMENT_COMPLETE, {
                state: {
                    paymentResult: result,
                    reservation: initialReservation
                }
            });

        } catch (err) {
            console.error('결제 처리 오류:', err);
            setPaymentError('결제 처리 중 오류가 발생했습니다. 다시 시도해주세요.');
        } finally {
            setPaymentProcessing(false);
        }
    };

    // 뒤로 가기 핸들러
    const handleGoBack = () => {
        navigate(-1);
    };

    // 쿠폰 적용 핸들러
    const handleApplyCoupon = (coupon) => {
        setAppliedCoupon(coupon);
    };

    // 가격 정보 계산
    const calculatePriceDetails = () => {
        if (!initialReservation) return {};

        const audienceCount = initialReservation.audienceCount || {};

        // 티켓 가격 (실제 구현 시 서버에서 가져오거나 상수로 정의)
        const TICKET_PRICES = {
            adult: 14000,
            teen: 12000,
            child: 10000,
            senior: 8000
        };

        const adultPrice = (audienceCount.adult || 0) * TICKET_PRICES.adult;
        const teenPrice = (audienceCount.teen || 0) * TICKET_PRICES.teen;
        const childPrice = (audienceCount.child || 0) * TICKET_PRICES.child;
        const seniorPrice = (audienceCount.senior || 0) * TICKET_PRICES.senior;

        const totalPrice = adultPrice + teenPrice + childPrice + seniorPrice;

        return {
            adultPrice,
            teenPrice,
            childPrice,
            seniorPrice,
            totalPrice
        };
    };

    // 로딩 중이거나 예매 정보가 없는 경우
    if ((loading && !reservationData) || (!initialReservation && !error)) {
        return (
            <Container>
                <PageTitle>결제 정보를 불러오는 중입니다...</PageTitle>
            </Container>
        );
    }

    // 에러 발생 시
    if (error) {
        return (
            <Container>
                <PageTitle>결제 정보 로드 실패</PageTitle>
                <ErrorMessage>{error}</ErrorMessage>
                <BackButton onClick={handleGoBack}>
                    <FaArrowLeft />
                    <span>이전 페이지로 돌아가기</span>
                </BackButton>
            </Container>
        );
    }

    const priceDetails = calculatePriceDetails();

    return (
        <Container>
            <PageHeader>
                <BackButton onClick={handleGoBack}>
                    <FaArrowLeft />
                    <span>이전</span>
                </BackButton>
                <PageTitle>
                    <FaCreditCard />
                    <span>결제하기</span>
                </PageTitle>
            </PageHeader>

            <PaymentPageContent>
                {/* 왼쪽: 결제 폼 */}
                <PaymentFormSection>
                    <PaymentForm
                        onSubmit={handlePayment}
                        totalAmount={priceDetails.totalPrice}
                        reservation={initialReservation}
                        processing={paymentProcessing}
                    />

                    {paymentError && (
                        <PaymentErrorMessage>{paymentError}</PaymentErrorMessage>
                    )}
                </PaymentFormSection>

                {/* 오른쪽: 예매 정보 요약 */}
                <SummarySection>
                    <ReservationSummary
                        reservation={initialReservation}
                        selectedSeats={selectedSeats}
                        audienceCount={initialReservation.audienceCount}
                        priceDetails={priceDetails}
                        appliedCoupon={appliedCoupon}
                    />

                    {/* 쿠폰 섹션 */}
                    <CouponSection>
                        <SectionTitle>쿠폰 적용</SectionTitle>
                        {user?.coupons?.length > 0 ? (
                            <>
                                <CouponSelect
                                    onChange={(e) => {
                                        const couponId = e.target.value;
                                        if (couponId) {
                                            const selectedCoupon = user.coupons.find(c => c.id === couponId);
                                            handleApplyCoupon(selectedCoupon);
                                        } else {
                                            handleApplyCoupon(null);
                                        }
                                    }}
                                    defaultValue=""
                                >
                                    <option value="">쿠폰을 선택하세요</option>
                                    {user.coupons.map(coupon => (
                                        <option key={coupon.id} value={coupon.id}>
                                            {coupon.name} ({coupon.discountAmount.toLocaleString()}원 할인)
                                        </option>
                                    ))}
                                </CouponSelect>

                                {appliedCoupon && (
                                    <AppliedCoupon>
                                        <span>적용된 쿠폰:</span>
                                        <strong>{appliedCoupon.name}</strong>
                                        <span>({appliedCoupon.discountAmount.toLocaleString()}원 할인)</span>
                                    </AppliedCoupon>
                                )}
                            </>
                        ) : (
                            <NoCoupon>사용 가능한 쿠폰이 없습니다.</NoCoupon>
                        )}
                    </CouponSection>

                    {/* 결제 약관 */}
                    <TermsSection>
                        <SectionTitle>결제 약관</SectionTitle>
                        <TermsContent>
                            <p>1. 예매 완료 후 부분 취소는 불가하며, 전체 취소만 가능합니다.</p>
                            <p>2. 상영 시간 이후에는 취소가 불가합니다.</p>
                            <p>3. 상영 시작 3시간 전까지 취소 시 100% 환불, 이후 취소 시 수수료가 부과됩니다.</p>
                            <p>4. 신용카드 결제 취소는 카드사 사정에 따라 취소 처리에 3~5일이 소요될 수 있습니다.</p>
                        </TermsContent>
                    </TermsSection>
                </SummarySection>
            </PaymentPageContent>

            <PaymentNotice>
                <NoticeIcon>i</NoticeIcon>
                <NoticeText>
                    결제 완료 후 예매내역은 마이페이지에서 확인하실 수 있습니다.
                </NoticeText>
            </PaymentNotice>
        </Container>
    );
};

// 스타일 컴포넌트
const PageHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: var(--spacing-lg);
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  background: none;
  border: none;
  color: var(--color-text-secondary);
  font-size: var(--font-size-md);
  cursor: pointer;
  padding: var(--spacing-xs);
  margin-right: var(--spacing-md);
  
  &:hover {
    color: var(--color-primary);
  }
`;

const PaymentPageContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-xl);
  
  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

const PaymentFormSection = styled.div`
  order: 2;
  
  @media (max-width: 992px) {
    order: 1;
  }
`;

const SummarySection = styled.div`
  order: 1;
  
  @media (max-width: 992px) {
    order: 2;
  }
`;

const SectionTitle = styled.h3`
  font-size: var(--font-size-lg);
  font-weight: 600;
  margin-bottom: var(--spacing-md);
  color: var(--color-text-primary);
`;

const CouponSection = styled.div`
  margin-top: var(--spacing-lg);
  padding: var(--spacing-md);
  background-color: var(--color-surface);
  border-radius: var(--border-radius-md);
`;

const CouponSelect = styled.select`
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-md);
  
  &:focus {
    outline: none;
    border-color: var(--color-primary);
  }
`;

const AppliedCoupon = styled.div`
  margin-top: var(--spacing-sm);
  font-size: var(--font-size-sm);
  
  strong {
    color: var(--color-primary);
    margin: 0 var(--spacing-xs);
  }
`;

const NoCoupon = styled.div`
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
`;

const TermsSection = styled.div`
  margin-top: var(--spacing-lg);
  padding: var(--spacing-md);
  background-color: var(--color-surface);
  border-radius: var(--border-radius-md);
`;

const TermsContent = styled.div`
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  
  p {
    margin-bottom: var(--spacing-xs);
  }
`;

const PaymentErrorMessage = styled.div`
  background-color: #fff0f0;
  color: var(--color-error);
  padding: var(--spacing-md);
  border-radius: var(--border-radius-md);
  margin-top: var(--spacing-md);
  font-size: var(--font-size-sm);
  border-left: 3px solid var(--color-error);
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: var(--spacing-xl);
  color: var(--color-error);
  background-color: var(--color-surface);
  border-radius: var(--border-radius-md);
  border-left: 4px solid var(--color-error);
  margin-bottom: var(--spacing-lg);
`;

const PaymentNotice = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-xl);
  padding: var(--spacing-md);
  background-color: var(--color-surface-variant, rgba(0, 0, 0, 0.03));
  border-radius: var(--border-radius-md);
`;

const NoticeIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: var(--color-primary);
  color: white;
  font-size: var(--font-size-sm);
  font-weight: 700;
`;

const NoticeText = styled.p`
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
`;

export default PaymentPage;