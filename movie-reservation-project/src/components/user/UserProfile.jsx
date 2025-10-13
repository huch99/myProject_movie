import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { FaUser, FaEnvelope, FaCalendarAlt, FaPhone, FaEdit, FaCamera } from 'react-icons/fa';
import { updateProfile } from '../../store/slices/authSlice';
import Button from '../common/Button';
import Input from '../common/Input';
import Modal from '../common/Modal';
import dateUtils from '../../utils/dateUtils';
import formatUtils from '../../utils/formatUtils';

/**
 * 사용자 프로필 컴포넌트
 */
const UserProfile = () => {
    const dispatch = useDispatch();
    const { user, loading } = useSelector((state) => state.auth);

    // 프로필 수정 모드 상태
    const [isEditMode, setIsEditMode] = useState(false);
    // 프로필 이미지 변경 모달 상태
    const [showImageModal, setShowImageModal] = useState(false);
    // 비밀번호 변경 모달 상태
    const [showPasswordModal, setShowPasswordModal] = useState(false);

    // 수정 가능한 사용자 정보 상태
    const [formData, setFormData] = useState({
        nickname: '',
        phoneNumber: '',
    });

    // 비밀번호 변경 상태
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    // 프로필 이미지 상태
    const [profileImage, setProfileImage] = useState(null);
    const [previewImage, setPreviewImage] = useState('');

    // 오류 메시지 상태
    const [errors, setErrors] = useState({});

    // 사용자 정보 로드
    useEffect(() => {
        if (user) {
            setFormData({
                nickname: user.nickname || '',
                phoneNumber: user.phoneNumber || '',
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

    // 비밀번호 입력 필드 변경 핸들러
    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData({
            ...passwordData,
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

    // 프로필 이미지 변경 핸들러
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // 수정 모드 토글 핸들러
    const toggleEditMode = () => {
        setIsEditMode(!isEditMode);

        // 수정 모드 취소 시 원래 정보로 되돌리기
        if (isEditMode) {
            setFormData({
                nickname: user.nickname || '',
                phoneNumber: user.phoneNumber || '',
            });
            setErrors({});
        }
    };

    // 프로필 업데이트 핸들러
    const handleUpdateProfile = async () => {
        // 유효성 검사
        const newErrors = {};

        if (!formData.nickname.trim()) {
            newErrors.nickname = '닉네임을 입력해주세요.';
        }

        if (formData.phoneNumber && !formData.phoneNumber.match(/^\d{10,11}$/)) {
            newErrors.phoneNumber = '유효한 전화번호 형식이 아닙니다.';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            // 프로필 이미지가 있으면 먼저 업로드
            let imageUrl = user.profileImage;

            if (profileImage) {
                const formData = new FormData();
                formData.append('image', profileImage);

                // 이미지 업로드 API 호출 (실제 구현 시 필요)
                // const response = await userService.uploadProfileImage(formData);
                // imageUrl = response.imageUrl;
            }

            // 프로필 업데이트 액션 디스패치
            await dispatch(updateProfile({
                ...formData,
                profileImage: imageUrl
            })).unwrap();

            // 수정 모드 종료
            setIsEditMode(false);
        } catch (error) {
            setErrors({
                submit: '프로필 업데이트에 실패했습니다.'
            });
        }
    };

    // 비밀번호 변경 핸들러
    const handleChangePassword = async () => {
        // 유효성 검사
        const newErrors = {};

        if (!passwordData.currentPassword) {
            newErrors.currentPassword = '현재 비밀번호를 입력해주세요.';
        }

        if (!passwordData.newPassword) {
            newErrors.newPassword = '새 비밀번호를 입력해주세요.';
        } else if (passwordData.newPassword.length < 8) {
            newErrors.newPassword = '비밀번호는 8자 이상이어야 합니다.';
        }

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            // 비밀번호 변경 API 호출 (실제 구현 시 필요)
            // await userService.changePassword(passwordData.currentPassword, passwordData.newPassword);

            // 비밀번호 변경 모달 닫기
            setShowPasswordModal(false);

            // 비밀번호 입력 초기화
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
            });
        } catch (error) {
            setErrors({
                passwordSubmit: '비밀번호 변경에 실패했습니다. 현재 비밀번호를 확인해주세요.'
            });
        }
    };

    // 사용자 등급 표시 함수
    const renderUserTier = () => {
        if (!user?.tier) return '일반';

        switch (user.tier) {
            case 'PREMIUM':
                return '프리미엄';
            case 'VIP':
                return 'VIP';
            case 'VVIP':
                return 'VVIP';
            default:
                return '일반';
        }
    };

    return (
        <ProfileContainer>
            {/* 프로필 헤더 */}
            <ProfileHeader>
                <ProfileImageSection>
                    <ProfileImageWrapper>
                        <ProfileImage src={previewImage || '/images/default-profile.jpg'} alt="프로필 이미지" />
                        {isEditMode && (
                            <ChangeImageButton onClick={() => setShowImageModal(true)}>
                                <FaCamera />
                            </ChangeImageButton>
                        )}
                    </ProfileImageWrapper>
                </ProfileImageSection>

                <ProfileInfo>
                    <UserName>{user?.username || '사용자'}</UserName>
                    <UserEmail>{user?.email || 'email@example.com'}</UserEmail>
                    <UserTier>회원등급: {renderUserTier()}</UserTier>
                    <LastLogin>마지막 로그인: {user?.lastLoginAt ? dateUtils.formatDateTime(user.lastLoginAt) : '정보 없음'}</LastLogin>
                </ProfileInfo>

                <ProfileActions>
                    <EditButton onClick={toggleEditMode}>
                        {isEditMode ? '취소' : '프로필 수정'}
                    </EditButton>

                    {!isEditMode && (
                        <PasswordButton onClick={() => setShowPasswordModal(true)}>
                            비밀번호 변경
                        </PasswordButton>
                    )}
                </ProfileActions>
            </ProfileHeader>

            {/* 프로필 상세 정보 */}
            <ProfileDetails>
                <SectionTitle>회원 정보</SectionTitle>

                {/* 기본 정보 */}
                <InfoSection>
                    <InfoItem>
                        <InfoLabel>
                            <FaUser />
                            <span>이름</span>
                        </InfoLabel>
                        <InfoValue>{user?.username || '정보 없음'}</InfoValue>
                    </InfoItem>

                    <InfoItem>
                        <InfoLabel>
                            <FaEnvelope />
                            <span>이메일</span>
                        </InfoLabel>
                        <InfoValue>{user?.email || '정보 없음'}</InfoValue>
                    </InfoItem>

                    <InfoItem>
                        <InfoLabel>
                            <FaUser />
                            <span>닉네임</span>
                        </InfoLabel>
                        {isEditMode ? (
                            <EditableField>
                                <Input
                                    name="nickname"
                                    value={formData.nickname}
                                    onChange={handleChange}
                                    error={errors.nickname}
                                />
                            </EditableField>
                        ) : (
                            <InfoValue>{user?.nickname || '정보 없음'}</InfoValue>
                        )}
                    </InfoItem>

                    <InfoItem>
                        <InfoLabel>
                            <FaCalendarAlt />
                            <span>생년월일</span>
                        </InfoLabel>
                        <InfoValue>
                            {user?.birthDate ? dateUtils.formatDate(user.birthDate) : '정보 없음'}
                        </InfoValue>
                    </InfoItem>

                    <InfoItem>
                        <InfoLabel>
                            <FaPhone />
                            <span>전화번호</span>
                        </InfoLabel>
                        {isEditMode ? (
                            <EditableField>
                                <Input
                                    name="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    placeholder="'-' 없이 입력"
                                    error={errors.phoneNumber}
                                />
                            </EditableField>
                        ) : (
                            <InfoValue>
                                {user?.phoneNumber ? formatUtils.formatPhoneNumber(user.phoneNumber) : '정보 없음'}
                            </InfoValue>
                        )}
                    </InfoItem>
                </InfoSection>

                {/* 수정 버튼 */}
                {isEditMode && (
                    <ActionButtons>
                        <CancelButton onClick={toggleEditMode}>
                            취소
                        </CancelButton>
                        <SaveButton onClick={handleUpdateProfile} disabled={loading}>
                            {loading ? '저장 중...' : '저장하기'}
                        </SaveButton>
                    </ActionButtons>
                )}

                {errors.submit && (
                    <ErrorMessage>{errors.submit}</ErrorMessage>
                )}
            </ProfileDetails>

            {/* 프로필 이미지 변경 모달 */}
            <Modal
                isOpen={showImageModal}
                onClose={() => setShowImageModal(false)}
                title="프로필 이미지 변경"
            >
                <ImageUploadContainer>
                    <ImagePreview src={previewImage || '/images/default-profile.jpg'} alt="프로필 이미지 미리보기" />
                    <FileInput
                        type="file"
                        id="profileImage"
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                    <FileInputLabel htmlFor="profileImage">
                        이미지 선택
                    </FileInputLabel>
                    <ModalActions>
                        <CancelButton onClick={() => setShowImageModal(false)}>
                            취소
                        </CancelButton>
                        <SaveButton
                            onClick={() => {
                                setShowImageModal(false);
                            }}
                        >
                            적용하기
                        </SaveButton>
                    </ModalActions>
                </ImageUploadContainer>
            </Modal>

            {/* 비밀번호 변경 모달 */}
            <Modal
                isOpen={showPasswordModal}
                onClose={() => setShowPasswordModal(false)}
                title="비밀번호 변경"
            >
                <PasswordChangeForm>
                    <InputGroup>
                        <Input
                            type="password"
                            name="currentPassword"
                            label="현재 비밀번호"
                            value={passwordData.currentPassword}
                            onChange={handlePasswordChange}
                            error={errors.currentPassword}
                        />
                    </InputGroup>

                    <InputGroup>
                        <Input
                            type="password"
                            name="newPassword"
                            label="새 비밀번호"
                            value={passwordData.newPassword}
                            onChange={handlePasswordChange}
                            error={errors.newPassword}
                        />
                    </InputGroup>

                    <InputGroup>
                        <Input
                            type="password"
                            name="confirmPassword"
                            label="비밀번호 확인"
                            value={passwordData.confirmPassword}
                            onChange={handlePasswordChange}
                            error={errors.confirmPassword}
                        />
                    </InputGroup>

                    {errors.passwordSubmit && (
                        <ErrorMessage>{errors.passwordSubmit}</ErrorMessage>
                    )}

                    <ModalActions>
                        <CancelButton onClick={() => setShowPasswordModal(false)}>
                            취소
                        </CancelButton>
                        <SaveButton onClick={handleChangePassword}>
                            변경하기
                        </SaveButton>
                    </ModalActions>
                </PasswordChangeForm>
            </Modal>
        </ProfileContainer>
    );
};

// 스타일 컴포넌트
const ProfileContainer = styled.div`
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: var(--spacing-xl);
  padding: var(--spacing-lg);
  background-color: var(--color-surface);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--box-shadow-sm);
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const ProfileImageSection = styled.div`
  margin-right: var(--spacing-lg);
  
  @media (max-width: 768px) {
    margin-right: 0;
    margin-bottom: var(--spacing-md);
  }
`;

const ProfileImageWrapper = styled.div`
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

const ChangeImageButton = styled.button`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: var(--color-primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: none;
  box-shadow: var(--box-shadow-sm);
`;

const ProfileInfo = styled.div`
  flex: 1;
`;

const UserName = styled.h2`
  font-size: var(--font-size-xl);
  font-weight: 700;
  margin-bottom: var(--spacing-xs);
`;

const UserEmail = styled.div`
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-xs);
`;

const UserTier = styled.div`
  display: inline-block;
  background-color: var(--color-primary-light, #ffeaee);
  color: var(--color-primary);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius-full);
  font-size: var(--font-size-sm);
  font-weight: 500;
  margin-bottom: var(--spacing-xs);
`;

const LastLogin = styled.div`
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
`;

const ProfileActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  
  @media (max-width: 768px) {
    flex-direction: row;
    margin-top: var(--spacing-md);
  }
`;

const EditButton = styled(Button)`
  white-space: nowrap;
`;

const PasswordButton = styled(Button)`
  white-space: nowrap;
  background-color: transparent;
  border: 1px solid var(--color-border);
  color: var(--color-text-primary);
  
  &:hover {
    background-color: var(--color-surface-variant, rgba(0, 0, 0, 0.03));
  }
`;

const ProfileDetails = styled.div`
  padding: var(--spacing-lg);
  background-color: var(--color-surface);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--box-shadow-sm);
`;

const SectionTitle = styled.h3`
  font-size: var(--font-size-lg);
  font-weight: 600;
  margin-bottom: var(--spacing-md);
  color: var(--color-text-primary);
  padding-bottom: var(--spacing-xs);
  border-bottom: 1px solid var(--color-border);
`;

const InfoSection = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-lg);
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
`;

const InfoLabel = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  
  svg {
    color: var(--color-primary);
  }
`;

const InfoValue = styled.div`
  font-weight: 500;
`;

const EditableField = styled.div`
  width: 100%;
`;

const ActionButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-md);
  margin-top: var(--spacing-lg);
`;

const SaveButton = styled(Button)`
  background-color: var(--color-primary);
  color: white;
  
  &:hover {
    background-color: var(--color-primary-dark, #d01830);
  }
`;

const CancelButton = styled(Button)`
  background-color: transparent;
  border: 1px solid var(--color-border);
  color: var(--color-text-primary);
  
  &:hover {
    background-color: var(--color-surface-variant, rgba(0, 0, 0, 0.03));
  }
`;

const ErrorMessage = styled.div`
  color: var(--color-error);
  margin-top: var(--spacing-sm);
  font-size: var(--font-size-sm);
`;

const ImageUploadContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
`;

const ImagePreview = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
`;

const FileInput = styled.input`
  display: none;
`;

const FileInputLabel = styled.label`
  padding: var(--spacing-sm) var(--spacing-md);
  background-color: var(--color-primary);
  color: white;
  border-radius: var(--border-radius-md);
  cursor: pointer;
  transition: var(--transition-fast);
  
  &:hover {
    background-color: var(--color-primary-dark, #d01830);
  }
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-md);
  margin-top: var(--spacing-lg);
  width: 100%;
`;

const PasswordChangeForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
`;

const InputGroup = styled.div`
  margin-bottom: var(--spacing-sm);
`;

export default UserProfile;