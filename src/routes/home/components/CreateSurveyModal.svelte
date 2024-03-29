<script>
    import Indicators from "../../../common_components/Indicators.svelte";
    import CreateSurveyRespondentCount from "./create_survey_components/CreateSurveyRespondentCount.svelte";
    import CreateSurveyWizardIndicator from "./create_survey_components/CreateSurveyWizardIndicator.svelte";
    import CreateSurveyAdminPassword from "./create_survey_components/CreateSurveyAdminPassword.svelte";
    import CreateSurveyConfirmation from "./create_survey_components/CreateSurveyConfirmation.svelte";
    import SurveyCreated from "./create_survey_components/SurveyCreated.svelte";
    import SurveyAleadyCreatedModal from "./create_survey_components/SurveyAleadyCreatedModal.svelte";
    import { getSurveySettings } from '../../../api/api';
    import { doAnimation } from '../../common_functions';
    import { getContext, setContext, onMount } from 'svelte';
    import { fade, scale } from 'svelte/transition';
    import { AxiosError } from "axios";
    import {
        currentWizardTab,
        accessPreviousWizardTab,
        accessNextWizardTab,
        respondentCountOptions,
        surveySettings,
        surveyCreationFailed
    } from '../create_survey_store';

    export let createdSurveyTokenInSession;
    export let sessionSurveyToken;

    const animationSpeed = 100;
    const animationDuration = 300;

    const createSurveyWizardParts = [
        {
            icon: 'fa-users',
            title: 'No. of Respondents',
            component: CreateSurveyRespondentCount,
            accomplished: false
        },
        {
            icon: 'fa-lock',
            title: 'Admin Password',
            component: CreateSurveyAdminPassword,
            accomplished: false
        },
        {
            icon: 'fa-check-square',
            title: 'Confirmation',
            component: CreateSurveyConfirmation,
        }
    ];

    const firstWizardPartIndex = 0;
    const wizardPartsCount = createSurveyWizardParts.length;
    const lastWizardPartIndex = wizardPartsCount - 1;

    let pageName = getContext('pageName');
    $pageName = 'Create Survey';

    let displayErrorTimeout;
    let nextBtn;
    let animationToExecute = null;
    let createdSurveyToken = null;
    let surveyCreatedDatetime = null;
    let enableNextBtn = false;
    let createSurveyLoading = true;
    let sendDisplayError = false;
    let bypassWarningOnPrevCreatedSurvey = false;
    let disablePrevButton = false;

    let hideCreateModal = getContext('hideCreateModal');

    setContext('doAnimation', doAnimation);

    $: if ($surveySettings.noOfRespondents !== null) {
        createSurveyWizardParts[0].accomplished = true;
    }

    $: if ($surveySettings.adminPassword !== null) {
        createSurveyWizardParts[1].accomplished = true;
    }

    $: if (sendDisplayError) {
        displayErrorTimeout = setTimeout(() => {
            sendDisplayError = false;
        }, 5000);
    } else {
        clearTimeout(displayErrorTimeout);
    }

    async function checkRespondentLimitOptions() {
        try {
            let apiResponse = await getSurveySettings({ setting: 'respondents' });
            if (apiResponse instanceof AxiosError) {
                console.error('Something went wrong while fetching of respondent limit options', apiResponse);
                $surveyCreationFailed = true;
            } else {
                $respondentCountOptions = apiResponse.data;
            }
        } catch (error) {
            console.error('Something went wrong while fetching of respondent limit options', error);
            $surveyCreationFailed = true;
        }
    }

    function changeStateNextButton(event) {
        enableNextBtn = event.detail.hasAnswer;
        if (enableNextBtn) {
            nextBtn.classList.remove('btn__navigation--inactive');
            nextBtn.classList.add('btn__navigation--active');
        } else {
            nextBtn.classList.remove('btn__navigation--active');
            nextBtn.classList.add('btn__navigation--inactive');
        }
    }

    function goToPreviousTab() {
        animationToExecute = {
            fade: 'fadeOut',
            direction: 'Right'
        }
        setTimeout(() => {
            accessPreviousWizardTab();
            animationToExecute = {
                fade: 'fadeIn',
                direction: 'Left'
            };
        }, animationDuration);
    }

    function goToNextTab() {
        if (enableNextBtn) {
            nextBtn.classList.remove('btn__navigation--active');
            nextBtn.classList.add('btn__navigation--inactive');
            sendDisplayError = false;
            enableNextBtn = false;

            animationToExecute = {
                fade: 'fadeOut',
                direction: 'Left'
            }
            setTimeout(() => {
                accessNextWizardTab();
                animationToExecute = {
                    fade: 'fadeIn',
                    direction: 'Right'
                };
            }, animationDuration);
        } else {
            sendDisplayError = true;
        }
    }

    function setCreatedSurveyToken(event) {
        createdSurveyToken = event.detail.surveyToken;
        surveyCreatedDatetime = event.detail.surveyCreatedDatetime;
        console.log('Survey successfully created.');
    }

    function proceedToSurveyCreation() {
        bypassWarningOnPrevCreatedSurvey = true;
    }

    onMount(async () => {
        $surveyCreationFailed = false;
        await checkRespondentLimitOptions();
        createSurveyLoading = false;
    });

