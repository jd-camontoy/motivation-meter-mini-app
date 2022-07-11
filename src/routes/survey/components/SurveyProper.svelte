<script>
    import SurveyProperMotivation from './SurveyProperMotivation.svelte';
    import SurveyProperKeywords from './SurveyProperKeywords.svelte';
    import Indicators from '../../../common_components/Indicators.svelte';
    import { currentFormTab, accessNextTab } from '../survey_store';
    import { doAnimation } from '../../common_functions';
    import { getContext, setContext } from 'svelte';
    import { fade } from 'svelte/transition';
    
    const animationDuration = 300;
    const displayedDate = getContext('displayedDate');

    const formComponents = [
        SurveyProperMotivation,
        SurveyProperKeywords
    ];
    
    const formsCount = formComponents.length;
    const firstFormIndex = 0;
    
    let nextBtn;
    let enableNextBtn;

    let sendDisplayError = false;
    let animationToExecute = null;

    setContext('doAnimation', doAnimation);

    function changeStateNextButton(event) {
        enableNextBtn = event.detail.hasAnswer;
        sendDisplayError = false;
        if (enableNextBtn) {
            nextBtn.classList.remove('btn__navigation--inactive');
            nextBtn.classList.add('btn__navigation--active');
        } else {
            nextBtn.classList.remove('btn__navigation--active');
            nextBtn.classList.add('btn__navigation--inactive');
        }
    }

    function goToNextTab() {
        if (enableNextBtn) {
            enableNextBtn = false;
            nextBtn.classList.remove('btn__navigation--active');
            nextBtn.classList.add('btn__navigation--inactive');
            sendDisplayError = false;

            animationToExecute = {
                fade: 'fadeOut',
                direction: 'Left'
            }
            setTimeout(() => {
                accessNextTab();
                animationToExecute = {
                    fade: 'fadeIn',
                    direction: 'Right'
                };
            }, animationDuration);
        } else {
            sendDisplayError = true;
            setTimeout(() => {
                sendDisplayError = false
            }, 5000);
        }
    }
</script>

<div in:fade>
    <div class="survey-card__header survey-card__header--survey-proper">
        <p class="survey-card__header--main">Motivation Meter Survey</p>
        <p class="survey-card__header--sub">for {displayedDate}</p>
    </div>

    <svelte:component
        this={formComponents[$currentFormTab]}
        on:message={changeStateNextButton}
        displayError={sendDisplayError}
        animationToExecute={animationToExecute}
    />

    <div class="survey-card__navigation">
        {#if $currentFormTab > firstFormIndex}
        <!-- Add functionality to previous button -->
        <button class="btn btn__navigation btn__navigation--active">
            <i class="fas fa-angle-left"></i>
            Previous
        </button>
        {/if}

        <Indicators 
            itemCount={formsCount} 
            currentActiveIndex={$currentFormTab}
        />

        <button
            class="btn btn__navigation btn__navigation--inactive"
            bind:this={nextBtn}
            on:click={goToNextTab}
        >
            <i class="fas fa-angle-right"></i>
            Next
        </button>
    </div>
</div>