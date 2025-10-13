// src/components/payment/CouponSelector.jsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { FaTicketAlt, FaAngleDown, FaAngleUp, FaCheck } from 'react-icons/fa';
import formatUtils from '../../utils/formatUtils';

/**
 * 쿠폰 선택 컴포넌트
 * 
 * @param {Object} props
 * @param {Array} props.coupons - 사용 가능한 쿠폰 목록
 * @param {Object} props.selectedCoupon - 현재 선택된 쿠폰
 * @param {Function} props.onSelectCoupon - 쿠폰 선택 시 호출될 함수
 * @param {number} props.totalAmount - 결제 총액 (쿠폰 적용 가능 여부 확인용)
 */
const CouponSelector = ({ coupons = [], selectedCoupon, onSelectCoupon, totalAmount = 0 }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [availableCoupons, setAvailableCoupons] = useState([]);

    // 사용 가능한 쿠폰 필터링
    useEffect(() => {
        const filtered = coupons.filter(coupon => {
            // 만료된 쿠폰 제외
            const isExpired = new Date(coupon.expiryDate) < new Date();
            if (isExpired) return false;

            // 이미 사용된 쿠폰 제외
            if (coupon.isUsed) return false;

            // 최소 주문 금액 확인
            if (coupon.minimumOrderAmount && totalAmount < coupon.minimumOrderAmount) {
                return false;
            }

            return true;
        });

        setAvailableCoupons(filtered);
    }, [coupons, totalAmount]);

    // 쿠폰 선택 핸들러
    const handleSelectCoupon = (coupon) => {
        onSelectCoupon(coupon);
        setIsOpen(false);
    };

    // 쿠폰 선택 취소 핸들러
    const handleClearCoupon = () => {
        onSelectCoupon(null);
    };

    // 할인 금액 계산
    const calculateDiscount = (coupon) => {
        if (!coupon) return 0;

        if (coupon.discountType === 'percentage') {
            const discount = Math.floor((totalAmount * coupon.discountValue) / 100);
            return coupon.maximumDiscountAmount
                ? Math.min(discount, coupon.maximumDiscountAmount)
                : discount;
        } else {
            return Math.min(coupon.discountAmount, totalAmount);
        }
    };

    // 선택된 쿠폰 표시 텍스트
    const getSelectedCouponText = () => {
        if (!selectedCoupon) return '사용 가능한 쿠폰 선택';

        const discount = calculateDiscount(selectedCoupon);
        return `${selectedCoupon.name} (${formatUtils.formatCurrency(discount)} 할인)`;
    };

    return (
        <SelectorContainer>
            <SectionTitle>쿠폰 적용</SectionTitle>

            <DropdownContainer>
                <SelectedCoupon onClick={() => setIsOpen(!isOpen)}>
                    <SelectedCouponText>
                        <FaTicketAlt />
                        <span>{getSelectedCouponText()}</span>
                    </SelectedCouponText>
                    {isOpen ? <FaAngleUp /> : <FaAngleDown />}
                </SelectedCoupon>

                {isOpen && (
                    <CouponDropdown>
                        {availableCoupons.length > 0 ? (
                            <>
                                <CouponOption onClick={handleClearCoupon}>
                                    <CouponOptionText>쿠폰 적용 안함</CouponOptionText>
                                    {!selectedCoupon && <FaCheck />}
                                </CouponOption>

                                {availableCoupons.map(coupon => {
                                    const isSelected = selectedCoupon && selectedCoupon.id === coupon.id;
                                    const discount = calculateDiscount(coupon);

                                    return (
                                        <CouponOption
                                            key={coupon.id}
                                            onClick={() => handleSelectCoupon(coupon)}
                                            selected={isSelected}
                                        >
                                            <CouponInfo>
                                                <CouponName>{coupon.name}</CouponName>
                                                <CouponDescription>
                                                    {coupon.discountType === 'percentage'
                                                        ? `${coupon.discountValue}% 할인`
                                                        : `${formatUtils.formatCurrency(coupon.discountAmount)} 할인`}
                                                    {coupon.minimumOrderAmount > 0 &&
                                                        ` (${formatUtils.formatCurrency(coupon.minimumOrderAmount)} 이상 구매 시)`}
                                                </CouponDescription>
                                                <CouponExpiry>
                                                    {new Date(coupon.expiryDate).toLocaleDateString()} 까지
                                                </CouponExpiry>
                                            </CouponInfo>
                                            <CouponDiscount>
                                                {formatUtils.formatCurrency(discount)}
                                                {isSelected && <FaCheck />}
                                            </CouponDiscount>
                                        </CouponOption>
                                    );
                                })}
                            </>
                        ) : (
                            <EmptyCoupon>사용 가능한 쿠폰이 없습니다</EmptyCoupon>
                        )}
                    </CouponDropdown>
                )}
            </DropdownContainer>

            {selectedCoupon && (
                <DiscountInfo>
                    <DiscountLabel>할인 금액:</DiscountLabel>
                    <DiscountValue>{formatUtils.formatCurrency(calculateDiscount(selectedCoupon))}</DiscountValue>
                </DiscountInfo>
            )}
        </SelectorContainer>
    );
};

