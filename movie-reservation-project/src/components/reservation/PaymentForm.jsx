import React, { useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { FaCreditCard, FaMobileAlt, FaLock } from 'react-icons/fa';
import { PAYMENT_METHODS } from '../../styles/variables';
import Button from '../common/Button';
import Input from '../common/Input';

/**
 * 결제 정보 입력 폼 컴포넌트
 * 
 * @param {Object} props
 * @param {Function} props.onSubmit - 결제 정보 제출 시 호출할 함수
 * @param {number} props.totalAmount - 결제 금액
 * @param {Object} props.reservation - 예매 정보
 */
const PaymentForm = ({ onSubmit, totalAmount, reservation }) => {
    const dispatch = useDispatch();

    // 결제 정보 상태
    const [paymentMethod, setPaymentMethod] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [cardExpiry, setCardExpiry] = useState('');
    const [cardCVC, setCardCVC] = useState('');
    const [cardOwner, setCardOwner] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [agreedToTerms, setAgreedToTerms] = useState(false);

    // 유효성 검사 상태
    const [errors, setErrors] = useState({});

    // 결제 수단 선택 핸들러
    const handlePaymentMethodChange = (method) => {
        setPaymentMethod(method);
        // 다른 결제 수단 선택 시 이전 입력 초기화
        if (method !== PAYMENT_METHODS.CREDIT_CARD) {
            setCardNumber('');
            setCardExpiry('');
            setCardCVC('');
            setCardOwner('');
        }
        if (method !== PAYMENT_METHODS.MOBILE) {
            setPhoneNumber('');
        }
        setErrors({});
    };

    // 카드 번호 포맷팅 (4자리마다 공백 추가)
    const formatCardNumber = (value) => {
        const numbers = value.replace(/\D/g, '');
        const groups = [];

        for (let i = 0; i < numbers.length && i < 16; i += 4) {
            groups.push(numbers.slice(i, i + 4));
        }

        return groups.join(' ');
    };

    // 카드 유효기간 포맷팅 (MM/YY)
    const formatCardExpiry = (value) => {
        const numbers = value.replace(/\D/g, '');

        if (numbers.length <= 2) {
            return numbers;
        }

        return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}`;
    };

    // 카드 번호 입력 핸들러
    const handleCardNumberChange = (e) => {
        const formatted = formatCardNumber(e.target.value);
        setCardNumber(formatted);

        if (errors.cardNumber) {
            setErrors({ ...errors, cardNumber: '' });
        }
    };

    // 카드 유효기간 입력 핸들러
    const handleCardExpiryChange = (e) => {
        const formatted = formatCardExpiry(e.target.value);
        setCardExpiry(formatted);

        if (errors.cardExpiry) {
            setErrors({ ...errors, cardExpiry: '' });
        }
    };

    // CVC 입력 핸들러
    const handleCardCVCChange = (e) => {
        const value = e.target.value.replace(/\D/g, '').slice(0, 3);
        setCardCVC(value);

        if (errors.cardCVC) {
            setErrors({ ...errors, cardCVC: '' });
        }
    };

    // 카드 소유자 입력 핸들러
    const handleCardOwnerChange = (e) => {
        setCardOwner(e.target.value);

        if (errors.cardOwner) {
            setErrors({ ...errors, cardOwner: '' });
        }
    };

    // 전화번호 입력 핸들러
    const handlePhoneNumberChange = (e) => {
        const value = e.target.value.replace(/\D/g, '').slice(0, 11);
        setPhoneNumber(value);

        if (errors.phoneNumber) {
            setErrors({ ...errors, phoneNumber: '' });
        }
    };

    // 약관 동의 핸들러
    const handleTermsChange = (e) => {
        setAgreedToTerms(e.target.checked);

        if (errors.agreedToTerms) {
            setErrors({ ...errors, agreedToTerms: '' });
        }
    };

    // 폼 제출 핸들러
    const handleSubmit = (e) => {
        e.preventDefault();

        // 유효성 검사
        const newErrors = {};

        if (!paymentMethod) {
            newErrors.paymentMethod = '결제 수단을 선택해주세요.';
        }

        if (paymentMethod === PAYMENT_METHODS.CREDIT_CARD) {
            if (!cardNumber || cardNumber.replace(/\s/g, '').length !== 16) {
                newErrors.cardNumber = '유효한 카드 번호를 입력해주세요.';
            }

            if (!cardExpiry || !cardExpiry.includes('/') || cardExpiry.length !== 5) {
                newErrors.cardExpiry = '유효한 만료일을 입력해주세요. (MM/YY)';
            }

            if (!cardCVC || cardCVC.length !== 3) {
                newErrors.cardCVC = '유효한 CVC 번호를 입력해주세요.';
            }

            if (!cardOwner) {
                newErrors.cardOwner = '카드 소유자 이름을 입력해주세요.';
            }
        }

        if (paymentMethod === PAYMENT_METHODS.MOBILE) {
            if (!phoneNumber || phoneNumber.length < 10) {
                newErrors.phoneNumber = '유효한 휴대폰 번호를 입력해주세요.';
            }
        }

        if (!agreedToTerms) {
            newErrors.agreedToTerms = '결제 진행을 위해 약관에 동의해주세요.';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // 결제 정보 생성
        const paymentData = {
            method: paymentMethod,
            amount: totalAmount,
            reservation: reservation?.id,
            cardInfo: paymentMethod === PAYMENT_METHODS.CREDIT_CARD ? {
                number: cardNumber.replace(/\s/g, ''),
                expiry: cardExpiry,
                cvc: cardCVC,
                owner: cardOwner
            } : null,
            phoneInfo: paymentMethod === PAYMENT_METHODS.MOBILE ? {
                number: phoneNumber
            } : null,
            agreedToTerms
        };

        // 부모 컴포넌트에 결제 정보 전달
        if (onSubmit) {
            onSubmit(paymentData);
        }
    };

    return (
        <FormContainer>
            <FormTitle>
                <FaLock />
                <span>결제 정보</span>
            </FormTitle>

            <PaymentMethodSection>
                <SectionTitle>결제 수단 선택</SectionTitle>
                <PaymentMethodList>
                    <PaymentMethodItem
                        selected={paymentMethod === PAYMENT_METHODS.CREDIT_CARD}
                        onClick={() => handlePaymentMethodChange(PAYMENT_METHODS.CREDIT_CARD)}
                    >
                        <FaCreditCard />
                        <span>신용/체크카드</span>
                    </PaymentMethodItem>

                    <PaymentMethodItem
                        selected={paymentMethod === PAYMENT_METHODS.KAKAO_PAY}
                        onClick={() => handlePaymentMethodChange(PAYMENT_METHODS.KAKAO_PAY)}
                    >
                        <span>카카오페이</span>
                    </PaymentMethodItem>

                    <PaymentMethodItem
                        selected={paymentMethod === PAYMENT_METHODS.NAVER_PAY}
                        onClick={() => handlePaymentMethodChange(PAYMENT_METHODS.NAVER_PAY)}
                    >
                        <span>네이버페이</span>
                    </PaymentMethodItem>

                    <PaymentMethodItem
                        selected={paymentMethod === PAYMENT_METHODS.MOBILE}
                        onClick={() => handlePaymentMethodChange(PAYMENT_METHODS.MOBILE)}
                    >
                        <FaMobileAlt />
                        <span>휴대폰 결제</span>
                    </PaymentMethodItem>
                </PaymentMethodList>

                {errors.paymentMethod && (
                    <ErrorMessage>{errors.paymentMethod}</ErrorMessage>
                )}
            </PaymentMethodSection>

            {/* 신용카드 결제 폼 */}
            {paymentMethod === PAYMENT_METHODS.CREDIT_CARD && (
                <CardSection>
                    <SectionTitle>카드 정보 입력</SectionTitle>
                    <CardForm>
                        <FormGroup>
                            <Input
                                label="카드 번호"
                                value={cardNumber}
                                onChange={handleCardNumberChange}
                                placeholder="0000 0000 0000 0000"
                                maxLength={19}
                                error={errors.cardNumber}
                            />
                        </FormGroup>

                        <CardDetailRow>
                            <FormGroup>
                                <Input
                                    label="유효기간"
                                    value={cardExpiry}
                                    onChange={handleCardExpiryChange}
                                    placeholder="MM/YY"
                                    maxLength={5}
                                    error={errors.cardExpiry}
                                />
                            </FormGroup>

                            <FormGroup>
                                <Input
                                    label="CVC"
                                    value={cardCVC}
                                    onChange={handleCardCVCChange}
                                    placeholder="000"
                                    maxLength={3}
                                    type="password"
                                    error={errors.cardCVC}
                                />
                            </FormGroup>
                        </CardDetailRow>

                        <FormGroup>
                            <Input
                                label="카드 소유자 이름"
                                value={cardOwner}
                                onChange={handleCardOwnerChange}
                                placeholder="카드에 표시된 이름"
                                error={errors.cardOwner}
                            />
                        </FormGroup>
                    </CardForm>
                </CardSection>
            )}

            {/* 휴대폰 결제 폼 */}
            {paymentMethod === PAYMENT_METHODS.MOBILE && (
                <MobileSection>
                    <SectionTitle>휴대폰 번호 입력</SectionTitle>
                    <FormGroup>
                        <Input
                            label="휴대폰 번호"
                            value={phoneNumber}
                            onChange={handlePhoneNumberChange}
                            placeholder="'-' 없이 입력"
                            error={errors.phoneNumber}
                        />
                    </FormGroup>
                </MobileSection>
            )}

            {/* 약관 동의 */}
            <TermsSection>
                <TermsAgreement>
                    <input
                        type="checkbox"
                        id="termsAgree"
                        checked={agreedToTerms}
                        onChange={handleTermsChange}
                    />
                    <label htmlFor="termsAgree">
                        결제 진행 및 결제 대행 서비스 이용약관에 동의합니다.
                    </label>
                </TermsAgreement>

                {errors.agreedToTerms && (
                    <ErrorMessage>{errors.agreedToTerms}</ErrorMessage>
                )}

                <TermsLink href="/terms/payment" target="_blank">
                    이용약관 보기
                </TermsLink>
            </TermsSection>

            <TotalAmountSection>
                <TotalAmountLabel>최종 결제 금액</TotalAmountLabel>
                <TotalAmountValue>{totalAmount?.toLocaleString()}원</TotalAmountValue>
            </TotalAmountSection>

            <SubmitButton onClick={handleSubmit}>
                결제하기
            </SubmitButton>

            <SecurityNotice>
                <FaLock />
                <span>
                    고객님의 카드 정보는 안전하게 암호화되어 처리됩니다.
                </span>
            </SecurityNotice>
        </FormContainer>
    );
};

// 스타일 컴포넌트
const FormContainer = styled.div`
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  padding: var(--spacing-lg);
  background-color: var(--color-surface);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--box-shadow-md);
`;

const FormTitle = styled.h3`
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: var(--font-size-xl);
  font-weight: 700;
  margin-bottom: var(--spacing-lg);
  color: var(--color-text-primary);
  
  svg {
    color: var(--color-primary);
  }
`;

const SectionTitle = styled.h4`
  font-size: var(--font-size-lg);
  font-weight: 600;
  margin-bottom: var(--spacing-md);
  color: var(--color-text-primary);
`;

const PaymentMethodSection = styled.div`
  margin-bottom: var(--spacing-lg);
`;

const PaymentMethodList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: var(--spacing-md);
`;

const PaymentMethodItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  border-radius: var(--border-radius-md);
  background-color: ${({ selected }) =>
        selected ? 'var(--color-primary)' : 'var(--color-background)'};
  color: ${({ selected }) =>
        selected ? 'white' : 'var(--color-text-primary)'};
  cursor: pointer;
  transition: var(--transition-fast);
  
  &:hover {
    background-color: ${({ selected }) =>
        selected ? 'var(--color-primary)' : 'var(--color-surface-variant, rgba(0, 0, 0, 0.03))'};
  }
  
  svg {
    font-size: var(--font-size-xl);
  }
`;

const CardSection = styled.div`
  margin-bottom: var(--spacing-lg);
`;

const CardForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
`;

const CardDetailRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-md);
`;

const MobileSection = styled.div`
  margin-bottom: var(--spacing-lg);
