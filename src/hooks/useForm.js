import { useState } from "react";

const useForm = (initialValues) => {
  const [values, setValues] = useState(initialValues);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  // 리셋 함수 추가
  const reset = () => {
    setValues(initialValues);
  };

  return {
    values,
    handleChange,
    reset,
  };
};

export default useForm;
