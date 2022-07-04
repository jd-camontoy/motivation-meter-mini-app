import { writable } from 'svelte/store';

export const respondentCountOptions = writable(null);

let initialSurveySettings = {
    noOfRespondents: null,
    adminPassword: null
}
export const surveySettings = writable(initialSurveySettings);