<script>
    import { onMount } from "svelte";
    import Indicators from '../../../common_components/Indicators.svelte';

    const initialDisplayedMotivationalQuoteIndex = 0;
    let currentDisplayedQuoteIndex = initialDisplayedMotivationalQuoteIndex;

    let initialMotivationalQuotes = [
        {
            quote: "Strive not to be a success, but rather to be of value.",
            author: "Albert Einstein"
        },
        {
            quote: "You can never cross the ocean until you have the courage to lose sight of the shore.",
            author: "Christopher Columbus"
        },
        {
            quote: "I am not a product of my circumstances. I am a product of my decisions.",
            author: "Stephen Covey"
        }
    ];

    let motivationQuoteSectionElement;

    let doAnimation = (element, fade, direction) => {
        let animationClass = "animate__" + fade + direction;
        element.classList.add("animate__animated");
        element.classList.add(animationClass);
        element.classList.add("animate__faster");

        setTimeout(() => {
            element.classList.remove("animate__animated");
            element.classList.remove(animationClass);
            element.classList.remove("animate__faster");
        }, 500);
    };

    let changeDisplayedQuoteIndex = (element) => {
        setInterval(() => {
            doAnimation(element, 'fadeOut', 'Left');
            setTimeout(() => {
                if (currentDisplayedQuoteIndex < initialMotivationalQuotes.length - 1) {
                    currentDisplayedQuoteIndex++;
                } else {
                    currentDisplayedQuoteIndex = initialDisplayedMotivationalQuoteIndex;
                }
                doAnimation(element, 'fadeIn', 'Right');
            }, 500)
        }, 1000*10)
    }

    onMount(() => changeDisplayedQuoteIndex(motivationQuoteSectionElement));
    
</script>

<div class="motivation-quote-section">
    <div class="motivation-quote" bind:this={motivationQuoteSectionElement}>
        <h1 class="motivation-quote-section__quote">
            {initialMotivationalQuotes[currentDisplayedQuoteIndex].quote}
        </h1>
        <hr/>
        <h4 class="motivation-quote-section__author">
            {initialMotivationalQuotes[currentDisplayedQuoteIndex].author}
        </h4>
    </div>
    <Indicators itemCount={initialMotivationalQuotes.length} currentActiveIndex={currentDisplayedQuoteIndex} />
</div>