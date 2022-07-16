<script>
    export let responsesPercentage;
    export let motivatedResponsePercentage;
    export let demotivatedResponsePercentage;
</script>

<div class="dashboard-card-section--bar-graph">
    <span 
        class="dashboard__bar-line dashboard__bar-line--responses" 
        style:width="{responsesPercentage}%"
    >
        <span 
            class="dashboard__bar-line dashboard__bar-line--motivated"
            style:width="{motivatedResponsePercentage}%"
        ></span>
        <span 
            class="dashboard__bar-line dashboard__bar-line--demotivated" 
            style:width="{demotivatedResponsePercentage}%"
        ></span>
    </span>
</div>