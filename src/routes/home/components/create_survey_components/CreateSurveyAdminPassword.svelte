<script>
    import { getContext, onMount } from 'svelte'

    export let animationToExecute;

    let formElement;
    let registeredDashboardPassword = '';
    let doAnimation = getContext('doAnimation');

    $: hasEnteredPassword = registeredDashboardPassword !== '';

    onMount(() => {
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
        </div>
        <input type="text" class="form__input" placeholder="Confirm entered password">
    </div>
</div>