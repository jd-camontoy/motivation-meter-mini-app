<script>
    export let createdSurveyToken = '';

    let dashboardLoginSurveyToken = '';

    $: if (createdSurveyToken != '') {
        dashboardLoginSurveyToken = createdSurveyToken;
    }
</script>

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