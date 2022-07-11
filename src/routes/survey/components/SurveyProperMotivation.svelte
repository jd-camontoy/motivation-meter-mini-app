<script>
    import { createEventDispatcher } from 'svelte';
    import { answerMotivated, answerDemotivated } from '../survey_store';

    export let displayError;

    const dispatch = createEventDispatcher();

    const NO_ANSWER = 0;
    const MOTIVATED = answerMotivated;
    const DEMOTIVATED = answerDemotivated;

    let motivationSelectedAnswer = NO_ANSWER;

    function messageNextButton() {
        let hasAnswer = motivationSelectedAnswer !== NO_ANSWER;
        dispatch('message', {hasAnswer});
    }

    function toggleYes() {
        motivationSelectedAnswer = 
            motivationSelectedAnswer !== MOTIVATED ?  MOTIVATED : NO_ANSWER;
        messageNextButton();
    }

    function toggleNo() {
        motivationSelectedAnswer = 
            motivationSelectedAnswer !== DEMOTIVATED ?  DEMOTIVATED : NO_ANSWER;
        messageNextButton();
    }
</script>

<div class="survey-card__form">
    <h1 class="survey-card__question">Are you motivated at work?</h1>

    {#if displayError}
        <div class="note note--error">
            <strong>Please select an answer first</strong> before proceeding to the next part.
        </div>
    {/if}

    <div class="survey-card__answer-selection">
        <span 
            class="toggle toggle__answer toggle__answer--yes"
            class:toggle__answer--yes-selected={motivationSelectedAnswer === MOTIVATED}
            on:click={toggleYes}
        >
            <i class="fas fa-check"></i>
            Yes
        </span>
        <span 
            class="toggle toggle__answer toggle__answer--no"
            class:toggle__answer--no-selected={motivationSelectedAnswer === DEMOTIVATED}
            on:click={toggleNo}
        >
            <i class="fas fa-times"></i>
            No
        </span>
    </div>
</div>