</script>

<div class="create-survey-modal">
    <div class="create-survey-modal__bg" in:fade|local out:fade|local={{ delay: animationSpeed }}></div>
    
    <div 
        class="create-survey-modal__card"
        in:scale={{ delay: animationSpeed }} out:scale
        class:create-survey-modal__card--success={createdSurveyToken !== null}
    >
        {#if !createdSurveyTokenInSession || bypassWarningOnPrevCreatedSurvey}
            {#if !createSurveyLoading}
                {#if !$surveyCreationFailed}
                    {#if createdSurveyToken === null}
                        <div class="create-survey-modal__header">
                            <h2 class="create-survey-modal__title">Create Survey</h2>
                            <button
                                class="btn btn__header btn__header--close"
                                on:click={hideCreateModal}
                            >
                                <i class="fas fa-times"></i>
                                Close
                            </button>
                        </div>
                    {/if}

                    {#if createdSurveyToken === null}
                        <CreateSurveyWizardIndicator 
                            indicators={createSurveyWizardParts}
                            currentIndex={$currentWizardTab}
                        />

                        {#if $currentWizardTab !== lastWizardPartIndex}
                            <svelte:component 
                                this={createSurveyWizardParts[$currentWizardTab].component}
                                animationToExecute={animationToExecute}
                                on:message={changeStateNextButton}
                                on:resetErrorDisplay={(event) => {
                                    if (event.detail.resetErrorDisplay) {
                                        sendDisplayError = false;
                                    }
                                }}
                                displayError={sendDisplayError}
                            />
                        {:else}
                            <CreateSurveyConfirmation 
                                animationToExecute={animationToExecute}
                                on:message={setCreatedSurveyToken}
                                on:surveyCreationSubmitted={(event) => disablePrevButton = event.detail.surveyCreationSubmitted}
                            />
                        {/if}

                        <div class="survey-card__navigation">
                            {#if $currentWizardTab > firstWizardPartIndex}
                            <button 
                                class="btn btn__navigation"
                                class:btn__navigation--active={!disablePrevButton}
                                class:btn__navigation--inactive={disablePrevButton}
                                disabled={disablePrevButton}
                                on:click={goToPreviousTab}
                            >
                                <i class="fas fa-angle-left"></i>
                                Previous
                            </button>
                            {/if}
                    
                            <Indicators 
                                itemCount={wizardPartsCount} 
                                currentActiveIndex={$currentWizardTab}
                            />
                    
                            {#if $currentWizardTab < lastWizardPartIndex}
                            <button
                                class="btn btn__navigation btn__navigation--inactive"
                                bind:this={nextBtn}
                                on:click={goToNextTab}
                            >
                                <i class="fas fa-angle-right"></i>
                                Next
                            </button>
                            {/if}
                        </div>
                    {:else}
                        <SurveyCreated
                            createdSurveyToken={createdSurveyToken}
                            surveyCreatedDatetime={surveyCreatedDatetime}
                        />
                    {/if}
                {:else}
                    <div class="create-survey-modal__body"> 
                        <div class="survey-card__header--result margin-bottom-40">
                            <i class="fas fa-exclamation-circle survey-card__icon survey-card__icon--primary"></i>
                            <h1>Something went wrong.</h1>
                            <h2>
                                An unexpected error has occured.<br>
                                Please try again at a later time.
                            </h2>
                        </div>
                        <button class="btn btn__primary" on:click={hideCreateModal}>
                            <i class="fas fa-arrow-left"></i>
                            Go back to Home
                        </button>
                    </div>
                {/if}
            {:else}
                <div class="create-survey-modal__body">
                    <i class="fas fa-circle-notch fa-spin survey-card__icon survey-card__icon--primary"></i>
                    <h1>Survey creation wizard loading...</h1>
                </div>
            {/if}
        {:else}
            <SurveyAleadyCreatedModal
                sessionSurveyToken={sessionSurveyToken}
                on:receiveBypassSelection={proceedToSurveyCreation}
            />
        {/if}
    </div>
</div>