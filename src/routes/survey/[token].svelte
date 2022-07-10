<script>
    import { getContext } from "svelte";

    let pageName = getContext('pageName');
    $pageName = 'Survey'
</script>

<div class="survey-card">
    <div class="survey-card__header">
        <h1>Motivation Meter Survey</h1>
        <h2>for February 22, 2022</h2>
    </div>
    <p class="survey-card__description margin-bottom-60">
        This survey serves as an avenue for employees to express their overall feelings when regards to their motivation at work. It also serves as an avenue for superviors and managers to know overall motivation levels of their subordinates.
    </p>
    <button class="btn btn__primary btn--start-survey">
        <i class="fas fa-play"></i>
        Start the Survey
    </button>
</div>