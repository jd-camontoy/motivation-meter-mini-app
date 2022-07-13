<script>
    import { createEventDispatcher, getContext, onMount } from 'svelte';
    import { surveyAnswers, keywordOptions } from '../survey_store';
    
    export let displayError;
    export let animationToExecute;

    const dispatch = createEventDispatcher();
    
    let formElement;

    let selectedKeywords = [];

    let doAnimation = getContext('doAnimation');

    function renderAnsweredState() {
        if ($surveyAnswers.keywords.length !== 0) {
            selectedKeywords = $surveyAnswers.keywords;
            dispatch('message', {
                hasAnswer: $surveyAnswers.keywords.length !== 0
            });
        }
    }

    onMount(() => {
        renderAnsweredState();
        if (animationToExecute !== null && animationToExecute.fade === 'fadeIn') {
            doAnimation(formElement, animationToExecute.fade, animationToExecute.direction);
        }
    });

    $: if (animationToExecute !== null && animationToExecute.fade === 'fadeOut') {
        doAnimation(formElement, animationToExecute.fade, animationToExecute.direction);
    }

    function messageNextButton() {
        let hasAnswer = selectedKeywords.length !== 0;
        dispatch('message', {hasAnswer});
        if (hasAnswer) {
            $surveyAnswers.keywords = selectedKeywords;
        }
    }

    function toggleKeyword(keyword) {
        if (!selectedKeywords.includes(keyword)) {
            selectedKeywords.push(keyword);
        } else {
            selectedKeywords = selectedKeywords.filter(value => value !== keyword);
        }
        messageNextButton();
    }

    function determineToggleClass(keyword, event) {
        let toggleElement = event.target;
        if (selectedKeywords.includes(keyword)) {
            toggleElement.classList.add("toggle__keyword--selected");
        } else {
            toggleElement.classList.remove("toggle__keyword--selected");
        }
    }
</script>

<div bind:this={formElement} class="survey-card__form">
    <div class="survey-card__question-section">
        <h1>Why?</h1>
        <h2>Please select keywords from the presented options.</h2>
    </div>

    {#if displayError}
        <div class="note note--error">
            <strong>Please select at least 1 keyword first</strong> before proceeding to the next part.
        </div>
    {/if}

    <div class="survey-card__answer-selection">
        {#if $keywordOptions}
            {#each $keywordOptions as keyword}
            <span 
                class="toggle toggle__keyword"
                class:toggle__keyword--selected={selectedKeywords.includes(keyword)}
                on:click={(e) => {
                    toggleKeyword(keyword);
                    determineToggleClass(keyword, e);
                }}
            >
                { keyword }
            </span>
            {/each}
        {/if}
    </div>
</div>