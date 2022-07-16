<script>
    import LoadingCard from '../../common_components/LoadingCard.svelte';
    import Clipboard from '../../common_components/Clipboard.svelte';
    import SurveyExpiryTimer from './components/SurveyExpiryTimer.svelte';
    import OverallMotivationSection from './components/OverallMotivationSection.svelte';
    import SurveyResultBarGraph from './components/SurveyResultBarGraph.svelte';
    import { fetchDashboardData } from '../../api/api';
    import { getContext, onMount } from "svelte";
    import { dashboardSurveyInfo, deleteDashboardSurveyInfo } from '../dashboard/session';
    import { goto } from '$app/navigation';
    import { AxiosError } from 'axios';

    let surveyToken;
    let surveyUrl;
    let surveyFullUrl;
    let surveyCreatedDisplayDate;
    let surveyCreatedDisplayTime;
    let surveyExpirationDatetimeObj;

    let tokenVerified = false;

    let fetchedDashboardDataMain = {
        currentResponseCount: null,
        responseLimit: null,
        motivatedResponseCount: null,
        demotivatedResponseCount: null
    }

    let dashboardGeneratedAnalyticsMain = {
        motivated: {
            responsePercentage: null,
            overallPercentage: null,
        },
        demotivated: {
            responsePercentage: null,
            overallPercentage: null,
        },
        noResponse: {
            count: null,
            percentage: null,
        },
        overallResponsePercentage: null
    }
    
    let getHostNameAndPort = getContext('getHostNameAndPort');
    let pageName = getContext('pageName');
    $pageName = 'Dashboard';

    function calculatePercentage(number, total) {
        let result = (100 * number) / total;
        return (!Number.isNaN(result)) ? result : 0;
    }

    function roundNumber(number) {
        let result = Math.round(number * 100) / 100;
        return (!Number.isNaN(result)) ? result : 0;
    }

    function validateData(rawData) {
        if (
            rawData != null &&
            (
                ('current_response_count' in rawData) ||
                ('response_limit' in rawData) ||
                ('motivated_response_count' in rawData) ||
                ('demotivated_response_count' in rawData) ||
                (('mention_count_for_keyword' in rawData) && rawData.mention_count_for_keyword === Array)
            )
        ) {
            return true;
        }
        return false;
    }

    function setDisplayedDashboardData(rawData) {
        try {
            fetchedDashboardDataMain.currentResponseCount = rawData.current_response_count;
            fetchedDashboardDataMain.responseLimit = rawData.response_limit;
            fetchedDashboardDataMain.motivatedResponseCount = rawData.motivated_response_count;
            fetchedDashboardDataMain.demotivatedResponseCount = rawData.demotivated_response_count;

            let noResponseCount = rawData.response_limit - rawData.current_response_count
            dashboardGeneratedAnalyticsMain.noResponse.count = noResponseCount;

            dashboardGeneratedAnalyticsMain.noResponse.percentage = roundNumber(calculatePercentage(noResponseCount, rawData.response_limit));

            dashboardGeneratedAnalyticsMain.motivated.responsePercentage = 
                roundNumber(calculatePercentage(rawData.motivated_response_count, rawData.current_response_count));

            dashboardGeneratedAnalyticsMain.motivated.overallPercentage = 
                roundNumber(calculatePercentage(rawData.motivated_response_count, rawData.response_limit));

            dashboardGeneratedAnalyticsMain.demotivated.responsePercentage = 
                roundNumber(calculatePercentage(rawData.demotivated_response_count, rawData.current_response_count));

            dashboardGeneratedAnalyticsMain.demotivated.overallPercentage = 
                roundNumber(calculatePercentage(rawData.demotivated_response_count, rawData.response_limit));

            dashboardGeneratedAnalyticsMain.overallResponsePercentage =
                roundNumber(calculatePercentage(rawData.current_response_count, rawData.response_limit));
        } catch (error) {
            console.error('Something went wrong while generating dashboard data', error);
        }
    }

    async function getDashboardData(surveyToken) {
        let returnData = null;
        try {
            let params = {
                token: surveyToken
            };
            let apiResult = await fetchDashboardData(params);
            if (apiResult instanceof AxiosError) {
                console.error('Something went wrong while fetching survey analytics', apiResult);
            } else {
                returnData = apiResult.data;
            }
        } catch (e) {
            console.error('Something went wrong on the brower while attempting to fetch data', e);
        }
        return returnData;
    }

    onMount(async () => {
        try {
            let surveyInfo = ($dashboardSurveyInfo != null) ? JSON.parse($dashboardSurveyInfo) : null;
            surveyToken = (surveyInfo != null && 'token' in surveyInfo) ? surveyInfo.token : null;
            if (surveyToken != null) {
                const surveyCreatedDatetimeObj = new Date(surveyInfo.created_at);
                surveyCreatedDisplayDate = surveyCreatedDatetimeObj.toLocaleString('default', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                });
                surveyCreatedDisplayTime = surveyCreatedDatetimeObj.toLocaleString('default', {
                    timeStyle: 'short'
                });

                surveyExpirationDatetimeObj = new Date(surveyInfo.expires_at);

                let hostNameAndPort = getHostNameAndPort();
                surveyUrl = '/survey/' + surveyToken;
                surveyFullUrl = hostNameAndPort + surveyUrl;

                let rawData = await getDashboardData(surveyToken);
                let validationResult = validateData(rawData);

                if (rawData != null & validationResult === true) {
                    tokenVerified = true;
                    setDisplayedDashboardData(rawData);
                } else {
                    logout();
                }
            } else {
                logout();
            }
        } catch (e) {
            console.error('Error occured during token verification', e);
            logout();
        }
    });

    //Optional: add a prompt upon logging out
    function logout() {
        deleteDashboardSurveyInfo();
        goto('/')
    }
