export {
  showCustomErrorMessage,
  createErrorMessageSpan,
  removeErrorMessageSpan,
  clearCustomErrorMessage,
  hasSpaces,
  isValidPhoneNumberInput,
  isValidEmail,
};

/**
 * FUNCTIONS FOR ALL VALIDATION FORMS
 */
/**
 * Show a custom error message and hide it after a timeout.
 * @param {HTMLElement} element - The error message element.
 * @param {string} message - The error message text.
 */
function showCustomErrorMessage(element, message) {
  element.textContent = message;
  element.classList.add("active");
  setTimeout(() => {
    element.classList.remove("active");
  }, 3000); // Display for 3 seconds
}

/**
 * Creates an error message span element for a form field and inserts it after the field.
 *
 * @param {HTMLFormElement} form - The form element containing the field.
 * @param {string} fieldName - The name attribute of the field.
 */
function createErrorMessageSpan(form, fieldName) {
  const errorElement = document.createElement("span");
  errorElement.className = "custom-error-message";
  errorElement.id = `${fieldName}-error`;
  form
    .querySelector(`[name="${fieldName}"]`)
    .insertAdjacentElement("afterend", errorElement);
}

/**
 * Function to remove error message span for a field.
 * @param {string} fieldName - The name attribute of the field.
 */
function removeErrorMessageSpan(fieldName) {
  const errorElement = document.getElementById(`${fieldName}-error`);
  if (errorElement) {
    errorElement.remove();
  }
}

/**
 * Clear custom error message.
 * @param {HTMLElement} element - The error message element.
 */
function clearCustomErrorMessage(element) {
  element.textContent = "";
  element.classList.remove("active");
}

/**
 * Check if a string has spaces at the beginning or end.
 * @param {string} value - The string to check.
 * @returns {boolean} - True if the string has spaces at the beginning or end, otherwise false.
 */
function hasSpaces(value) {
  return value.trim() !== value;
}

/**
 * Validate phone number using libphonenumber.
 * @param {string} phoneNumber - The phone number to validate.
 * @returns {boolean} - True if the phone number is valid, otherwise false.
 */
function isValidPhoneNumberInput(phoneNumber) {
  try {
    const parsedPhoneNumber =
      libphonenumber.parsePhoneNumberFromString(phoneNumber);
    return parsedPhoneNumber && parsedPhoneNumber.isValid();
  } catch (error) {
    return false;
  }
}

/**
 * Checks if a given string is a valid email address.
 *
 * @param {string} email - The email address to be validated.
 * @returns {boolean} - `true` if the email is valid, `false` otherwise.
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
