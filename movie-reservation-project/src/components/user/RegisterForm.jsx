import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { registerUser } from '../../store/slices/authSlice';
import Input from '../common/Input';
import Button from '../common/Button';
import validationUtils from '../../utils/validationUtils';
import { FaUser, FaEnvelope, FaLock, FaCalendarAlt, FaPhoneAlt } from 'react-icons/fa';

/**
 * 회원가입 폼 컴포넌트
 */
const RegisterForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // 회원가입 상태 관리
    const { loading, error } = useSelector((state) => state.auth);

    // 폼 상태 관리
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        nickname: '',
        birthDate: '',
        phone: '',
    });

    // 약관 동의 상태
    const [agreements, setAgreements] = useState({
        termsAgree: false,
        privacyAgree: false,
        marketingAgree: false,
    });

    // 유효성 검사 오류 메시지
    const [errors, setErrors] = useState({});

    // 입력 필드 변경 핸들러
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });

        // 실시간 유효성 검사
        validateField(name, value);
    };

    // 약관 동의 변경 핸들러
    const handleAgreementChange = (e) => {
        const { name, checked } = e.target;
        setAgreements({
            ...agreements,
            [name]: checked
        });

        // 약관 동의 오류 제거
        if (name === 'termsAgree' || name === 'privacyAgree') {
            setErrors({
                ...errors,
                agreements: ''
            });
        }
    };

    // 전체 약관 동의 핸들러
    const handleAgreeAll = (e) => {
        const { checked } = e.target;
        setAgreements({
            termsAgree: checked,
            privacyAgree: checked,
            marketingAgree: checked
        });

        if (checked) {
            setErrors({
                ...errors,
                agreements: ''
            });
        }
    };

    // 단일 필드 유효성 검사
    const validateField = (name, value) => {
        let errorMessage = '';

        switch (name) {
            case 'username':
                if (!value) {
                    errorMessage = '이름을 입력해주세요.';
                } else if (value.length < 2) {
                    errorMessage = '이름은 2자 이상 입력해주세요.';
                }
                break;
            case 'email':
                if (!value) {
                    errorMessage = '이메일을 입력해주세요.';
                } else if (!validationUtils.isValidEmail(value)) {
                    errorMessage = '올바른 이메일 형식이 아닙니다.';
                }
                break;
            case 'password':
                if (!value) {
                    errorMessage = '비밀번호를 입력해주세요.';
                } else if (!validationUtils.isValidPassword(value)) {
                    errorMessage = '비밀번호는 8자 이상, 문자, 숫자, 특수문자를 포함해야 합니다.';
                }
                break;
            case 'confirmPassword':
                if (!value) {
                    errorMessage = '비밀번호 확인을 입력해주세요.';
                } else if (value !== formData.password) {
                    errorMessage = '비밀번호가 일치하지 않습니다.';
                }
                break;
            case 'nickname':
                if (!value) {
                    errorMessage = '닉네임을 입력해주세요.';
                } else if (value.length < 2 || value.length > 10) {
                    errorMessage = '닉네임은 2자 이상 10자 이하로 입력해주세요.';
                }
                break;
            case 'birthDate':
                if (!value) {
                    errorMessage = '생년월일을 입력해주세요.';
                } else if (!validationUtils.isValidDate(value)) {
                    errorMessage = '올바른 날짜 형식이 아닙니다.';
                } else if (!validationUtils.isValidAge(value)) {
                    errorMessage = '만 14세 이상만 가입 가능합니다.';
                }
                break;
            case 'phoneNumber':
                if (value && !validationUtils.isValidPhone(value)) {
                    errorMessage = '올바른 전화번호 형식이 아닙니다.';
                }
                break;
            default:
                break;
        }

        setErrors({
            ...errors,
            [name]: errorMessage
        });

        return !errorMessage;
    };

    // 전체 폼 유효성 검사
    const validateForm = () => {
        const fieldErrors = {};
        let isValid = true;

        // 각 필드 검사
        Object.keys(formData).forEach(field => {
            const valid = validateField(field, formData[field]);
            if (!valid) isValid = false;
        });

        // 필수 약관 동의 검사
        if (!agreements.termsAgree || !agreements.privacyAgree) {
            fieldErrors.agreements = '필수 약관에 동의해주세요.';
            isValid = false;
        }

        setErrors({
            ...errors,
            ...fieldErrors
        });

        return isValid;
    };

    // 회원가입 폼 제출 핸들러
    const handleSubmit = async (e) => {
        e.preventDefault();

        // 유효성 검사
        if (!validateForm()) {
            return;
        }

        try {
            // 디버깅용 로그 추가
            // console.log('회원가입 전체 데이터:', formData);
            // console.log('비밀번호 값:', formData.password);
            // console.log('비밀번호 타입:', typeof formData.password);

            // 회원가입 액션 디스패치
            const userData = {
                email: formData.email,
                password: formData.password,
                name: formData.name,
                phone: formData.phone,
                birthDate: formData.birthDate,
                nickname: formData.nickname,
                marketingAgree: agreements.marketingAgree,
                termsAgree: agreements.termsAgree,
            };

            await dispatch(registerUser(userData)).unwrap();

            // 회원가입 성공 시 로그인 페이지로 이동
            navigate('/login', { state: { message: '회원가입이 완료되었습니다. 로그인해주세요.' } });
        } catch (err) {
            console.error('회원가입 실패:', err);
            setErrors({
                ...errors,
                submit: '회원가입 처리 중 오류가 발생했습니다. 다시 시도해주세요.'
            });
        }
    };

    return (
        <FormContainer>
            <FormTitle>회원가입</FormTitle>

            {/* 에러 메시지 */}
            {(errors.submit || error) && (
                <ErrorMessage>
                    {errors.submit || error}
                </ErrorMessage>
            )}

            <Form onSubmit={handleSubmit}>
                {/* 기본 정보 섹션 */}
                <FormSection>
                    <SectionTitle>기본 정보</SectionTitle>

                    <InputGroup>
                        <StyledInput
                            label="이름"
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="이름을 입력하세요"
                            icon={<FaUser />}
                            error={errors.name}
                            required
                        />
                    </InputGroup>

                    <InputGroup>
                        <StyledInput
                            label="이메일"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="이메일 주소를 입력하세요"
                            icon={<FaEnvelope />}
                            error={errors.email}
                            required
                        />
                    </InputGroup>

                    <InputGroup>
                        <StyledInput
                            label="비밀번호"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="비밀번호를 입력하세요"
                            icon={<FaLock />}
                            error={errors.password}
                            required
                        />
                    </InputGroup>

                    <InputGroup>
                        <StyledInput
                            label="비밀번호 확인"
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="비밀번호를 다시 입력하세요"
                            icon={<FaLock />}
                            error={errors.confirmPassword}
                            required
                        />
                    </InputGroup>
                </FormSection>

                {/* 추가 정보 섹션 */}
                <FormSection>
                    <SectionTitle>추가 정보</SectionTitle>

                    <InputGroup>
                        <StyledInput
                            label="닉네임"
                            type="text"
                            name="nickname"
                            value={formData.nickname}
                            onChange={handleChange}
                            placeholder="사용할 닉네임을 입력하세요"
                            icon={<FaUser />}
                            error={errors.nickname}
                            required
                        />
                    </InputGroup>

                    <InputGroup>
                        <StyledInput
                            label="생년월일"
                            type="date"
                            name="birthDate"
                            value={formData.birthDate}
                            onChange={handleChange}
                            icon={<FaCalendarAlt />}
                            error={errors.birthDate}
                            required
                        />
                    </InputGroup>

                    <InputGroup>
                        <StyledInput
                            label="휴대폰 번호"
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="'-' 없이 입력하세요"
                            icon={<FaPhoneAlt />}
                            error={errors.phone}
                        />
                    </InputGroup>
                </FormSection>

                {/* 약관 동의 섹션 */}
                <FormSection>
                    <SectionTitle>약관 동의</SectionTitle>

                    <AgreementItem>
                        <input
                            type="checkbox"
                            id="agreeAll"
                            checked={agreements.termsAgree && agreements.privacyAgree && agreements.marketingAgree}
                            onChange={handleAgreeAll}
                        />
                        <label htmlFor="agreeAll">
                            <strong>모든 약관에 동의합니다</strong>
                        </label>
                    </AgreementItem>

                    <AgreementDivider />

                    <AgreementItem>
                        <input
                            type="checkbox"
                            id="terms"
                            name="termsAgree"
                            checked={agreements.termsAgree}
                            onChange={handleAgreementChange}
                            required
                        />
                        <label htmlFor="terms">
                            [필수] 서비스 이용약관 동의
                        </label>
                        <ViewTermsLink to="/terms" target="_blank">보기</ViewTermsLink>
                    </AgreementItem>

                    <AgreementItem>
                        <input
                            type="checkbox"
                            id="privacy"
                            name="privacy"
                            checked={agreements.privacyAgree}
                            onChange={handleAgreementChange}
                            required
                        />
                        <label htmlFor="privacy">
                            [필수] 개인정보 처리방침 동의
                        </label>
                        <ViewTermsLink to="/privacy" target="_blank">보기</ViewTermsLink>
                    </AgreementItem>

                    <AgreementItem>
                        <input
                            type="checkbox"
                            id="marketing"
                            name="marketingAgree"
                            checked={agreements.marketingAgree}
                            onChange={handleAgreementChange}
                        />
                        <label htmlFor="marketing">
                            [선택] 마케팅 정보 수신 동의
                        </label>
                        <ViewTermsLink to="/marketing" target="_blank">보기</ViewTermsLink>
                    </AgreementItem>

                    {errors.agreements && (
                        <ErrorText>{errors.agreements}</ErrorText>
                    )}
                </FormSection>

                {/* 회원가입 버튼 */}
                <RegisterButton
                    type="submit"
                    disabled={loading}
                    fullWidth
                >
                    {loading ? '처리 중...' : '회원가입'}
                </RegisterButton>

                {/* 로그인 링크 */}
                <LoginLink>
                    이미 계정이 있으신가요? <Link to="/login">로그인</Link>
                </LoginLink>
            </Form>
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

const FormTitle = styled.h2`
  font-size: var(--font-size-2xl);
  font-weight: 700;
  text-align: center;
  margin-bottom: var(--spacing-lg);
  color: var(--color-text-primary);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const FormSection = styled.div`
  margin-bottom: var(--spacing-lg);
`;

const SectionTitle = styled.h3`
  font-size: var(--font-size-lg);
  font-weight: 600;
  margin-bottom: var(--spacing-md);
  color: var(--color-text-primary);
  padding-bottom: var(--spacing-xs);
  border-bottom: 1px solid var(--color-border);
`;

const InputGroup = styled.div`
  margin-bottom: var(--spacing-md);
`;

const StyledInput = styled(Input)`
  width: 100%;
`;

const AgreementItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: var(--spacing-xs);
  
  input {
    width: 18px;
    height: 18px;
    margin-right: var(--spacing-sm);
  }
  
    label {
    flex: 1;
    font-size: var(--font-size-sm);
    color: var(--color-text-primary);
    cursor: pointer;
  }
  
  strong {
    font-weight: 600;
  }
`;

const ViewTermsLink = styled(Link)`
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  margin-left: var(--spacing-sm);
  text-decoration: none;
  
  &:hover {
    color: var(--color-primary);
    text-decoration: underline;
  }
`;

const AgreementDivider = styled.hr`
  border: 0;
  height: 1px;
  background-color: var(--color-border);
  margin: var(--spacing-xs) 0;
`;

const RegisterButton = styled(Button)`
  margin-bottom: var(--spacing-md);
  height: 48px;
  font-weight: 600;
`;

const LoginLink = styled.div`
  text-align: center;
  margin-top: var(--spacing-md);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  
  a {
    color: var(--color-primary);
    font-weight: 500;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const ErrorMessage = styled.div`
  background-color: #fff0f0;
  color: var(--color-error);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius-md);
  margin-bottom: var(--spacing-md);
  font-size: var(--font-size-sm);
  border-left: 3px solid var(--color-error);
`;

const ErrorText = styled.div`
  color: var(--color-error);
  font-size: var(--font-size-xs);
  margin-top: var(--spacing-xs);
`;

export default RegisterForm;