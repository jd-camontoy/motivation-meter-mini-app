<script>
    import Indicators from "../../../common_components/Indicators.svelte";
    import CreateSurveyRespondentCount from "./create_survey_components/CreateSurveyRespondentCount.svelte";
    import { getSurveySettings } from '../../../api/api';
    import { getContext, onMount } from 'svelte';
    import { fade, scale } from 'svelte/transition';
    import { AxiosError } from "axios";
    import { respondentCountOptions } from '../create_survey_store';

    const animationSpeed = 100;
    
    let nextBtn;
    let enableNextBtn = false;
    let createSurveyLoading = true;
    let createSurveyLoadingError = false;
    let sendDisplayError = false;

    let hideCreateModal = getContext('hideCreateModal');

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

    function goToNextTab() {
        if (enableNextBtn) {
            enableNextBtn = false;
            nextBtn.classList.remove('btn__navigation--active');
            nextBtn.classList.add('btn__navigation--inactive');
            sendDisplayError = false;
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

                <!-- Create a dynamic component for this section -->
                <div class="create-survey-modal__wizard-indicator-section">
                    <div class="create-survey-modal__wizard-indicator create-survey-modal__wizard-indicator--active">
                        <i class="fas fa-users"></i>
                        <p>No. of Respondents</p>
                    </div>
                <hr>
                    <div class="create-survey-modal__wizard-indicator">
                        <i class="fas fa-lock"></i>
                        <p>Admin Password</p>
                    </div>
                <hr>
                    <div class="create-survey-modal__wizard-indicator">
                        <i class="fas fa-check-square"></i>
                        <p>Confirmation</p>
                    </div>
                </div>

                <!-- Add the other components of survey here, by which should be dynamically changed like a wizard form -->
                <CreateSurveyRespondentCount on:message={changeStateNextButton} displayError={sendDisplayError}/>

                <div class="survey-card__navigation">
                    <button class="btn btn__navigation btn__navigation--active" >
                        <i class="fas fa-angle-left"></i>
                        Previous
                    </button>
            
                    <!-- Add proper number of wizard parts -->
                    <Indicators 
                        itemCount={3} 
                        currentActiveIndex={1}
                    />
            
                    <button 
                        class="btn btn__navigation btn__navigation--inactive"
                        bind:this={nextBtn}
                        on:click={goToNextTab}
                    >
                        <i class="fas fa-angle-right"></i>
                        Next
                    </button>
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