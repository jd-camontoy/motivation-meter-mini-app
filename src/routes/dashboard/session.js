import { writable } from "svelte/store";
import { browser } from "$app/env";

const sessionKey = 'survey_info';
const sessionValue = (browser) ? localStorage.getItem(sessionKey) : null;

export const dashboardSurveyInfo = writable(sessionValue);
dashboardSurveyInfo.subscribe((data) => browser && localStorage.setItem(sessionKey, data));

// Add expiration to session
export const deleteDashboardSurveyInfo = (() => {
    browser && localStorage.removeItem(sessionKey);
    dashboardSurveyInfo.update(n => null);
});