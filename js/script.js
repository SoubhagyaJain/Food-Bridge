const counters = document.querySelectorAll(".counter");

counters.forEach(counter => {

    const updateCounter = () => {

        const target = +counter.getAttribute("data-target");

        const current = +counter.innerText;

        const increment = target / 100;

        if(current < target){

            counter.innerText = Math.ceil(current + increment);

            setTimeout(updateCounter, 20);

        } else {

            counter.innerText = target + "+";
        }
    };

    updateCounter();
});

const reveals = document.querySelectorAll(".reveal");

function revealSections() {

    reveals.forEach((reveal) => {

        const windowHeight = window.innerHeight;
        const revealTop = reveal.getBoundingClientRect().top;
        const revealPoint = 100;

        if (revealTop < windowHeight - revealPoint) {
            reveal.classList.add("active");
        }
    });

}

window.addEventListener("scroll", revealSections);
window.addEventListener("load", revealSections);

revealSections();