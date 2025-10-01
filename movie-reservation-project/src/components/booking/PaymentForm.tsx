import React, { useState } from 'react';
import styled from 'styled-components';
import { useBooking } from '../../context/BookingContext';
import { useNavigate } from 'react-router';
import Button from '../common/Button';

const Container = styled.div`
  margin-bottom: 30px;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 20px;
  font-weight: 600;
`;

const BookingSummary = styled.div`
  background-color: #f8f8f8;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 30px;
`;

const SummaryTitle = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 15px;
  font-weight: 600;
`;

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
`;

const SummaryItem = styled.div`
  margin-bottom: 15px;
`;

const ItemLabel = styled.div`
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 5px;
`;

const ItemValue = styled.div`
  font-size: 1rem;
  font-weight: 500;
`;

const FormSection = styled.div`
  margin-bottom: 30px;
`;

const SectionTitle = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 15px;
  font-weight: 600;
`;

const PaymentMethodContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 20px;
`;

const PaymentMethodOption = styled.div<{ selected: boolean }>`
  flex: 1;
  min-width: 120px;
  padding: 15px;
  border: 1px solid ${props => props.selected ? '#e51937' : '#ddd'};
  border-radius: 8px;
  text-align: center;
  cursor: pointer;
  background-color: ${props => props.selected ? 'rgba(229, 25, 55, 0.05)' : 'white'};
  transition: all 0.2s;
  
  &:hover {
    border-color: ${props => props.selected ? '#e51937' : '#bbb'};
    background-color: ${props => props.selected ? 'rgba(229, 25, 55, 0.05)' : '#f9f9f9'};
  }
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  font-size: 0.9rem;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #e51937;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #e51937;
  }
`;

const CardInfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
`;

const Checkbox = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
  
  input {
    width: 18px;
    height: 18px;
  }
  
  label {
    font-size: 0.9rem;
  }
`;

const TotalAmount = styled.div`
  background-color: #f8f8f8;
  border-radius: 8px;
  padding: 20px;
  margin: 30px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TotalText = styled.div`
  font-size: 1.2rem;
  font-weight: 600;
`;

const TotalPrice = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #e51937;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
`;

