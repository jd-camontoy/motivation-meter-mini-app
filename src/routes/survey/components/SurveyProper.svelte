<script>
    import SurveyProperMotivation from './SurveyProperMotivation.svelte';
    import { getContext } from 'svelte';
    import { fade } from 'svelte/transition';

    const displayedDate = getContext('displayedDate');
</script>

<div in:fade>
    <div class="survey-card__header survey-card__header--survey-proper">
        <p class="survey-card__header--main">Motivation Meter Survey</p>
        <p class="survey-card__header--sub">for {displayedDate}</p>
    </div>
    
    <!-- Add dynamic change of components later -->
    <SurveyProperMotivation/>

    <div class="survey-card__navigation">
        <div class="survey-card__indicators">
            <span class="survey-card__indicator survey-card__indicator--active"></span>
            <span class="survey-card__indicator survey-card__indicator--inactive"></span>
            <span class="survey-card__indicator survey-card__indicator--inactive"></span>
        </div>
        <button class="btn btn__navigation btn__navigation--active">
            <i class="fas fa-angle-right"></i>
            Next
        </button>
    </div>
</div>