import React from 'react';
import styled, { css } from 'styled-components';
import PropTypes from 'prop-types';

/**
 * 재사용 가능한 버튼 컴포넌트
 * 
 * @param {Object} props
 * @param {string} props.variant - 버튼 스타일 (primary, secondary, outlined, text)
 * @param {string} props.size - 버튼 크기 (small, medium, large)
 * @param {boolean} props.fullWidth - 전체 너비 적용 여부
 * @param {boolean} props.disabled - 비활성화 여부
 * @param {function} props.onClick - 클릭 이벤트 핸들러
 * @param {React.ReactNode} props.children - 버튼 내용
 * @param {string} props.type - 버튼 타입 (button, submit, reset)
 */
const Button = ({
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  disabled = false,
  onClick,
  children,
  type = 'button',
  ...rest
}) => {
  return (
    <StyledButton
      variant={variant}
      size={size}
      $fullWidth={fullWidth}
      disabled={disabled}
      onClick={onClick}
      type={type}
      {...rest}
    >
      {children}
    </StyledButton>
  );
};

// 버튼 스타일 변형
const variantStyles = {
  primary: css`
    background-color: var(--color-primary);
    color: white;
    border: none;
    
    &:hover:not(:disabled) {
      background-color: var(--color-primary-dark, #d01830);
    }
    
    &:active:not(:disabled) {
      background-color: var(--color-primary-darker, #b8152b);
    }
  `,
  secondary: css`
    background-color: var(--color-secondary);
    color: white;
    border: none;
    
    &:hover:not(:disabled) {
      background-color: var(--color-secondary-dark, #23304f);
    }
    
    &:active:not(:disabled) {
      background-color: var(--color-secondary-darker, #1c2840);
    }
  `,
  outlined: css`
    background-color: transparent;
    color: var(--color-primary);
    border: 1px solid var(--color-primary);
    
    &:hover:not(:disabled) {
      background-color: rgba(229, 25, 55, 0.05);
    }
    
    &:active:not(:disabled) {
      background-color: rgba(229, 25, 55, 0.1);
    }
  `,
  text: css`
    background-color: transparent;
    color: var(--color-primary);
    border: none;
    
    &:hover:not(:disabled) {
      background-color: rgba(229, 25, 55, 0.05);
    }
    
    &:active:not(:disabled) {
      background-color: rgba(229, 25, 55, 0.1);
    }
  `,
};

// 버튼 크기 스타일
const sizeStyles = {
  small: css`
    padding: 6px 12px;
    font-size: var(--font-size-sm, 0.875rem);
  `,
  medium: css`
    padding: 8px 16px;
    font-size: var(--font-size-md, 1rem);
  `,
  large: css`
    padding: 12px 24px;
    font-size: var(--font-size-lg, 1.125rem);
  `,
};

// 스타일 버튼 컴포넌트
const StyledButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-regular);
  font-weight: 500;
  border-radius: var(--border-radius-md, 8px);
  cursor: pointer;
  transition: var(--transition-fast, all 0.15s ease);
  outline: none;
  width: ${({ $fullWidth }) => ($fullWidth ? '100%' : 'auto')};
  
  /* 버튼 스타일 변형 적용 */
  ${({ variant }) => variantStyles[variant] || variantStyles.primary}
  
  /* 버튼 크기 적용 */
  ${({ size }) => sizeStyles[size] || sizeStyles.medium}
  
  /* 비활성화 상태 */
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  /* 아이콘이 있는 경우 간격 추가 */
  svg {
    margin-right: ${({ iconOnly }) => (iconOnly ? '0' : '8px')};
  }
`;

Button.propTypes = {
  variant: PropTypes.oneOf(['primary', 'secondary', 'outlined', 'text']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  fullWidth: PropTypes.bool,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  children: PropTypes.node.isRequired,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
};

export default Button;