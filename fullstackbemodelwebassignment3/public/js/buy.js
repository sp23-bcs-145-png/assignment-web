// CART FUNCTIONALITY
const cartList = document.getElementById("cart-list");
const totalPriceEl = document.getElementById("total-price");
let cart = [];

document.querySelectorAll(".add-to-cart").forEach(btn => {
  btn.addEventListener("click", () => {
    const name = btn.dataset.package;
    const price = parseFloat(btn.dataset.price);
    cart.push({ name, price });
    renderCart();
  });
});

function renderCart() {
  cartList.innerHTML = "";
  let total = 0;

  cart.forEach(item => {
    total += item.price;
    cartList.innerHTML += `
      <li class="list-group-item d-flex justify-content-between align-items-center">
        ${item.name} <span>$${item.price}</span>
      </li>`;
  });

  totalPriceEl.textContent = total.toFixed(2);
}



// ✅ jQuery Client-Side Form Validation
$(document).ready(function () {

  // Show card section when card is selected
  $("input[name='payment']").change(function () {
    $("#card-fields").toggle($(this).val() === "card");
  });

  $("#booking-form").submit(function (e) {
    e.preventDefault();
    let valid = true;

    // Helper function
    function validateField(selector, condition, msg) {
      if (!condition) {
        $(selector).addClass("is-invalid").removeClass("is-valid");
        $(selector).next(".invalid-feedback").text(msg);
        if (valid) scrollToError(selector);
        valid = false;
      } else {
        $(selector).addClass("is-valid").removeClass("is-invalid");
      }
    }

    // Validation rules
    validateField("#name", $("#name").val().length >= 3, "At least 3 characters required.");
    validateField("#email", /.+@.+\..+/.test($("#email").val()), "Invalid email address.");
    validateField("#phone", /^[0-9]{10,}$/.test($("#phone").val()), "Phone must be at least 10 digits.");
    validateField("#address", $("#address").val() !== "", "Enter an address.");
    validateField("#city", $("#city").val() !== "", "City required.");
    validateField("#postal", /^[0-9]{4,6}$/.test($("#postal").val()), "Postal code must be 4–6 digits.");
    validateField("#country", $("#country").val() !== "", "Select a country.");

    // Payment method
    const payment = $("input[name='payment']:checked").val();
    if (!payment) {
      $("#payment-error").show();
      valid = false;
    } else {
      $("#payment-error").hide();
    }

    // Card validation only if card is selected
    if (payment === "card") {
      validateField("#card-number", /^[0-9]{16}$/.test($("#card-number").val()), "Enter 16 digits.");
      validateField("#card-expiry", $("#card-expiry").val() !== "", "Select expiry date.");
      validateField("#card-cvv", /^[0-9]{3,4}$/.test($("#card-cvv").val()), "Enter valid CVV.");
    }

    // Terms checkbox
    if (!$("#terms").is(":checked")) {
      $("#terms-error").show();
      valid = false;
    } else {
      $("#terms-error").hide();
    }

    if (valid) {
      alert("✅ Booking successfully submitted!");
      $("#booking-form")[0].reset();
      $(".is-valid").removeClass("is-valid");
      $("#card-fields").hide();
    }
  });

  function scrollToError(selector) {
    $("html, body").animate({ scrollTop: $(selector).offset().top - 120 }, 600);
  }
});
