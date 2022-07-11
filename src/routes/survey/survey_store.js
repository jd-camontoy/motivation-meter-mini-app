import { writable } from 'svelte/store';

const initialValue = 0;

export const answerMotivated = 1;
export const answerDemotivated = 2;

export const surveyStarted = writable(false);
export const currentFormTab = writable(initialValue);

export const accessPreviousTab = (() => {
    let currentTabValue;
    currentFormTab.subscribe((value => currentTabValue = value));

    if (currentTabValue >= initialValue) {
        currentFormTab.update(n => n - 1);
    }
});

export const accessNextTab = (() => {
    let currentTabValue;
    currentFormTab.subscribe((value => currentTabValue = value));

    if (currentTabValue >= initialValue) {
        currentFormTab.update(n => n + 1);
    }
});