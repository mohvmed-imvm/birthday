
// =========================
// LANGUAGE SETTING
// =========================

const LANGUAGE_KEY = "4u-language";
const WHATSAPP_NUMBER = "201040275280";
const TEMPLATE_ID = "girl-birthday";
const ORDER_STORAGE_KEY = "4u-order-" + TEMPLATE_ID;

const customizationText = document.getElementById("customizationText");
const orderNumberElement = document.getElementById("orderNumber");
const formStatus = document.getElementById("formStatus");

function getLanguage() {
    return localStorage.getItem(LANGUAGE_KEY) === "en" ? "en" : "ar";
}

function getOrderNumber() {
    let orderNumber = sessionStorage.getItem(ORDER_STORAGE_KEY);

    if (!orderNumber) {
        const date = new Date();
        const datePart = [
            date.getFullYear().toString().slice(-2),
            String(date.getMonth() + 1).padStart(2, "0"),
            String(date.getDate()).padStart(2, "0")
        ].join("");

        const randomPart = Math.random().toString(36).slice(2, 8).toUpperCase();

        orderNumber = `4U-${datePart}-${randomPart}`;
        sessionStorage.setItem(ORDER_STORAGE_KEY, orderNumber);
    }

    return orderNumber;
}

const orderNumber = getOrderNumber();

if (orderNumberElement) {
    orderNumberElement.textContent = orderNumber;
}

function getDefaultCustomization(language) {
    if (language === "en") {
        return [
            "Birthday Person: ",
            "Age: ",
            "Personal Message: ",
            "Additional Notes: "
        ].join("\n");
    }

    return [
        "صاحب عيد الميلاد: ",
        "العمر: ",
        "الرسالة الشخصية: ",
        "تفاصيل إضافية: "
    ].join("\n");
}

let lastDefaultCustomization = "";

function updateCustomizationLanguage(language) {
    if (!customizationText) return;

    const newDefault = getDefaultCustomization(language);

    // غيّر العناوين تلقائيًا فقط لو العميل لسه ماغيّرش النص
    if (
        !customizationText.value.trim() ||
        customizationText.value === lastDefaultCustomization
    ) {
        customizationText.value = newDefault;
    }

    lastDefaultCustomization = newDefault;

    customizationText.placeholder =
        customizationText.getAttribute(`data-placeholder-${language}`) || "";
}

function applyLanguage() {
    const language = getLanguage();

    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";

    document.querySelectorAll("[data-ar][data-en]").forEach((element) => {
        element.textContent = element.getAttribute(`data-${language}`);
    });

    const introText = document.querySelector(".intro-text");

    if (introText) {
        introText.textContent = "...something special is waiting u";
    }

    document.title = language === "en"
        ? "Birthday Surprise | 4U celebrations"
        : "مفاجأة عيد الميلاد | 4U celebrations";

    const closeButton = document.getElementById("closeModal");

    if (closeButton) {
        closeButton.setAttribute(
            "aria-label",
            language === "en" ? "Close" : "إغلاق"
        );
    }

    updateCustomizationLanguage(language);
}

applyLanguage();

window.addEventListener("storage", (event) => {
    if (event.key === LANGUAGE_KEY) {
        applyLanguage();
    }
});


// =========================
// SCROLL TO CUSTOMIZATION
// =========================

function scrollToCustomization() {
    closeAboutModal();

    const section = document.getElementById("customization");

    if (section) {
        section.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }
}

document.querySelectorAll("[data-scroll-customization]").forEach((button) => {
    button.addEventListener("click", (event) => {
        event.preventDefault();
        scrollToCustomization();
    });
});


// =========================
// ABOUT DEMO MODAL
// =========================

const aboutButton = document.getElementById("aboutButton");
const aboutModal = document.getElementById("aboutModal");
const closeModalButton = document.getElementById("closeModal");

let previousFocus = null;

function openAboutModal(event) {
    if (event) event.preventDefault();
    if (!aboutModal) return;

    previousFocus = document.activeElement;

    aboutModal.classList.add("active");
    aboutModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");

    if (closeModalButton) closeModalButton.focus();
}

function closeAboutModal() {
    if (!aboutModal || !aboutModal.classList.contains("active")) return;

    aboutModal.classList.remove("active");
    aboutModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");

    if (previousFocus && typeof previousFocus.focus === "function") {
        previousFocus.focus();
    }
}

if (aboutButton) {
    aboutButton.addEventListener("click", openAboutModal);
}

if (closeModalButton) {
    closeModalButton.addEventListener("click", closeAboutModal);
}

if (aboutModal) {
    aboutModal.addEventListener("click", (event) => {
        if (event.target === aboutModal) closeAboutModal();
    });
}

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeAboutModal();
});


// =========================
// 5 SECOND COUNTDOWN
// =========================

let count = 5;

const number = document.getElementById("number");
const intro = document.getElementById("intro");
const main = document.getElementById("main");
const siteHeader = document.getElementById("siteHeader");

