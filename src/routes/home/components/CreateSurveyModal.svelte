<script>
    import Indicators from "../../../common_components/Indicators.svelte";
    import CreateSurveyRespondentCount from "./create_survey_components/CreateSurveyRespondentCount.svelte";
    import CreateSurveyWizardIndicator from "./create_survey_components/CreateSurveyWizardIndicator.svelte";
    import CreateSurveyAdminPassword from "./create_survey_components/CreateSurveyAdminPassword.svelte";
    import CreateSurveyConfirmation from "./create_survey_components/CreateSurveyConfirmation.svelte";
    import { getSurveySettings } from '../../../api/api';
    import { getContext, setContext, onMount } from 'svelte';
    import { fade, scale } from 'svelte/transition';
    import { AxiosError } from "axios";
    import {
        currentWizardTab,
        accessPreviousWizardTab,
        accessNextWizardTab,
        respondentCountOptions
    } from '../create_survey_store';

    const animationSpeed = 100;
    const animationDuration = 300;

    // Add components to this array later
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
    let enableNextBtn = false;
    let createSurveyLoading = true;
    let createSurveyLoadingError = false;
    let sendDisplayError = false;

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

    async function checkRespondentLimitOptions() {
        try {
            let apiResponse = await getSurveySettings({ setting: 'respondents' });
            if (apiResponse instanceof AxiosError) {
                console.error('Something went wrong while fetching of respondent limit options', apiResponse);
                createSurveyLoadingError = true;
            } else {
                $respondentCountOptions = apiResponse.data;
            }
        } catch (error) {
            console.error('Something went wrong while fetching of respondent limit options', error);
            createSurveyLoadingError = true;
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

    onMount(async () => {
        await checkRespondentLimitOptions();
        createSurveyLoading = false;
    });

</script>

<div class="create-survey-modal">
    <div class="create-survey-modal__bg" in:fade|local out:fade|local={{ delay: animationSpeed }}></div>
    
    <div 
        class="create-survey-modal__card"
        in:scale={{ delay: animationSpeed }} out:scale
    >
        {#if !createSurveyLoading}
            {#if !createSurveyLoadingError}
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

                <!-- Add proper progress index data to this component later -->
                <CreateSurveyWizardIndicator 
                    indicators={createSurveyWizardParts}
                    currentIndex={$currentWizardTab}
                />

                <!-- Add the other components of survey here, by which should be dynamically changed like a wizard form -->
                <svelte:component 
                    this={createSurveyWizardParts[$currentWizardTab].component}
                    animationToExecute={animationToExecute}
                    on:message={changeStateNextButton}
                    displayError={sendDisplayError}
                />

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
    </div>
</div>