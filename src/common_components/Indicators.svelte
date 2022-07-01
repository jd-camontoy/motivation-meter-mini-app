<script>
    export let itemCount;
    export let currentActiveIndex;
</script>

<div class="survey-card__indicators">
    {#each Array(itemCount) as _, row}
        <span 
            class="survey-card__indicator"
            class:survey-card__indicator--active={row === currentActiveIndex}
            class:survey-card__indicator--inactive={row !== currentActiveIndex}
        ></span>
    {/each}
</div>