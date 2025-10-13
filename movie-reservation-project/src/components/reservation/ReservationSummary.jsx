import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { FaTicketAlt, FaCalendarAlt, FaClock, FaMapMarkerAlt, FaUsers } from 'react-icons/fa';
import formatUtils from '../../utils/formatUtils';

/**
 * 예매 정보 요약 컴포넌트
 * 
 * @param {Object} props
 * @param {Object} props.reservation - 예매 정보 객체
 * @param {Array} props.selectedSeats - 선택한 좌석 배열
 * @param {Object} props.audienceCount - 관람객 수 객체
 * @param {Object} props.priceDetails - 가격 정보 객체
 * @param {Object} props.appliedCoupon - 적용된 쿠폰 정보
 */
const ReservationSummary = ({
    reservation,
    selectedSeats = [],
    audienceCount = {},
    priceDetails = {},
    appliedCoupon
}) => {
    // 선택한 좌석 문자열 생성
    const getSelectedSeatsText = () => {
        if (!selectedSeats || selectedSeats.length === 0) {
            return '선택된 좌석이 없습니다';
        }

        return selectedSeats.map(seat => `${seat.rowName}${seat.seatNumber}`).join(', ');
    };

    // 관람객 수 텍스트 생성
    const getAudienceText = () => {
        const audience = [];

        if (audienceCount.adult && audienceCount.adult > 0) {
            audience.push(`성인 ${audienceCount.adult}명`);
        }

        if (audienceCount.teen && audienceCount.teen > 0) {
            audience.push(`청소년 ${audienceCount.teen}명`);
        }

        if (audienceCount.child && audienceCount.child > 0) {
            audience.push(`어린이 ${audienceCount.child}명`);
        }

        if (audienceCount.senior && audienceCount.senior > 0) {
            audience.push(`경로 ${audienceCount.senior}명`);
        }

        return audience.length > 0 ? audience.join(', ') : '선택된 인원이 없습니다';
    };

    // 할인 금액 계산
    const getDiscountAmount = () => {
        if (appliedCoupon && appliedCoupon.discountAmount) {
            return appliedCoupon.discountAmount;
        }
        return 0;
    };

    // 최종 결제 금액 계산
    const getFinalAmount = () => {
        const totalPrice = priceDetails.totalPrice || 0;
        const discountAmount = getDiscountAmount();
        return Math.max(0, totalPrice - discountAmount);
    };

    return (
        <SummaryContainer>
            <SummaryTitle>예매 정보</SummaryTitle>

            {/* 영화 정보 */}
            <SummarySection>
                <SummaryItem>
                    <ItemIcon>
                        <FaTicketAlt />
                    </ItemIcon>
                    <ItemContent>
                        <ItemLabel>영화</ItemLabel>
                        <ItemValue>{reservation?.movie?.title || '영화를 선택해주세요'}</ItemValue>
                    </ItemContent>
                </SummaryItem>

                {/* 상영관 정보 */}
                <SummaryItem>
                    <ItemIcon>
                        <FaMapMarkerAlt />
                    </ItemIcon>
                    <ItemContent>
                        <ItemLabel>극장/상영관</ItemLabel>
                        <ItemValue>
                            {reservation?.theater?.name || '극장을 선택해주세요'}
                            {reservation?.screening?.screen && ` / ${reservation.screening.screen}`}
                        </ItemValue>
                    </ItemContent>
                </SummaryItem>

                {/* 상영 일시 */}
                <SummaryItem>
                    <ItemIcon>
                        <FaCalendarAlt />
                    </ItemIcon>
                    <ItemContent>
                        <ItemLabel>상영일</ItemLabel>
                        <ItemValue>
                            {reservation?.screening?.date || '날짜를 선택해주세요'}
                        </ItemValue>
                    </ItemContent>
                </SummaryItem>

                {/* 상영 시간 */}
                <SummaryItem>
                    <ItemIcon>
                        <FaClock />
                    </ItemIcon>
                    <ItemContent>
                        <ItemLabel>상영 시간</ItemLabel>
                        <ItemValue>
                            {reservation?.screening?.time || '시간을 선택해주세요'}
                        </ItemValue>
                    </ItemContent>
                </SummaryItem>

                {/* 관람객 정보 */}
                <SummaryItem>
                    <ItemIcon>
                        <FaUsers />
                    </ItemIcon>
                    <ItemContent>
                        <ItemLabel>관람객</ItemLabel>
                        <ItemValue>{getAudienceText()}</ItemValue>
                    </ItemContent>
                </SummaryItem>

                {/* 좌석 정보 */}
                <SummaryItem>
                    <ItemIcon>
                        <span>🪑</span>
                    </ItemIcon>
                    <ItemContent>
                        <ItemLabel>좌석</ItemLabel>
                        <ItemValue>{getSelectedSeatsText()}</ItemValue>
                    </ItemContent>
                </SummaryItem>
            </SummarySection>

            {/* 가격 정보 */}
            <PriceSection>
                <PriceTitle>결제 금액</PriceTitle>

                {audienceCount.adult > 0 && (
                    <PriceItem>
                        <PriceLabel>성인 ({audienceCount.adult}명)</PriceLabel>
                        <PriceValue>{formatUtils.formatCurrency(priceDetails.adultPrice || 0)}</PriceValue>
                    </PriceItem>
                )}

                {audienceCount.teen > 0 && (
                    <PriceItem>
                        <PriceLabel>청소년 ({audienceCount.teen}명)</PriceLabel>
                        <PriceValue>{formatUtils.formatCurrency(priceDetails.teenPrice || 0)}</PriceValue>
                    </PriceItem>
                )}

                {audienceCount.child > 0 && (
                    <PriceItem>
                        <PriceLabel>어린이 ({audienceCount.child}명)</PriceLabel>
                        <PriceValue>{formatUtils.formatCurrency(priceDetails.childPrice || 0)}</PriceValue>
                    </PriceItem>
                )}

                {audienceCount.senior > 0 && (
                    <PriceItem>
                        <PriceLabel>경로 ({audienceCount.senior}명)</PriceLabel>
                        <PriceValue>{formatUtils.formatCurrency(priceDetails.seniorPrice || 0)}</PriceValue>
                    </PriceItem>
                )}

                <Divider />

                <PriceItem>
                    <PriceLabel>총 금액</PriceLabel>
                    <PriceValue>{formatUtils.formatCurrency(priceDetails.totalPrice || 0)}</PriceValue>
                </PriceItem>

                {appliedCoupon && (
                    <PriceItem>
                        <PriceLabel>할인 금액</PriceLabel>
                        <DiscountValue>- {formatUtils.formatCurrency(getDiscountAmount())}</DiscountValue>
                    </PriceItem>
                )}

                <Divider />

                <TotalPriceItem>
                    <TotalPriceLabel>최종 결제 금액</TotalPriceLabel>
                    <TotalPriceValue>{formatUtils.formatCurrency(getFinalAmount())}</TotalPriceValue>
                </TotalPriceItem>
            </PriceSection>
        </SummaryContainer>
    );
};

