/* =========================
   LANGUAGE SETTINGS
========================= */

function applyLanguage() {
    const savedLanguage = localStorage.getItem("4u-language");
    const language = savedLanguage === "en" ? "en" : "ar";

    // Set page language and direction
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";

    // Translate every element that has Arabic and English text
    document.querySelectorAll("[data-ar][data-en]").forEach((element) => {
        element.textContent = element.getAttribute(`data-${language}`);
    });

    // Keep the countdown intro in English in both languages
    const introText = document.querySelector(".intro-text");

    if (introText) {
        introText.textContent = "...something special is waiting u";
    }

    // Update the browser tab title
    document.title = language === "en"
        ? "Birthday Surprise | 4U celebrations"
        : "مفاجأة عيد الميلاد | 4U celebrations";

    // Update the WhatsApp order message
    const orderButton = document.getElementById("orderButton");

    if (orderButton) {
        const message = language === "en"
            ? "Hello 4U, I would like to order a gift website design"
            : "أهلا 4U عايز أطلب تصميم هدية";

        orderButton.href =
            "https://wa.me/201040275280?text=" +
            encodeURIComponent(message);
    }

    // Update the close button's accessible label
    const closeButton = document.getElementById("closeModal");

    if (closeButton) {
        closeButton.setAttribute(
            "aria-label",
            language === "en" ? "Close" : "إغلاق"
        );
    }
}


// Apply the saved language when the page opens
applyLanguage();


// Listen for language changes made in another tab
window.addEventListener("storage", (event) => {
    if (event.key === "4u-language") {
        applyLanguage();
    }
});


/* =========================
   ABOUT DEMO MODAL
========================= */

const aboutButton = document.getElementById("aboutButton");
const aboutModal = document.getElementById("aboutModal");
const closeModalButton = document.getElementById("closeModal");
const modalOrderButton = document.getElementById("modalOrderButton");

let previousFocus = null;


// Open the modal
function openAboutModal(event) {
    if (event) {
        event.preventDefault();
    }

    if (!aboutModal) {
        return;
    }

    previousFocus = document.activeElement;

    aboutModal.classList.add("active");
    aboutModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");

    // Move focus to the close button
    if (closeModalButton) {
        closeModalButton.focus();
    }
}


// Close the modal
function closeAboutModal() {
    if (!aboutModal || !aboutModal.classList.contains("active")) {
        return;
    }

    aboutModal.classList.remove("active");
    aboutModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");

    // Return focus to the element that opened the modal
    if (previousFocus && typeof previousFocus.focus === "function") {
        previousFocus.focus();
    }
}


// Open from the navigation menu
if (aboutButton) {
    aboutButton.addEventListener("click", openAboutModal);
}


// Close using the X button
if (closeModalButton) {
    closeModalButton.addEventListener("click", closeAboutModal);
}


// Close by clicking the dark background outside the modal
if (aboutModal) {
    aboutModal.addEventListener("click", (event) => {
        if (event.target === aboutModal) {
            closeAboutModal();
        }
    });
}


// Close using the Escape key
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeAboutModal();
    }
});


// Go to the order section from inside the modal
if (modalOrderButton) {
    modalOrderButton.addEventListener("click", () => {
        closeAboutModal();

        const orderSection = document.getElementById("order");

        if (orderSection) {
            orderSection.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
        }
    });
}


/* =========================
   5 SECOND COUNTDOWN
   Always stays in English
========================= */

let count = 5;

const number = document.getElementById("number");
const intro = document.getElementById("intro");
const main = document.getElementById("main");
const siteHeader = document.getElementById("siteHeader");

const countdown = setInterval(() => {
    count--;

    if (count > 0) {
        number.innerText = count;

        // Restart the number animation
        number.style.animation = "none";

        void number.offsetWidth;

        number.style.animation = "numberIn .8s ease";
    } else {
        clearInterval(countdown);

        number.innerText = "♡";

        setTimeout(() => {
            intro.classList.add("hide");
            main.classList.add("show");

            // Show the website menu
            siteHeader.classList.add("visible");

            startHearts();
        }, 700);
    }
}, 1000);


/* =========================
   OPEN GIFT
========================= */

function openGift() {
    const gift = document.getElementById("giftArea");

    // Prevent repeated clicks
    if (gift.classList.contains("open")) {
        return;
    }

    gift.classList.add("open");

    // Play birthday music
    const music = document.getElementById("birthdayMusic");

    music.volume = 0.7;
    music.play().catch(() => {});

    // Wait for the lid to open
    setTimeout(() => {
        gift.style.display = "none";

        document.querySelector("h1").style.display = "none";
        document.querySelector(".subtitle").style.display = "none";
        document.querySelector(".gift-text").style.display = "none";

        document.getElementById("message").style.display = "block";

        // Heart burst
        for (let i = 0; i < 70; i++) {
            setTimeout(createHeart, i * 35);
        }
    }, 800);
}


/* =========================
   CREATE HEART
========================= */

function createHeart() {
    const heart = document.createElement("div");

    heart.className = "heart";

    const hearts = [
        "♡",
        "❤︎",
        "𝄞",
        "𝜗𝜚",
        "⋆"
    ];

    heart.innerText =
        hearts[Math.floor(Math.random() * hearts.length)];

    heart.style.left = Math.random() * 100 + "vw";

    heart.style.fontSize =
        (15 + Math.random() * 35) + "px";

    heart.style.animationDuration =
        (4 + Math.random() * 5) + "s";

    document.body.appendChild(heart);

    setTimeout(() => {
        heart.remove();
    }, 9000);
}


/* =========================
   CONTINUOUS HEARTS
========================= */

function startHearts() {
    setInterval(createHeart, 650);
}
