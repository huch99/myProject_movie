// src/pages/PaymentMethodsPage.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { fetchPaymentMethods, deletePaymentMethod, setDefaultPaymentMethod } from '../store/slices/userSlice';
import Container from '../components/layout/Container';
import PageTitle from '../components/common/PageTitle';
import EmptyState from '../components/common/EmptyState';
import Loading from '../components/common/Loading';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import { FaCreditCard, FaTrash, FaStar, FaPlus, FaLock } from 'react-icons/fa';

/**
 * 결제 수단 관리 페이지 컴포넌트
 */
const PaymentMethodsPage = () => {
    const dispatch = useDispatch();
    const { paymentMethods, loading, error } = useSelector(state => state.user);

    // 모달 상태
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedMethod, setSelectedMethod] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);

    // 결제 수단 목록 불러오기
    useEffect(() => {
        dispatch(fetchPaymentMethods());
    }, [dispatch]);

    // 결제 수단 삭제 핸들러
    const handleDeleteMethod = async () => {
        if (!selectedMethod) return;

        try {
            await dispatch(deletePaymentMethod(selectedMethod.id)).unwrap();
            setShowDeleteModal(false);
            setSelectedMethod(null);
        } catch (error) {
            console.error('결제 수단 삭제 실패:', error);
        }
    };

    // 결제 수단 삭제 모달 열기
    const openDeleteModal = (method) => {
        setSelectedMethod(method);
        setShowDeleteModal(true);
    };

    // 기본 결제 수단 설정 핸들러
    const handleSetDefaultMethod = async (methodId) => {
        try {
            await dispatch(setDefaultPaymentMethod(methodId)).unwrap();
        } catch (error) {
            console.error('기본 결제 수단 설정 실패:', error);
        }
    };

    // 카드 번호 마스킹 (마지막 4자리만 표시)
    const maskCardNumber = (cardNumber) => {
        if (!cardNumber) return '';
        const last4Digits = cardNumber.slice(-4);
        return `•••• •••• •••• ${last4Digits}`;
    };

    // 카드 유효기간 포맷팅
    const formatExpiry = (expiry) => {
        if (!expiry) return '';
        return `${expiry.slice(0, 2)}/${expiry.slice(2)}`;
    };

    return (
        <Container>
            <PageHeader>
                <PageTitle>
                    <FaCreditCard />
                    <span>결제 수단 관리</span>
                </PageTitle>

                <AddButton onClick={() => setShowAddModal(true)}>
                    <FaPlus />
                    <span>결제 수단 추가</span>
                </AddButton>
            </PageHeader>

            {loading ? (
                <Loading text="결제 수단 정보를 불러오는 중입니다..." />
            ) : error ? (
                <ErrorMessage>{error}</ErrorMessage>
            ) : paymentMethods?.length > 0 ? (
                <PaymentMethodsList>
                    {paymentMethods.map(method => (
                        <PaymentMethodCard key={method.id}>
                            <CardInfo>
                                <CardTypeIcon>
                                    <FaCreditCard />
                                </CardTypeIcon>
                                <CardDetails>
                                    <CardName>{method.cardName}</CardName>
                                    <CardNumber>{maskCardNumber(method.cardNumber)}</CardNumber>
                                    <CardExpiry>만료일: {formatExpiry(method.expiryDate)}</CardExpiry>
                                </CardDetails>
                            </CardInfo>

                            <CardActions>
                                {method.isDefault ? (
                                    <DefaultBadge>
                                        <FaStar />
                                        <span>기본 결제 수단</span>
                                    </DefaultBadge>
                                ) : (
                                    <DefaultButton
                                        onClick={() => handleSetDefaultMethod(method.id)}
                                    >
                                        기본으로 설정
                                    </DefaultButton>
                                )}

                                <DeleteButton onClick={() => openDeleteModal(method)}>
                                    <FaTrash />
                                </DeleteButton>
                            </CardActions>
                        </PaymentMethodCard>
                    ))}
                </PaymentMethodsList>
            ) : (
                <EmptyState
                    icon={<FaCreditCard size={48} />}
                    title="등록된 결제 수단이 없습니다"
                    description="영화 예매를 위해 결제 수단을 등록해보세요!"
                    action={
                        <AddCardButton onClick={() => setShowAddModal(true)}>
                            결제 수단 등록하기
                        </AddCardButton>
                    }
                />
            )}

            <SecurityInfo>
                <SecurityIcon>
                    <FaLock />
                </SecurityIcon>
                <SecurityText>
                    모든 결제 정보는 안전하게 암호화되어 저장됩니다.
                    <br />
                    카드 정보는 PCI DSS 규정을 준수하여 관리됩니다.
                </SecurityText>
            </SecurityInfo>

            {/* 결제 수단 삭제 모달 */}
            <Modal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                title="결제 수단 삭제"
            >
                <ModalContent>
                    <ModalText>
                        정말 이 결제 수단을 삭제하시겠습니까?
                        <br />
                        삭제 후에는 복구할 수 없습니다.
                    </ModalText>

                    {selectedMethod?.isDefault && (
                        <WarningText>
                            주의: 기본 결제 수단을 삭제하려고 합니다.
                        </WarningText>
                    )}

                    <ModalActions>
                        <CancelButton onClick={() => setShowDeleteModal(false)}>
                            취소
                        </CancelButton>
                        <DeleteConfirmButton onClick={handleDeleteMethod}>
                            삭제
                        </DeleteConfirmButton>
                    </ModalActions>
                </ModalContent>
            </Modal>

            {/* 결제 수단 추가 모달 */}
            <Modal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                title="결제 수단 추가"
            >
                <AddPaymentForm>
                    {/* 실제 구현 시 결제 수단 추가 폼 컴포넌트 사용 */}
                    <p>결제 수단 추가 폼이 여기에 들어갑니다.</p>
                    <ModalActions>
                        <CancelButton onClick={() => setShowAddModal(false)}>
                            취소
                        </CancelButton>
                        <AddButton onClick={() => setShowAddModal(false)}>
                            추가하기
                        </AddButton>
                    </ModalActions>
                </AddPaymentForm>
            </Modal>
        </Container>
    );
};

