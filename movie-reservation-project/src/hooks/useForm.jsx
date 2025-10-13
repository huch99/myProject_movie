// 폼 관리 커스텀 훅
import { useCallback, useState } from "react";

/**
 * 폼 상태와 유효성 검증을 관리하는 커스텀 훅
 * @param {Object} initialValues - 폼 초기값
 * @param {Function} validate - 유효성 검증 함수 (선택적)
 * @param {Function} onSubmit - 제출 시 실행할 콜백 함수
 * @returns {Object} { values, errors, touched, handleChange, handleBlur, handleSubmit, resetForm }
 */
const useForm = (initialValues = {}, validate = () => ({}), onSubmit = () => {}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 입력값 변경 처리
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;

    setValues(prevValues => ({
      ...prevValues,
      [name]: fieldValue
    }));
  }, []);

  // 직접 값 설정 (e.target이 아닌 경우)
  const setFieldValue = useCallback((name, value) => {
    setValues(prevValues => ({
      ...prevValues,
      [name]: value
    }));
  }, []);

  // 필드 블러(포커스 해제) 처리
  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    
    setTouched(prevTouched => ({
      ...prevTouched,
      [name]: true
    }));
    
    // 블러 시 유효성 검사
    const validationErrors = validate(values);
    setErrors(validationErrors);
  }, [validate, values]);

  // 폼 제출 처리
  const handleSubmit = useCallback((e) => {
    if (e) e.preventDefault();
    
    setTouched(Object.keys(values).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {}));
    
    const validationErrors = validate(values);
    setErrors(validationErrors);
    
    const hasErrors = Object.keys(validationErrors).length > 0;
    
    if (!hasErrors) {
      setIsSubmitting(true);
      onSubmit(values, {
        setSubmitting: setIsSubmitting,
        resetForm
      });
    }
  }, [values, validate, onSubmit]);

  // 폼 초기화
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    resetForm
  };
};

export default useForm;