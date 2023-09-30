import {
  showCustomErrorMessage,
  clearCustomErrorMessage,
  hasSpaces,
  isValidPhoneNumberInput,
  isValidEmail,
} from "./forms-validation-functions-script.js";
import { showResponseModal } from "./modal-window-script.js";

export { formOrderService, customErrorMessages, fieldNames };

/**
 *  ORDER SERVICE FORM VALIDATION
 */
// Get necessary elements
const formOrderService = document.querySelector(".form-order-service");
const customErrorMessages = document.querySelectorAll(".custom-error-message");
const submitButton = document.querySelector(".form-order-service__submit");
const fieldNames = ["name", "phone", "email", "comment", "terms"];

/**
 * Validate the form and handle submission.
 * @param {Event} event - The form submission event.
 */
function handleFormOrderServiceSubmission(event) {
  event.preventDefault();

  submitButton.disabled = true;

  customErrorMessages.forEach(clearCustomErrorMessage);

  let hasErrors = false;

  formOrderService.querySelectorAll(".field__input").forEach((input) => {
    const fieldName = input.getAttribute("name");
    const errorElement = document.getElementById(`${fieldName}-error`);

    const maxLineLength = 256;
    if (input.value.length > maxLineLength) {
      input.value = input.value.slice(0, maxLineLength);
    }

    if (input.value.trim() === "") {
      showCustomErrorMessage(errorElement, `You must fill ${fieldName}!`);
      hasErrors = true;
    } else {
      if (hasSpaces(input.value)) {
        showCustomErrorMessage(
          errorElement,
          `There must not be a space at the beginning or end of ${fieldName}!`
        );
        hasErrors = true;
      }

      if (fieldName === "name") {
        const firstLetter = input.value[0];
        if (!/[A-Z]/.test(firstLetter)) {
          showCustomErrorMessage(
            errorElement,
            `Name must start with a capital letter!`
          );

          const latinPattern = /^[A-Za-z]*$/;
          if (!latinPattern.test(input.value)) {
            showCustomErrorMessage(
              errorElement,
              `The name must be written in Latin!`
            );
            hasErrors = true;
          }

          hasErrors = true;
        }
      } else if (fieldName === "phone") {
        const phoneNumber = input.value;
        const isValidPhoneNumber = isValidPhoneNumberInput(phoneNumber);

        if (!isValidPhoneNumber) {
          showCustomErrorMessage(errorElement, `Invalid phone number format!`);
          hasErrors = true;
        }
      } else if (fieldName === "email") {
        if (!isValidEmail(input.value.trim())) {
          showCustomErrorMessage(errorElement, `Invalid email format!`);
          hasErrors = true;
        }
      }
    }
  });

  // Textarea field
  const textarea = formOrderService.querySelector(".field__textarea");
  const textareaErrorElement = document.getElementById("comment-error");

  if (textarea.value.trim() === "") {
    showCustomErrorMessage(
      textareaErrorElement,
      "You must fill in the comment!"
    );
    hasErrors = true;
  } else {
    if (hasSpaces(textarea.value)) {
      showCustomErrorMessage(
        textareaErrorElement,
        "There must not be a space at the beginning or end of the comment!"
      );
      hasErrors = true;
    } else {
      const nonLatinPattern = /[\u0250-\ue007]/g;
      if (nonLatinPattern.test(textarea.value)) {
        showCustomErrorMessage(
          textareaErrorElement,
          "The comment must contain only Latin letters, numbers, and special characters!"
        );
        hasErrors = true;
      } else {
        clearCustomErrorMessage(textareaErrorElement);
      }
    }
  }

  if (hasErrors) {
    textareaErrorElement.style.top = "95%";
  }

  // Checkbox
  const termsCheckbox = document.getElementById("terms");
  const termsErrorElement = document.getElementById("terms-error");
  if (!termsCheckbox.checked) {
    showCustomErrorMessage(termsErrorElement, `You must accept!`);
    hasErrors = true;
  } else {
    clearCustomErrorMessage(termsErrorElement);
  }

  if (hasErrors) {
    termsErrorElement.style.left = "unset";
    termsErrorElement.style.right = "0";
    termsErrorElement.style.top = "150%";
  }

  setTimeout(() => {
    submitButton.disabled = false;
  }, 3000);

  if (!hasErrors) {
    // Submit form using AJAX
    fetch("../php/process_order_service_form.php", {
      method: "POST",
      body: new FormData(formOrderService),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `Network response was not ok: ${response.statusText}`
          );
        }
        return response.json();
      })
      .then((data) => {
        if (data.success) {
          // Form submitted successfully
          showResponseModal(
            "Congratulations!",
            "You have successfully placed an order for services! You will be contacted shortly at the specified phone number or email, so we advise you to track them.",
            false
          );
        } else {
          // Form submission failed
          console.error("Form submission error:", data.message);
          showResponseModal(
            "Error",
            data.message || "Form submission failed. Please try again later.",
            true
          );
        }
      })
      .catch((error) => {
        console.error("AJAX error:", error);
        showResponseModal(
          "Error",
          "An error occurred. Please try again later.",
          true
        );
      });
  }
}

/**
 * Attach event listener to the field text in checkbox
 * to prevent text selection ONLY after a double click
 */
const checkboxText = document.querySelector('.field__text[for="terms"]');
checkboxText.addEventListener(
  "mousedown",
  (event) => {
    if (event.detail > 1) {
      event.preventDefault();
    }
  },
  false
);

// Event listener for form submission
formOrderService.addEventListener("submit", handleFormOrderServiceSubmission);
