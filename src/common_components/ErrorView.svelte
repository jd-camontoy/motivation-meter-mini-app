<script>
    import { onMount } from "svelte";   
    import LoadingCard from "./LoadingCard.svelte";

    export let isSystemError = false;
    export let errorTitle;
    export let errorMessage;

    let pageLoading = true;

    onMount(() => {
        pageLoading = false;
    });
</script>

{#if !pageLoading}
<div class="survey-card">
    <div class="survey-card__header--result margin-bottom-40">
        {#if isSystemError}
            <i class="fas fa-exclamation-circle survey-card__icon survey-card__icon--primary"></i>
        {:else}
            <i class="fas fa-question-circle survey-card__icon survey-card__icon--primary"></i>
        {/if}
        <h1>{errorTitle}</h1>
        <h2>
            {@html errorMessage}
        </h2>
    </div>
    {#if !isSystemError}
        <!-- Add the proper button (session based) functionality later if the Dashboard is on the works -->
        <span class="btn btn__primary margin-bottom-60">
            <i class="fas fa-arrow-left"></i>
            <a href="#">Go to somewhere</a>
        </span>
    {:else}
        <button class="btn btn__primary" on:click={() => location.reload()}>
            <i class="fas fa-redo-alt"></i> 
            Reload the page
        </button>
    {/if}
    <p class="survey-card__description survey-card__description--centered margin-top-60">
        Kindly coordinate with your survey administrator if you think this link should be present.
    </p>
</div>
{:else}
    <LoadingCard />
{/if}