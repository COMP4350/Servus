import { useState } from 'react';

function useForm(initialState = {}) {
    const [state, setState] = useState(initialState);

    const onChange = evt =>
        setState({
            ...state,
            [evt.target.name]: evt.target.value,
        });

    return [state, onChange];
}

export default useForm;
