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