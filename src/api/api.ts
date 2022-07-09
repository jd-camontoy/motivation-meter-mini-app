import axios, { AxiosError } from "axios";
import { SurveySetting, SurveyParams } from "./interface";

const baseURL = 'http://localhost:5005/api';

const surveySettingURL = '/survey_settings';
const urlSurveyEndpoint = '/survey';

const api = axios.create({
    baseURL,
    headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PATCH, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token"
    }
});

const sendToPOST = async (url, parameters) => {
    let data = {
        params: JSON.stringify(parameters)
    };
    let result = 
        await api.post(url, data).catch((error) => {
            return error;
        });
    if (!(result instanceof AxiosError)) {
        return {
            ...result.data,
            status_code: result.status
        }
    } else {
        return result;
    }
}

export const sendNewSurvey = async (params: SurveyParams) => {
    let result = await sendToPOST(urlSurveyEndpoint, params);
    return result;
}

export const getSurveySettings = async (setting: SurveySetting) => {
    let data = {
        params: setting
    };
    let result = 
        await api.get(surveySettingURL, data).catch((error) => {
            return error;
        });
    if (!(result instanceof AxiosError)) {
        return {
            ...result.data,
            status_code: result.status
        }
    } else {
        return result;
    }
}