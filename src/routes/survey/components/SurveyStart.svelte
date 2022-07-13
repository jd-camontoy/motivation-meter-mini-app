<script>
    import { getContext } from 'svelte';
    import { surveyStarted } from '../survey_store';

    const displayedDate = getContext('displayedDate');
</script>

<div class="survey-card__header">
    <h1>Motivation Meter Survey</h1>
    <h2>for {displayedDate}</h2>
</div>
<p class="survey-card__description margin-bottom-60">
    This survey serves as an avenue for employees to express their overall feelings when regards to their motivation at work. It also serves as an avenue for superviors and managers to know overall motivation levels of their subordinates.
</p>
<button class="btn btn__primary btn--start-survey" on:click={() => $surveyStarted = true}>
    <i class="fas fa-play"></i>
    Start the Survey
</button>