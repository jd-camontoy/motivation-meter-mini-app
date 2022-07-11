<script>
    import { onMount } from 'svelte';
    import { getSurveySettings } from '../../../api/api';
    import { AxiosError } from 'axios';

    let keywordOptions;

    let selectedKeywords = [];

    async function getKeywordOptions() {
        let fetchedKeywords = null;
        try {
            let apiResponse = await getSurveySettings({
                setting: 'keywords'
            });
            if (apiResponse instanceof AxiosError) {
                console.error('Something went wrong while fetching of respondent limit options', apiResponse);
            } else {
                fetchedKeywords = apiResponse.data;
            }
        } catch (error) {
            console.error('Something went wrong while fetching of respondent limit options', error);
        }
        return fetchedKeywords;
    }

    onMount(async () => {
        keywordOptions = await getKeywordOptions();
    });

    function toggleKeyword(keyword) {
        if (!selectedKeywords.includes(keyword)) {
            selectedKeywords.push(keyword);
        } else {
            selectedKeywords = selectedKeywords.filter(value => value !== keyword);
        }
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

<div class="survey-card__form">
    <div class="survey-card__question-section">
        <h1>Why?</h1>
        <h2>Please select keywords from the presented options.</h2>
    </div>
    <div class="survey-card__answer-selection">
        {#if keywordOptions}
            {#each keywordOptions as keyword}
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