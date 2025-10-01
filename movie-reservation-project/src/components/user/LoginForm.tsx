import React, { useState } from 'react';
import styled from 'styled-components';
import Button from '../common/Button';
import { useAuth } from '../../hooks/useAuth';

interface LoginFormProps {
    onSuccess?: () => void;
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

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
    const { login, loading, error } = useAuth();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [formErrors, setFormErrors] = useState({
        email: '',
        password: '',
    });

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
        const newErrors = { email: '', password: '' };

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
        }

        setFormErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            await login(formData); // AuthContext의 login 함수 사용

            if (onSuccess) {
                onSuccess();
            }
        } catch (err) {
            // 에러는 useAuth에서 처리됨
        }
    };

    return (
        <Form onSubmit={handleSubmit}>
            {error && <ErrorMessage>{error}</ErrorMessage>}

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
                    placeholder="비밀번호를 입력하세요"
                />
                {formErrors.password && <ErrorMessage>{formErrors.password}</ErrorMessage>}
            </FormGroup>

            <Button
                variant="primary"
                size="large"
                fullWidth
                type="submit"
                disabled={loading}
            >
                {loading ? '로그인 중...' : '로그인'}
            </Button>
        </Form>
    );
};

export default LoginForm;