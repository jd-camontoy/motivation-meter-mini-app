<script>
    export let surveyExpirationDatetime;
    export let surveyIsComplete;
    export let latestResponseDate;
    
    let surveyExpirationDisplayDate;
    let surveyExpirationDisplayTime;
    let surveyExpirationDatetimeObj;

    let surveyTimerLoading = true;
    let surveyEnded = false;
    let displayTimer = false;
    let expiryDescriptor = 'Survey ends on';

    let displayedTimer = {
        day: 0,
        hour: 0,
        minute: 0,
        second: 0
    };

    function addLeadingZero(num) {
        let numLength = 2;
        let pad = new Array(1 + numLength).join('0');
        return (pad + num).slice(-pad.length);
    }

    let surveyExpirationTimer = setInterval(async () => {
        timeBetweenDates(surveyExpirationDatetimeObj);
    }, 1000);

    function timeBetweenDates(toDate) {
        try {
            let now = new Date();
            let difference = toDate.getTime() - now.getTime();

            if (difference <= 0) {
                // Timer done
                clearInterval(surveyExpirationTimer);
                expiryDescriptor = 'on';
                surveyEnded = true;
            
            } else {
                let seconds = Math.floor(difference / 1000);
                let minutes = Math.floor(seconds / 60);
                let hours = Math.floor(minutes / 60);
                let days = Math.floor(hours / 24);

                hours %= 24;
                minutes %= 60;
                seconds %= 60;

                let displayedHr = addLeadingZero(hours);
                let displayedMin = addLeadingZero(minutes);
                let displayedSec = addLeadingZero(seconds);

                let hrLabel = (hours > 1) ? 'hours' : 'hour';
                let minLabel = (minutes > 1) ? 'minutes' : 'minute';
                let secLabel = (seconds > 1) ? 'seconds' : 'second';

                displayedTimer.hour = (hours > 0) ? displayedHr + ` ${hrLabel}` : '';
                displayedTimer.minute = (minutes > 0) ? displayedMin + ` ${minLabel}` : '';
                displayedTimer.second = (seconds > 0) ? displayedSec + ` ${secLabel}` : '';
            }
            displayTimer = true;
        } catch (error) {
            console.log('Something went wrong with the timer', error);
        }
    }

    function setDisplayedValues(surveyIsComplete) {
        surveyTimerLoading = true;
        let dateToDisplay;
        if (!surveyIsComplete) {
            dateToDisplay = new Date(surveyExpirationDatetime);
            surveyExpirationDatetimeObj = dateToDisplay;
            surveyExpirationTimer;
        } else {
            clearInterval(surveyExpirationTimer);
            displayTimer = false;
            dateToDisplay = new Date(latestResponseDate);
        }
        surveyExpirationDisplayDate = dateToDisplay.toLocaleString('default', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
        });
        surveyExpirationDisplayTime = dateToDisplay.toLocaleString('default', {
            timeStyle: 'short'
        });
        surveyTimerLoading = false;
    }

    $: setDisplayedValues(surveyIsComplete);
</script>

{#if !surveyTimerLoading}
<div class="dashboard__header-timer">
    {#if displayTimer}
        <h2>
            {#if surveyEnded}
                Survey ended
            {:else}
                {`${displayedTimer.hour} ${displayedTimer.minute} ${displayedTimer.second} remaining`}
            {/if}
        </h2>
        <p>{expiryDescriptor} {surveyExpirationDisplayDate} at {surveyExpirationDisplayTime}</p>
    {:else if surveyIsComplete}
        <h2>Survey completed</h2>
        <p>on {surveyExpirationDisplayDate} at {surveyExpirationDisplayTime}</p>
    {:else}
        <h2>
            <i class="fas fa-circle-notch fa-spin"></i>
        </h2>
    {/if}
</div>
{/if}