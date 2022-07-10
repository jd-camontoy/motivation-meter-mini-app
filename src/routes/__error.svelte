<script context="module">
    export function load({ error, status }) {
        console.error(error.message, error);
        return {
            props: {
                title: status,
                message: error.message
            }
        };
    }
</script>

<script>
    import ErrorView from "../common_components/ErrorView.svelte";

    export let title;
    export let message;
    
    let isSystemError = false;

    $: if (title == '404') {
        title = 'Page not found.';
        message = 'The requested page does not exist.';
    }
</script>

<ErrorView
    isSystemError={isSystemError}
    errorTitle={title}
    errorMessage={message}
/>