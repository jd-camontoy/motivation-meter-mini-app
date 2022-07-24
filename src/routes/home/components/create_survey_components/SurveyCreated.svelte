<script>
    import Clipboard from '../../../../common_components/Clipboard.svelte';
    import { getContext } from 'svelte';
    
    export let createdSurveyToken;
    export let surveyCreatedDatetime;

    let getHostNameAndPort = getContext('getHostNameAndPort');
    
    let currentUrlHostnamePort = getHostNameAndPort();
    let surveyUrl = currentUrlHostnamePort + '/survey/' + createdSurveyToken;

    function resetSurveyCreationModal () {
        localStorage.setItem('survey_token_login', createdSurveyToken);
        location.reload();
    }

    $: displayedSurveyCreatedDate = new Date(surveyCreatedDatetime).toLocaleString('default', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });
</script>

<div class="survey-card__header--result">
    <i class="fas fa-check-circle survey-card__icon survey-card__icon--success"></i>
    <h1>Survey sucessfully created.</h1>
</div>
<p class="create-survey-modal__description">
    Motivation Meter Survey for {displayedSurveyCreatedDate} has been created. <br/>
    You can now send this survey link to your respondents.
</p>
<div class="create-survey-modal__survey-link">
    <h2>
        <Clipboard text={surveyUrl} />
        {surveyUrl}
    </h2>
</div>
<p class="create-survey-modal__description margin-bottom-20">
    You can also start monitoring the responses for your survey.
</p>
<button 
    class="btn btn__primary btn--submit-survey margin-bottom-40"
    on:click={resetSurveyCreationModal}
>
    <i class="fas fa-sign-in-alt"></i>
    Go to Dashboard Login
</button>
<div class="note note--information">
    <i class="fas fa-info"></i>
    <strong>Note: </strong>
    Surveys are only active for 24 hours. All answers will be anonymous and only relevant statistics will be presented.
</div>