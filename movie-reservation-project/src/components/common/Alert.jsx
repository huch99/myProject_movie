// src/components/common/Alert.jsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { FaCheckCircle, FaInfoCircle, FaExclamationTriangle, FaTimesCircle, FaTimes } from 'react-icons/fa';

/**
 * 알림 메시지 컴포넌트
 * 
 * @param {Object} props
 * @param {string} props.message - 알림 메시지 내용
 * @param {string} props.type - 알림 타입 ('success', 'info', 'warning', 'error')
 * @param {boolean} props.showIcon - 아이콘 표시 여부 (기본값: true)
 * @param {number} props.autoClose - 자동으로 닫히는 시간(ms) (0이면 자동 닫힘 비활성화)
 * @param {Function} props.onClose - 알림이 닫힐 때 호출될 함수
 */
const Alert = ({
    message,
    type = 'info',
    showIcon = true,
    autoClose = 0,
    onClose
}) => {
    const [visible, setVisible] = useState(true);

    // 자동 닫힘 기능
    useEffect(() => {
        if (autoClose > 0 && visible) {
            const timer = setTimeout(() => {
                handleClose();
            }, autoClose);

            return () => clearTimeout(timer);
        }
    }, [autoClose, visible]);

    // 알림 닫기 핸들러
    const handleClose = () => {
        setVisible(false);
        if (onClose) {
            onClose();
        }
    };

    // 알림이 보이지 않으면 렌더링하지 않음
    if (!visible) {
        return null;
    }

    // 알림 타입에 따른 아이콘 선택
    const renderIcon = () => {
        switch (type) {
            case 'success':
                return <FaCheckCircle />;
            case 'warning':
                return <FaExclamationTriangle />;
            case 'error':
                return <FaTimesCircle />;
            case 'info':
            default:
                return <FaInfoCircle />;
        }
    };

    return (
        <AlertContainer type={type}>
            {showIcon && <AlertIcon type={type}>{renderIcon()}</AlertIcon>}
            <AlertMessage>{message}</AlertMessage>
            <CloseButton onClick={handleClose}>
                <FaTimes />
            </CloseButton>
        </AlertContainer>
    );
};

// 스타일 컴포넌트
const AlertContainer = styled.div`
  display: flex;
  align-items: center;
  padding: var(--spacing-md, 1rem);
  margin-bottom: var(--spacing-lg, 1.5rem);
  border-radius: var(--border-radius-md, 4px);
  background-color: ${props => {
        switch (props.type) {
            case 'success':
                return 'var(--color-success-light, #e6f4ea)';
            case 'warning':
                return 'var(--color-warning-light, #fff8e6)';
            case 'error':
                return 'var(--color-error-light, #fdeded)';
            case 'info':
            default:
                return 'var(--color-info-light, #e8f4fd)';
        }
    }};
  border-left: 4px solid ${props => {
        switch (props.type) {
            case 'success':
                return 'var(--color-success, #34a853)';
            case 'warning':
                return 'var(--color-warning, #fbbc05)';
            case 'error':
                return 'var(--color-error, #ea4335)';
            case 'info':
            default:
                return 'var(--color-info, #4285f4)';
        }
    }};
  animation: fadeIn 0.3s ease-in-out;
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const AlertIcon = styled.div`
  margin-right: var(--spacing-sm, 0.75rem);
  font-size: var(--font-size-lg, 1.25rem);
  color: ${props => {
        switch (props.type) {
            case 'success':
                return 'var(--color-success, #34a853)';
            case 'warning':
                return 'var(--color-warning, #fbbc05)';
            case 'error':
                return 'var(--color-error, #ea4335)';
            case 'info':
            default:
                return 'var(--color-info, #4285f4)';
        }
    }};
`;

const AlertMessage = styled.div`
  flex: 1;
  font-size: var(--font-size-md, 1rem);
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: var(--color-text-secondary, #666);
  cursor: pointer;
  padding: 0;
  font-size: var(--font-size-md, 1rem);
  opacity: 0.7;
  transition: opacity 0.2s;
  
  &:hover {
    opacity: 1;
  }
`;

Alert.propTypes = {
    message: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['success', 'info', 'warning', 'error']),
    showIcon: PropTypes.bool,
    autoClose: PropTypes.number,
    onClose: PropTypes.func
};

export default Alert;