`;

const FormGroup = styled.div`
  margin-bottom: var(--spacing-sm);
`;

const TermsSection = styled.div`
  margin-bottom: var(--spacing-lg);
`;

const TermsAgreement = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-sm);
  
  input {
    width: 20px;
    height: 20px;
  }
  
  label {
    font-weight: 500;
  }
`;

const TermsLink = styled.a`
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  text-decoration: underline;
  
  &:hover {
    color: var(--color-primary);
  }
`;

const TotalAmountSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md);
  background-color: var(--color-surface-variant, rgba(0, 0, 0, 0.03));
  border-radius: var(--border-radius-md);
  margin-bottom: var(--spacing-lg);
`;

const TotalAmountLabel = styled.span`
  font-weight: 600;
`;

const TotalAmountValue = styled.span`
  font-size: var(--font-size-lg);
  font-weight: 700;
  color: var(--color-primary);
`;

const SubmitButton = styled(Button)`
  width: 100%;
  padding: var(--spacing-md);
  font-size: var(--font-size-lg);
  font-weight: 600;
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--border-radius-md);
  cursor: pointer;
  transition: var(--transition-fast);
  
  &:hover {
    background-color: var(--color-primary-dark, #d01830);
  }
`;

const SecurityNotice = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-lg);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  
  svg {
    color: var(--color-primary);
  }
`;

const ErrorMessage = styled.div`
  color: var(--color-error);
  font-size: var(--font-size-sm);
  margin-top: var(--spacing-xs);
`;

PaymentForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    totalAmount: PropTypes.number.isRequired,
    reservation: PropTypes.object
};

export default PaymentForm;