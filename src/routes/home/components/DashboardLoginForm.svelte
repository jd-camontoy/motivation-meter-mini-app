<script>
    import { sendDashboardLogin } from '../../../api/api';
    import { dashboardSurveyInfo } from '../../dashboard/session';
    import { goto } from '$app/navigation';
    import { AxiosError } from 'axios'; 

    export let createdSurveyToken = '';

    let dashboardLoginSurveyToken = '';
    let dashboardLoginPassword = '';
    let formErrorMessage = '';

    let displayFormError = false;
    let formSubmissionInProgress = false;

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
    async function dashboardLoginSubmission(formValidationFunction) {
        displayFormError = false;
        formSubmissionInProgress = true;
        let formValidated = formValidationFunction();
        if (formValidated) {
            try {
                let loginParams = {
                    survey_token: dashboardLoginSurveyToken,
                    survey_dashboard_password: dashboardLoginPassword
                }
                let apiResult = await sendDashboardLogin(loginParams);
                if (apiResult instanceof AxiosError) {
                    let responseData = apiResult.response.data;
                    if (
                        responseData != undefined &&
                        ('success' in responseData && responseData.success == false)
                    ) {
                        formErrorMessage = 'Survey information was not found. Please re-check credentials.';
                    }
                    displayFormError = true;
                    console.error('Submitted dashboard credentials did not return a survey record', responseData);
                } else {
                    // Refactor to transfer JSON parsing and serializing to the store JS
                    $dashboardSurveyInfo = JSON.stringify(apiResult.data);
                    let storedSurveyInfo = JSON.parse($dashboardSurveyInfo);
                    if ('_id' in storedSurveyInfo) {
                        console.log('Survey info stored', storedSurveyInfo);
                        let dashboardUrl = '/dashboard';
                        goto(dashboardUrl);
                    }
                }
            } catch (e) {
                formErrorMessage = 'Something went wrong during submission. Please re-try at a later time.';
                displayFormError = true;
                console.error(formErrorMessage, e);
            }
        }
        formSubmissionInProgress = false;
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
    
    <button
        class="btn btn__primary btn--create-survey"
        disabled={formSubmissionInProgress}
    >
        {#if !formSubmissionInProgress}
            <i class="fas fa-sign-in-alt"></i>
            Login and Manage Survey
        {:else}
            <i class="fas fa-circle-notch fa-spin"></i>
            Trying to log in...
        {/if}
    </button>
</form> 