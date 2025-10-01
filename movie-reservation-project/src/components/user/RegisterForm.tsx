import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import styled from 'styled-components';
import Button from '../common/Button';
import type { RegisterFormData } from '../../types/user.types';
import { useAuth } from '../../hooks/useAuth';

interface RegisterFormProps {
    onSuccess?: () => void;
    onSubmit?: (formData: RegisterFormData) => Promise<void>;
    isLoading?: boolean;
    error?: string | null;
}

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  margin-bottom: 8px;
  font-weight: 500;
`;

const Input = styled.input`
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #e51937;
  }
`;

const ErrorMessage = styled.div`
  color: #e51937;
  font-size: 0.9rem;
  margin-top: 5px;
`;

const CheckboxGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 5px;
  
  input {
    width: 18px;
    height: 18px;
  }
  
  label {
    font-size: 0.9rem;
  }
`;

const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess,
    onSubmit,
    isLoading: externalLoading,
    error: externalError
}) => {
    const navigate = useNavigate();
    const { register, loading: authLoading, error: authError } = useAuth();

    // 외부에서 제공된 로딩 상태와 에러를 우선적으로 사용하고, 없으면 useAuth의 상태 사용
    const loading = externalLoading !== undefined ? externalLoading : authLoading;
    const error = externalError !== undefined ? externalError : authError;

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        birthdate: '',
        phone: '',
    });

    const [formErrors, setFormErrors] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        birthdate: '',
        phone: '',
        terms: '',
    });

    const [agreeTerms, setAgreeTerms] = useState(false);
    const [agreePrivacy, setAgreePrivacy] = useState(false);
    const [agreeMarketing, setAgreeMarketing] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });

        // 입력 시 해당 필드의 에러 메시지 초기화
        setFormErrors({
            ...formErrors,
            [name]: '',
        });
    };

    const validateForm = () => {
        let isValid = true;
        const newErrors = {
            name: '', email: '', password: '', confirmPassword: '',
            birthdate: '', phone: '', terms: ''
        };

        // 이름 유효성 검사
        if (!formData.name.trim()) {
            newErrors.name = '이름을 입력해 주세요.';
            isValid = false;
        }

        // 이메일 유효성 검사
        if (!formData.email.trim()) {
            newErrors.email = '이메일을 입력해 주세요.';
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = '유효한 이메일 주소를 입력해 주세요.';
            isValid = false;
        }

        // 비밀번호 유효성 검사
        if (!formData.password.trim()) {
            newErrors.password = '비밀번호를 입력해 주세요.';
            isValid = false;
        } else if (formData.password.length < 8) {
            newErrors.password = '비밀번호는 8자 이상이어야 합니다.';
            isValid = false;
        } else if (!/(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/.test(formData.password)) {
            newErrors.password = '비밀번호는 영문, 숫자, 특수문자를 포함해야 합니다.';
            isValid = false;
        }

        // 비밀번호 확인 유효성 검사
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';
            isValid = false;
        }

        // 생년월일 유효성 검사
        if (!formData.birthdate.trim()) {
            newErrors.birthdate = '생년월일을 입력해 주세요.';
            isValid = false;
        }

        // 휴대폰 번호 유효성 검사
        if (!formData.phone.trim()) {
            newErrors.phone = '휴대폰 번호를 입력해 주세요.';
            isValid = false;
        } else if (!/^\d{3}-\d{4}-\d{4}$/.test(formData.phone)) {
            newErrors.phone = '올바른 형식(000-0000-0000)으로 입력해 주세요.';
            isValid = false;
        }

        // 약관 동의 확인
        if (!agreeTerms || !agreePrivacy) {
            newErrors.terms = '필수 약관에 모두 동의해 주세요.';
            isValid = false;
        }

        setFormErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const registerData: RegisterFormData = {
            ...formData,
            agreeTerms,
            agreePrivacy,
            agreeMarketing
        };

        try {
            // 외부에서 제공된 onSubmit 함수가 있으면 사용하고, 없으면 useAuth의 register 함수 사용
            if (onSubmit) {
                await onSubmit(registerData);
            } else {
                await register(registerData);
            }

            if (onSuccess) {
                onSuccess();
            } else {
                alert('회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.');
                navigate('/login');
            }
        } catch (err) {
            // 에러는 useAuth 또는 외부 onSubmit에서 처리됨
        }
    };
    return (
        <Form onSubmit={handleSubmit}>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      <FormGroup>
        <Label htmlFor="name">이름</Label>
        <Input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="이름을 입력하세요"
        />
        {formErrors.name && <ErrorMessage>{formErrors.name}</ErrorMessage>}
      </FormGroup>
      
      <FormGroup>
        <Label htmlFor="email">이메일</Label>
        <Input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="이메일 주소를 입력하세요"
        />
        {formErrors.email && <ErrorMessage>{formErrors.email}</ErrorMessage>}
      </FormGroup>
      
      <FormGroup>
        <Label htmlFor="password">비밀번호</Label>
        <Input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          placeholder="비밀번호를 입력하세요 (8자 이상, 영문/숫자/특수문자 포함)"
        />
        {formErrors.password && <ErrorMessage>{formErrors.password}</ErrorMessage>}
      </FormGroup>
      
      <FormGroup>
        <Label htmlFor="confirmPassword">비밀번호 확인</Label>
        <Input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleInputChange}
          placeholder="비밀번호를 다시 입력하세요"
        />
        {formErrors.confirmPassword && <ErrorMessage>{formErrors.confirmPassword}</ErrorMessage>}
      </FormGroup>
      
      <FormGroup>
        <Label htmlFor="birthdate">생년월일</Label>
        <Input
          type="date"
          id="birthdate"
          name="birthdate"
          value={formData.birthdate}
          onChange={handleInputChange}
        />
        {formErrors.birthdate && <ErrorMessage>{formErrors.birthdate}</ErrorMessage>}
      </FormGroup>
      
      <FormGroup>
        <Label htmlFor="phone">휴대폰 번호</Label>
        <Input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          placeholder="000-0000-0000"
        />
        {formErrors.phone && <ErrorMessage>{formErrors.phone}</ErrorMessage>}
      </FormGroup>
      
      <FormGroup>
        <CheckboxGroup>
          <input
            type="checkbox"
            id="agreeTerms"
            checked={agreeTerms}
            onChange={() => { setAgreeTerms(!agreeTerms); setFormErrors(prev => ({ ...prev, terms: '' })); }}
          />
          <label htmlFor="agreeTerms">
            <strong>[필수]</strong> 서비스 이용약관에 동의합니다.
          </label>
        </CheckboxGroup>
        
        <CheckboxGroup>
          <input
            type="checkbox"
            id="agreePrivacy"
            checked={agreePrivacy}
            onChange={() => { setAgreePrivacy(!agreePrivacy); setFormErrors(prev => ({ ...prev, terms: '' })); }}
          />
          <label htmlFor="agreePrivacy">
            <strong>[필수]</strong> 개인정보 처리방침에 동의합니다.
          </label>
        </CheckboxGroup>
        
        <CheckboxGroup>
          <input
            type="checkbox"
            id="agreeMarketing"
            checked={agreeMarketing}
            onChange={() => setAgreeMarketing(!agreeMarketing)}
          />
          <label htmlFor="agreeMarketing">
            [선택] 마케팅 정보 수신에 동의합니다.
          </label>
        </CheckboxGroup>
        {formErrors.terms && <ErrorMessage>{formErrors.terms}</ErrorMessage>}
      </FormGroup>
      
      <Button 
        variant="primary" 
        size="large" 
        fullWidth 
        type="submit"
        disabled={loading}
      >
        {loading ? '가입 중...' : '회원가입'}
      </Button>
    </Form>
    );
};

export default RegisterForm;