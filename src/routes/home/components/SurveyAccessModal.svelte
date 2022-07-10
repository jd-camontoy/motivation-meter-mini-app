<script>
    import { getContext } from "svelte";
    import { fade, scale } from 'svelte/transition';

    const animationSpeed = 100;

    let hideSurveyModal = getContext('hideSurveyModal');
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
            <form class="form__dashboard-login margin-top-40">
                <!-- Add eye feature -->
                <input
                    type="text"
                    class="form__input form__input--survey-id"
                    placeholder="Enter provided Survey ID"
                />
                <button class="btn btn__primary">
                    <i class="fas fa-sign-in-alt"></i>
                    Access the Survey
                </button>
            </form>
        </div>
    </div>
</div>