// 스타일 컴포넌트
const SelectorContainer = styled.div`
  margin-bottom: var(--spacing-lg);
`;

const SectionTitle = styled.h3`
  font-size: var(--font-size-lg);
  font-weight: 600;
  margin-bottom: var(--spacing-sm);
  color: var(--color-text-primary);
`;

const DropdownContainer = styled.div`
  position: relative;
  width: 100%;
`;

const SelectedCoupon = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  background-color: var(--color-surface);
  cursor: pointer;
  
  &:hover {
    border-color: var(--color-primary);
  }
`;

const SelectedCouponText = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  
  svg {
    color: var(--color-primary);
  }
`;

const CouponDropdown = styled.div`
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  width: 100%;
  max-height: 300px;
  overflow-y: auto;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  box-shadow: var(--box-shadow-md);
  z-index: 10;
`;

const CouponOption = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-sm) var(--spacing-md);
  border-bottom: 1px solid var(--color-border);
  background-color: ${props => props.selected ? 'var(--color-primary-light, rgba(229, 25, 55, 0.1))' : 'transparent'};
  cursor: pointer;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background-color: var(--color-surface-variant, rgba(0, 0, 0, 0.03));
  }
`;

const CouponInfo = styled.div`
  flex: 1;
`;

const CouponName = styled.div`
  font-weight: 500;
  margin-bottom: var(--spacing-xs);
`;

const CouponDescription = styled.div`
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-xs);
`;

const CouponExpiry = styled.div`
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
`;

const CouponDiscount = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  color: var(--color-primary);
  font-weight: 600;
  
  svg {
    color: var(--color-success);
  }
`;

const EmptyCoupon = styled.div`
  padding: var(--spacing-md);
  text-align: center;
  color: var(--color-text-secondary);
`;

const CouponOptionText = styled.div`
  font-weight: 500;
`;

const DiscountInfo = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-sm);
  padding-top: var(--spacing-sm);
  border-top: 1px dashed var(--color-border);
`;

const DiscountLabel = styled.div`
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
`;

const DiscountValue = styled.div`
  font-size: var(--font-size-md);
  font-weight: 600;
  color: var(--color-primary);
`;

CouponSelector.propTypes = {
    coupons: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            name: PropTypes.string.isRequired,
            discountType: PropTypes.oneOf(['percentage', 'fixed']).isRequired,
            discountValue: PropTypes.number,
            discountAmount: PropTypes.number,
            maximumDiscountAmount: PropTypes.number,
            minimumOrderAmount: PropTypes.number,
            expiryDate: PropTypes.string.isRequired,
            isUsed: PropTypes.bool
        })
    ),
    selectedCoupon: PropTypes.object,
    onSelectCoupon: PropTypes.func.isRequired,
    totalAmount: PropTypes.number
};

export default CouponSelector;