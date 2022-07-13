<script>
    import { getContext } from 'svelte';

    const displayedDate = getContext('displayedDate');
</script>


<div class="survey-card">
    <div class="survey-card__header--result">
        <i class="fas fa-stop-circle survey-card__icon survey-card__icon--primary"></i>
        <h1>Survey already ended.</h1>
        <h2>
            Thank you for your participation to the <br/>
            Motivation Meter Survey for {displayedDate}
        </h2>
    </div>
    <p class="survey-card__description survey-card__description--centered margin-top-40">
        Kindly coordinate with your survey administrator if you think this survey link must still be accessible.
    </p>
</div>