<script>
    import { getContext, onMount } from "svelte";

    export let responseCount;
    export let keywordApiData;

    let motivatedKeywordDisplayData;
    let demotivatedKeywordDisplayData;
    let displayedKeywordAnalytics;

    let dashboardLoading = true;
    let calculatePercentage = getContext('calculatePercentage');
    let roundNumber = getContext('roundNumber');

    let rankKeywords = (data, i, originalData) => {
        if (i > 0) {
            let prevKeywordData = originalData[i - 1];
            if (prevKeywordData.count === data.count) {
                data.rank = prevKeywordData.rank;
            } else {
                data.rank = i + 1;
            }
        } else {
            data.rank = 1;
        }

        return data;
    }

    onMount(() => {
        motivatedKeywordDisplayData = keywordApiData.map(({demotivated, ...data}) => {
            let percentage = ('motivated' in data) ?
                    roundNumber(calculatePercentage(data.motivated, responseCount)) : null;
            return {
                'keyword': data.keyword,
                'count': data.motivated,
                'percentage': percentage
            }
        })
        .sort((a, b) => b.count - a.count);
        motivatedKeywordDisplayData = motivatedKeywordDisplayData.map(rankKeywords);

        demotivatedKeywordDisplayData = keywordApiData.map(({motivated, ...data}) => {
            let percentage = ('demotivated' in data) ?
                    roundNumber(calculatePercentage(data.demotivated, responseCount)) : null;
            return {
                'keyword': data.keyword,
                'count': data.demotivated,
                'percentage': percentage,
                'rank': 0
            }
        })
        .sort((a, b) => b.count - a.count);
        demotivatedKeywordDisplayData = demotivatedKeywordDisplayData.map(rankKeywords);

        //Initially displayed data are the motivated ones
        displayedKeywordAnalytics = motivatedKeywordDisplayData;

        dashboardLoading = false;
    });

</script>

<div class="dashboard-card-section--header margin-top-40">
    <div class="dashboard__header-title-section">
        <h3>Keyword Ranking </h3>
        <p>for responses who seleted "Motivated"</p>
    </div>
    <div class="dashboard__header-buttons">
        <button class="btn btn__dashboard btn__dashboard--switch">
            <i class="fas fa-toggle-on"></i>
            Switch to Demotivated
        </button>
    </div>
</div>

{#if !dashboardLoading}
    <div class="dashboard-card-section--keyword-results margin-top-40">
        {#each displayedKeywordAnalytics as keywordData}    
            <div class="dashboard__widget dashboard__widget--keyword">
                <div class="dashboard__widget-rank-and-title">
                    <h3 class="dashboard__widget-rank">{keywordData.rank}</h3>
                    <span class="dashboard__widget-title dashboard__widget-title--keyword margin-right-20">
                        {keywordData.keyword}
                    </span>
                </div>

                <div class="dashboard__widget-keyword-analytic">
                    <div class="dashboard__widget-keyword-analytic-specifics">
                        <span class="dashboard__widget-percentage">{keywordData.percentage}</span>
                        <div class="dashboard__widget-extra-analytic">
                            <span class="dashboard__widget-extra-analytic-numbers">{`${keywordData.count} of ${responseCount}`}</span>
                            <span class="dashboard__widget-extra-analytic-noun">mentions for motivated</span>
                        </div>
                    </div>
                </div>
            </div>
        {/each}
    </div>
{/if}