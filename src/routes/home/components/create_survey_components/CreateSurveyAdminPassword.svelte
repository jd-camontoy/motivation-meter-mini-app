<script>
    import { getContext, onMount, createEventDispatcher } from 'svelte'
    import { surveySettings } from '../../create_survey_store';

    export let animationToExecute;
    export let displayError;

    const minimumCharactersPassword = 6;
    const passwordCriteria = [
        {
            description: `Must be at least ${minimumCharactersPassword} characters.`,
            accomplished: false
        },
        {
            description: `
                Must contain: 
                    <br/>&emsp;&emsp;&#8226; at least 1 letter
                    <br/>&emsp;&emsp;&#8226; at least 1 number, and
                    <br/>&emsp;&emsp;&#8226; at least 1 of the allowed special characters (!?@#$%^&)
            `,
            accomplished: false
        }
    ];
    const dispatch = createEventDispatcher();
    
    // Ensures password has at least 1 number, 1 letter, and 1 of the only allowed set of special characters.
    const regexValidPassword = /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&])([a-zA-Z0-9!?@#$%^&]+)$/;

    let formElement;
    let registeredDashboardPassword = '';
    let confirmatoryDasboardPassword = '';
    let confirmatoryDasboardPasswordIsSame = false;
    let doAnimation = getContext('doAnimation');

    $: hasEnteredPassword = registeredDashboardPassword !== '';

    $: if (registeredDashboardPassword === '') {
        confirmatoryDasboardPassword = '';
    }

    $:  if (
            registeredDashboardPassword !== '' && 
            registeredDashboardPassword.length >= minimumCharactersPassword
        ) {
            passwordCriteria[0].accomplished = true;
        } else {
            passwordCriteria[0].accomplished = false;
        }

    $: passwordHasValidRegexPattern = regexValidPassword.test(registeredDashboardPassword);

    $: if (passwordHasValidRegexPattern) {
        passwordCriteria[1].accomplished = true;
    } else {
        passwordCriteria[1].accomplished = false;
    }

    $: if (hasEnteredPassword && registeredDashboardPassword === confirmatoryDasboardPassword) {
        confirmatoryDasboardPasswordIsSame = true;
    } else {
        confirmatoryDasboardPasswordIsSame = false;
    }

    $: passwordIsValid = 
        registeredDashboardPassword.length >= minimumCharactersPassword &&
        passwordHasValidRegexPattern && 
        confirmatoryDasboardPasswordIsSame
    
    $: dispatch('message', { hasAnswer: passwordIsValid });

    $: if (passwordIsValid) {
        $surveySettings.adminPassword = registeredDashboardPassword;
    }

    function removeError() {
        if (displayError) {
            displayError = false;
        }
    }

    function renderAnsweredState() {
        let hasRegisteredPassword = $surveySettings.adminPassword !== null;
        if (hasRegisteredPassword) {
            registeredDashboardPassword = $surveySettings.adminPassword;
            confirmatoryDasboardPassword = $surveySettings.adminPassword;
            dispatch('message', {
                hasAnswer: hasRegisteredPassword
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
</script>


<div class="survey-card__form" bind:this={formElement}>
    <div class="survey-card__question-section">
        <h1>Let's register a password for the survey dashboard.</h1>
        <h2>Set a password for accessing the survey dashboard.</h2>
    </div>
    <div class="create-survey-modal__form">
        <div class="create-survey-modal__form-input-group">
            <div class="create-survey-modal__form-input-field">
                <input 
                    type="password"
                    placeholder="Enter password"
                    bind:value={registeredDashboardPassword}
                    on:keydown={removeError}
                >
                <i 
                    class="fas fa-eye cursor--pointer"
                    on:click={(e) => {
                        if (hasEnteredPassword) {
                            toggleFieldDisplay(e)
                        }
                    }}
                ></i>
            </div>

            <!-- Add error displayed for the registered password -->
            {#if hasEnteredPassword}
            <ul>
                {#each passwordCriteria as criterion}
                    <li 
                        class:form__input_message--success={criterion.accomplished} 
                        class:form__input_message--error={!criterion.accomplished}
                    >
                        <i class="fas" class:fa-check={criterion.accomplished} class:fa-times={!criterion.accomplished}></i>
                        {@html criterion.description}
                    </li>
                {/each}
            </ul>
            {/if}

        </div>
        <div class="create-survey-modal__form-input-group">
            <div 
                class="create-survey-modal__form-input-field"
                class:create-survey-modal__form-input-field--disabled={!hasEnteredPassword}
            >
                <input 
                    type="password"
                    placeholder="Confirm entered password" 
                    disabled={!hasEnteredPassword}
                    bind:value={confirmatoryDasboardPassword}
                    on:keydown={removeError}
                >
                <i 
                    class="fas fa-eye cursor--pointer"
                    on:click={(e) => {
                        if (hasEnteredPassword) {
                            toggleFieldDisplay(e)
                        }
                    }}
                ></i>
            </div>

            {#if confirmatoryDasboardPassword !== ''}
            <ul>
                <li
                    class:form__input_message--success={confirmatoryDasboardPasswordIsSame} 
                    class:form__input_message--error={!confirmatoryDasboardPasswordIsSame}
                >
                    <i
                        class="fas"
                        class:fa-check={confirmatoryDasboardPasswordIsSame}
                        class:fa-times={!confirmatoryDasboardPasswordIsSame}
                    ></i>
                    Must be the same as the previously entered password.
                </li>
            </ul>
            {/if}
        </div>
    </div>
</div>