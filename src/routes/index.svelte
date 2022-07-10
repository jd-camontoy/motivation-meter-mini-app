<script>
    import MotivationQuoteSection from './home/components/MotivationQuoteSection.svelte';
    import CreateSurveyModal from './home/components/CreateSurveyModal.svelte';
    import SurveyAccessModal from './home/components/SurveyAccessModal.svelte';
    import { getContext, onMount, setContext } from 'svelte';

    let isCreateModalDisplayed = false;
    let isSurveyAccessModalDisplayed = false;
    let createdSurveyTokenInSession = false;

    let pageName = getContext('pageName');
    $pageName = 'Home';
    
    let dashboardLoginSurveyToken = '';

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
        if (localStorage.getItem('survey_token_login')) {
            dashboardLoginSurveyToken = localStorage.getItem('survey_token_login');
            createdSurveyTokenInSession = dashboardLoginSurveyToken != null || dashboardLoginSurveyToken != undefined;
        }
    });
</script>

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

            <!-- Add error message div -->
            <!-- Add information message div -->

            <!-- Add form functionality -->
            <form class="form__dashboard-login">
                <input
                    bind:value={dashboardLoginSurveyToken}
                    type="text"
                    class="form__input form__input--survey-id"
                    placeholder="Enter provided Survey ID"
                />
                <!-- Add eye feature -->
                <div class="form__group form__input--dashboard-password">
                    <input 
                        type="password"
                        placeholder="Enter registered password"
                    >
                    <i 
                        class="fas fa-eye cursor--pointer"
                    ></i>
                </div>
                <button class="btn btn__primary btn--create-survey">
                    <i class="fas fa-sign-in-alt"></i>
                    Login and Manage Survey
                </button>
            </form>
        </div>
        <MotivationQuoteSection />
    </div>
</div>

{#if isCreateModalDisplayed}
    <CreateSurveyModal createdSurveyTokenInSession={createdSurveyTokenInSession}/>
{/if}

{#if isSurveyAccessModalDisplayed}
    <SurveyAccessModal />
{/if}