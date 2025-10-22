// 로컬 스토리지 관련 유틸리티

/**
 * 로컬 스토리지 관련 유틸리티 함수 모음
 */
const storageUtils = {
    /**
     * 로컬 스토리지에 데이터 저장
     * @param {string} key - 저장할 키
     * @param {any} value - 저장할 값
     */
    setItem: (key, value) => {
        try {
            const serializedValue = JSON.stringify(value);
            localStorage.setItem(key, serializedValue);
        } catch (error) {
            console.error('로컬 스토리지에 데이터를 저장하는 중 오류가 발생했습니다:', error);
        }
    },

    /**
     * 로컬 스토리지에서 데이터 가져오기
     * @param {string} key - 가져올 키
     * @param {any} defaultValue - 기본값 (데이터가 없을 경우)
     * @returns {any} 저장된 데이터 또는 기본값
     */
    // getItem: (key, defaultValue = null) => {
    //     try {
    //         const serializedValue = localStorage.getItem(key);
    //         if (serializedValue === null) {
    //             return defaultValue;
    //         }
    //         return JSON.parse(serializedValue);
    //     } catch (error) {
    //         console.error('로컬 스토리지에서 데이터를 가져오는 중 오류가 발생했습니다:', error);
    //         return defaultValue;
    //     }
    // },
    getItem: (key, defaultValue = null) => {
        try {
            const serializedValue = localStorage.getItem(key);

            if (serializedValue === null || serializedValue === undefined) {
                return defaultValue;
            }
            return JSON.parse(serializedValue);
        } catch (error) {
            console.error('로컬 스토리지에서 데이터를 가져오는 중 오류가 발생했습니다:', error);
            return defaultValue;
        }
    },

    /**
     * 로컬 스토리지에서 데이터 삭제
     * @param {string} key - 삭제할 키
     */
    removeItem: (key) => {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error('로컬 스토리지에서 데이터를 삭제하는 중 오류가 발생했습니다:', error);
        }
    },

    /**
     * 로컬 스토리지 전체 비우기
     */
    clear: () => {
        try {
            localStorage.clear();
        } catch (error) {
            console.error('로컬 스토리지를 비우는 중 오류가 발생했습니다:', error);
        }
    },

    /**
     * 로컬 스토리지에 저장된 모든 키 가져오기
     * @returns {Array} 키 배열
     */
    getAllKeys: () => {
        try {
            return Object.keys(localStorage);
        } catch (error) {
            console.error('로컬 스토리지의 키를 가져오는 중 오류가 발생했습니다:', error);
            return [];
        }
    },

    /**
     * 토큰 관련 유틸리티
     */
    token: {
        /**
         * 액세스 토큰 저장
         * @param {string} token - 액세스 토큰
         */
        setAccessToken: (token) => {
            storageUtils.setItem('accessToken', token);
        },

        /**
         * 액세스 토큰 가져오기
         * @returns {string|null} 액세스 토큰
         */
        // 원래 방법
        // getAccessToken: () => {
        //     return storageUtils.getItem('accessToken');
        // },

        // 2번 방법
        // getAccessToken: () => {
        //     // userData 객체에서 토큰 가져오기 시도
        //     const userData = storageUtils.getItem('userData');
        //     if (userData?.accessToken) {
        //         return userData.accessToken;
        //     }

        //     // 직접 accessToken 키로도 확인
        //     return storageUtils.getItem('accessToken');
        //     // 기본값이 null이므로 따로 지정할 필요 없음
        // },

        // 3번 방법
        getAccessToken: () => {
            try {
                // userData 객체에서 토큰 가져오기
                const userData = storageUtils.getItem('userData');
                if (userData && userData.accessToken) {
                    return userData.accessToken;
                }

                // 직접 accessToken 키로 확인할 때 안전하게 처리
                const token = localStorage.getItem('accessToken');
                if (!token) return null;

                try {
                    return JSON.parse(token);
                } catch {
                    return token; // JSON이 아니면 그대로 반환
                }
            } catch (error) {
                console.error('액세스 토큰을 가져오는 중 오류:', error);
                return null;
            }
        },

        /**
         * 리프레시 토큰 저장
         * @param {string} token - 리프레시 토큰
         */
        setRefreshToken: (token) => {
            storageUtils.setItem('refreshToken', token);
        },

        /**
         * 리프레시 토큰 가져오기
         * @returns {string|null} 리프레시 토큰
         */
        // getRefreshToken: () => {
        //     return storageUtils.getItem('refreshToken');
        // },
        getRefreshToken: () => {
            try {
                // userData 객체에서 토큰을 가져오기
                const userData = storageUtils.getItem('userData');

                // userData가 있고 그 안에 refreshToken이 있으면 반환
                if (userData && userData.refreshToken) {
                    return userData.refreshToken;
                }

                // 직접 refreshToken 키로도 확인
                const directToken = localStorage.getItem('refreshToken');

                // 값이 null이거나 undefined인 경우 처리
                if (directToken === null || directToken === undefined) {
                    return null;
                }

                // 문자열이면 JSON 파싱 시도
                try {
                    return JSON.parse(directToken);
                } catch {
                    // 일반 문자열이면 그대로 반환
                    return directToken;
                }
            } catch (error) {
                console.error('리프레시 토큰을 가져오는 중 오류가 발생했습니다:', error);
                return null;
            }
        },

        /**
         * 모든 토큰 삭제
         */
        clearTokens: () => {
            storageUtils.removeItem('accessToken');
            storageUtils.removeItem('refreshToken');
        }
    },

    /**
     * 사용자 정보 관련 유틸리티
     */
    user: {
        /**
         * 사용자 정보 저장
         * @param {Object} user - 사용자 정보
         */
        setUserInfo: (user) => {
            storageUtils.setItem('user', user);
        },

        /**
         * 사용자 정보 가져오기
         * @returns {Object|null} 사용자 정보
         */

        // getUserInfo: () => {
        //     return storageUtils.getItem('user');
        // },

        getUserInfo: () => {
            try {
                // userData 객체에서 사용자 정보 가져오기
                const userData = localStorage.getItem('userData');

                // userData가 null이거나 undefined인 경우
                if (!userData) {
                    return null;
                }

                try {
                    // JSON으로 파싱 시도
                    return JSON.parse(userData);
                } catch {
                    // 일반 문자열이면 그대로 반환
                    return userData;
                }
            } catch (error) {
                console.error('사용자 정보를 가져오는 중 오류가 발생했습니다:', error);
                return null;
            }
        },

        /**
         * 사용자 정보 삭제
         */
        clearUserInfo: () => {
            storageUtils.removeItem('user');
        }
    },

    /**
     * 테마 관련 유틸리티
     */
    theme: {
        /**
         * 테마 설정 저장
         * @param {string} theme - 테마 (light/dark)
         */
        setTheme: (theme) => {
            storageUtils.setItem('theme', theme);
        },

        /**
         * 테마 설정 가져오기
         * @returns {string} 테마 (기본값: light)
         */
        getTheme: () => {
            return storageUtils.getItem('theme', 'light');
        }
    },

    /**
     * 최근 검색어 관련 유틸리티
     */
    searchHistory: {
        /**
         * 최근 검색어 추가
         * @param {string} keyword - 검색어
         * @param {number} maxItems - 최대 저장 개수
         */
        addSearchKeyword: (keyword, maxItems = 10) => {
            if (!keyword || keyword.trim() === '') return;

            const keywords = storageUtils.searchHistory.getSearchKeywords();
            const newKeywords = [keyword.trim()];

            // 중복 제거하며 기존 검색어 추가
            keywords.forEach(item => {
                if (item !== keyword.trim() && newKeywords.length < maxItems) {
                    newKeywords.push(item);
                }
            });

            storageUtils.setItem('searchKeywords', newKeywords);
        },

        /**
         * 최근 검색어 목록 가져오기
         * @returns {Array} 검색어 배열
         */
        getSearchKeywords: () => {
            return storageUtils.getItem('searchKeywords', []);
        },

        /**
         * 특정 검색어 삭제
         * @param {string} keyword - 삭제할 검색어
         */
        removeSearchKeyword: (keyword) => {
            const keywords = storageUtils.searchHistory.getSearchKeywords();
            const filteredKeywords = keywords.filter(item => item !== keyword);
            storageUtils.setItem('searchKeywords', filteredKeywords);
        },

        /**
         * 모든 검색어 삭제
         */
        clearSearchKeywords: () => {
            storageUtils.removeItem('searchKeywords');
        }
    },

    /**
     * 장바구니(예매 임시 정보) 관련 유틸리티
     */
    cart: {
        /**
         * 예매 임시 정보 저장
         * @param {Object} reservationData - 예매 정보
         */
        setReservationData: (reservationData) => {
            storageUtils.setItem('reservationData', reservationData);
        },

        /**
         * 예매 임시 정보 가져오기
         * @returns {Object|null} 예매 정보
         */
        getReservationData: () => {
            return storageUtils.getItem('reservationData');
        },

        /**
         * 예매 임시 정보 삭제
         */
        clearReservationData: () => {
            storageUtils.removeItem('reservationData');
        },

        /**
         * 선택한 좌석 정보 저장
         * @param {Array} seats - 선택한 좌석 배열
         */
        setSelectedSeats: (seats) => {
            storageUtils.setItem('selectedSeats', seats);
        },

        /**
         * 선택한 좌석 정보 가져오기
         * @returns {Array} 선택한 좌석 배열
         */
        getSelectedSeats: () => {
            return storageUtils.getItem('selectedSeats', []);
        },

        /**
         * 선택한 좌석 정보 삭제
         */
        clearSelectedSeats: () => {
            storageUtils.removeItem('selectedSeats');
        }
    },

    /**
     * 최근 본 영화 관련 유틸리티
     */
    recentMovies: {
        /**
         * 최근 본 영화 추가
         * @param {Object} movie - 영화 정보
         * @param {number} maxItems - 최대 저장 개수
         */
        addRecentMovie: (movie, maxItems = 10) => {
            if (!movie || !movie.id) return;

            const movies = storageUtils.recentMovies.getRecentMovies();

            // 이미 있는 영화라면 제거
            const filteredMovies = movies.filter(item => item.id !== movie.id);

            // 최신 영화를 맨 앞에 추가
            const newMovies = [movie, ...filteredMovies].slice(0, maxItems);

            storageUtils.setItem('recentMovies', newMovies);
        },

        /**
         * 최근 본 영화 목록 가져오기
         * @returns {Array} 영화 정보 배열
         */
        getRecentMovies: () => {
            return storageUtils.getItem('recentMovies', []);
        },

        /**
         * 특정 영화 삭제
         * @param {number} movieId - 삭제할 영화 ID
         */
        removeRecentMovie: (movieId) => {
            const movies = storageUtils.recentMovies.getRecentMovies();
            const filteredMovies = movies.filter(item => item.id !== movieId);
            storageUtils.setItem('recentMovies', filteredMovies);
        },

        /**
         * 모든 최근 본 영화 삭제
         */
        clearRecentMovies: () => {
            storageUtils.removeItem('recentMovies');
        }
    },

    /**
     * 쿠폰 관련 유틸리티
     */
    coupons: {
        /**
         * 쿠폰 정보 저장
         * @param {Array} coupons - 쿠폰 정보 배열
         */
        setCoupons: (coupons) => {
            storageUtils.setItem('coupons', coupons);
        },

        /**
         * 쿠폰 정보 가져오기
         * @returns {Array} 쿠폰 정보 배열
         */
        getCoupons: () => {
            return storageUtils.getItem('coupons', []);
        },

        /**
         * 쿠폰 정보 삭제
         */
        clearCoupons: () => {
            storageUtils.removeItem('coupons');
        }
    },

    /**
     * 브라우저 지원 여부 확인
     * @returns {boolean} 로컬 스토리지 지원 여부
     */
    isSupported: () => {
        try {
            const testKey = '__test__';
            localStorage.setItem(testKey, testKey);
            localStorage.removeItem(testKey);
            return true;
        } catch (e) {
            return false;
        }
    }
};

export default storageUtils;