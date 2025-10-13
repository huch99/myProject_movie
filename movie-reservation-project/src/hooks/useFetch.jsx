// API 요청 관련 커스텀 훅
import { useCallback, useEffect, useState } from "react";
import axios from 'axios';
import useAuth from "./useAuth";

/**
 * API 요청을 위한 커스텀 훅
 * @param {string} url - 요청할 API 엔드포인트
 * @param {Object} options - 요청 옵션 (method, headers, body 등)
 * @param {boolean} immediate - 컴포넌트 마운트 시 즉시 요청 여부
 * @returns {Object} { data, loading, error, fetchData }
 */

const useFetch = (url, options = {}, immediate = true) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { logout } = useAuth();

    // API 요청 함수
    const fetchData = useCallback(async (overrideOptions = {}) => {
        try {
            setLoading(true);
            setError(null);

            // 기본 옵션과 오버라이드 옵션 병합
            const requestOptions = {
                ...options,
                ...overrideOptions
            };

            // 토큰 가져오기
            const token = localStorage.getItem('token');

            // 헤더에 토큰 추가
            const headers = {
                'Content-Type' : 'application/json',
                ...(token && { Authorization : `Bearer ${token}` }),
                ...(requestOptions.headers || {})
            };

            // API 요청 실행
            const response = await axios({
                url,
                ...requestOptions,
                headers
            });

            setData(response.data);
            return response.data;
        } catch (error) {
            setError(error.response?.data?.message || '요청 처리 중 오류가 발생했습니다.');

            // 401 에러 (인증 실패) 시 로그아웃 처리
            if(error.response?.status === 401) {
                logout();
            }

            throw error;
        } finally {
            setLoading(false);
        }
    }, [url, options, logout]);

    // 컴포넌트 마운트 시 immediate가 true면 즉시 API 요청
    useEffect(() => {
        if (immediate) {
            fetchData();
        }
    }, [immediate, fetchData]);

    return { data, loading, error, fetchData };
};

export default useFetch;