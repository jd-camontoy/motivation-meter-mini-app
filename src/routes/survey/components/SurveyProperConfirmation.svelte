<script>
    import { getContext, onMount } from "svelte";
    import { 
        answerMotivated,
        answerDemotivated,
        surveyAnswers
    } from '../survey_store';

    export let animationToExecute;
    
    let formElement;
    let motivationAnswer;
    let keywordsAnswer;

    let doAnimation = getContext('doAnimation');

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
    <!-- Add functionality to the button later  -->
    <button class="btn btn__primary btn--submit-survey">
        <i class="fas fa-check"></i>
        Yes, I’m sure. Submit them.
    </button>
</div>