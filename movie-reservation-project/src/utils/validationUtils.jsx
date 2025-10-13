// 유효성 검증 유틸리티

/**
 * 유효성 검증을 위한 유틸리티 함수 모음
 */
const validationUtils = {
    /**
     * 이메일 유효성 검증
     * @param {string} email - 검증할 이메일
     * @returns {boolean} 유효성 여부
     */
    isValidEmail: (email) => {
        if (!email) return false;
        const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        return regex.test(email);
    },

    /**
     * 비밀번호 유효성 검증 (최소 8자, 문자, 숫자, 특수문자 포함)
     * @param {string} password - 검증할 비밀번호
     * @returns {boolean} 유효성 여부
     */
    isValidPassword: (password) => {
        if (!password) return false;
        const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
        return regex.test(password);
    },

    /**
     * 전화번호 유효성 검증
     * @param {string} phone - 검증할 전화번호
     * @returns {boolean} 유효성 여부
     */
    isValidPhone: (phone) => {
        if (!phone) return false;
        const regex = /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/;
        return regex.test(phone);
    },

    /**
     * 이름 유효성 검증 (2~20자)
     * @param {string} name - 검증할 이름
     * @returns {boolean} 유효성 여부
     */
    isValidName: (name) => {
        if (!name) return false;
        return name.length >= 2 && name.length <= 20;
    },

    /**
     * 필수 입력값 검증
     * @param {string} value - 검증할 값
     * @returns {boolean} 유효성 여부
     */
    isRequired: (value) => {
        if (value === null || value === undefined) return false;
        return value.toString().trim() !== '';
    },

    /**
     * 숫자 유효성 검증
     * @param {string|number} value - 검증할 값
     * @returns {boolean} 유효성 여부
     */
    isNumber: (value) => {
        if (value === null || value === undefined) return false;
        return !isNaN(value) && !isNaN(parseFloat(value));
    },

    /**
     * 최소 길이 검증
     * @param {string} value - 검증할 값
     * @param {number} min - 최소 길이
     * @returns {boolean} 유효성 여부
     */
    minLength: (value, min) => {
        if (!value) return false;
        return value.length >= min;
    },

    /**
     * 최대 길이 검증
     * @param {string} value - 검증할 값
     * @param {number} max - 최대 길이
     * @returns {boolean} 유효성 여부
     */
    maxLength: (value, max) => {
        if (!value) return true; // 값이 없으면 최대 길이 제한을 통과
        return value.length <= max;
    },

    /**
     * 날짜 유효성 검증 (YYYY-MM-DD)
     * @param {string} date - 검증할 날짜
     * @returns {boolean} 유효성 여부
     */
    isValidDate: (date) => {
        if (!date) return false;

        // YYYY-MM-DD 형식 검증
        const regex = /^\d{4}-\d{2}-\d{2}$/;
        if (!regex.test(date)) return false;

        // 실제 유효한 날짜인지 검증
        const d = new Date(date);
        const dNum = d.getTime();
        if (!dNum && dNum !== 0) return false; // NaN 값 체크

        return d.toISOString().slice(0, 10) === date;
    },

    /**
     * 생년월일 유효성 검증 (만 14세 이상)
     * @param {string} birthDate - 검증할 생년월일 (YYYY-MM-DD)
     * @returns {boolean} 유효성 여부
     */
    isValidAge: (birthDate) => {
        if (!validationUtils.isValidDate(birthDate)) return false;

        const today = new Date();
        const birth = new Date(birthDate);

        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }

        return age >= 14;
    },

    /**
     * 신용카드 번호 유효성 검증
     * @param {string} cardNumber - 검증할 카드번호
     * @returns {boolean} 유효성 여부
     */
    isValidCreditCard: (cardNumber) => {
        if (!cardNumber) return false;

        // 숫자와 하이픈만 허용
        const cleaned = cardNumber.replace(/\D/g, '');

        // 길이 검증 (대부분의 카드는 13-19자리)
        if (cleaned.length < 13 || cleaned.length > 19) return false;

        // Luhn 알고리즘 검증
        let sum = 0;
        let double = false;

        for (let i = cleaned.length - 1; i >= 0; i--) {
            let digit = parseInt(cleaned.charAt(i), 10);

            if (double) {
                digit *= 2;
                if (digit > 9) digit -= 9;
            }

            sum += digit;
            double = !double;
        }

        return sum % 10 === 0;
    },

    /**
     * 폼 데이터 전체 유효성 검증
     * @param {Object} formData - 폼 데이터 객체
     * @param {Object} validationRules - 유효성 검증 규칙 객체
     * @returns {Object} 에러 메시지 객체
     */
    validateForm: (formData, validationRules) => {
        const errors = {};

        Object.keys(validationRules).forEach(field => {
            const rules = validationRules[field];
            const value = formData[field];

            // 필수 입력값 검증
            if (rules.required && !validationUtils.isRequired(value)) {
                errors[field] = rules.requiredMessage || '필수 입력값입니다.';
                return;
            }

            // 이메일 형식 검증
            if (rules.email && value && !validationUtils.isValidEmail(value)) {
                errors[field] = rules.emailMessage || '올바른 이메일 형식이 아닙니다.';
                return;
            }

            // 비밀번호 형식 검증
            if (rules.password && value && !validationUtils.isValidPassword(value)) {
                errors[field] = rules.passwordMessage || '비밀번호는 8자 이상, 문자, 숫자, 특수문자를 포함해야 합니다.';
                return;
            }

            // 전화번호 형식 검증
            if (rules.phone && value && !validationUtils.isValidPhone(value)) {
                errors[field] = rules.phoneMessage || '올바른 전화번호 형식이 아닙니다.';
                return;
            }

            // 최소 길이 검증
            if (rules.minLength && value && !validationUtils.minLength(value, rules.minLength)) {
                errors[field] = rules.minLengthMessage || `최소 ${rules.minLength}자 이상 입력해야 합니다.`;
                return;
            }

            // 최대 길이 검증
            if (rules.maxLength && value && !validationUtils.maxLength(value, rules.maxLength)) {
                errors[field] = rules.maxLengthMessage || `최대 ${rules.maxLength}자까지 입력 가능합니다.`;
                return;
            }

            // 숫자 형식 검증
            if (rules.number && value && !validationUtils.isNumber(value)) {
                errors[field] = rules.numberMessage || '숫자만 입력 가능합니다.';
                return;
            }

            // 날짜 형식 검증
            if (rules.date && value && !validationUtils.isValidDate(value)) {
                errors[field] = rules.dateMessage || '올바른 날짜 형식이 아닙니다.';
                return;
            }

            // 나이 검증
            if (rules.age && value && !validationUtils.isValidAge(value)) {
                errors[field] = rules.ageMessage || '만 14세 이상만 가입 가능합니다.';
                return;
            }

            // 신용카드 형식 검증
            if (rules.creditCard && value && !validationUtils.isValidCreditCard(value)) {
                errors[field] = rules.creditCardMessage || '올바른 카드 번호가 아닙니다.';
                return;
            }

            // 커스텀 검증 함수
            if (rules.validate && typeof rules.validate === 'function') {
                const customError = rules.validate(value, formData);
                if (customError) {
                    errors[field] = customError;
                    return;
                }
            }
        });

        return errors;
    },

    /**
     * 로그인 폼 유효성 검증
     * @param {Object} formData - 로그인 폼 데이터
     * @returns {Object} 에러 메시지 객체
     */
    validateLoginForm: (formData) => {
        const validationRules = {
            email: {
                required: true,
                requiredMessage: '이메일을 입력해주세요.',
                email: true,
                emailMessage: '올바른 이메일 형식이 아닙니다.'
            },
            password: {
                required: true,
                requiredMessage: '비밀번호를 입력해주세요.'
            }
        };

        return validationUtils.validateForm(formData, validationRules);
    },

    /**
     * 회원가입 폼 유효성 검증
     * @param {Object} formData - 회원가입 폼 데이터
     * @returns {Object} 에러 메시지 객체
     */
    validateRegisterForm: (formData) => {
        const validationRules = {
            name: {
                required: true,
                requiredMessage: '이름을 입력해주세요.',
                minLength: 2,
                minLengthMessage: '이름은 2자 이상 입력해주세요.',
                maxLength: 20,
                maxLengthMessage: '이름은 20자 이하로 입력해주세요.'
            },
            email: {
                required: true,
                requiredMessage: '이메일을 입력해주세요.',
                email: true,
                emailMessage: '올바른 이메일 형식이 아닙니다.'
            },
            password: {
                required: true,
                requiredMessage: '비밀번호를 입력해주세요.',
                password: true,
                passwordMessage: '비밀번호는 8자 이상, 문자, 숫자, 특수문자를 포함해야 합니다.'
            },
            confirmPassword: {
                required: true,
                requiredMessage: '비밀번호 확인을 입력해주세요.',
                validate: (value, formData) => value !== formData.password ? '비밀번호가 일치하지 않습니다.' : undefined
            },
            phone: {
                required: true,
                requiredMessage: '전화번호를 입력해주세요.',
                phone: true,
                phoneMessage: '올바른 전화번호 형식이 아닙니다.'
            },
            birthDate: {
                required: true,
                requiredMessage: '생년월일을 입력해주세요.',
                date: true,
                dateMessage: '올바른 날짜 형식이 아닙니다.',
                age: true,
                ageMessage: '만 14세 이상만 가입 가능합니다.'
            },
            termsAgreed: {
                required: true,
                requiredMessage: '이용약관에 동의해주세요.'
            }
        };

        return validationUtils.validateForm(formData, validationRules);
    }
};

export default validationUtils;