<script>
    import { getContext } from "svelte";
    import { fade, scale } from 'svelte/transition';

    const animationSpeed = 100;
    const validSurveyTokenRegex = /^[0-9A-Za-z]+$/;

    let displayedErrorMsg;
    let displayError = false;
    let enteredSurveyToken = '';

    let pageName = getContext('pageName');
    $pageName = 'Answer a Survey';

    let hideSurveyModal = getContext('hideSurveyModal');

    let displayErrorTimeout;

    $: if (displayError) {
        displayErrorTimeout = setTimeout(() => {
            displayError = false;
        }, 5000);
    } else {
        clearTimeout(displayErrorTimeout)
    }
    
    $: surveyUrl = '/survey/' + enteredSurveyToken;

    function validateEnteredToken() {
        if (enteredSurveyToken === '') {
            displayError = true;
            displayedErrorMsg = 'Please provide the survey token.';
        } else if (!validSurveyTokenRegex.test(enteredSurveyToken)) {
            displayError = true;
            displayedErrorMsg = 'Please provide a valid survey token.';
        } else {
            window.open(surveyUrl,'_blank');
            hideSurveyModal();
        }
    }
</script>

<div class="create-survey-modal">
    <div class="create-survey-modal__bg" in:fade|local out:fade|local={{ delay: animationSpeed }}></div>

    <div class="create-survey-modal__card" in:scale={{ delay: animationSpeed }} out:scale>
        <div class="create-survey-modal__body">
            <div class="create-survey-modal__header margin-bottom-40">
                <h2 class="create-survey-modal__title">Answer a Survey</h2>
                <button
                    class="btn btn__header btn__header--close"
                    on:click={hideSurveyModal}
                >
                    <i class="fas fa-times"></i>
                    Close
                </button>
            </div>
            <div class="survey-card__question-section">
                <h1>Let's answer a survey</h1>
                <h2>Kindly enter the provided survey token on the field below.</h2>
            </div>

            {#if displayError}
                <div class="note note--error">
                    {displayedErrorMsg}
                </div>
            {/if}

            <form class="form__dashboard-login margin-top-40" on:submit|preventDefault={validateEnteredToken}>
                <input
                    bind:value={enteredSurveyToken}
                    on:input={() => { 
                        displayError = false;
                    }}
                    type="text"
                    class="form__input form__input--survey-id"
                    placeholder="Enter provided Survey ID"
                />
                <button class="btn btn__primary" type="submit">
                    <i class="fas fa-sign-in-alt"></i>
                    Access the Survey
                </button>
            </form>
        </div>
    </div>
</div>