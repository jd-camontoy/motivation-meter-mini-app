<script>
    import { getContext, onMount } from "svelte";
    import { 
        answerMotivated,
        answerDemotivated,
        surveyAnswers,
        surveySubmittionError,
        surveySubmitted
    } from '../survey_store';
    import { sendSurveyResponse } from '../../../api/api';
    import { AxiosError } from "axios";

    export let animationToExecute;
    
    let formElement;
    let motivationAnswer;
    let keywordsAnswer;

    let responseSubmitted = false;

    let doAnimation = getContext('doAnimation');
    let surveyToken = getContext('surveyToken');
    let surveyData = getContext('surveyData');

    $: if ($surveyAnswers.motivation === answerMotivated) {
        motivationAnswer = 'Yes'
    } else if ($surveyAnswers.motivation === answerDemotivated) {
        motivationAnswer = 'No'
    }

    $: keywordsAnswer = $surveyAnswers.keywords.join(', ');

    onMount(() => {
        if (animationToExecute !== null && animationToExecute.fade === 'fadeIn') {
            doAnimation(formElement, animationToExecute.fade, animationToExecute.direction);
        }
    });

    $: if (animationToExecute !== null && animationToExecute.fade === 'fadeOut') {
        doAnimation(formElement, animationToExecute.fade, animationToExecute.direction);
    }

    $: finalSurveyAnswers = {
        survey_token: surveyToken,
        answer_motivated: $surveyAnswers.motivation,
        answer_keywords: $surveyAnswers.keywords,
        survey_id: surveyData._id
    };

    async function submitSurveyResponse() {
        try {
            responseSubmitted = true;
            let response = await sendSurveyResponse(finalSurveyAnswers);
            if (response instanceof AxiosError) {
                $surveySubmittionError = true;
                console.error('Survey response submission error', response);
            } else if ('success' in response && response.success === true) {
                $surveySubmitted = true;
            }
        } catch (e) {
            $surveySubmittionError = true;
            console.error('Survey response submission error', e);
        }
    }
</script>

<div bind:this={formElement} class="survey-card__form">
    <div class="survey-card__question-section">
        <h1>Are you sure with your answers?</h1>
        <h2>Kindly review the following answers you have selected for the presented questions.</h2>
    </div>
    <div class="survey-card__answer-confirmation">
        <div class="survey-card__answer-confirmation-row">
            <p class="survey-card__answer-confirmation-question">Are you motivated at work?</p>
            <p class="survey-card__answer-confirmation-answer">
                {motivationAnswer}
            </p>
        </div>
        <div class="survey-card__answer-confirmation-row">
            <p class="survey-card__answer-confirmation-question">Why?</p>
            <p class="survey-card__answer-confirmation-answer">
                {keywordsAnswer}
            </p>
        </div>
    </div>
    <button 
        class="btn btn__primary btn--submit-survey"
        on:click={submitSurveyResponse}
        disabled={responseSubmitted}
    >
        {#if !responseSubmitted}
            <i class="fas fa-check"></i>
            Yes, I’m sure. Submit them.
        {:else}
            <i class="fas fa-circle-notch fa-spin"></i>
            Submitting...
        {/if}
    </button>
</div>