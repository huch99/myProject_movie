import React from 'react';
import styled from 'styled-components';
import { 
  FaParking, FaWheelchair, FaUtensils, FaIceCream, 
  FaTicketAlt, FaWifi, FaBaby, FaCouch, FaCoffee
} from 'react-icons/fa';

const TheaterFacilities = ({ facilities }) => {
  // 시설 아이콘 매핑
  const facilityIcons = {
    'PARKING': { icon: <FaParking />, label: '주차시설' },
    'WHEELCHAIR': { icon: <FaWheelchair />, label: '휠체어 접근' },
    'RESTAURANT': { icon: <FaUtensils />, label: '식당' },
    'SNACK_BAR': { icon: <FaIceCream />, label: '스낵바' },
    'TICKETING': { icon: <FaTicketAlt />, label: '현장 발권' },
    'WIFI': { icon: <FaWifi />, label: '와이파이' },
    'NURSING_ROOM': { icon: <FaBaby />, label: '수유실' },
    'PREMIUM_SEAT': { icon: <FaCouch />, label: '프리미엄석' },
    'CAFE': { icon: <FaCoffee />, label: '카페' }
    // 필요에 따라 더 추가 가능
  };

  if (!facilities || facilities.length === 0) {
    return (
      <FacilitiesContainer>
        <NoFacilities>등록된 부대시설 정보가 없습니다.</NoFacilities>
      </FacilitiesContainer>
    );
  }

  return (
    <FacilitiesContainer>
      <FacilitiesTitle>부대시설</FacilitiesTitle>
      <FacilitiesList>
        {facilities.map((facility, index) => {
          const facilityInfo = facilityIcons[facility] || { 
            icon: null, 
            label: facility 
          };
          
          return (
            <FacilityItem key={index}>
              <IconWrapper>
                {facilityInfo.icon || <DefaultIcon>•</DefaultIcon>}
              </IconWrapper>
              <FacilityName>{facilityInfo.label}</FacilityName>
            </FacilityItem>
          );
        })}
      </FacilitiesList>
    </FacilitiesContainer>
  );
};

// Styled Components
const FacilitiesContainer = styled.div`
  margin: 20px 0;
  padding: 16px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const FacilitiesTitle = styled.h3`
  font-size: 18px;
  margin: 0 0 16px 0;
  padding-bottom: 8px;
  border-bottom: 1px solid #eee;
`;

const FacilitiesList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
`;

const FacilityItem = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 16px;
  background-color: #f5f5f5;
  border-radius: 20px;
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
  color: #3498db;
  font-size: 16px;
`;

const DefaultIcon = styled.span`
  font-size: 20px;
`;

const FacilityName = styled.span`
  font-size: 14px;
`;

const NoFacilities = styled.div`
  padding: 20px;
  text-align: center;
  color: #999;
`;

export default TheaterFacilities;