document.addEventListener("DOMContentLoaded", function () {
    var currentPage = window.location.pathname.split("/").pop().toLowerCase() || "home.html";
    var pageToSection = {
        "about.html": "home.html",
        "advertisingcontact.html": "home.html",
        "careers.html": "home.html",
        "cinemaregulations.html": "home.html",
        "faq.html": "home.html",
        "home.html": "home.html",
        "lichchieu.html": "lichchieu.html",
        "phimconan.html": "lichchieu.html",
        "phimdiemoi.html": "lichchieu.html",
        "phimnhabanu.html": "lichchieu.html",
        "phimrunningman.html": "lichchieu.html",
        "phimthienduongmau.html": "lichchieu.html",
        "phimtrangquynh.html": "lichchieu.html",
        "phimxusocacnguyento.html": "lichchieu.html",
        "phimyeuquai.html": "lichchieu.html",
        "privacypolicy.html": "home.html",
        "rap.html": "rap.html",
        "offers.html": "offers.html",
        "termsofservice.html": "home.html",
        "ticketbookingguide.html": "home.html",
        "login.html": "login.html"
    };

    var targetPage = pageToSection[currentPage];
    if (!targetPage) {
        return;
    }

    var navLinks = document.querySelectorAll(".navbar .nav-link[href]");
    navLinks.forEach(function (link) {
        link.classList.remove("is-active");
        if (link.getAttribute("aria-current") === "page") {
            link.removeAttribute("aria-current");
        }
    });

    navLinks.forEach(function (link) {
        var href = link.getAttribute("href");
        if (!href) {
            return;
        }

        var linkPage = href.split("/").pop().toLowerCase();
        if (linkPage === targetPage) {
            link.classList.add("is-active");
            if (link.closest(".navbar-nav") && link.closest(".navbar-nav").classList.contains("me-auto")) {
                link.setAttribute("aria-current", "page");
            }
        }
    });
});
