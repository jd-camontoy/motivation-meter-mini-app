<script>
    import { getContext, onMount } from "svelte";
    import { surveySettings } from '../../create_survey_store';

    export let animationToExecute;

    let displayPassword = false;
    let passwordCharacterCount = $surveySettings.adminPassword.length;

    let formElement;
    let doAnimation = getContext('doAnimation');

    onMount(() => {
        if (animationToExecute !== null && animationToExecute.fade === 'fadeIn') {
            doAnimation(formElement, animationToExecute.fade, animationToExecute.direction);
        }
    });

    $: if (animationToExecute !== null && animationToExecute.fade === 'fadeOut') {
        doAnimation(formElement, animationToExecute.fade, animationToExecute.direction);
    }

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
    <button class="btn btn__primary btn--submit-survey">
        <i class="fas fa-check"></i>
        Yes, I’m sure. Create the survey.
    </button>
</div>