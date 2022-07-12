<script>
    import { getContext } from 'svelte';

    const displayedDate = getContext('displayedDate');
</script>

<div class="survey-card__header--result">
    <i class="fas fa-check-circle survey-card__icon survey-card__icon--success"></i>
    <h1>Survey answers sucessfully submitted.</h1>
    <h2>
        Thank you for your participation to the <br/>
        Motivation Meter Survey for {displayedDate}. 
    </h2>
</div>
<p class="survey-card__description margin-top-40">
    Rest assured that no identifier of any sort will be stored and displayed that correlates you with your answer, while your answers and selected keywords will still be counted and displayed.
</p>