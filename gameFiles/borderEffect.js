async function blinkBorder() {
    const border = document.getElementById('warningBorder');
    border.style.display = "block"
    border.classList.add('animate__animated');
    border.classList.add('animate__fadeIn');
    await sleep(200);
    border.classList.remove('animate__animated');
    border.classList.remove('animate__fadeIn');
    border.classList.add('animate__animated');
    border.classList.add('animate__fadeOut');
    await sleep(200);
    border.classList.remove('animate__animated');
    border.classList.remove('animate__fadeOut');
    border.style.display = "none"
}