const countdown = setInterval(() => {
    count--;

    if (count > 0) {
        if (number) {
            number.innerText = count;
            number.style.animation = "none";

            void number.offsetWidth;

            number.style.animation = "numberIn .8s ease";
        }
    } else {
        clearInterval(countdown);

        if (number) number.innerText = "♡";

        setTimeout(() => {
            if (intro) intro.classList.add("hide");
            if (main) main.classList.add("show");
            if (siteHeader) siteHeader.classList.add("visible");

            startHearts();
        }, 700);
    }
}, 1000);


// =========================
// OPEN GIFT
// =========================

function openGift() {
    const gift = document.getElementById("giftArea");

    if (!gift || gift.classList.contains("open")) return;

    gift.classList.add("open");

    const music = document.getElementById("birthdayMusic");

    if (music) {
        music.volume = 0.7;
        music.play().catch(() => {});
    }

    setTimeout(() => {
        gift.style.display = "none";

        const title = document.querySelector(".content h1");
        const subtitle = document.querySelector(".content .subtitle");
        const giftText = document.querySelector(".gift-text");
        const message = document.getElementById("message");

        if (title) title.style.display = "none";
        if (subtitle) subtitle.style.display = "none";
        if (giftText) giftText.style.display = "none";
        if (message) message.style.display = "block";

        for (let i = 0; i < 70; i++) {
            setTimeout(createHeart, i * 35);
        }
    }, 800);
}


// =========================
// FLOATING HEARTS
// =========================

function createHeart() {
    const heart = document.createElement("div");

    heart.className = "heart";

    const hearts = ["♡", "❤︎", "𝄞", "𝜗𝜚", "⋆"];

    heart.innerText = hearts[Math.floor(Math.random() * hearts.length)];
    heart.style.left = Math.random() * 100 + "vw";
    heart.style.fontSize = (15 + Math.random() * 35) + "px";
    heart.style.animationDuration = (4 + Math.random() * 5) + "s";

    document.body.appendChild(heart);

    setTimeout(() => heart.remove(), 9000);
}

function startHearts() {
    setInterval(createHeart, 650);
}


// =========================
// BUILD ORDER MESSAGE
// =========================

function getOrderMessage() {
    const language = getLanguage();
    const customerDetails = customizationText
        ? customizationText.value.trim()
        : "";

    const templateName = language === "en"
        ? "Girl Birthday Template"
        : "قالب عيد ميلاد بنت";

    const greeting = language === "en"
        ? "Hello 4U Celebrations,"
        : "أهلا 4U Celebrations,";

    const orderLabel = language === "en"
        ? "Order Number:"
        : "رقم الطلب:";

    const templateLabel = language === "en"
        ? "Template Name:"
        : "اسم القالب:";

    const detailsLabel = language === "en"
        ? "Order Details:"
        : "بيانات التخصيص:";

    return [
        greeting,
        "",
        `${orderLabel} ${orderNumber}`,
        `${templateLabel} ${templateName}`,
        "",
        detailsLabel,
        customerDetails
    ].join("\n");
}


// =========================
// COPY ORDER DETAILS
// =========================

const copyOrderButton = document.getElementById("copyOrder");

function showStatus(message, isError = false) {
    if (!formStatus) return;

    formStatus.textContent = message;
    formStatus.style.color = isError ? "#7d2148" : "#ffffff";
}

if (copyOrderButton) {
    copyOrderButton.addEventListener("click", async () => {
        const message = getOrderMessage();
        const language = getLanguage();

        try {
            await navigator.clipboard.writeText(message);

            showStatus(
                language === "en"
                    ? "Order details copied successfully."
                    : "تم نسخ بيانات الطلب بنجاح"
            );
        } catch (error) {
            // طريقة بديلة للمتصفحات التي لا تدعم Clipboard API
            const temporaryTextarea = document.createElement("textarea");

            temporaryTextarea.value = message;
            temporaryTextarea.style.position = "fixed";
            temporaryTextarea.style.opacity = "0";

            document.body.appendChild(temporaryTextarea);
            temporaryTextarea.select();

            const copied = document.execCommand("copy");
            temporaryTextarea.remove();

            showStatus(
                copied
                    ? (language === "en" ? "Order details copied." : "تم نسخ بيانات الطلب")
                    : (language === "en"
                        ? "Copy failed. Please select and copy the text manually."
                        : "النسخ لم ينجح، انسخ النص يدويًا من فضلك"),
                !copied
            );
        }
    });
}


// =========================
// SEND ORDER ON WHATSAPP
// =========================

const sendOrderButton = document.getElementById("sendOrder");

if (sendOrderButton) {
    sendOrderButton.addEventListener("click", () => {
        const language = getLanguage();
        const customerDetails = customizationText
            ? customizationText.value.trim()
            : "";

        if (!customerDetails) {
            showStatus(
                language === "en"
                    ? "Please fill in your order details first."
                    : "اكتب بيانات طلبك الأول من فضلك",
                true
            );

            if (customizationText) customizationText.focus();
            return;
        }

        const message = getOrderMessage();

        const whatsappURL =
            `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

        showStatus(
            language === "en"
                ? "WhatsApp is opening. Please review and send your message."
                : "واتساب هيفتح دلوقتي، راجع الرسالة واضغط إرسال"
        );

        window.open(whatsappURL, "_blank", "noopener,noreferrer");
    });
}
