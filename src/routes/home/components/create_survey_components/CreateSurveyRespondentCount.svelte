<script>
import { onMount } from 'svelte';

    import { respondentCountOptions } from '../../create_survey_store';
    let respondentsNumberOptions;

    let selectedRespondentNumber = null;

    function toggleOption(selectedOption) {
        if (selectedRespondentNumber === null || selectedRespondentNumber !== selectedOption) {
            selectedRespondentNumber = selectedOption;
        } else {
            selectedRespondentNumber = null;
        }
    }

    onMount(() => {
        if ($respondentCountOptions) {
            respondentsNumberOptions = $respondentCountOptions;
        }
    });
</script>

<div class="survey-card__form">
    <div class="survey-card__question-section">
        <h1>How many people do you want to ask?</h1>
        <h2>Select desired number of respondents for the survey.</h2>
    </div>

    <div class="survey-card__answer-selection">
        {#if respondentsNumberOptions}
            {#each respondentsNumberOptions as option}
                <span 
                    class="toggle toggle__keyword"
                    class:toggle__keyword--selected={selectedRespondentNumber === option}
                    on:click={() => {
                        toggleOption(option)
                    }}
                >
                    {option}
                </span>
            {/each}
        {/if}
    </div>
</div>