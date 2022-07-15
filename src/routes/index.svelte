<script>
    import LoadingCard from '../common_components/LoadingCard.svelte';
    import MotivationQuoteSection from './home/components/MotivationQuoteSection.svelte';
    import CreateSurveyModal from './home/components/CreateSurveyModal.svelte';
    import SurveyAccessModal from './home/components/SurveyAccessModal.svelte';
    import DashboardLoginForm from './home/components/DashboardLoginForm.svelte';
    import { dashboardSurveyInfo } from './dashboard/session';
    import { getContext, onMount, setContext } from 'svelte';
    import { goto } from '$app/navigation';

    let isCreateModalDisplayed = false;
    let isSurveyAccessModalDisplayed = false;
    let createdSurveyTokenInSession = false;
    let sessionChecked = false;

    let pageName = getContext('pageName');
    $pageName = 'Home';
    
    let createdSurveyToken = '';

    let hideCreateModal = () => {
        if (isCreateModalDisplayed) {
            isCreateModalDisplayed = false;
            $pageName = 'Home';
        }
    }
    setContext('hideCreateModal', hideCreateModal);

    let hideSurveyModal = () => {
        if (isSurveyAccessModalDisplayed) {
            isSurveyAccessModalDisplayed = false;
            $pageName = 'Home';
        }
    }
    setContext('hideSurveyModal', hideSurveyModal);

    onMount(() => {
        let sessionData = ($dashboardSurveyInfo != null) ? JSON.parse($dashboardSurveyInfo) : null;
        if (sessionData != null && 'token' in sessionData) {
            let dashboardUrl = '/dashboard';
            goto(dashboardUrl);
        } else {
            sessionChecked = true;
        }
        if (localStorage.getItem('survey_token_login')) {
            createdSurveyToken = localStorage.getItem('survey_token_login');
            createdSurveyTokenInSession = createdSurveyToken != null || createdSurveyToken != undefined;
        }
    });
</script>

{#if sessionChecked}
    <div class="container-main">
        <div class="header">
            <div class="header__logo">
                <h4>Welcome to</h4>
                <h2>Motivation Meter</h2>
            </div>
            <button
                class="btn btn__header"
                on:click={() => isSurveyAccessModalDisplayed = true}
            >
                <i class="fas fa-file-alt"></i>
                Answer a survey
            </button>
        </div>

        <div class="main-content">
            <div class="home-card">
                <button
                    class="btn btn__primary"
                    class:btn--create-survey={!createdSurveyTokenInSession}
                    class:btn--survey-created={createdSurveyTokenInSession}
                    on:click={() => { isCreateModalDisplayed = true }}
                >
                    <i class="fas fa-plus"></i>
                    Create a Motivation Survey
                </button>
                <div class="card__separator">
                    <hr/>
                    <p>or</p>
                    <hr/>
                </div>
                <DashboardLoginForm createdSurveyToken={createdSurveyToken}/>
            </div>
            <MotivationQuoteSection />
        </div>
    </div>
{:else}
    <LoadingCard />
{/if}


{#if isCreateModalDisplayed}
    <CreateSurveyModal createdSurveyTokenInSession={createdSurveyTokenInSession}/>
{/if}

{#if isSurveyAccessModalDisplayed}
    <SurveyAccessModal />
{/if}