// 스타일 컴포넌트
const SummaryContainer = styled.div`
  background-color: var(--color-surface);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg);
  box-shadow: var(--box-shadow-sm);
`;

const SummaryTitle = styled.h3`
  font-size: var(--font-size-lg);
  font-weight: 700;
  margin-bottom: var(--spacing-md);
  color: var(--color-text-primary);
`;

const SummarySection = styled.div`
  margin-bottom: var(--spacing-lg);
`;

const SummaryItem = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: var(--spacing-sm);
`;

const ItemIcon = styled.div`
  color: var(--color-primary);
  margin-right: var(--spacing-sm);
  font-size: var(--font-size-md);
  width: 20px;
  text-align: center;
`;

const ItemContent = styled.div`
  flex: 1;
`;

const ItemLabel = styled.div`
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin-bottom: 2px;
`;

const ItemValue = styled.div`
  font-weight: 500;
  color: var(--color-text-primary);
`;

const PriceSection = styled.div`
  margin-top: var(--spacing-lg);
`;

const PriceTitle = styled.h4`
  font-size: var(--font-size-md);
  font-weight: 600;
  margin-bottom: var(--spacing-md);
  color: var(--color-text-primary);
`;

const PriceItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--spacing-xs);
`;

const PriceLabel = styled.div`
  color: var(--color-text-secondary);
`;

const PriceValue = styled.div`
  font-weight: 500;
`;

const DiscountValue = styled.div`
  font-weight: 500;
  color: var(--color-primary);
`;

const Divider = styled.hr`
  border: 0;
  height: 1px;
  background-color: var(--color-border);
  margin: var(--spacing-sm) 0;
`;

const TotalPriceItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: var(--spacing-sm);
`;

const TotalPriceLabel = styled.div`
  font-weight: 600;
  font-size: var(--font-size-md);
`;

const TotalPriceValue = styled.div`
  font-weight: 700;
  font-size: var(--font-size-lg);
  color: var(--color-primary);
`;

ReservationSummary.propTypes = {
    reservation: PropTypes.object,
    selectedSeats: PropTypes.array,
    audienceCount: PropTypes.object,
    priceDetails: PropTypes.object,
    appliedCoupon: PropTypes.object
};

export default ReservationSummary;
