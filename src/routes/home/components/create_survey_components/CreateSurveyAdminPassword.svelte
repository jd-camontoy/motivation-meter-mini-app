<script>
    import { getContext, onMount } from 'svelte'

    export let animationToExecute;

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
</script>


<div class="survey-card__form" bind:this={formElement}>
    <div class="survey-card__question-section">
        <h1>Let's register a password for the survey dashboard.</h1>
        <h2>Set a password for accessing the survey dashboard.</h2>
    </div>
    <div class="create-survey-modal__form">
        <input type="text" class="form__input" placeholder="Enter password">
        <input type="text" class="form__input" placeholder="Confirm entered password">
    </div>
</div>