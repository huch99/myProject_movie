import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { fetchUserCoupons } from '../../store/slices/userSlice';
import { FaTicketAlt, FaCalendarAlt, FaGift, FaCheck } from 'react-icons/fa';
import dateUtils from '../../utils/dateUtils';
import EmptyState from '../common/EmptyState';
import Loading from '../common/Loading';

/**
 * 사용자 쿠폰 목록 컴포넌트
 * 
 * @param {Object} props
 * @param {boolean} props.selectable - 쿠폰 선택 모드 활성화 여부
 * @param {Function} props.onSelect - 쿠폰 선택 시 호출될 함수
 * @param {number} props.selectedCouponId - 현재 선택된 쿠폰 ID
 * @param {number} props.totalAmount - 결제 총액 (할인 가능 여부 확인용)
 */
const CouponList = ({ selectable = false, onSelect, selectedCouponId, totalAmount }) => {
    const dispatch = useDispatch();
    const { coupons, loading, error } = useSelector(state => state.user);

    // 필터 상태
    const [filter, setFilter] = useState('all'); // 'all', 'available', 'expired'

    // 쿠폰 로드
    useEffect(() => {
        dispatch(fetchUserCoupons());
    }, [dispatch]);

    // 쿠폰 필터링
    const getFilteredCoupons = () => {
        if (!coupons) return [];

        const now = new Date();

        switch (filter) {
            case 'available':
                return coupons.filter(coupon => {
                    const expiryDate = new Date(coupon.expiryDate);
                    return expiryDate > now && !coupon.isUsed;
                });
            case 'expired':
                return coupons.filter(coupon => {
                    const expiryDate = new Date(coupon.expiryDate);
                    return expiryDate <= now || coupon.isUsed;
                });
            default:
                return coupons;
        }
    };

    // 쿠폰 선택 핸들러
    const handleSelectCoupon = (coupon) => {
        if (!selectable || coupon.isUsed || isExpired(coupon) || !isCouponApplicable(coupon)) return;

        if (onSelect) {
            onSelect(selectedCouponId === coupon.id ? null : coupon);
        }
    };

    // 쿠폰 만료 여부 확인
    const isExpired = (coupon) => {
        const expiryDate = new Date(coupon.expiryDate);
        return expiryDate <= new Date();
    };

    // 쿠폰 적용 가능 여부 확인
    const isCouponApplicable = (coupon) => {
        // 최소 주문 금액 체크
        if (coupon.minimumOrderAmount && totalAmount < coupon.minimumOrderAmount) {
            return false;
        }

        return true;
    };

    // 필터링된 쿠폰 목록
    const filteredCoupons = getFilteredCoupons();

    // 로딩 중 표시
    if (loading) {
        return <Loading text="쿠폰 정보를 불러오는 중입니다..." />;
    }

    // 에러 표시
    if (error) {
        return <ErrorMessage>{error}</ErrorMessage>;
    }

    return (
        <CouponListContainer>
            <ListHeader>
                <FilterTabs>
                    <FilterTab
                        active={filter === 'all'}
                        onClick={() => setFilter('all')}
                    >
                        전체
                    </FilterTab>
                    <FilterTab
                        active={filter === 'available'}
                        onClick={() => setFilter('available')}
                    >
                        사용 가능
                    </FilterTab>
                    <FilterTab
                        active={filter === 'expired'}
                        onClick={() => setFilter('expired')}
                    >
                        만료/사용됨
                    </FilterTab>
                </FilterTabs>

                <CouponCount>{filteredCoupons.length}개의 쿠폰</CouponCount>
            </ListHeader>

            {filteredCoupons.length > 0 ? (
                <CouponGrid>
                    {filteredCoupons.map(coupon => {
                        const isExpiredCoupon = isExpired(coupon);
                        const isApplicable = isCouponApplicable(coupon);
                        const isSelected = selectedCouponId === coupon.id;

                        return (
                            <CouponCard
                                key={coupon.id}
                                expired={isExpiredCoupon || coupon.isUsed}
                                selectable={selectable && !isExpiredCoupon && !coupon.isUsed && isApplicable}
                                selected={isSelected}
                                onClick={() => handleSelectCoupon(coupon)}
                            >
                                {isSelected && (
                                    <SelectedBadge>
                                        <FaCheck />
                                    </SelectedBadge>
                                )}

                                <CouponHeader>
                                    <CouponType>
                                        <FaTicketAlt />
                                        <span>{coupon.type || '할인 쿠폰'}</span>
                                    </CouponType>

                                    {(isExpiredCoupon || coupon.isUsed) && (
                                        <CouponStatus>
                                            {coupon.isUsed ? '사용 완료' : '기간 만료'}
                                        </CouponStatus>
                                    )}
                                </CouponHeader>

                                <CouponName>{coupon.name}</CouponName>

                                <DiscountInfo>
                                    {coupon.discountType === 'percentage' ? (
                                        <DiscountValue>{coupon.discountValue}% 할인</DiscountValue>
                                    ) : (
                                        <DiscountValue>{coupon.discountAmount?.toLocaleString()}원 할인</DiscountValue>
                                    )}

                                    {coupon.maximumDiscountAmount > 0 && (
                                        <MaxDiscount>최대 {coupon.maximumDiscountAmount.toLocaleString()}원</MaxDiscount>
                                    )}
                                </DiscountInfo>

                                {coupon.minimumOrderAmount > 0 && (
                                    <MinimumOrderInfo>
                                        {coupon.minimumOrderAmount.toLocaleString()}원 이상 구매 시 사용 가능
                                    </MinimumOrderInfo>
                                )}

                                <CouponFooter>
                                    <ExpiryDate>
                                        <FaCalendarAlt />
                                        <span>
                                            {dateUtils.formatDate(coupon.expiryDate)}까지
                                        </span>
                                    </ExpiryDate>

                                    {!isExpiredCoupon && !coupon.isUsed && !selectable && (
                                        <CouponIcon>
                                            <FaGift />
                                        </CouponIcon>
                                    )}
                                </CouponFooter>

                                {selectable && !isApplicable && !isExpiredCoupon && !coupon.isUsed && (
                                    <NotApplicableOverlay>
                                        <NotApplicableText>
                                            최소 주문금액을 충족하지 않습니다
                                        </NotApplicableText>
                                    </NotApplicableOverlay>
                                )}
                            </CouponCard>
                        );
                    })}
                </CouponGrid>
            ) : (
                <EmptyState
                    icon={<FaGift size={32} />}
                    title="쿠폰이 없습니다"
                    description={filter === 'all'
                        ? "보유하신 쿠폰이 없습니다."
                        : filter === 'available'
                            ? "사용 가능한 쿠폰이 없습니다."
                            : "만료되거나 사용된 쿠폰이 없습니다."
                    }
                />
            )}
        </CouponListContainer>
    );
};

