<script>
    export let createdSurveyToken = '';

    let dashboardLoginSurveyToken = '';
    let dashboardLoginPassword = '';
    let formErrorMessage = '';

    let displayFormError = false;

    let displayErrorTimeout;

    $: if (displayFormError) {
        displayErrorTimeout = setTimeout(() => {
            displayFormError = false;
        }, 5000);
    } else {
        clearTimeout(displayErrorTimeout)
    }

    $: if (createdSurveyToken != '') {
        dashboardLoginSurveyToken = createdSurveyToken;
    }

    let formValidation = () => {
        if (dashboardLoginSurveyToken === '') {
            formErrorMessage = 'Please provide the survey token.';
            displayFormError = true;
            return false;
        } else if (dashboardLoginPassword === '') {
            formErrorMessage = 'Please provide the dashboard password.';
            displayFormError = true;
            return false;
        } else {
            return true;
        }
    }

    // Add full submission implementation later
    function dashboardLoginSubmission(formValidationFunction) {
        let formValidated = formValidationFunction();
        console.log(`Validation result: ${formValidated}`);
    }
</script>

{#if displayFormError}
    <div class="note note--error">
        {formErrorMessage}
    </div>
{/if}

<!-- Add form functionality -->
<form 
    on:submit|preventDefault={() => dashboardLoginSubmission(formValidation)} 
    class="form__dashboard-login"
>
    <input
        bind:value={dashboardLoginSurveyToken}
        on:input={() => { 
            displayFormError = false;
        }}
        type="text"
        class="form__input form__input--survey-id"
        placeholder="Enter provided Survey ID"
    />
    <!-- Add eye feature -->
    <div class="form__group form__input--dashboard-password">
        <input 
            bind:value={dashboardLoginPassword}
            on:input={() => { 
                displayFormError = false;
            }}
            type="password"
            placeholder="Enter registered password"
        >
        <i 
            class="fas fa-eye cursor--pointer"
        ></i>
    </div>
    <button class="btn btn__primary btn--create-survey">
        <i class="fas fa-sign-in-alt"></i>
        Login and Manage Survey
    </button>
</form> 