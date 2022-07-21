<script>
    import { tweened } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';

    export let responsesPercentage;
    export let motivatedResponsePercentage;
    export let demotivatedResponsePercentage;

    const tweenSettings = {
		duration: 400,
		easing: cubicOut
	}

	const progressResponses = tweened(0, tweenSettings);
    const progressMotivatedResponse = tweened(0, tweenSettings);
    const progressDemotivatedResponse = tweened(0, tweenSettings);

    $: progressResponses.set(responsesPercentage);
    $: progressMotivatedResponse.set(motivatedResponsePercentage);
    $: progressDemotivatedResponse.set(demotivatedResponsePercentage);

</script>

<div class="dashboard-card-section--bar-graph">
    <span 
        class="dashboard__bar-line dashboard__bar-line--responses" 
        style:width="{$progressResponses}%"
    >
        <span 
            class="dashboard__bar-line dashboard__bar-line--motivated"
            style:width="{$progressMotivatedResponse}%"
        ></span>
        <span 
            class="dashboard__bar-line dashboard__bar-line--demotivated" 
            style:width="{$progressDemotivatedResponse}%"
        ></span>
    </span>
</div>