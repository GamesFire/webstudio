import {
  createErrorMessageSpan,
  removeErrorMessageSpan,
  showCustomErrorMessage,
  clearCustomErrorMessage,
  hasSpaces,
  isValidEmail,
} from "./forms-validation-functions-script.js";

export { formContactUs, customErrorMessages };

/**
 * ORDER SERVICE FORM VALIDATION
 */
// Get necessary elements
const formContactUs = document.querySelector(".form-contact-us");
const customErrorMessages = document.querySelectorAll(".custom-error-message");
const submitButton = document.querySelector(".form-contact-us__submit");
const fieldNames = ["name", "email", "comment"];

/**
 * Creates a response message element and appends it to the body.
 *
 * @param {string} message - The message to display in the response element.
 * @param {boolean} isSuccess - Indicates whether the message represents a success (true) or an error (false).
 */
function createResponseMessage(message, isSuccess) {
  const responseMessageElement = document.createElement("div");
  responseMessageElement.className = isSuccess
    ? "response-message success"
    : "response-message error";
  responseMessageElement.textContent = message;
  document.body.append(responseMessageElement);

  setTimeout(() => {
    responseMessageElement.remove();
  }, 5000);
}

/**
 * Displays a response message on the page, either as a success or an error message.
 *
 * @param {string} message - The message to display in the response element.
 * @param {boolean} isSuccess - Indicates whether the message represents a success (true) or an error (false).
 */
function showResponseMessage(message, isSuccess) {
  createResponseMessage(message, isSuccess);
}

/**
 * Validate the form and handle submission.
 * @param {Event} event - The form submission event.
 */
function handleFormContactUsSubmission(event) {
  event.preventDefault();

  submitButton.disabled = true;

  customErrorMessages.forEach(clearCustomErrorMessage);

  let hasErrors = false;

  formContactUs.querySelectorAll(".field__input").forEach((input) => {
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
      } else if (fieldName === "email") {
        if (!isValidEmail(input.value.trim())) {
          showCustomErrorMessage(errorElement, `Invalid email format!`);
          hasErrors = true;
        }
      }
    }
  });

  const textarea = formContactUs.querySelector(".field__textarea");
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

  setTimeout(() => {
    submitButton.disabled = false;
  }, 3000);

  if (!hasErrors) {
    // Submit form using AJAX
    fetch("../php/process_contact_us_form.php", {
      method: "POST",
      body: new FormData(formContactUs),
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
          showResponseMessage(
            "You have successfully submitted your form to the support team. Thank you for contacting us!",
            true
          );

          formContactUs.reset();
        } else {
          // Form submission failed
          console.error("Form submission error:", data.message);
          showResponseMessage(
            data.message || "Form submission failed. Please try again later.",
            false
          );
        }
      })
      .catch((error) => {
        console.error("AJAX error:", error);
        showResponseMessage(
          "An error occurred. Please try again later.",
          false
        );
      });
  }
}

// Event listener for form submission
formContactUs.addEventListener("submit", handleFormContactUsSubmission);

// Event listener for the DOMContentLoaded event to initialize error message elements
document.addEventListener("DOMContentLoaded", () => {
  fieldNames.forEach((fieldName) =>
    createErrorMessageSpan(formContactUs, fieldName)
  );
});

// Add event listener to remove error message spans when leaving the page
window.addEventListener("beforeunload", () => {
  fieldNames.forEach((fieldName) => {
    removeErrorMessageSpan(fieldName);
  });
});
