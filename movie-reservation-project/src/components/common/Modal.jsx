import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { createPortal } from 'react-dom';
import Button from './Button';
import { FaTimes } from 'react-icons/fa';

/**
 * 재사용 가능한 모달 컴포넌트
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - 모달 열림 상태
 * @param {function} props.onClose - 모달 닫기 함수
 * @param {string} props.title - 모달 제목
 * @param {React.ReactNode} props.children - 모달 내용
 * @param {string} props.size - 모달 크기 (small, medium, large)
 * @param {boolean} props.showCloseButton - 닫기 버튼 표시 여부
 * @param {React.ReactNode} props.footer - 모달 하단 영역 (버튼 등)
 */
const Modal = ({
    isOpen,
    onClose,
    title,
    children,
    size = 'medium',
    showCloseButton = true,
    footer,
    ...rest
}) => {
    const modalRef = useRef(null);

    // ESC 키로 모달 닫기
    useEffect(() => {
        const handleEscKey = (event) => {
            if (event.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscKey);

        // 모달이 열릴 때 body 스크롤 방지
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscKey);
            document.body.style.overflow = 'auto';
        };
    }, [isOpen, onClose]);

    // 모달 외부 클릭 시 닫기
    const handleOutsideClick = (event) => {
        if (modalRef.current && !modalRef.current.contains(event.target)) {
            onClose();
        }
    };

    // 모달이 닫혀있으면 렌더링하지 않음
    if (!isOpen) return null;

    // React Portal을 사용하여 모달을 body 바로 아래에 렌더링
    return createPortal(
        <ModalOverlay onClick={handleOutsideClick}>
            <ModalContainer ref={modalRef} size={size} {...rest}>
                <ModalHeader>
                    <ModalTitle>{title}</ModalTitle>
                    {showCloseButton && (
                        <CloseButton onClick={onClose}>
                            <FaTimes />
                        </CloseButton>
                    )}
                </ModalHeader>

                <ModalContent>
                    {children}
                </ModalContent>

                {footer && <ModalFooter>{footer}</ModalFooter>}
            </ModalContainer>
        </ModalOverlay>,
        document.body
    );
};

// 모달 크기 설정
const modalSizes = {
    small: '400px',
    medium: '600px',
    large: '800px',
};

// 스타일 컴포넌트
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--color-overlay, rgba(0, 0, 0, 0.5));
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: var(--z-index-modal, 1000);
  padding: var(--spacing-md, 16px);
`;

const ModalContainer = styled.div`
  background-color: var(--color-background);
  border-radius: var(--border-radius-lg, 16px);
  box-shadow: var(--box-shadow-lg);
  width: 100%;
  max-width: ${({ size }) => modalSizes[size] || modalSizes.medium};
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  animation: modalFadeIn 0.3s ease-out;
  
  @keyframes modalFadeIn {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md, 16px) var(--spacing-lg, 24px);
  border-bottom: 1px solid var(--color-border);
`;

const ModalTitle = styled.h3`
  margin: 0;
  font-size: var(--font-size-lg, 1.125rem);
  font-weight: 600;
  color: var(--color-text-primary);
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-text-secondary);
  font-size: var(--font-size-lg, 1.125rem);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border-radius: 50%;
  transition: var(--transition-fast);
  
  &:hover {
    color: var(--color-text-primary);
    background-color: var(--color-surface);
  }
`;

const ModalContent = styled.div`
  padding: var(--spacing-lg, 24px);
  overflow-y: auto;
  flex: 1;
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-sm, 8px);
  padding: var(--spacing-md, 16px) var(--spacing-lg, 24px);
  border-top: 1px solid var(--color-border);
`;

Modal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    title: PropTypes.string,
    children: PropTypes.node,
    size: PropTypes.oneOf(['small', 'medium', 'large']),
    showCloseButton: PropTypes.bool,
    footer: PropTypes.node,
};

// 자주 사용되는 모달 타입들을 미리 정의
export const AlertModal = ({ isOpen, onClose, title, message, confirmText = '확인' }) => (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="small">
        <AlertMessage>{message}</AlertMessage>
        <Modal.Footer>
            <Button onClick={onClose}>{confirmText}</Button>
        </Modal.Footer>
    </Modal>
);

export const ConfirmModal = ({
    isOpen,
    onClose,
    title,
    message,
    onConfirm,
    confirmText = '확인',
    cancelText = '취소',
    confirmVariant = 'primary'
}) => (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="small">
        <AlertMessage>{message}</AlertMessage>
        <Modal.Footer>
            <Button variant="outlined" onClick={onClose}>{cancelText}</Button>
            <Button variant={confirmVariant} onClick={() => { onConfirm(); onClose(); }}>{confirmText}</Button>
        </Modal.Footer>
    </Modal>
);

// 사용자 정의 모달 푸터를 위한 컴포넌트
Modal.Footer = ({ children }) => {
    return <ModalFooter>{children}</ModalFooter>;
};

// 스타일 컴포넌트 (추가)
const AlertMessage = styled.p`
  margin: 0;
  font-size: var(--font-size-md);
  line-height: 1.5;
  color: var(--color-text-primary);
  text-align: center;
`;

export default Modal;