<script>
    export let indicators;
    export let currentIndex;

    let lastIndicatorIndex = indicators.length - 1;
</script>

<!-- Add class for accomplished part later -->
<div class="create-survey-modal__wizard-indicator-section">
    {#each indicators as indicator, i}
        <div
            class="create-survey-modal__wizard-indicator"
            class:create-survey-modal__wizard-indicator--active={i === currentIndex}
        >
            <i class="fas {indicator.icon}"></i>
            <p>{indicator.title}</p>
        </div>
        {#if i < lastIndicatorIndex}
            <hr>
        {/if}
    {/each}
</div>
