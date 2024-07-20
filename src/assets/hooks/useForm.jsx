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

  const setValue = (name, value) => {
    setValues({
      ...values,
      [name]: value,
    });
  };

  return {
    values,
    handleChange,
    setValue,
  };
};

export default useForm;
