<script>
    import { getContext } from "svelte";
    import { fly } from "svelte/transition";

    export let responseCount;
    export let keywordApiData;
    export let fetchedDashboardData;

    let motivatedKeywordDisplayData;
    let demotivatedKeywordDisplayData;
    let displayedKeywordAnalytics;
    let responseCountDisplayedData;

    
    //Initially displayed data are the responses from "Motivated"
    let selectedMotivationTypeKeyword = 'Motivated';
    let displayedDataAreFromMotivated = true;

    let dashboardLoading = true;
    let calculatePercentage = getContext('calculatePercentage');
    let roundNumber = getContext('roundNumber');

    let rankKeywords = (data, i, originalData) => {
        if (i > 0) {
            let prevKeywordData = originalData[i - 1];
            if (prevKeywordData.count === data.count) {
                data.rank = prevKeywordData.rank;
            } else {
                data.rank = prevKeywordData.rank + 1;
            }
        } else {
            data.rank = 1;
        }

        return data;
    }

    let initializeDisplayedData = () => {
        displayedKeywordAnalytics = (displayedDataAreFromMotivated) ?
            motivatedKeywordDisplayData : demotivatedKeywordDisplayData;
            
        responseCountDisplayedData = (displayedDataAreFromMotivated) ?
            fetchedDashboardData.motivatedResponseCount : fetchedDashboardData.demotivatedResponseCount;

        selectedMotivationTypeKeyword = (displayedDataAreFromMotivated) ? 'Motivated' : 'Demotivated';
    }

    async function setDisplayedKeywordData(keywordApiData) {
        dashboardLoading = true;

        motivatedKeywordDisplayData = keywordApiData.map(({demotivated, ...data}) => {
            let percentage = ('motivated' in data) ?
                    roundNumber(calculatePercentage(data.motivated, responseCount)) : null;
            return {
                'keyword': data.keyword,
                'count': data.motivated,
                'percentage': percentage,
                'rank': 0
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

        await Promise.resolve().then(initializeDisplayedData);

        dashboardLoading = false;
    }

    $: setDisplayedKeywordData(keywordApiData);

</script>

<div class="dashboard-card-section--header margin-top-40">
    <div class="dashboard__header-title-section">
        <h3>Keyword Ranking </h3>
        <p>for responses who answered as "{selectedMotivationTypeKeyword}"</p>
    </div>
    <div class="dashboard__header-buttons">
        <button
            class="btn btn__dashboard btn__dashboard--switch"
            on:click={() => {
                displayedDataAreFromMotivated = !displayedDataAreFromMotivated;
                initializeDisplayedData();
            }}
        >
            <i class="fas fa-exchange-alt"></i>
            {#if displayedDataAreFromMotivated}
                Switch to Demotivated
            {:else}
                Switch to Motivated
            {/if}
        </button>
    </div>
</div>

{#if !dashboardLoading}
    <div class="dashboard-card-section--keyword-results margin-top-40">
        {#each displayedKeywordAnalytics as keywordData, index (keywordData)}    
            <div 
                class="dashboard__widget dashboard__widget--keyword"
                in:fly="{{ y: 30, duration: 200, delay: 100 * index }}"
            >
                <div class="dashboard__widget-rank-and-title">
                    <h3 class="dashboard__widget-rank">
                    {#if responseCountDisplayedData > 0}
                        {keywordData.rank}
                    {:else}
                        &#8226;
                    {/if}
                    </h3>
                    <span class="dashboard__widget-title dashboard__widget-title--keyword margin-right-20">
                        {keywordData.keyword}
                    </span>
                </div>

                <div class="dashboard__widget-keyword-analytic">
                    <div class="dashboard__widget-keyword-analytic-specifics">
                        <span class="dashboard__widget-percentage">{keywordData.percentage}</span>
                        <div class="dashboard__widget-extra-analytic">
                            {#if keywordData.count > 0}
                                <span class="dashboard__widget-extra-analytic-numbers">{`${keywordData.count} of ${responseCount} `}mentions</span>
                                <span class="dashboard__widget-extra-analytic-noun">for {selectedMotivationTypeKeyword.toLowerCase()}</span>
                            {:else}
                                <span class="dashboard__widget-extra-analytic-numbers">No mentions</span>
                                <span class="dashboard__widget-extra-analytic-noun">for {selectedMotivationTypeKeyword.toLowerCase()}</span>
                            {/if}
                        </div>
                    </div>
                </div>
            </div>
        {/each}
    </div>
{/if}