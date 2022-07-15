<script>
    import { createEventDispatcher, getContext } from "svelte";

    export let sessionSurveyToken;

    let hideCreateModal = getContext('hideCreateModal');

    const dispatch = createEventDispatcher();

    function sendBypassToTrue() {
        dispatch('receiveBypassSelection', { 
            bypassWarningOnPrevCreatedSurvey: true 
        });
    }
</script>

<div class="create-survey-modal__body">
    <div class="create-survey-modal__header">
        <h2 class="create-survey-modal__title">Already Created {sessionSurveyToken}</h2>
        <button
            class="btn btn__header btn__header--close"
            on:click={hideCreateModal}
        >
            <i class="fas fa-times"></i>
            Close
        </button>
    </div>
    <div class="survey-card__header--result margin-bottom-40">
        <i class="fas fa-clipboard-check survey-card__icon survey-card__icon--primary"></i>
        <h1>A survey has already been created.</h1>
        <h2>
            Lets’ login to the dashboard instead.
        </h2>
        <form class="form__dashboard-login margin-top-40">
            <!-- Add eye feature -->
            <div class="form__group form__input--dashboard-password">
                <input 
                    type="password"
                    placeholder="Enter registered password"
                >
                <i 
                    class="fas fa-eye cursor--pointer"
                ></i>
            </div>
            <button class="btn btn__primary">
                <i class="fas fa-sign-in-alt"></i>
                Login to Dashboard
            </button>
        </form>
    </div>
    <span
        class="clickable"
        on:click={sendBypassToTrue}
    >
        Proceed to survey creation
    </span>
</div>