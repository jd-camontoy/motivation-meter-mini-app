<script>
    import { tweened } from 'svelte/motion';
    import { cubicOut } from 'svelte/easing';
    import { getContext } from 'svelte';

    export let surveyIsComplete;
    export let dashboardGeneratedAnalyticsMain;
    export let fetchedDashboardDataMain;

    let roundNumber = getContext('roundNumber');

    const tweenSettings = {
        duration: 500,
        easing: cubicOut
    }
    
    const progressMotivationMainPercentage = tweened(0, tweenSettings);
    const progressDemotivatedMainPercentage = tweened(0, tweenSettings);
    const progressNoResponseMainPercentage = tweened(0, tweenSettings);
    const progressOverallMotivatedPercentage = tweened(0, tweenSettings);
    const progressOverallDemotivatedPercentage = tweened(0, tweenSettings);

    $: progressMotivationMainPercentage.set(dashboardGeneratedAnalyticsMain.motivated.responsePercentage);
    $: progressDemotivatedMainPercentage.set(dashboardGeneratedAnalyticsMain.demotivated.responsePercentage);
    $: progressNoResponseMainPercentage.set(dashboardGeneratedAnalyticsMain.noResponse.percentage);
    $: progressOverallMotivatedPercentage.set(dashboardGeneratedAnalyticsMain.motivated.overallPercentage);
    $: progressOverallDemotivatedPercentage.set(dashboardGeneratedAnalyticsMain.demotivated.overallPercentage);
</script>

<div
    class="dashboard-card-section--motivation-results"
    class:dashboard-card-section--motivation-results--complete={surveyIsComplete}
>
    <div class="dashboard__widget dashboard__widget--motivated">
        <span class="dashboard__widget-title dashboard__widget-title--motivated">
            Motivated
        </span>
        <div
            class="dashboard__widget-main-analytic"
            class:dashboard__widget-main-analytic--complete={surveyIsComplete}
        >
            <span class="dashboard__widget-percentage">
                {
                    (dashboardGeneratedAnalyticsMain.motivated.responsePercentage != null) ? 
                        roundNumber($progressMotivationMainPercentage) : '--'
                }
            </span>
            <div class="dashboard__widget-extra-analytic">
                <span class="dashboard__widget-extra-analytic-numbers">
                    {`${fetchedDashboardDataMain.motivatedResponseCount} of ${fetchedDashboardDataMain.currentResponseCount}`}
                </span>
                <span class="dashboard__widget-extra-analytic-noun">
                    respondent{(fetchedDashboardDataMain.currentResponseCount > 1) ? 's' : ''}
                </span>
            </div>
        </div>
        {#if !surveyIsComplete}
            <hr>
            <div class="dashboard__widget-sub-analytic">
                <span class="dashboard__widget-percentage--sub">
                    {
                        (dashboardGeneratedAnalyticsMain.motivated.overallPercentage != null) ? 
                            roundNumber($progressOverallMotivatedPercentage) : '--'
                    }
                </span>
                <div class="dashboard__widget-extra-analytic">
                    <span class="dashboard__widget-extra-analytic-numbers">
                        {`${fetchedDashboardDataMain.motivatedResponseCount} of ${fetchedDashboardDataMain.responseLimit}`}
                    </span>
                    <span class="dashboard__widget-extra-analytic-noun">recepients</span>
                </div>
            </div>
        {/if}
    </div>

    <div class="dashboard__widget dashboard__widget--demotivated">
        <span class="dashboard__widget-title dashboard__widget-title--demotivated">
            De-motivated
        </span>
        <div
            class="dashboard__widget-main-analytic"
            class:dashboard__widget-main-analytic--complete={surveyIsComplete}
        >
            <span class="dashboard__widget-percentage">
                {
                    (dashboardGeneratedAnalyticsMain.demotivated.responsePercentage != null) ? 
                        roundNumber($progressDemotivatedMainPercentage) : '--'
                }
            </span>
            <div class="dashboard__widget-extra-analytic">
                <span class="dashboard__widget-extra-analytic-numbers">
                    {`${fetchedDashboardDataMain.demotivatedResponseCount} of ${fetchedDashboardDataMain.currentResponseCount}`}
                </span>
                <span class="dashboard__widget-extra-analytic-noun">
                    respondent{(fetchedDashboardDataMain.currentResponseCount > 1) ? 's' : ''}
                </span>
            </div>
        </div>
        {#if !surveyIsComplete}
            <hr>
            <div class="dashboard__widget-sub-analytic">
                <span class="dashboard__widget-percentage--sub">
                    {
                        (dashboardGeneratedAnalyticsMain.demotivated.overallPercentage != null) ? 
                            roundNumber($progressOverallDemotivatedPercentage) : '--'
                    }
                </span>
                <div class="dashboard__widget-extra-analytic">
                    <span class="dashboard__widget-extra-analytic-numbers">
                        {`${fetchedDashboardDataMain.demotivatedResponseCount} of ${fetchedDashboardDataMain.responseLimit}`}
                    </span>
                    <span class="dashboard__widget-extra-analytic-noun">recepients</span>
                </div>
            </div>
        {/if}
    </div>

    {#if !surveyIsComplete}
        <div class="dashboard__widget dashboard__widget--no-response">
            <span class="dashboard__widget-title dashboard__widget-title--no-response">
                No response
            </span>
            <div class="dashboard__widget-main-analytic">
                <span class="dashboard__widget-percentage">
                    {
                        (dashboardGeneratedAnalyticsMain.noResponse.percentage != null) ? 
                            roundNumber($progressNoResponseMainPercentage) : '--'
                    }
                </span>
                <div class="dashboard__widget-extra-analytic dashboard__widget-extra-analytic--left">
                    <span class="dashboard__widget-extra-analytic-numbers">
                        {`${dashboardGeneratedAnalyticsMain.noResponse.count} of ${fetchedDashboardDataMain.responseLimit}`}
                    </span>
                    <span class="dashboard__widget-extra-analytic-noun">recepients</span>
                </div>
            </div>
        </div>
    {/if}
</div>