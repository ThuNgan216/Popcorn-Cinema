document.addEventListener("DOMContentLoaded", function () {
    var sourceSelect = document.querySelector(".navbar .form-select");
    if (!sourceSelect) {
        return;
    }

    var storageKeys = {
        city: "popcorn-selected-city",
        cinema: "popcorn-selected-cinema"
    };

    var cityGroups = {
        hcm: {
            label: "TP.HCM",
            cinemas: [
                "Popcorn Cinema"
            ]
        },
        hanoi: {
            label: "Ha Noi",
            cinemas: [
                "Popcorn Cinema"
            ]
        },
        dongthap: {
            label: "Dong Thap",
            cinemas: [
                "Popcorn Cinema"
            ]
        },
        danang: {
            label: "Da Nang",
            cinemas: [
                "Popcorn Cinema"
            ]
        }
    };

    var cityOrder = ["hcm", "hanoi", "dongthap", "danang"];
    var selectedCity = cityGroups[localStorage.getItem(storageKeys.city)] ? localStorage.getItem(storageKeys.city) : "hcm";
    var selectedCinema = localStorage.getItem(storageKeys.cinema) || "";
    var highlightedCity = null;
    var menu = document.createElement("div");

    if (cityGroups[selectedCity].cinemas.indexOf(selectedCinema) === -1) {
        selectedCinema = "";
        localStorage.removeItem(storageKeys.cinema);
    }

    menu.className = "location-menu";
    menu.innerHTML = [
        '<button class="location-trigger" type="button" aria-expanded="false">',
        '  <span class="location-trigger-label">Chọn cụm rạp</span>',
        '  <span class="location-trigger-value"></span>',
        "</button>",
        '<div class="location-dropdown" role="menu">',
        '  <div class="location-city-list"></div>',
        '  <div class="location-cinema-panel">',
        '    <div class="location-cinema-list"></div>',
        "  </div>",
        "</div>"
    ].join("");

    sourceSelect.parentNode.insertBefore(menu, sourceSelect);
    sourceSelect.remove();

    var trigger = menu.querySelector(".location-trigger");
    var triggerValue = menu.querySelector(".location-trigger-value");
    var dropdown = menu.querySelector(".location-dropdown");
    var cityList = menu.querySelector(".location-city-list");
    var cinemaList = menu.querySelector(".location-cinema-list");

    function isMobileView() {
        return window.matchMedia("(max-width: 991.98px)").matches;
    }

    function updateTriggerValue() {
        var cityLabel = cityGroups[selectedCity].label;
        triggerValue.textContent = selectedCinema || cityLabel;
        trigger.title = selectedCinema ? cityLabel + " - " + selectedCinema : cityLabel;
    }

    function updateCityState() {
        cityList.querySelectorAll(".location-city-item").forEach(function (item) {
            item.classList.toggle("is-active", item.dataset.cityKey === highlightedCity);
        });
    }

    function renderCinemas() {
        cinemaList.innerHTML = "";

        dropdown.classList.toggle("is-city-idle", !highlightedCity);
        if (!highlightedCity) {
            return;
        }

        var cinemas = cityGroups[highlightedCity].cinemas;

        if (!cinemas.length) {
            var emptyState = document.createElement("div");
            emptyState.className = "location-empty";
            emptyState.textContent = "Chưa có cụm rạp cho khu vực này.";
            cinemaList.appendChild(emptyState);
            return;
        }

        cinemas.forEach(function (cinemaName) {
            var cinemaButton = document.createElement("button");

            cinemaButton.className = "location-cinema-button";
            cinemaButton.type = "button";
            cinemaButton.textContent = cinemaName;
            cinemaButton.classList.toggle("is-active", highlightedCity === selectedCity && cinemaName === selectedCinema);

            cinemaButton.addEventListener("click", function () {
                selectedCity = highlightedCity;
                selectedCinema = cinemaName;
                localStorage.setItem(storageKeys.city, selectedCity);
                localStorage.setItem(storageKeys.cinema, selectedCinema);
                updateTriggerValue();
                renderCinemas();
                closeMenu();
            });

            cinemaList.appendChild(cinemaButton);
        });
    }

    function setHighlightedCity(cityKey) {
        highlightedCity = cityKey;
        updateCityState();
        renderCinemas();
    }

    function closeMenu() {
        menu.classList.remove("is-open");
        trigger.setAttribute("aria-expanded", "false");
        setHighlightedCity(null);
    }

    function openMenu() {
        menu.classList.add("is-open");
        trigger.setAttribute("aria-expanded", "true");
        setHighlightedCity(null);
    }

    cityOrder.forEach(function (cityKey) {
        var cityItem = document.createElement("div");
        var cityButton = document.createElement("button");

        cityItem.className = "location-city-item";
        cityItem.dataset.cityKey = cityKey;

        cityButton.className = "location-city-button";
        cityButton.type = "button";
        cityButton.textContent = cityGroups[cityKey].label;

        cityButton.addEventListener("mouseenter", function () {
            if (!isMobileView()) {
                setHighlightedCity(cityKey);
            }
        });

        cityButton.addEventListener("focus", function () {
            setHighlightedCity(cityKey);
        });

        cityButton.addEventListener("click", function () {
            setHighlightedCity(cityKey);

            if (isMobileView()) {
                selectedCity = cityKey;
                selectedCinema = "";
                localStorage.setItem(storageKeys.city, selectedCity);
                localStorage.removeItem(storageKeys.cinema);
                updateTriggerValue();
                renderCinemas();
            }
        });

        cityItem.appendChild(cityButton);
        cityList.appendChild(cityItem);
    });

    updateTriggerValue();
    setHighlightedCity(null);

    trigger.addEventListener("click", function (event) {
        event.preventDefault();

        if (menu.classList.contains("is-open")) {
            closeMenu();
            return;
        }

        openMenu();
    });

    dropdown.addEventListener("mouseleave", function () {
        if (!isMobileView()) {
            setHighlightedCity(null);
        }
    });

    document.addEventListener("click", function (event) {
        if (!menu.contains(event.target)) {
            closeMenu();
        }
    });

    window.addEventListener("resize", function () {
        if (!isMobileView()) {
            closeMenu();
        }
    });
});
