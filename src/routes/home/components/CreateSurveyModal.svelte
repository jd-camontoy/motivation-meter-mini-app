<script>
    import Indicators from "../../../common_components/Indicators.svelte";
    import CreateSurveyRespondentCount from "./create_survey_components/CreateSurveyRespondentCount.svelte";
    import CreateSurveyWizardIndicator from "./create_survey_components/CreateSurveyWizardIndicator.svelte";
    import CreateSurveyAdminPassword from "./create_survey_components/CreateSurveyAdminPassword.svelte";
    import CreateSurveyConfirmation from "./create_survey_components/CreateSurveyConfirmation.svelte";
    import SurveyCreated from "./create_survey_components/SurveyCreated.svelte";
    import { getSurveySettings } from '../../../api/api';
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
    
    let nextBtn;
    let animationToExecute = null;
    let createdSurveyToken = null;
    let enableNextBtn = false;
    let createSurveyLoading = true;
    let sendDisplayError = false;
    let bypassWarningOnPrevCreatedSurvey = false;

    let hideCreateModal = getContext('hideCreateModal');

    let doAnimation = (element, fade, direction) => {
        let animationClass = "animate__" + fade + direction;
        element.classList.add("animate__animated");
        element.classList.add(animationClass);
        element.classList.add("animate__faster");

        setTimeout(() => {
            element.classList.remove("animate__animated");
            element.classList.remove(animationClass);
            element.classList.remove("animate__faster");
        }, 500);
    }

    setContext('doAnimation', doAnimation);

    $: if ($surveySettings.noOfRespondents !== null) {
        createSurveyWizardParts[0].accomplished = true;
    }

    $: if ($surveySettings.adminPassword !== null) {
        createSurveyWizardParts[1].accomplished = true;
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
        sendDisplayError = false;
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
            enableNextBtn = false;
            nextBtn.classList.remove('btn__navigation--active');
            nextBtn.classList.add('btn__navigation--inactive');
            sendDisplayError = false;

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
            setTimeout(() => {
                sendDisplayError = false
            }, 5000);
        }
    }

    function setCreatedSurveyToken(event) {
        createdSurveyToken = event.detail.surveyToken;
        console.log('Survey successfully created.');
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
                                displayError={sendDisplayError}
                            />
                        {:else}
                            <CreateSurveyConfirmation 
                                animationToExecute={animationToExecute}
                                on:message={setCreatedSurveyToken}
                            />
                        {/if}

                        <div class="survey-card__navigation">
                            {#if $currentWizardTab > firstWizardPartIndex}
                            <button 
                                class="btn btn__navigation btn__navigation--active"
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
                        <SurveyCreated createdSurveyToken={createdSurveyToken} />
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
            <div class="create-survey-modal__body"> 
                <div class="survey-card__header--result margin-bottom-40">
                    <i class="fas fa-clipboard-check survey-card__icon survey-card__icon--primary"></i>
                    <h1>A survey has already been created.</h1>
                    <h2>
                        Lets’ login to the dashboard instead.
                    </h2>
                    <form class="form__dashboard-login margin-top-40">
                        <!-- Add eye feature -->
                        <div class="form__group form__input--dashboard-password">
                            <input 
                                type="password"
                                placeholder="Enter registered password"
                            >
                            <i 
                                class="fas fa-eye cursor--pointer"
                            ></i>
                        </div>
                        <button class="btn btn__primary">
                            <i class="fas fa-sign-in-alt"></i>
                            Login to Dashboard
                        </button>
                    </form>
                </div>
                <div class="create-survey-modal__header">
                    <p
                        class="temp-proceed-to-creation"
                        on:click={() => {
                            bypassWarningOnPrevCreatedSurvey = true;
                        }}
                    >
                        Proceed to survey creation
                    </p>
                    <button
                        class="btn btn__header btn__header--close"
                        on:click={hideCreateModal}
                    >
                        <i class="fas fa-times"></i>
                        Close
                    </button>
                </div>
            </div>
        {/if}
    </div>
</div>

<style>
    .temp-proceed-to-creation {
        cursor: pointer;
    }

    .temp-proceed-to-creation:hover {
        filter: brightness(0.5);
    }
</style>