// 스타일 컴포넌트
const CouponListContainer = styled.div`
  width: 100%;
`;

const ListHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
`;

const FilterTabs = styled.div`
  display: flex;
  gap: var(--spacing-xs);
`;

const FilterTab = styled.button`
  padding: var(--spacing-xs) var(--spacing-md);
  background-color: ${props => props.active
        ? 'var(--color-primary)'
        : 'var(--color-surface)'};
  color: ${props => props.active
        ? 'white'
        : 'var(--color-text-primary)'};
  border: none;
  border-radius: var(--border-radius-md);
  cursor: pointer;
  transition: var(--transition-fast);
  font-size: var(--font-size-sm);
  
  &:hover {
    background-color: ${props => props.active
        ? 'var(--color-primary)'
        : 'var(--color-surface-variant, rgba(0, 0, 0, 0.03))'};
  }
`;

const CouponCount = styled.div`
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
`;

const CouponGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--spacing-md);
`;

const CouponCard = styled.div`
  position: relative;
  background-color: ${props => props.expired
        ? 'var(--color-surface-variant, rgba(0, 0, 0, 0.03))'
        : 'var(--color-surface)'};
  border: 1px solid ${props => props.selected
        ? 'var(--color-primary)'
        : 'var(--color-border)'};
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-md);
  box-shadow: ${props => props.selected
        ? '0 0 0 2px var(--color-primary-light, rgba(229, 25, 55, 0.1))'
        : 'var(--box-shadow-sm)'};
  opacity: ${props => props.expired ? 0.7 : 1};
  cursor: ${props => props.selectable ? 'pointer' : 'default'};
  transition: var(--transition-fast);
  
  &:hover {
    transform: ${props => props.selectable ? 'translateY(-2px)' : 'none'};
  }
`;

const SelectedBadge = styled.div`
  position: absolute;
  top: -10px;
  right: -10px;
  width: 24px;
  height: 24px;
  background-color: var(--color-primary);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-sm);
`;

const CouponHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-sm);
`;

const CouponType = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: var(--font-size-sm);
  color: var(--color-primary);
`;

const CouponStatus = styled.div`
  padding: var(--spacing-xs) var(--spacing-sm);
  background-color: var(--color-text-disabled);
  color: white;
  border-radius: var(--border-radius-full);
  font-size: var(--font-size-xs);
  font-weight: 500;
`;

const CouponName = styled.h3`
  font-size: var(--font-size-md);
  font-weight: 600;
  margin-bottom: var(--spacing-sm);
`;

const DiscountInfo = styled.div`
  margin-bottom: var(--spacing-sm);
`;

const DiscountValue = styled.div`
  font-size: var(--font-size-lg);
  font-weight: 700;
  color: var(--color-primary);
`;

const MaxDiscount = styled.div`
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
`;

const MinimumOrderInfo = styled.div`
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-sm);
`;

const CouponFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: var(--spacing-md);
`;

const ExpiryDate = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
`;

const CouponIcon = styled.div`
  color: var(--color-primary);
`;

const NotApplicableOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--border-radius-lg);
`;

const NotApplicableText = styled.div`
  background-color: white;
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--color-error);
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: var(--spacing-xl);
  color: var(--color-error);
  background-color: var(--color-surface);
  border-radius: var(--border-radius-md);
  border-left: 4px solid var(--color-error);
`;

CouponList.propTypes = {
    selectable: PropTypes.bool,
    onSelect: PropTypes.func,
    selectedCouponId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    totalAmount: PropTypes.number
};

export default CouponList;