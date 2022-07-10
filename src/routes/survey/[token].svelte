<script>
    import LoadingCard from "../../common_components/LoadingCard.svelte";
    import ErrorView from "../../common_components/ErrorView.svelte";
    import SurveyEnded from "./components/SurveyEnded.svelte";
    import SurveyStart from "./components/SurveyStart.svelte";
    import SurveyProper from "./components/SurveyProper.svelte";
    import { getContext, setContext, onMount } from "svelte";
    import { getSurveyDetails } from '../../api/api';
    import { surveyStarted } from './survey_store';
    import { page } from '$app/stores';
    import { AxiosError } from "axios";

    let surveyToken = $page.params.token;
    
    let surveyLoading = true;
    let surveyTokenInvalid = false;

    let isSystemError = false;
    let errorTitle = '';
    let errorMessage = '';
    let surveyData = null;
    let displayedDate;
    let surveyEnded = false;

    let pageName = getContext('pageName');
    $pageName = 'Survey'

    onMount(async () => {
        try {
            let apiResult = await getSurveyDetails({
                token: surveyToken
            });
            if (apiResult instanceof AxiosError) {
                let apiData = apiResult.response.data;
                let consoleErrorTitle = 'No response from API';;
                if (
                    apiData != undefined &&
                    ('success' in apiData &&  apiData.success === false)
                ) {
                    let apiResponse = apiResult.response;
                    if ('status' in apiResponse && apiResponse.status === 401) {
                        consoleErrorTitle = 'Survey link already expired'
                        surveyEnded = true;
                        surveyData = apiResponse.data.survey_data;
                    } else {
                        isSystemError = false;
                        errorTitle = 'Invalid survey link.';
                        errorMessage = 'The requested page does not exist.';
                        consoleErrorTitle = 'Survey token was non existent';
                    }
                } else {
                    isSystemError = true;
                    errorTitle = 'Something went wrong.';
                    errorMessage = `
                        An unexpected error has occured.<br>
                        Please try accessing again at a later time.
                    `;
                }
                surveyTokenInvalid = true;
                console.error(consoleErrorTitle, apiResult);
            } else {
                surveyTokenInvalid = false;
                surveyData = apiResult.data;
                console.log('Survey token verification successful');
            }
        } catch (e) {
            surveyTokenInvalid = true;
            isSystemError = true;
            errorTitle = 'Something went wrong.';
            errorMessage = `
                An unexpected error has occured.<br>
                Please try accessing again at a later time.
            `;
            console.log('Something went wrong during survey verification', e);
        }
        surveyLoading = false;
    });

    $: if (surveyData !== null) {
        setContext('surveyData', surveyData);
        const date = new Date(surveyData.created_at);
        displayedDate = date.toLocaleString('default', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
        setContext('displayedDate', displayedDate);
    }

    $: errorOccured = surveyTokenInvalid === true;
</script>

{#if !surveyLoading}
    {#if !errorOccured}
        <div class="survey-card">
            {#if !$surveyStarted}
                <SurveyStart/>
            {:else}
                <SurveyProper/>
            {/if}
        </div>
    {:else if surveyEnded}
        <SurveyEnded/>
    {:else}
        <ErrorView      
            isSystemError={isSystemError}
            errorTitle={errorTitle}
            errorMessage={errorMessage}
        />
    {/if}
{:else}
    <LoadingCard pageName={$pageName} />
{/if}