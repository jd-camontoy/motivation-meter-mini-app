<script>
    export let pageName = null;
</script>

<div class="survey-card">
    <i class="fas fa-circle-notch fa-spin survey-card__icon survey-card__icon--primary"></i>
    
    <h1>
        {#if pageName}
            {pageName} loading...
        {:else}
            Loading...
        {/if}
    </h1>
</div>