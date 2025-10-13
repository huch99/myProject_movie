// src/components/payment/PaymentMethodSelector.jsx
import React, { useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { FaCreditCard, FaMobileAlt, FaPaypal, FaApple } from 'react-icons/fa';
import { SiKakao, SiNaver } from 'react-icons/si';
import { PAYMENT_METHODS } from '../../styles/variables';


/**
 * 결제 수단 선택 컴포넌트
 * 
 * @param {Object} props
 * @param {string} props.selectedMethod - 선택된 결제 수단
 * @param {Function} props.onMethodSelect - 결제 수단 선택 시 호출될 함수
 */
const PaymentMethodSelector = ({ selectedMethod, onMethodSelect }) => {
    // 결제 수단 목록
    const paymentMethods = [
        {
            id: PAYMENT_METHODS.CREDIT_CARD,
            name: '신용/체크카드',
            icon: <FaCreditCard />
        },
        {
            id: PAYMENT_METHODS.KAKAO_PAY,
            name: '카카오페이',
            icon: <SiKakao />
        },
        {
            id: PAYMENT_METHODS.NAVER_PAY,
            name: '네이버페이',
            icon: <SiNaver />
        },
        {
            id: PAYMENT_METHODS.PAYPAL,
            name: '페이팔',
            icon: <FaPaypal />
        },
        {
            id: PAYMENT_METHODS.APPLE_PAY,
            name: '애플페이',
            icon: <FaApple />
        },
        {
            id: PAYMENT_METHODS.MOBILE,
            name: '휴대폰 결제',
            icon: <FaMobileAlt />
        }
    ];

    return (
        <SelectorContainer>
            <SectionTitle>결제 수단 선택</SectionTitle>

            <MethodGrid>
                {paymentMethods.map((method) => (
                    <MethodItem
                        key={method.id}
                        selected={selectedMethod === method.id}
                        onClick={() => onMethodSelect(method.id)}
                    >
                        <MethodIcon>{method.icon}</MethodIcon>
                        <MethodName>{method.name}</MethodName>
                        {selectedMethod === method.id && (
                            <SelectedIndicator />
                        )}
                    </MethodItem>
                ))}
            </MethodGrid>
        </SelectorContainer>
    );
};

// 스타일 컴포넌트
const SelectorContainer = styled.div`
  background-color: var(--color-surface);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-md);
  box-shadow: var(--box-shadow-sm);
`;

const SectionTitle = styled.h3`
  font-size: var(--font-size-lg);
  font-weight: 600;
  margin-bottom: var(--spacing-md);
  color: var(--color-text-primary);
`;

const MethodGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: var(--spacing-md);
`;

const MethodItem = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-md);
  border-radius: var(--border-radius-md);
  background-color: ${props => props.selected ? 'var(--color-primary-light, rgba(229, 25, 55, 0.1))' : 'var(--color-background)'};
  border: 2px solid ${props => props.selected ? 'var(--color-primary)' : 'var(--color-border)'};
  cursor: pointer;
  transition: var(--transition-fast);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--box-shadow-sm);
  }
`;

const MethodIcon = styled.div`
  font-size: var(--font-size-xl);
  margin-bottom: var(--spacing-sm);
  color: var(--color-primary);
`;

const MethodName = styled.div`
  font-size: var(--font-size-sm);
  font-weight: 500;
  text-align: center;
`;

const SelectedIndicator = styled.div`
  position: absolute;
  top: -8px;
  right: -8px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: var(--color-primary);
  
  &::after {
    content: '✓';
    color: white;
    font-size: 12px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`;

PaymentMethodSelector.propTypes = {
    selectedMethod: PropTypes.string,
    onMethodSelect: PropTypes.func.isRequired
};

export default PaymentMethodSelector;