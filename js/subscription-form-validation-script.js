import {
  showCustomErrorMessage,
  clearCustomErrorMessage,
  isValidEmail,
} from "./forms-validation-functions-script.js";

/**
 * SUBSCRIPTION FORM VALIDATION IN THE FOOTER
 */

/**
 * Handles the submission of the subscription form.
 *
 * @param {Event} event - The event object representing the form submission.
 */
function handleSubscriptionFormSubmission(event) {
  event.preventDefault();

  const submitButton = document.querySelector(".subscription__submit-email");
  submitButton.disabled = true;

  // Find the email input and its error element
  const emailInput = document.querySelector(".subscription__add-email");
  const emailErrorElement = document.getElementById("subscription-email-error");
  const emailValue = emailInput.value.trim();

  clearCustomErrorMessage(emailErrorElement);

  let hasErrors = false;

  if (emailValue === "") {
    showCustomErrorMessage(emailErrorElement, "You must fill in the email!");
    hasErrors = true;
  } else if (!isValidEmail(emailValue)) {
    showCustomErrorMessage(emailErrorElement, "Invalid email format!");
    hasErrors = true;
  }

  /**
   * Simulates the subscription process.
   *
   * @param {string} email - The email to be subscribed.
   */
  function simulateSubscription(email) {
    alert(`Subscribed with email: ${email}`);
    emailInput.value = "";
  }

  // If no errors, simulate subscription logic
  if (!hasErrors) {
    simulateSubscription(emailValue);
  }

  setTimeout(() => {
    submitButton.disabled = false;
  }, 3000);
}

// Event listener for the DOMContentLoaded event to initialize the subscription form.
document.addEventListener("DOMContentLoaded", function () {
  const subscriptionForm = document.querySelector(".subscription");
  subscriptionForm.addEventListener("submit", handleSubscriptionFormSubmission);
});
