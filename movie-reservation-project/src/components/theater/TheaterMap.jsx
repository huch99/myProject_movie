// src/components/theater/TheaterMap.js
import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

/**
 * 극장 위치를 지도에 표시하는 컴포넌트
 * 
 * @param {Object} props
 * @param {Object} props.theater - 단일 극장 정보 (상세 페이지용)
 * @param {Array} props.theaters - 여러 극장 정보 목록 (목록 페이지용)
 * @param {number} props.zoom - 지도 줌 레벨 (기본값: 15)
 * @param {string} props.height - 지도 높이 (기본값: '400px')
 */
const TheaterMap = ({ theater, theaters, zoom = 15, height = '400px' }) => {
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const markersRef = useRef([]);

    useEffect(() => {
        // 카카오맵 API가 로드되었는지 확인
        const loadKakaoMap = () => {
            if (window.kakao && window.kakao.maps) {
                initializeMap();
            } else {
                // 카카오맵 API 로드
                const script = document.createElement('script');
                script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.REACT_APP_KAKAO_MAP_API_KEY}&autoload=false`;
                script.async = true;
                script.onload = () => {
                    window.kakao.maps.load(initializeMap);
                };
                document.head.appendChild(script);
            }
        };

        // 지도 초기화
        const initializeMap = () => {
            const container = mapRef.current;
            const options = {
                center: new window.kakao.maps.LatLng(37.566826, 126.9786567), // 서울 시청 (기본값)
                level: zoom
            };

            // 지도 생성
            const map = new window.kakao.maps.Map(container, options);
            mapInstanceRef.current = map;

            // 지도에 극장 표시
            if (theater) {
                // 단일 극장 표시 (상세 페이지)
                displayTheater(theater, map);
            } else if (theaters && theaters.length > 0) {
                // 여러 극장 표시 (목록 페이지)
                displayTheaters(theaters, map);
            }
        };

        loadKakaoMap();

        // 컴포넌트 언마운트 시 마커 정리
        return () => {
            markersRef.current.forEach(marker => marker.setMap(null));
            markersRef.current = [];
        };
    }, [theater, theaters, zoom]);

    // 단일 극장 표시 함수
    const displayTheater = (theaterData, map) => {
        if (!theaterData.latitude || !theaterData.longitude) return;

        const position = new window.kakao.maps.LatLng(
            theaterData.latitude,
            theaterData.longitude
        );

        // 지도 중심 이동
        map.setCenter(position);

        // 마커 생성
        const marker = new window.kakao.maps.Marker({
            position,
            map
        });

        markersRef.current.push(marker);

        // 인포윈도우 생성
        const infoContent = `
      <div style="padding:5px;font-size:12px;">
        <strong>${theaterData.name}</strong><br>
        ${theaterData.address}
      </div>
    `;

        const infowindow = new window.kakao.maps.InfoWindow({
            content: infoContent
        });

        // 인포윈도우 표시
        infowindow.open(map, marker);

        // 마커 클릭 이벤트
        window.kakao.maps.event.addListener(marker, 'click', () => {
            infowindow.open(map, marker);
        });
    };

    // 여러 극장 표시 함수
    const displayTheaters = (theaterList, map) => {
        if (!theaterList || theaterList.length === 0) return;

        const bounds = new window.kakao.maps.LatLngBounds();

        theaterList.forEach(theaterData => {
            if (!theaterData.latitude || !theaterData.longitude) return;

            const position = new window.kakao.maps.LatLng(
                theaterData.latitude,
                theaterData.longitude
            );

            // 마커 생성
            const marker = new window.kakao.maps.Marker({
                position,
                map
            });

            markersRef.current.push(marker);

            // 인포윈도우 생성
            const infoContent = `
        <div style="padding:5px;font-size:12px;">
          <strong>${theaterData.name}</strong><br>
          ${theaterData.address}
        </div>
      `;

            const infowindow = new window.kakao.maps.InfoWindow({
                content: infoContent
            });

            // 마커 클릭 이벤트
            window.kakao.maps.event.addListener(marker, 'click', () => {
                infowindow.open(map, marker);
            });

            // 지도 범위 확장
            bounds.extend(position);
        });

        // 모든 마커가 보이도록 지도 범위 조정
        map.setBounds(bounds);
    };

    return (
        <MapContainer ref={mapRef} height={height}>
            {!window.kakao && (
                <MapFallback>
                    지도를 불러오는 중입니다...
                </MapFallback>
            )}
        </MapContainer>
    );
};

// 스타일 컴포넌트
const MapContainer = styled.div`
  width: 100%;
  height: ${props => props.height || '400px'};
  border-radius: var(--border-radius-md);
  position: relative;
  overflow: hidden;
`;

const MapFallback = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-surface);
  color: var(--color-text-secondary);
`;

TheaterMap.propTypes = {
    theater: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        name: PropTypes.string,
        address: PropTypes.string,
        latitude: PropTypes.number,
        longitude: PropTypes.number
    }),
    theaters: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            name: PropTypes.string,
            address: PropTypes.string,
            latitude: PropTypes.number,
            longitude: PropTypes.number
        })
    ),
    zoom: PropTypes.number,
    height: PropTypes.string
};

export default TheaterMap;