// 스타일 컴포넌트
const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-md);
  }
`;

const PaymentMethodsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
`;

const PaymentMethodCard = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md);
  background-color: var(--color-surface);
  border-radius: var(--border-radius-md);
  box-shadow: var(--box-shadow-sm);
  
  @media (max-width: 576px) {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-md);
  }
`;

const CardInfo = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
`;

const CardTypeIcon = styled.div`
  font-size: var(--font-size-xl);
  color: var(--color-primary);
`;

const CardDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
`;

const CardName = styled.div`
  font-weight: 600;
`;

const CardNumber = styled.div`
  font-family: monospace;
  letter-spacing: 1px;
`;

const CardExpiry = styled.div`
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
`;

const CardActions = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  
  @media (max-width: 576px) {
    width: 100%;
    justify-content: flex-end;
  }
`;

const DefaultBadge = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs) var(--spacing-sm);
  background-color: var(--color-primary-light, rgba(229, 25, 55, 0.1));
  color: var(--color-primary);
  border-radius: var(--border-radius-full);
  font-size: var(--font-size-sm);
`;

const DefaultButton = styled.button`
  padding: var(--spacing-xs) var(--spacing-sm);
  background-color: var(--color-surface);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-sm);
  cursor: pointer;
  
  &:hover {
    background-color: var(--color-surface-variant, rgba(0, 0, 0, 0.03));
  }
`;

const DeleteButton = styled.button`
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-surface);
  color: var(--color-error);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  cursor: pointer;
  
  &:hover {
    background-color: var(--color-error-light, #fff0f0);
    border-color: var(--color-error);
  }
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: var(--spacing-xl);
  color: var(--color-error);
  background-color: var(--color-surface);
  border-radius: var(--border-radius-md);
  border-left: 4px solid var(--color-error);
`;

const SecurityInfo = styled.div`
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-md);
  margin-top: var(--spacing-xl);
  padding: var(--spacing-md);
  background-color: var(--color-surface-variant, rgba(0, 0, 0, 0.03));
  border-radius: var(--border-radius-md);
`;

const SecurityIcon = styled.div`
  color: var(--color-success);
  font-size: var(--font-size-lg);
`;

const SecurityText = styled.div`
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  line-height: 1.5;
`;

const ModalContent = styled.div`
  padding: var(--spacing-md);
`;

const ModalText = styled.p`
  text-align: center;
  margin-bottom: var(--spacing-lg);
  line-height: 1.5;
`;

const WarningText = styled.p`
  text-align: center;
  color: var(--color-error);
  margin-bottom: var(--spacing-lg);
  font-weight: 500;
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-md);
`;

const CancelButton = styled(Button)`
  background-color: var(--color-surface);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
  
  &:hover {
    background-color: var(--color-surface-variant, rgba(0, 0, 0, 0.03));
  }
`;

const DeleteConfirmButton = styled(Button)`
  background-color: var(--color-error);
  color: white;
  
  &:hover {
    background-color: var(--color-error-dark, #c41c1c);
  }
`;

const AddPaymentForm = styled.form`
  padding: var(--spacing-md);
`;

const AddButton = styled(Button)`
  background-color: var(--color-primary);
  color: white;
  
  &:hover {
    background-color: var(--color-primary-dark, #d01830);
  }
`;

const AddCardButton = styled(Button)`
  background-color: var(--color-primary);
  color: white;
  padding: var(--spacing-sm) var(--spacing-lg);
  
  &:hover {
    background-color: var(--color-primary-dark, #d01830);
  }
`;

export default PaymentMethodsPage;