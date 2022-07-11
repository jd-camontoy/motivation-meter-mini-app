<script>
    import { createEventDispatcher, getContext, onMount } from 'svelte';
    import { answerMotivated, answerDemotivated } from '../survey_store';

    export let displayError;
    export let animationToExecute;

    const dispatch = createEventDispatcher();

    const NO_ANSWER = 0;
    const MOTIVATED = answerMotivated;
    const DEMOTIVATED = answerDemotivated;
    
    let formElement;

    let motivationSelectedAnswer = NO_ANSWER;

    let doAnimation = getContext('doAnimation');

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

    onMount(async () => {
        if (animationToExecute !== null && animationToExecute.fade === 'fadeIn') {
            doAnimation(formElement, animationToExecute.fade, animationToExecute.direction);
        }
    });

    $: if (animationToExecute !== null && animationToExecute.fade === 'fadeOut') {
        doAnimation(formElement, animationToExecute.fade, animationToExecute.direction);
    }
</script>

<div bind:this={formElement} class="survey-card__form">
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