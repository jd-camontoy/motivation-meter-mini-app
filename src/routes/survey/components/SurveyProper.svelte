<script>
    import { getContext } from 'svelte';
    import { fade } from 'svelte/transition';

    const displayedDate = getContext('displayedDate');
</script>

<div in:fade>
    <div class="survey-card__header survey-card__header--survey-proper">
        <p class="survey-card__header--main">Motivation Meter Survey</p>
        <p class="survey-card__header--sub">for {displayedDate}</p>
    </div>
    <div class="survey-card__form">
        <h1 class="survey-card__question">Are you motivated at work?</h1>
        <div class="survey-card__answer-selection">
            <input id="radio__motivated" type="radio" hidden>
            <span class="toggle toggle__answer toggle__answer--yes">
                <i class="fas fa-check"></i>
                Yes
            </span>
            <input id="radio__demotivated" type="radio" hidden>
            <span class="toggle toggle__answer toggle__answer--no">
                <i class="fas fa-times"></i>
                No
            </span>
        </div>
    </div>
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