<script>
    import LoadingCard from '../../common_components/LoadingCard.svelte';
    import Clipboard from '../../common_components/Clipboard.svelte';
    import { getContext, onMount } from "svelte";
    import { dashboardSurveyInfo, deleteDashboardSurveyInfo } from '../dashboard/session';
    import { goto } from '$app/navigation';

    let surveyToken;
    let surveyUrl;
    let surveyFullUrl;
    let surveyCreatedDisplayDate;
    let surveyCreatedDisplayTime;

    let tokenVerified = false;
    
    let getHostNameAndPort = getContext('getHostNameAndPort');
    let pageName = getContext('pageName');
    $pageName = 'Dashboard';

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

                let hostNameAndPort = getHostNameAndPort();
                surveyUrl = '/survey/' + surveyToken;
                surveyFullUrl = hostNameAndPort + surveyUrl;

                tokenVerified = true;
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
            </div>

            <div class="dashboard-card-section--motivation-results">
                <div class="dashboard__widget dashboard__widget--motivated">
                    <span class="dashboard__widget-title dashboard__widget-title--motivated">
                        Motivated
                    </span>
                    <div class="dashboard__widget-main-analytic">
                        <span class="dashboard__widget-percentage">0</span>
                        <div class="dashboard__widget-extra-analytic">
                            <span class="dashboard__widget-extra-analytic-numbers">0 of 0</span>
                            <span class="dashboard__widget-extra-analytic-noun">recepients</span>
                        </div>
                    </div>
                    <hr>
                    <div class="dashboard__widget-sub-analytic">
                        <span class="dashboard__widget-percentage--sub">0</span>
                        <div class="dashboard__widget-extra-analytic">
                            <span class="dashboard__widget-extra-analytic-numbers">0 of 0</span>
                            <span class="dashboard__widget-extra-analytic-noun">recepients</span>
                        </div>
                    </div>
                </div>

                <div class="dashboard__widget dashboard__widget--demotivated">
                    <span class="dashboard__widget-title dashboard__widget-title--demotivated">
                        De-motivated
                    </span>
                    <div class="dashboard__widget-main-analytic">
                        <span class="dashboard__widget-percentage">0</span>
                        <div class="dashboard__widget-extra-analytic">
                            <span class="dashboard__widget-extra-analytic-numbers">0 of 0</span>
                            <span class="dashboard__widget-extra-analytic-noun">recepients</span>
                        </div>
                    </div>
                    <hr>
                    <div class="dashboard__widget-sub-analytic">
                        <span class="dashboard__widget-percentage--sub">0</span>
                        <div class="dashboard__widget-extra-analytic">
                            <span class="dashboard__widget-extra-analytic-numbers">0 of 0</span>
                            <span class="dashboard__widget-extra-analytic-noun">recepients</span>
                        </div>
                    </div>
                </div>

                <div class="dashboard__widget dashboard__widget--no-response">
                    <span class="dashboard__widget-title dashboard__widget-title--no-response">
                        No response
                    </span>
                    <div class="dashboard__widget-main-analytic">
                        <span class="dashboard__widget-percentage">0</span>
                        <div class="dashboard__widget-extra-analytic dashboard__widget-extra-analytic--left">
                            <span class="dashboard__widget-extra-analytic-numbers">0 of 0</span>
                            <span class="dashboard__widget-extra-analytic-noun">recepients</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="dashboard-card-section--bar-graph">
                <span class="dashboard__bar-line dashboard__bar-line--responses">
                    <span class="dashboard__bar-line dashboard__bar-line--motivated" length=""></span>
                    <span class="dashboard__bar-line dashboard__bar-line--demotivated" length=""></span>
                </span>
            </div>

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