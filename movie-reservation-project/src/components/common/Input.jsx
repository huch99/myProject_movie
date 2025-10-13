import React, { forwardRef } from 'react';
import styled, { css } from 'styled-components';
import PropTypes from 'prop-types';

/**
 * 재사용 가능한 입력 필드 컴포넌트
 * 
 * @param {Object} props
 * @param {string} props.type - 입력 필드 타입 (text, password, email, number 등)
 * @param {string} props.label - 입력 필드 라벨
 * @param {string} props.placeholder - 입력 필드 플레이스홀더
 * @param {string} props.value - 입력 필드 값
 * @param {function} props.onChange - 값 변경 이벤트 핸들러
 * @param {function} props.onBlur - 포커스 해제 이벤트 핸들러
 * @param {boolean} props.required - 필수 입력 여부
 * @param {boolean} props.disabled - 비활성화 여부
 * @param {string} props.error - 오류 메시지
 * @param {boolean} props.fullWidth - 전체 너비 적용 여부
 * @param {string} props.size - 입력 필드 크기 (small, medium, large)
 * @param {string} props.name - 입력 필드 이름
 */
const Input = forwardRef(({
  type = 'text',
  label,
  placeholder,
  value,
  onChange,
  onBlur,
  required = false,
  disabled = false,
  error,
  fullWidth = false,
  size = 'medium',
  name,
  ...rest
}, ref) => {
  return (
    <InputContainer $fullWidth={fullWidth}>
      {label && (
        <InputLabel htmlFor={name}>
          {label}
          {required && <RequiredMark>*</RequiredMark>}
        </InputLabel>
      )}
      <InputWrapper>
        <StyledInput
          ref={ref}
          type={type}
          id={name}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          $hasError={!!error}
          size={size}
          required={required}
          {...rest}
        />
      </InputWrapper>
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </InputContainer>
  );
});

// 입력 필드 크기 스타일
const sizeStyles = {
  small: css`
    height: 32px;
    padding: 6px 12px;
    font-size: var(--font-size-sm, 0.875rem);
  `,
  medium: css`
    height: 40px;
    padding: 8px 16px;
    font-size: var(--font-size-md, 1rem);
  `,
  large: css`
    height: 48px;
    padding: 12px 16px;
    font-size: var(--font-size-lg, 1.125rem);
  `,
};

// 스타일 컴포넌트
const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: ${({ $fullWidth }) => ($fullWidth ? '100%' : 'auto')};
  margin-bottom: var(--spacing-md, 16px);
`;

const InputLabel = styled.label`
  font-size: var(--font-size-sm, 0.875rem);
  font-weight: 500;
  margin-bottom: var(--spacing-xs, 4px);
  color: var(--color-text-primary);
`;

const RequiredMark = styled.span`
  color: var(--color-error);
  margin-left: 4px;
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const StyledInput = styled.input`
  width: 100%;
  border: 1px solid ${props => props.$hasError ? props.theme.colors.error : props.theme.colors.border};
  border-radius: var(--border-radius-md, 8px);
  background-color: var(--color-background);
  color: var(--color-text-primary);
  transition: var(--transition-fast, all 0.15s ease);
  
  /* 입력 필드 크기 적용 */
  ${({ size }) => sizeStyles[size] || sizeStyles.medium}
  
 &:focus {
  outline: none;
  border-color: ${({ $hasError }) => 
    $hasError ? 'var(--color-error)' : 'var(--color-primary)'};
  box-shadow: 0 0 0 2px ${({ $hasError }) => 
    $hasError ? 'rgba(var(--color-error-rgb), 0.2)' : 'rgba(var(--color-primary-rgb), 0.2)'};
}
}
  
  &:disabled {
    background-color: var(--color-surface);
    cursor: not-allowed;
    opacity: 0.6;
  }
  
  &::placeholder {
    color: var(--color-text-disabled);
  }
`;

const ErrorMessage = styled.span`
  font-size: var(--font-size-xs, 0.75rem);
  color: var(--color-error);
  margin-top: var(--spacing-xs, 4px);
`;

Input.displayName = 'Input';

Input.propTypes = {
  type: PropTypes.string,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  error: PropTypes.string,
  fullWidth: PropTypes.bool,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  name: PropTypes.string,
};

export default Input;