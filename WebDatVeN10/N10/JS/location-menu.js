document.addEventListener("DOMContentLoaded", function () {
    var STORAGE_KEY = "popcornCinemaSelectedLocation";
    var LOCATIONS = [
        {
            id: "hcm",
            label: "TP.HCM",
            cinemas: [
                { id: "popcorn-hcm", label: "Popcorn Cinema" }
            ]
        },
        {
            id: "hn",
            label: "H\u00e0 N\u1ed9i",
            cinemas: [
                { id: "popcorn-hn", label: "Popcorn Cinema" }
            ]
        },
        {
            id: "dt",
            label: "\u0110\u1ed3ng Th\u00e1p",
            cinemas: [
                { id: "popcorn-dt", label: "Popcorn Cinema" }
            ]
        },
        {
            id: "dn",
            label: "\u0110\u00e0 N\u1eb5ng",
            cinemas: [
                { id: "popcorn-dn", label: "Popcorn Cinema" }
            ]
        }
    ];

    function getDefaultSelection() {
        return {
            cityId: LOCATIONS[0].id,
            cinemaId: LOCATIONS[0].cinemas[0].id
        };
    }

    function getCityById(cityId) {
        return LOCATIONS.find(function (city) {
            return city.id === cityId;
        }) || null;
    }

    function getCinemaById(city, cinemaId) {
        if (!city) {
            return null;
        }

        return city.cinemas.find(function (cinema) {
            return cinema.id === cinemaId;
        }) || null;
    }

    function normalizeSelection(selection) {
        var fallback = getDefaultSelection();
        var city = getCityById(selection && selection.cityId) || getCityById(fallback.cityId);
        var cinema = getCinemaById(city, selection && selection.cinemaId) || city.cinemas[0];

        return {
            cityId: city.id,
            cinemaId: cinema.id
        };
    }

    function readStoredSelection() {
        try {
            var rawValue = window.localStorage.getItem(STORAGE_KEY);
            if (!rawValue) {
                return getDefaultSelection();
            }

            return normalizeSelection(JSON.parse(rawValue));
        } catch (error) {
            return getDefaultSelection();
        }
    }

    function writeStoredSelection(selection) {
        try {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(selection));
        } catch (error) {
            // Ignore storage errors so the dropdown still works in restrictive browsers.
        }
    }

    function createElement(tagName, className, textContent) {
        var element = document.createElement(tagName);

        if (className) {
            element.className = className;
        }

        if (typeof textContent === "string") {
            element.textContent = textContent;
        }

        return element;
    }

    function createCityItem(city) {
        var cityItem = createElement("div", "location-item");
        var cityLabel = createElement("span", "", city.label);
        var cityArrow = createElement("span", "", "\u203a");

        cityItem.dataset.cityId = city.id;
        cityItem.setAttribute("role", "button");
        cityItem.setAttribute("tabindex", "0");
        cityItem.appendChild(cityLabel);
        cityItem.appendChild(cityArrow);

        return cityItem;
    }

    function createCinemaItem(city, cinema) {
        var cinemaItem = createElement("div", "submenu-item", cinema.label);

        cinemaItem.dataset.cityId = city.id;
        cinemaItem.dataset.cinemaId = cinema.id;
        cinemaItem.setAttribute("role", "button");
        cinemaItem.setAttribute("tabindex", "0");
        cinemaItem.title = cinema.label + " - " + city.label;

        return cinemaItem;
    }

    function buildLocationDropdown(selection) {
        var normalizedSelection = normalizeSelection(selection);
        var dropdown = createElement("div", "location-dropdown");
        var toggle = createElement("button", "location-dropdown-toggle");
        var topLabel = createElement("span", "dropdown-label-top", "Ch\u1ecdn c\u1ee5m r\u1ea1p");
        var mainLabel = createElement("span", "dropdown-label-main");
        var arrow = createElement("span", "dropdown-arrow", "\u2303");
        var menu = createElement("div", "location-dropdown-menu");
        var leftColumn = createElement("div", "location-menu-left");
        var rightColumn = createElement("div", "location-menu-right");

        dropdown.id = "locationDropdown";
        toggle.id = "dropdownToggle";
        toggle.type = "button";
        toggle.setAttribute("aria-expanded", "false");

        mainLabel.id = "selectedLocation";
        menu.id = "dropdownMenu";
        rightColumn.id = "submenuContent";

        LOCATIONS.forEach(function (city) {
            var cityItem = createCityItem(city);
            var submenuGroup = createElement("div", "submenu-group");

            submenuGroup.dataset.cityId = city.id;

            city.cinemas.forEach(function (cinema) {
                submenuGroup.appendChild(createCinemaItem(city, cinema));
            });

            leftColumn.appendChild(cityItem);
            rightColumn.appendChild(submenuGroup);
        });

        toggle.appendChild(topLabel);
        toggle.appendChild(mainLabel);
        toggle.appendChild(arrow);

        menu.appendChild(leftColumn);
        menu.appendChild(rightColumn);

        dropdown.appendChild(toggle);
        dropdown.appendChild(menu);

        applySelection(dropdown, normalizedSelection, false);

        return dropdown;
    }

    function replaceLegacyLocationControl() {
        var currentDropdown = document.getElementById("locationDropdown");
        var legacySelect = document.querySelector(".navbar .container-fluid .form-select");
        var locationControl = currentDropdown || legacySelect;

        if (!locationControl) {
            return null;
        }

        var dropdown = buildLocationDropdown(readStoredSelection());
        locationControl.replaceWith(dropdown);

        return dropdown;
    }

    function updateVisibleCity(dropdown, cityId) {
        var cityItems = dropdown.querySelectorAll(".location-item");
        var submenuGroups = dropdown.querySelectorAll(".submenu-group");

        cityItems.forEach(function (item) {
            item.classList.toggle("active", item.dataset.cityId === cityId);
        });

        submenuGroups.forEach(function (group) {
            group.classList.toggle("d-none", group.dataset.cityId !== cityId);
        });
    }

    function applySelection(dropdown, selection, shouldPersist) {
        var normalizedSelection = normalizeSelection(selection);
        var city = getCityById(normalizedSelection.cityId);
        var cinema = getCinemaById(city, normalizedSelection.cinemaId);
        var label = dropdown.querySelector("#selectedLocation");
        var cinemaItems = dropdown.querySelectorAll(".submenu-item");

        dropdown.dataset.cityId = city.id;
        dropdown.dataset.cinemaId = cinema.id;

        label.textContent = cinema.label;
        label.title = cinema.label + " - " + city.label;

        updateVisibleCity(dropdown, city.id);

        cinemaItems.forEach(function (item) {
            var isActive = item.dataset.cityId === city.id && item.dataset.cinemaId === cinema.id;
            item.classList.toggle("active", isActive);
        });

        if (shouldPersist !== false) {
            writeStoredSelection(normalizedSelection);
        }
    }

    function openDropdown(dropdown) {
        var toggle = dropdown.querySelector("#dropdownToggle");

        updateVisibleCity(dropdown, dropdown.dataset.cityId || getDefaultSelection().cityId);
        dropdown.classList.add("open");
        toggle.setAttribute("aria-expanded", "true");
    }

    function closeDropdown(dropdown) {
        var toggle = dropdown.querySelector("#dropdownToggle");

        dropdown.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
    }

    function activateCityPreview(dropdown, cityId) {
        updateVisibleCity(dropdown, cityId);
    }

    function bindAsButton(element, action) {
        element.addEventListener("click", action);
        element.addEventListener("keydown", function (event) {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                action.call(element, event);
            }
        });
    }

    function initializeLocationDropdown(dropdown) {
        var toggle = dropdown.querySelector("#dropdownToggle");
        var cityItems = dropdown.querySelectorAll(".location-item");
        var cinemaItems = dropdown.querySelectorAll(".submenu-item");

        toggle.addEventListener("click", function (event) {
            event.stopPropagation();

            if (dropdown.classList.contains("open")) {
                closeDropdown(dropdown);
            } else {
                openDropdown(dropdown);
            }
        });

        cityItems.forEach(function (item) {
            var preview = function (event) {
                if (event.type === "click") {
                    event.preventDefault();
                }

                activateCityPreview(dropdown, item.dataset.cityId);
            };

            item.addEventListener("mouseenter", preview);
            item.addEventListener("focus", preview);
            bindAsButton(item, preview);
        });

        cinemaItems.forEach(function (item) {
            bindAsButton(item, function (event) {
                event.stopPropagation();

                applySelection(dropdown, {
                    cityId: item.dataset.cityId,
                    cinemaId: item.dataset.cinemaId
                });

                closeDropdown(dropdown);
            });
        });

        document.addEventListener("click", function (event) {
            if (!dropdown.contains(event.target)) {
                closeDropdown(dropdown);
            }
        });

        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape") {
                closeDropdown(dropdown);
            }
        });
    }

    var dropdown = replaceLegacyLocationControl();

    if (!dropdown) {
        return;
    }

    initializeLocationDropdown(dropdown);
});
