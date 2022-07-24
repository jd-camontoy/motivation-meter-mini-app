<script>
    import { AxiosError } from "axios";
    import { sendDashboardLogin } from '../../../../api/api';
    import { dashboardSurveyInfo } from '../../../dashboard/session';
    import { goto } from '$app/navigation';
    import { createEventDispatcher, getContext } from "svelte";

    export let sessionSurveyToken;

    const dispatch = createEventDispatcher();

    let formErrorMessage;
    let displayErrorTimeout;

    let dashboardPassword = '';
    let displayFormError = false;
    let formSubmissionInProgress = false;
    let formSubmissionSuccessful = false;

    let hideCreateModal = getContext('hideCreateModal');

    $: if (displayFormError) {
        displayErrorTimeout = setTimeout(() => {
            displayFormError = false;
        }, 5000);
    } else {
        clearTimeout(displayErrorTimeout)
    }

    function sendBypassToTrue() {
        dispatch('receiveBypassSelection', { 
            bypassWarningOnPrevCreatedSurvey: true 
        });
    }

    function toggleFieldDisplay(event) {
        const TYPE_PASSWORD = 'password';
        const TYPE_TEXT = 'text';

        let mainElement = event.target;
        let inputElement = mainElement.previousElementSibling;
        let currentInputType = inputElement.getAttribute("type");

        if (currentInputType === TYPE_PASSWORD) {
            inputElement.setAttribute("type", TYPE_TEXT);
            mainElement.classList.remove("fa-eye");
            mainElement.classList.add("fa-eye-slash");
        } else if (currentInputType === TYPE_TEXT) {
            inputElement.setAttribute("type", TYPE_PASSWORD);
            mainElement.classList.remove("fa-eye-slash");
            mainElement.classList.add("fa-eye");
        }
    }

    let formValidation = () => {
        if (dashboardPassword === '') {
            formErrorMessage = 'Please provide the dashboard password.';
            displayFormError = true;
            return false;
        } else {
            return true;
        }
    }

    async function dashboardLogin(formValidationFunction) {
        formSubmissionInProgress = true;
        displayFormError = false;
        let formValidated = formValidationFunction();
        if (formValidated) {
            try {
                let loginParams = {
                    survey_token: sessionSurveyToken,
                    survey_dashboard_password: dashboardPassword
                }
                let apiResult = await sendDashboardLogin(loginParams);
                if (apiResult instanceof AxiosError) {
                    let responseData = apiResult.response.data;
                    if (
                        responseData != undefined &&
                        ('success' in responseData && responseData.success == false)
                    ) {
                        formErrorMessage = 'Survey information was not found. Please re-check credentials.';
                    } else {
                        formErrorMessage = 'Something went wrong during submission. Please re-try at a later time.';
                    }
                    displayFormError = true;
                    console.error('Submitted dashboard credentials did not return a survey record', responseData);
                } else {
                    // Refactor to transfer JSON parsing and serializing to the store JS
                    formSubmissionSuccessful = true;
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
        <h2 class="margin-bottom-40">
            Lets’ login to the dashboard instead.
        </h2>
        {#if displayFormError}
            <div class="note note--error">
                {formErrorMessage}
            </div>
        {/if}
        <form
            class="form__dashboard-login"
            on:submit|preventDefault={() => {dashboardLogin(formValidation)}}
        >
            <!-- Add eye feature -->
            <div class="form__group form__input--dashboard-password">
                <input
                    bind:value={dashboardPassword}
                    on:input={() => { displayFormError = false }}
                    type="password"
                    placeholder="Enter registered password"
                >
                <i 
                    class="fas fa-eye cursor--pointer"
                    on:click={(e) => {
                        if (dashboardPassword !== '') {
                            toggleFieldDisplay(e)
                        }
                    }}
                ></i>
            </div>
            <button
                class="btn btn__primary btn--create-survey"
                disabled={formSubmissionInProgress || formSubmissionSuccessful}
            >
                {#if !formSubmissionInProgress}
                    <i class="fas fa-sign-in-alt"></i>
                    Login to Dashboard
                {:else if formSubmissionSuccessful}
                    <i class="fas fa-circle-notch fa-spin"></i>
                    Redirecting to Dashboard
                {:else}
                    <i class="fas fa-circle-notch fa-spin"></i>
                    Trying to log in...
                {/if}
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