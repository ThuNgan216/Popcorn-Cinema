document.addEventListener("DOMContentLoaded", function () {
    const seats = document.querySelectorAll(".seat");
    const seatCount = document.getElementById("seatCount");
    const selectedSeatsText = document.getElementById("selectedSeatsText");
    const selectedSeatQuantity = document.getElementById("selectedSeatQuantity");
    const totalPrice = document.getElementById("totalPrice");
    const continueBtn = document.getElementById("continueBtn");

    function getSeatPrice(seat) {
        if (seat.classList.contains("sweetbox")) return 120000;
        if (seat.classList.contains("vip")) return 90000;
        return 70000;
    }

    function formatCurrency(value) {
        return value.toLocaleString("vi-VN") + " đ";
    }

    function updateBookingInfo() {
        const allSeats = document.querySelectorAll(".seat");
        const unavailableSeats = document.querySelectorAll(".seat.booked, .seat.disabled");
        const selectedSeats = document.querySelectorAll(".seat.selected");

        const totalSeats = allSeats.length;
        const remainingSeats = totalSeats - unavailableSeats.length - selectedSeats.length;

        if (seatCount) {
            seatCount.textContent = `${remainingSeats}/${totalSeats}`;
        }

        const seatCodes = [];
        let total = 0;

        selectedSeats.forEach(seat => {
            const code = seat.textContent.trim();
            seatCodes.push(code);
            total += getSeatPrice(seat);
        });

        if (selectedSeatsText) {
            selectedSeatsText.textContent = seatCodes.length > 0 ? seatCodes.join(", ") : "Chưa chọn ghế";
        }

        if (selectedSeatQuantity) {
            selectedSeatQuantity.textContent = seatCodes.length;
        }

        if (totalPrice) {
            totalPrice.textContent = formatCurrency(total);
        }

        if (continueBtn) {
            continueBtn.disabled = seatCodes.length === 0;
            continueBtn.style.opacity = seatCodes.length === 0 ? "0.6" : "1";
            continueBtn.style.cursor = seatCodes.length === 0 ? "not-allowed" : "pointer";
        }
    }

    seats.forEach(seat => {
        if (seat.classList.contains("booked") || seat.classList.contains("disabled")) return;

        seat.addEventListener("click", function () {
            this.classList.toggle("selected");
            updateBookingInfo();
        });
    });

    updateBookingInfo();
});