const PaymentForm: React.FC = () => {
    const { state, prevStep, resetBooking } = useBooking();
    const { selectedMovie, selectedTheater, selectedScreening, selectedSeats, ticketTypes, totalPrice } = state;

    const navigate = useNavigate();

    const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank' | 'mobile' | 'kakao'>('card');
    const [formData, setFormData] = useState({
        cardNumber: '',
        expiryMonth: '',
        expiryYear: '',
        cvv: '',
        cardOwner: '',
        birthdate: '',
        phoneNumber: '',
    });
    const [agreeTerms, setAgreeTerms] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handlePaymentMethodChange = (method: 'card' | 'bank' | 'mobile' | 'kakao') => {
        setPaymentMethod(method);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!agreeTerms) {
            alert('결제 진행을 위해 약관에 동의해 주세요.');
            return;
        }

        // 폼 유효성 검사
        if (paymentMethod === 'card') {
            if (!formData.cardNumber || !formData.expiryMonth || !formData.expiryYear || !formData.cvv) {
                alert('카드 정보를 모두 입력해 주세요.');
                return;
            }
        }

        try {
            setLoading(true);

            // 실제로는 API 호출하여 결제 처리
            await new Promise(resolve => setTimeout(resolve, 1500)); // 결제 처리 시뮬레이션

            // 결제 성공 시 예매 완료 페이지로 이동
            alert('예매가 완료되었습니다.');
            resetBooking();
            navigate('/booking/complete', {
                state: {
                    movieTitle: selectedMovie?.title,
                    theaterName: selectedTheater?.name,
                    screeningTime: selectedScreening?.startTime,
                    seats: selectedSeats.map(seat => seat.id).join(', '),
                    totalAmount: totalPrice,
                }
            });
        } catch (error) {
            alert('결제 처리 중 오류가 발생했습니다. 다시 시도해 주세요.');
            console.error('Payment error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        prevStep();
    };

    // 날짜 및 시간 포맷 함수
    const formatDateTime = (timeString: string | undefined) => {
        if (!timeString) return '';

        const date = new Date(timeString);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? '오후' : '오전';
        const formattedHours = hours % 12 || 12;

        return `${year}.${month}.${day} ${ampm} ${formattedHours}:${minutes.toString().padStart(2, '0')}`;
    };

    if (!selectedMovie || !selectedTheater || !selectedScreening || selectedSeats.length === 0) {
        return (
            <Container>
                <Title>결제하기</Title>
                <div>영화, 극장, 상영 시간, 좌석을 먼저 선택해 주세요.</div>
                <ButtonContainer>
                    <Button variant="outline" onClick={handleBack}>이전 단계로</Button>
                </ButtonContainer>
            </Container>
        );
    }
    return (
        <Container>
            <Title>결제하기</Title>

            <BookingSummary>
                <SummaryTitle>예매 정보</SummaryTitle>
                <SummaryGrid>
                    <SummaryItem>
                        <ItemLabel>영화</ItemLabel>
                        <ItemValue>{selectedMovie.title}</ItemValue>
                    </SummaryItem>
                    <SummaryItem>
                        <ItemLabel>극장</ItemLabel>
                        <ItemValue>{selectedTheater.name}</ItemValue>
                    </SummaryItem>
                    <SummaryItem>
                        <ItemLabel>상영 일시</ItemLabel>
                        <ItemValue>{formatDateTime(selectedScreening.startTime)}</ItemValue>
                    </SummaryItem>
                    <SummaryItem>
                        <ItemLabel>인원</ItemLabel>
                        <ItemValue>
                            {ticketTypes.adult > 0 && `성인 ${ticketTypes.adult}명 `}
                            {ticketTypes.teen > 0 && `청소년 ${ticketTypes.teen}명 `}
                            {ticketTypes.child > 0 && `어린이 ${ticketTypes.child}명`}
                        </ItemValue>
                    </SummaryItem>
                    <SummaryItem>
                        <ItemLabel>좌석</ItemLabel>
                        <ItemValue>{selectedSeats.map(seat => seat.id).join(', ')}</ItemValue>
                    </SummaryItem>
                </SummaryGrid>
            </BookingSummary>

            <form onSubmit={handleSubmit}>
                <FormSection>
                    <SectionTitle>결제 수단 선택</SectionTitle>
                    <PaymentMethodContainer>
                        <PaymentMethodOption
                            selected={paymentMethod === 'card'}
                            onClick={() => handlePaymentMethodChange('card')}
                        >
                            신용/체크카드
                        </PaymentMethodOption>
                        <PaymentMethodOption
                            selected={paymentMethod === 'bank'}
                            onClick={() => handlePaymentMethodChange('bank')}
                        >
                            계좌이체
                        </PaymentMethodOption>
                        <PaymentMethodOption
                            selected={paymentMethod === 'mobile'}
                            onClick={() => handlePaymentMethodChange('mobile')}
                        >
                            휴대폰 결제
                        </PaymentMethodOption>
                        <PaymentMethodOption
                            selected={paymentMethod === 'kakao'}
                            onClick={() => handlePaymentMethodChange('kakao')}
                        >
                            카카오페이
                        </PaymentMethodOption>
                    </PaymentMethodContainer>
                </FormSection>

                {paymentMethod === 'card' && (
                    <FormSection>
                        <SectionTitle>카드 정보 입력</SectionTitle>
                        <FormGroup>
                            <Label htmlFor="cardNumber">카드 번호</Label>
                            <Input
                                type="text"
                                id="cardNumber"
                                name="cardNumber"
                                placeholder="0000-0000-0000-0000"
                                value={formData.cardNumber}
                                onChange={handleInputChange}
                            />
                        </FormGroup>

                        <CardInfoGrid>
                            <FormGroup>
                                <Label>유효 기간</Label>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <Select
                                        name="expiryMonth"
                                        value={formData.expiryMonth}
                                        onChange={handleInputChange}
                                    >
                                        <option value="">월</option>
                                        {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                                            <option key={month} value={month.toString().padStart(2, '0')}>
                                                {month}월
                                            </option>
                                        ))}
                                    </Select>
                                    <Select
                                        name="expiryYear"
                                        value={formData.expiryYear}
                                        onChange={handleInputChange}
                                    >
                                        <option value="">년</option>
                                        {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i).map(year => (
                                            <option key={year} value={year.toString().slice(-2)}>
                                                {year}년
                                            </option>
                                        ))}
                                    </Select>
                                </div>
                            </FormGroup>

                            <FormGroup>
                                <Label htmlFor="cvv">보안 코드 (CVV)</Label>
                                <Input
                                    type="password"
                                    id="cvv"
                                    name="cvv"
                                    placeholder="카드 뒷면 3자리"
                                    maxLength={3}
                                    value={formData.cvv}
                                    onChange={handleInputChange}
                                />
                            </FormGroup>
                        </CardInfoGrid>

                        <FormGroup>
                            <Label htmlFor="cardOwner">카드 소유자</Label>
                            <Input
                                type="text"
                                id="cardOwner"
                                name="cardOwner"
                                placeholder="카드에 표시된 이름"
                                value={formData.cardOwner}
                                onChange={handleInputChange}
                            />
                        </FormGroup>

                        <FormGroup>
                            <Label htmlFor="birthdate">생년월일</Label>
                            <Input
                                type="text"
                                id="birthdate"
                                name="birthdate"
                                placeholder="YYMMDD (예: 990101)"
                                maxLength={6}
                                value={formData.birthdate}
                                onChange={handleInputChange}
                            />
                        </FormGroup>
                    </FormSection>
                )}

                {paymentMethod === 'bank' && (
                    <FormSection>
                        <SectionTitle>계좌이체 정보</SectionTitle>
                        <FormGroup>
                            <Label>은행 선택</Label>
                            <Select name="bank">
                                <option value="">은행을 선택하세요</option>
                                <option value="kb">국민은행</option>
                                <option value="shinhan">신한은행</option>
                                <option value="woori">우리은행</option>
                                <option value="hana">하나은행</option>
                                <option value="nh">농협은행</option>
                                <option value="ibk">기업은행</option>
                            </Select>
                        </FormGroup>

                        <FormGroup>
                            <Label htmlFor="birthdate">생년월일</Label>
                            <Input
                                type="text"
                                id="birthdate"
                                name="birthdate"
                                placeholder="YYMMDD (예: 990101)"
                                maxLength={6}
                                value={formData.birthdate}
                                onChange={handleInputChange}
                            />
                        </FormGroup>
                    </FormSection>
                )}

                {paymentMethod === 'mobile' && (
                    <FormSection>
                        <SectionTitle>휴대폰 결제 정보</SectionTitle>
                        <FormGroup>
                            <Label>통신사 선택</Label>
                            <Select name="mobileCarrier">
                                <option value="">통신사를 선택하세요</option>
                                <option value="skt">SKT</option>
                                <option value="kt">KT</option>
                                <option value="lgu">LG U+</option>
                                <option value="mvno">알뜰폰</option>
                            </Select>
                        </FormGroup>

                        <FormGroup>
                            <Label htmlFor="phoneNumber">휴대폰 번호</Label>
                            <Input
                                type="text"
                                id="phoneNumber"
                                name="phoneNumber"
                                placeholder="010-0000-0000"
                                value={formData.phoneNumber}
                                onChange={handleInputChange}
                            />
                        </FormGroup>

                        <FormGroup>
                            <Label htmlFor="birthdate">생년월일</Label>
                            <Input
                                type="text"
                                id="birthdate"
                                name="birthdate"
                                placeholder="YYMMDD (예: 990101)"
                                maxLength={6}
                                value={formData.birthdate}
                                onChange={handleInputChange}
                            />
                        </FormGroup>
                    </FormSection>
                )}

                {paymentMethod === 'kakao' && (
                    <FormSection>
                        <SectionTitle>카카오페이 결제 안내</SectionTitle>
                        <p>
                            결제 버튼을 누르시면 카카오페이 결제 화면으로 이동합니다.
                            결제 진행을 위해 카카오톡 앱이 설치되어 있어야 합니다.
                        </p>
                    </FormSection>
                )}

                <FormSection>
                    <Checkbox>
                        <input
                            type="checkbox"
                            id="agreeTerms"
                            checked={agreeTerms}
                            onChange={() => setAgreeTerms(!agreeTerms)}
                        />
                        <label htmlFor="agreeTerms">
                            결제 진행 및 예매 완료 시 환불 규정에 동의합니다.
                            (환불 규정: 상영 시작 20분 전까지 취소 가능, 그 이후 취소 및 환불 불가)
                        </label>
                    </Checkbox>
                </FormSection>

                <TotalAmount>
                    <TotalText>최종 결제 금액</TotalText>
                    <TotalPrice>{totalPrice.toLocaleString()}원</TotalPrice>
                </TotalAmount>

                <ButtonContainer>
                    <Button variant="outline" onClick={handleBack}>
                        이전 단계로
                    </Button>
                    <Button
                        variant="primary"
                        size="large"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? '결제 처리 중...' : '결제하기'}
                    </Button>
                </ButtonContainer>
            </form>
        </Container>
    );
};

export default PaymentForm;