<script>
    import Indicators from "../../../common_components/Indicators.svelte";
    import CreateSurveyRespondentCount from "./create_survey_components/CreateSurveyRespondentCount.svelte";
    import { getContext } from 'svelte';
    import { fade, scale } from 'svelte/transition';

    const animationSpeed = 100;

    let hideCreateModal = getContext('hideCreateModal');
</script>

<div class="create-survey-modal">
    <div class="create-survey-modal__bg" in:fade|local out:fade|local={{ delay: animationSpeed }}></div>
    
    <div 
        class="create-survey-modal__card"
        in:scale={{ delay: animationSpeed }} out:scale
    >
        <div class="create-survey-modal__header">
            <h2 class="create-survey-modal__title">Create Survey</h2>
            <button
                class="btn btn__header btn__header--close"
                on:click={hideCreateModal}
            >
                <i class="fas fa-times"></i>
                Close
            </button>
        </div>

        <!-- Create a dynamic component for this section -->
        <div class="create-survey-modal__wizard-indicator-section">
            <div class="create-survey-modal__wizard-indicator create-survey-modal__wizard-indicator--active">
                <i class="fas fa-users"></i>
                <p>No. of Respondents</p>
            </div>
           <hr>
            <div class="create-survey-modal__wizard-indicator">
                <i class="fas fa-lock"></i>
                <p>Admin Password</p>
            </div>
           <hr>
            <div class="create-survey-modal__wizard-indicator">
                <i class="fas fa-check-square"></i>
                <p>Confirmation</p>
            </div>
        </div>

        <!-- Add the other components of survey here, by which should be dynamically changed like a wizard form -->
        <CreateSurveyRespondentCount />

        <div class="survey-card__navigation">
            <button class="btn btn__navigation btn__navigation--active" >
                <i class="fas fa-angle-left"></i>
                Previous
            </button>
    
            <!-- Add proper number of wizard parts -->
            <Indicators 
                itemCount={3} 
                currentActiveIndex={1}
            />
    
            <button class="btn btn__navigation btn__navigation--inactive">
                <i class="fas fa-angle-right"></i>
                Next
            </button>
        </div>
    </div>
</div>