import { writable } from 'svelte/store';

export const answerMotivated = 1;
export const answerDemotivated = 2;

export const surveyStarted = writable(false);