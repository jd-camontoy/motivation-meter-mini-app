<script>
    import { AxiosError } from "axios";
    import { getContext, onMount, createEventDispatcher } from "svelte";
    import { surveySettings, surveyCreationFailed } from '../../create_survey_store';
    import { sendNewSurvey } from '../../../../api/api';

    export let animationToExecute;

    const dispatch = createEventDispatcher();

    let formElement;

    let displayPassword = false;
    let creationSubmitted = false;

    let passwordCharacterCount = $surveySettings.adminPassword.length;
    let doAnimation = getContext('doAnimation');

    onMount(() => {
        if (animationToExecute !== null && animationToExecute.fade === 'fadeIn') {
            doAnimation(formElement, animationToExecute.fade, animationToExecute.direction);
        }
    });

    $: if (animationToExecute !== null && animationToExecute.fade === 'fadeOut') {
        doAnimation(formElement, animationToExecute.fade, animationToExecute.direction);
    }

    $: finalSurveyCreationParmas = {
        survey_no_of_respondents: $surveySettings.noOfRespondents,
        survey_dashboard_password: $surveySettings.adminPassword
    };

    function displayToggledEyeIcon(event) {
        let mainElement = event.target;
        if (mainElement.classList.contains("fa-eye")) {
            mainElement.classList.remove("fa-eye");
            mainElement.classList.add("fa-eye-slash");
        } else if (mainElement.classList.contains("fa-eye-slash")) {
            mainElement.classList.remove("fa-eye-slash");
            mainElement.classList.add("fa-eye");
        }
    }

    async function submitSurveyCreation() {
        try {
            creationSubmitted = true;
            let response = await sendNewSurvey(finalSurveyCreationParmas);

            if (response instanceof AxiosError) {
                $surveyCreationFailed = true;
                console.error('Survey creation submission error', response);
            } else if ('success' in response && response.success === true) {
                let surveyToken = response.token;
                dispatch('message', {surveyToken});
            }
        } catch (e) {
            $surveyCreationFailed = true;
            console.error('Survey creation submission error', e);
        }
    }
</script>


<div class="survey-card__form" bind:this={formElement}>
    <div class="survey-card__question-section">
        <h1>Are you sure with your new survey?</h1>
        <h2>Kindly review the following submitted settings for the new survey to be created.</h2>
    </div>
    <div class="survey-card__answer-confirmation">
        <div class="survey-card__answer-confirmation-row">
            <p class="survey-card__answer-confirmation-question">Number of Respondents</p>
            <p class="survey-card__answer-confirmation-answer">{$surveySettings.noOfRespondents}</p>
        </div>
        <div class="survey-card__answer-confirmation-row">
            <p class="survey-card__answer-confirmation-question">Dashboard Password</p>
            <p class="survey-card__answer-confirmation-answer">
                {#if !displayPassword}
                    {#each Array(passwordCharacterCount) as _, i}
                        &#8226
                    {/each}
                {:else}
                    {$surveySettings.adminPassword}
                {/if}
                <i class="fas fa-eye cursor--pointer"
                    on:mousedown={(e) => {
                        displayPassword = true;
                        displayToggledEyeIcon(e);
                    }}
                    on:mouseup={(e) => {
                        displayPassword = false;
                        displayToggledEyeIcon(e);
                    }}
                ></i>
            </p>
        </div>
    </div>
    <button 
        class="btn btn__primary btn--submit-survey"
        on:click={submitSurveyCreation}
        disabled={creationSubmitted}
    >
        {#if !creationSubmitted}
            <i class="fas fa-check"></i>
            Yes, I’m sure. Create the survey.
        {:else}
            <i class="fas fa-circle-notch fa-spin"></i>
            Creating...
        {/if}
    </button>
</div>