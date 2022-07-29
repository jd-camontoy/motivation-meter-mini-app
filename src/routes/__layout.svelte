<script>
	import '../app.scss';
    import { setContext } from 'svelte';
    import { writable } from 'svelte/store';

    const bgVideoUrl = 'https://storage.cloud.google.com/newdevprjct-jdlbc/bg.webm?authuser=3';

    let pageName = writable('Loading...');
    setContext('pageName', pageName);

    let getHostNameAndPort = () => {
        try {
            let currentUrlHostnameProtocolPort = window.location.href;
            let currentUrlProtocol = currentUrlHostnameProtocolPort.toString().split(window.location.host)[0];
            let currentUrlHostnamePort = currentUrlHostnameProtocolPort.toString().split(currentUrlProtocol)[1];
            currentUrlHostnamePort = currentUrlHostnamePort.toString().split('/')[0];
            return currentUrlHostnamePort;
        } catch (e) {
            console.error('Something went wrong while fetching the hostname and port.'. e);
        }
    }
    setContext('getHostNameAndPort', getHostNameAndPort);
</script>

<svelte:head>
	<link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Fira+Sans:wght@400;500;700&display=swap" rel="stylesheet">
    <script src="https://kit.fontawesome.com/635d2a8139.js" crossorigin="anonymous"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css"/>
    <title>{$pageName} - Motivation Meter Mini</title>
</svelte:head>

<div class="container">
    <video class="bg-video" autoplay loop muted>
        <source src={bgVideoUrl} type="video/webm">
        <p>Sorry, your browser doesn't support embedded videos.</p>
    </video>

    <slot></slot>
</div>