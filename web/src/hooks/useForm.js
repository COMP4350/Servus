import { useState } from 'react';

function useForm(initialValues = {}) {
    const [values, setValues] = useState(initialValues);

    const onChange = evt =>
        setValues({
            ...values,
            [evt.target.name]: evt.target.value,
        });

    return [values, onChange, setValues];
}

export default useForm;
