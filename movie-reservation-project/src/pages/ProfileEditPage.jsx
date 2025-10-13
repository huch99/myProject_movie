// src/pages/ProfileEditPage.js
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { updateUserProfile } from '../store/slices/authSlice';
import Container from '../components/layout/Container';
import PageTitle from '../components/common/PageTitle';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Alert from '../components/common/Alert';
import { FaUser, FaCamera } from 'react-icons/fa';
import ROUTE_PATHS from '../constants/routePaths';

/**
 * 프로필 수정 페이지 컴포넌트
 */
const ProfileEditPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, loading } = useSelector((state) => state.auth);

    // 폼 상태 관리
    const [formData, setFormData] = useState({
        nickname: '',
        phoneNumber: '',
        birthDate: '',
        profileImage: null
    });

    // 미리보기 이미지 URL
    const [previewImage, setPreviewImage] = useState('');

    // 알림 상태
    const [alert, setAlert] = useState({
        show: false,
        message: '',
        type: 'success'
    });

    // 오류 메시지
    const [errors, setErrors] = useState({});

    // 사용자 정보 로드
    useEffect(() => {
        if (user) {
            setFormData({
                nickname: user.nickname || '',
                phoneNumber: user.phoneNumber || '',
                birthDate: user.birthDate || '',
                profileImage: null
            });

            if (user.profileImage) {
                setPreviewImage(user.profileImage);
            }
        }
    }, [user]);

    // 입력 필드 변경 핸들러
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });

        // 오류 메시지 초기화
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: ''
            });
        }
    };

    // 이미지 변경 핸들러
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({
                ...formData,
                profileImage: file
            });

            // 이미지 미리보기 생성
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // 폼 제출 핸들러
    const handleSubmit = async (e) => {
        e.preventDefault();

        // 유효성 검사
        const validationErrors = {};

        if (!formData.nickname.trim()) {
            validationErrors.nickname = '닉네임을 입력해주세요.';
        } else if (formData.nickname.length < 2 || formData.nickname.length > 10) {
            validationErrors.nickname = '닉네임은 2자 이상 10자 이하로 입력해주세요.';
        }

        if (formData.phoneNumber && !/^\d{10,11}$/.test(formData.phoneNumber.replace(/-/g, ''))) {
            validationErrors.phoneNumber = '올바른 전화번호 형식이 아닙니다.';
        }

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            // 프로필 이미지 처리 (실제 구현 시 필요)
            let imageUrl = user.profileImage;

            if (formData.profileImage) {
                // 이미지 업로드 로직 (실제 구현 시 필요)
                // const uploadResult = await uploadProfileImage(formData.profileImage);
                // imageUrl = uploadResult.imageUrl;
            }

            // 프로필 업데이트 액션 디스패치
            await dispatch(updateUserProfile({
                ...formData,
                profileImage: imageUrl
            })).unwrap();

            // 성공 알림 표시
            setAlert({
                show: true,
                message: '프로필이 성공적으로 업데이트되었습니다.',
                type: 'success'
            });

            // 일정 시간 후 알림 숨기기
            setTimeout(() => {
                setAlert({ ...alert, show: false });
            }, 3000);
        } catch (error) {
            console.error('프로필 업데이트 오류:', error);

            setAlert({
                show: true,
                message: '프로필 업데이트 중 오류가 발생했습니다.',
                type: 'error'
            });
        }
    };

    // 뒤로 가기 핸들러
    const handleGoBack = () => {
        navigate(ROUTE_PATHS.MY_PAGE);
    };

    return (
        <Container>
            <PageWrapper>
                <PageTitle>
                    <FaUser />
                    <span>프로필 수정</span>
                </PageTitle>

                {alert.show && (
                    <Alert
                        message={alert.message}
                        type={alert.type}
                        onClose={() => setAlert({ ...alert, show: false })}
                    />
                )}

                <ProfileForm onSubmit={handleSubmit}>
                    <FormSection>
                        <SectionTitle>프로필 이미지</SectionTitle>
                        <ImageUploadSection>
                            <ProfileImagePreview>
                                <ProfileImage
                                    src={previewImage || '/images/default-profile.jpg'}
                                    alt="프로필 이미지"
                                />
                                <UploadButton htmlFor="profileImage">
                                    <FaCamera />
                                </UploadButton>
                            </ProfileImagePreview>
                            <ImageUploadInfo>
                                JPG, PNG 파일 (최대 5MB)
                                <input
                                    type="file"
                                    id="profileImage"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    style={{ display: 'none' }}
                                />
                            </ImageUploadInfo>
                        </ImageUploadSection>
                    </FormSection>

                    <FormSection>
                        <SectionTitle>기본 정보</SectionTitle>

                        <FormGroup>
                            <Input
                                label="이메일"
                                type="email"
                                value={user?.email || ''}
                                disabled
                                helpText="이메일은 변경할 수 없습니다."
                            />
                        </FormGroup>

                        <FormGroup>
                            <Input
                                label="이름"
                                type="text"
                                value={user?.username || ''}
                                disabled
                                helpText="이름은 변경할 수 없습니다."
                            />
                        </FormGroup>

                        <FormGroup>
                            <Input
                                label="닉네임"
                                type="text"
                                name="nickname"
                                value={formData.nickname}
                                onChange={handleChange}
                                error={errors.nickname}
                                required
                            />
                        </FormGroup>

                        <FormGroup>
                            <Input
                                label="생년월일"
                                type="date"
                                name="birthDate"
                                value={formData.birthDate}
                                onChange={handleChange}
                                error={errors.birthDate}
                            />
                        </FormGroup>

                        <FormGroup>
                            <Input
                                label="휴대폰 번호"
                                type="tel"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                placeholder="'-' 없이 입력하세요"
                                error={errors.phoneNumber}
                            />
                        </FormGroup>
                    </FormSection>

                    <FormActions>
                        <CancelButton type="button" onClick={handleGoBack}>
                            취소
                        </CancelButton>
                        <SaveButton type="submit" disabled={loading}>
                            {loading ? '저장 중...' : '저장하기'}
                        </SaveButton>
                    </FormActions>
                </ProfileForm>
            </PageWrapper>
        </Container>
    );
};