</script>

{#if tokenVerified}
    <div class="container-main">
        <div class="header">
            <div class="header__logo header__logo--dashboard">
                <h4>Motivation Meter Survey</h4>
                <h2>Dashboard</h2>
            </div>
            <button class="btn btn__header" on:click={logout}>
                <i class="fas fa-sign-out-alt"></i>
                Logout
            </button>
        </div>

        <div class="dashboard-card">
            <div class="dashboard-card-section--header">
                <div class="dashboard__header-title-section">
                    <h2>
                        <a href={surveyUrl} target="_blank" class="tooltipped clickable">
                            /{surveyToken}
                            <span class="tooltip">
                                Click to preview survey
                            </span>
                        </a>
                        <Clipboard text={surveyFullUrl} />
                    </h2>
                    <p>Created on {surveyCreatedDisplayDate} at {surveyCreatedDisplayTime}</p>
                </div>
                <SurveyExpiryTimer surveyExpirationDatetimeObj={surveyExpirationDatetimeObj} />
            </div>

            <OverallMotivationSection
                dashboardGeneratedAnalyticsMain={dashboardGeneratedAnalyticsMain}
                fetchedDashboardDataMain={fetchedDashboardDataMain}
            />

            <SurveyResultBarGraph
                responsesPercentage={dashboardGeneratedAnalyticsMain.overallResponsePercentage}
                motivatedResponsePercentage={dashboardGeneratedAnalyticsMain.motivated.responsePercentage}
                demotivatedResponsePercentage={dashboardGeneratedAnalyticsMain.demotivated.responsePercentage}
            />

            <div class="dashboard-card-section--keyword-results margin-top-40">
                <div class="dashboard__widget dashboard__widget--keyword">
                    <span class="dashboard__widget-title dashboard__widget-title--keyword margin-right-20">
                        Salary
                    </span>

                    <div class="dashboard__widget-keyword-analytic margin-right-20">
                        <div class="dashboard__widget-keyword-analytic-title">
                            <span class="dashboard__widget-keyword-analytic-title-rank">
                                Most Mentioned
                            </span>
                            <span class="dashboard__widget-keyword-analytic-title-descriptor">
                                for motivated
                            </span>
                        </div>

                        <div class="dashboard__widget-keyword-analytic-specifics">
                            <span class="dashboard__widget-percentage">0</span>
                            <div class="dashboard__widget-extra-analytic">
                                <span class="dashboard__widget-extra-analytic-numbers">0 of 0</span>
                                <span class="dashboard__widget-extra-analytic-noun">recepients</span>
                            </div>
                        </div>
                    </div>
                    <hr>
                    <div class="dashboard__widget-keyword-analytic margin-left-20">
                        <div class="dashboard__widget-keyword-analytic-title">
                            <span class="dashboard__widget-keyword-analytic-title-rank">
                                Most Mentioned
                            </span>
                            <span class="dashboard__widget-keyword-analytic-title-descriptor">
                                for motivated
                            </span>
                        </div>

                        <div class="dashboard__widget-keyword-analytic-specifics">
                            <span class="dashboard__widget-percentage">0</span>
                            <div class="dashboard__widget-extra-analytic">
                                <span class="dashboard__widget-extra-analytic-numbers">0 of 0</span>
                                <span class="dashboard__widget-extra-analytic-noun">recepients</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="dashboard__widget dashboard__widget--keyword">
                    <span class="dashboard__widget-title dashboard__widget-title--keyword margin-right-20">
                        Management
                    </span>

                    <div class="dashboard__widget-keyword-analytic margin-right-20">
                        <div class="dashboard__widget-keyword-analytic-title">
                            <span class="dashboard__widget-keyword-analytic-title-rank">
                                Most Mentioned
                            </span>
                            <span class="dashboard__widget-keyword-analytic-title-descriptor">
                                for motivated
                            </span>
                        </div>

                        <div class="dashboard__widget-keyword-analytic-specifics">
                            <span class="dashboard__widget-percentage">0</span>
                            <div class="dashboard__widget-extra-analytic">
                                <span class="dashboard__widget-extra-analytic-numbers">0 of 0</span>
                                <span class="dashboard__widget-extra-analytic-noun">recepients</span>
                            </div>
                        </div>
                    </div>
                    <hr>
                    <div class="dashboard__widget-keyword-analytic margin-left-20">
                        <div class="dashboard__widget-keyword-analytic-title">
                            <span class="dashboard__widget-keyword-analytic-title-rank">
                                Most Mentioned
                            </span>
                            <span class="dashboard__widget-keyword-analytic-title-descriptor">
                                for motivated
                            </span>
                        </div>

                        <div class="dashboard__widget-keyword-analytic-specifics">
                            <span class="dashboard__widget-percentage">0</span>
                            <div class="dashboard__widget-extra-analytic">
                                <span class="dashboard__widget-extra-analytic-numbers">0 of 0</span>
                                <span class="dashboard__widget-extra-analytic-noun">recepients</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="dashboard__widget dashboard__widget--keyword">
                    <span class="dashboard__widget-title dashboard__widget-title--keyword margin-right-20">
                        Growth
                    </span>

                    <div class="dashboard__widget-keyword-analytic margin-right-20">
                        <div class="dashboard__widget-keyword-analytic-title">
                            <span class="dashboard__widget-keyword-analytic-title-rank">
                                Most Mentioned
                            </span>
                            <span class="dashboard__widget-keyword-analytic-title-descriptor">
                                for motivated
                            </span>
                        </div>

                        <div class="dashboard__widget-keyword-analytic-specifics">
                            <span class="dashboard__widget-percentage">0</span>
                            <div class="dashboard__widget-extra-analytic">
                                <span class="dashboard__widget-extra-analytic-numbers">0 of 0</span>
                                <span class="dashboard__widget-extra-analytic-noun">recepients</span>
                            </div>
                        </div>
                    </div>
                    <hr>
                    <div class="dashboard__widget-keyword-analytic margin-left-20">
                        <div class="dashboard__widget-keyword-analytic-title">
                            <span class="dashboard__widget-keyword-analytic-title-rank">
                                Most Mentioned
                            </span>
                            <span class="dashboard__widget-keyword-analytic-title-descriptor">
                                for motivated
                            </span>
                        </div>

                        <div class="dashboard__widget-keyword-analytic-specifics">
                            <span class="dashboard__widget-percentage">0</span>
                            <div class="dashboard__widget-extra-analytic">
                                <span class="dashboard__widget-extra-analytic-numbers">0 of 0</span>
                                <span class="dashboard__widget-extra-analytic-noun">recepients</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="dashboard__widget dashboard__widget--keyword">
                    <span class="dashboard__widget-title dashboard__widget-title--keyword margin-right-20">
                        Culture
                    </span>

                    <div class="dashboard__widget-keyword-analytic margin-right-20">
                        <div class="dashboard__widget-keyword-analytic-title">
                            <span class="dashboard__widget-keyword-analytic-title-rank">
                                Most Mentioned
                            </span>
                            <span class="dashboard__widget-keyword-analytic-title-descriptor">
                                for motivated
                            </span>
                        </div>

                        <div class="dashboard__widget-keyword-analytic-specifics">
                            <span class="dashboard__widget-percentage">0</span>
                            <div class="dashboard__widget-extra-analytic">
                                <span class="dashboard__widget-extra-analytic-numbers">0 of 0</span>
                                <span class="dashboard__widget-extra-analytic-noun">recepients</span>
                            </div>
                        </div>
                    </div>
                    <hr>
                    <div class="dashboard__widget-keyword-analytic margin-left-20">
                        <div class="dashboard__widget-keyword-analytic-title">
                            <span class="dashboard__widget-keyword-analytic-title-rank">
                                Most Mentioned
                            </span>
                            <span class="dashboard__widget-keyword-analytic-title-descriptor">
                                for motivated
                            </span>
                        </div>

                        <div class="dashboard__widget-keyword-analytic-specifics">
                            <span class="dashboard__widget-percentage">0</span>
                            <div class="dashboard__widget-extra-analytic">
                                <span class="dashboard__widget-extra-analytic-numbers">0 of 0</span>
                                <span class="dashboard__widget-extra-analytic-noun">recepients</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
        </div>
    </div>
{:else}
    <LoadingCard />
{/if}