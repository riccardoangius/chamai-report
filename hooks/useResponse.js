import { useState, useEffect } from 'react';
import { fetchResponse } from '../components/common';

export const useResponse = (props) => {
    const { shouldRequest, survey_id, token, response_id } = props;

    const [response, setResponse] = useState(null);

    useEffect(() => {
        if (shouldRequest) {
            fetchResponse(survey_id, token, response_id, setResponse);
        }
    }, [shouldRequest]);

    const { responses, systemQuestions, scoreQuestionsBySection } = response || { responses: null, systemQuestions: null, scoreQuestionsBySection: null };

    return { responses, systemQuestions, scoreQuestionsBySection }

}