<script>
    export let surveyIsComplete;
    export let dashboardGeneratedAnalyticsMain;
    export let fetchedDashboardDataMain;
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
                        dashboardGeneratedAnalyticsMain.motivated.responsePercentage : '--'
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
                            dashboardGeneratedAnalyticsMain.motivated.overallPercentage : '--'
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
                        dashboardGeneratedAnalyticsMain.demotivated.responsePercentage : '--'
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
                            dashboardGeneratedAnalyticsMain.demotivated.overallPercentage : '--'
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
                            dashboardGeneratedAnalyticsMain.noResponse.percentage : '--'
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