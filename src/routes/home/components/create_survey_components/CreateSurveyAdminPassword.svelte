<script>
    import { getContext, onMount, createEventDispatcher } from 'svelte'
    import { surveySettings } from '../../create_survey_store';
    import { togglePasswordValueDisplay } from '../../../common_functions';

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

    $: displayFormError = displayError;

    $: hasEnteredPassword = registeredDashboardPassword !== '';
    $: hasEnteredConfirmatoryPassword = confirmatoryDasboardPassword !== '';

    $: if (registeredDashboardPassword === '') {
        confirmatoryDasboardPassword = '';
    }

    $: passwordMetMinCharCount = registeredDashboardPassword.length >= minimumCharactersPassword;

    $:  if (registeredDashboardPassword !== '' &&  passwordMetMinCharCount) {
            passwordCriteria[0].accomplished = true;
        } else {
            passwordCriteria[0].accomplished = false;
        }

    $: passwordHasValidRegexPattern = regexValidPassword.test(registeredDashboardPassword);

    $:  if (passwordHasValidRegexPattern) {
            passwordCriteria[1].accomplished = true;
        } else {
            passwordCriteria[1].accomplished = false;
        }

    $:  if (hasEnteredPassword && registeredDashboardPassword === confirmatoryDasboardPassword) {
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

    function resetErrorDisplay() {
        dispatch('resetErrorDisplay', { 'resetErrorDisplay': true });
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
</script>


<div class="survey-card__form" bind:this={formElement}>
    <div class="survey-card__question-section">
        <h1>Let's register a password for the survey dashboard.</h1>
        <h2>Set a password for accessing the survey dashboard.</h2>
    </div>

    {#if displayFormError}
        <div class="note note--error">
            {#if registeredDashboardPassword === ''}
                <strong>Please register a password first</strong> before proceeding to the next part.
            {:else if !passwordHasValidRegexPattern || !passwordMetMinCharCount}
                <strong>Please ensure that the registered password has met the criterias</strong> before proceeding to the next part.
            {:else if confirmatoryDasboardPassword === ''}
                <strong>Please confirm the registered password first</strong> before proceeding to the next part.
            {:else if !confirmatoryDasboardPasswordIsSame}
                <strong>Please ensure that the registered password has met the criterias</strong> before proceeding to the next part.
            {/if}
        </div>
    {/if}

    <div class="create-survey-modal__form">
        <div class="create-survey-modal__form-input-group">
            <div class="form__group form__input--dashboard-password">
                <input 
                    type="password"
                    placeholder="Enter password"
                    bind:value={registeredDashboardPassword}
                    on:input={resetErrorDisplay}
                >
                <i 
                    class="fas fa-eye cursor--pointer"
                    on:click={(e) => {
                        if (hasEnteredPassword) {
                            togglePasswordValueDisplay(e)
                        }
                    }}
                ></i>
            </div>

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
                class="form__group form__input--dashboard-password"
                class:form__group--disabled={!hasEnteredPassword}
            >
                <input 
                    type="password"
                    placeholder="Confirm entered password" 
                    disabled={!hasEnteredPassword}
                    bind:value={confirmatoryDasboardPassword}
                    on:input={resetErrorDisplay}
                >
                <i 
                    class="fas fa-eye cursor--pointer"
                    on:click={(e) => {
                        if (hasEnteredPassword && hasEnteredConfirmatoryPassword) {
                            togglePasswordValueDisplay(e)
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