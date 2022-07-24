export let doAnimation = (element, fade, direction) => {
    let animationClass = "animate__" + fade + direction;
    element.classList.add("animate__animated");
    element.classList.add(animationClass);
    element.classList.add("animate__faster");

    setTimeout(() => {
        element.classList.remove("animate__animated");
        element.classList.remove(animationClass);
        element.classList.remove("animate__faster");
    }, 500);
}

export let togglePasswordValueDisplay = (event) => {
    const TYPE_PASSWORD = 'password';
    const TYPE_TEXT = 'text';

    let mainElement = event.target;
    let inputElement = mainElement.previousElementSibling;
    let currentInputType = inputElement.getAttribute("type");

    if (currentInputType === TYPE_PASSWORD) {
        inputElement.setAttribute("type", TYPE_TEXT);
        mainElement.classList.remove("fa-eye");
        mainElement.classList.add("fa-eye-slash");
    } else if (currentInputType === TYPE_TEXT) {
        inputElement.setAttribute("type", TYPE_PASSWORD);
        mainElement.classList.remove("fa-eye-slash");
        mainElement.classList.add("fa-eye");
    }
}