// 스타일 컴포넌트
const PageWrapper = styled.div`
  max-width: 700px;
  margin: 0 auto;
  padding: var(--spacing-lg) 0;
`;

const ProfileForm = styled.form`
  background-color: var(--color-surface);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg);
  box-shadow: var(--box-shadow-sm);
`;

const FormSection = styled.section`
  margin-bottom: var(--spacing-xl);
`;

const SectionTitle = styled.h3`
  font-size: var(--font-size-lg);
  font-weight: 600;
  margin-bottom: var(--spacing-md);
  color: var(--color-text-primary);
  padding-bottom: var(--spacing-xs);
  border-bottom: 1px solid var(--color-border);
`;

const ImageUploadSection = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
  
  @media (max-width: 576px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const ProfileImagePreview = styled.div`
  position: relative;
  width: 120px;
  height: 120px;
`;

const ProfileImage = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid var(--color-primary);
`;

const UploadButton = styled.label`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: var(--color-primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: var(--box-shadow-sm);
`;

const ImageUploadInfo = styled.div`
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
`;

const FormGroup = styled.div`
  margin-bottom: var(--spacing-md);
`;

const FormActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-md);
`;

const CancelButton = styled(Button)`
  background-color: transparent;
  border: 1px solid var(--color-border);
  color: var(--color-text-primary);
  
  &:hover {
    background-color: var(--color-surface-variant, rgba(0, 0, 0, 0.03));
  }
`;

const SaveButton = styled(Button)`
  background-color: var(--color-primary);
  color: white;
  
  &:hover {
    background-color: var(--color-primary-dark, #d01830);
  }
`;

export default ProfileEditPage;