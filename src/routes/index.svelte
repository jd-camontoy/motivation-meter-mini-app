<script>
    import MotivationQuoteSection from './home/components/MotivationQuoteSection.svelte';
    import { getContext } from 'svelte';

    let pageName = getContext('pageName');
    $pageName = 'Home';
</script>

<div class="container-main">
    <div class="header">
        <div class="header__logo">
            <h4>Welcome to</h4>
            <h2>Motivation Meter</h2>
        </div>
        <button class="btn btn__header">
            <i class="fas fa-file-alt"></i>
            Answer a survey
        </button>
    </div>

    <div class="main-content">
        <div class="home-card">
            <!-- Add create survey functionality to the button -->
            <button class="btn btn__primary">
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
        <!-- Add motivation quote section -->
        <MotivationQuoteSection />
    </div>
</div>