<script>
    export let text;
    let copiedToClipboard = false;

    function resetCopyStatus() {
        copiedToClipboard = false;
    }

    async function copyToClipboard() {
        await navigator.clipboard.writeText(text)
            .then(() => {
                copiedToClipboard = true;
                setTimeout(resetCopyStatus, 1000*5)
            })
            .catch((e) => console.log('Copy to clipboard unsuccessful', e));
    }
</script>

<i 
    class="fa fa-clipboard tooltipped"
    on:click={copyToClipboard}
>
    <span 
        class="tooltip"
        class:tooltip-success={copiedToClipboard}
    >
        {#if !copiedToClipboard}
            Click to copy
        {:else}
            Copied!
        {/if}
    </span>
</i>