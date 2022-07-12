export interface SurveySetting {
    setting: string
}

export interface SurveyParams {
    survey_no_of_respondents: number,
    survey_dashboard_password: string
}

export interface SurveyTokenParam {
    token: string
}

export interface SurveyReponseParams {
    survey_token: string,
    answer_motivated: number,
    answer_keywords: Array<string>
}