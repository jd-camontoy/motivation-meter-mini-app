import { writable } from 'svelte/store';

const initialIndicatorIndex = 0;

export const currentWizardTab = writable(initialIndicatorIndex);

export const respondentCountOptions = writable(null);

export const surveyCreationFailed = writable(false);

let initialSurveySettings = {
    noOfRespondents: null,
    adminPassword: null
}

export const surveySettings = writable(initialSurveySettings);

export const accessPreviousWizardTab = (() => {
    let currentTabValue = initialIndicatorIndex;
    currentWizardTab.subscribe((value => currentTabValue = value));

    if (currentTabValue >= initialIndicatorIndex) {
        currentWizardTab.update(n => n - 1);
    }
});

export const accessNextWizardTab = (() => {
    let currentTabValue = initialIndicatorIndex;
    currentWizardTab.subscribe((value => currentTabValue = value));

    if (currentTabValue >= initialIndicatorIndex) {
        currentWizardTab.update(n => n + 1);
    }
});