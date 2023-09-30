import {
  createErrorMessageSpan,
  removeErrorMessageSpan,
} from "./forms-validation-functions-script.js";

import {
  fieldNames,
  formOrderService,
} from "./order-service-form-validation-script.js";

export { hideFormModal, showResponseModal };
/**
 * SCRIPT FOR MODAL WINDOW ON THE STUDIO PAGE
 */
// Get necessary elements
const orderButton = document.querySelector(".btn__order-service");
const formModalContainer = document.getElementById("modal-container");
const container = document.querySelector(".hero__container");
const submitButton = document.querySelector(".form-order-service__submit");
const header = document.querySelector(".header");
const body = document.body;

/**
 * ORDER SERVICE MODAL WINDOW
 */
/**
 * Create and append the backdrop overlay element.
 * @param {HTMLElement} container - The container element to which the backdrop should be appended.
 * @returns {HTMLElement} - The created backdrop element.
 */
function showBackdropOverlay(container) {
  const backdropOverlay = document.createElement("div");
  backdropOverlay.classList.add("hero-modals-window__backdrop--overlay");
  backdropOverlay.id = "modal-backdrop";
  container.append(backdropOverlay);

  return backdropOverlay;
}

/**
 * Function to show the modal.
 */
function showFormModal() {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "smooth",
  });

  header.classList.remove("header");

  const modalBackdrop = showBackdropOverlay(container);

  // Add error message spans dynamically
  fieldNames.forEach((fieldName) =>
    createErrorMessageSpan(formOrderService, fieldName)
  );

  formModalContainer.classList.add("active-modal-window");

  modalBackdrop.style.display = "block";

  // Check if the page is already scrolled to the top
  if (window.scrollY === 0) {
    body.style.overflow = "hidden";
  } else {
    const onScroll = () => {
      if (window.scrollY === 0) {
        body.style.overflow = "hidden";
        window.removeEventListener("scroll", onScroll);
      }
    };

    window.addEventListener("scroll", onScroll);
  }
}

/**
 * Function to hide the modal and reset errors.
 */
function hideFormModal() {
  const inputFields = formModalContainer.querySelectorAll(
    ".field__input, .field__textarea, .field__checkbox"
  );
  inputFields.forEach((input) => {
    if (!submitButton) {
      if (input.type === "checkbox") {
        input.checked = false;
      } else {
        input.value = "";
      }
    }
  });

  header.classList.add("header");

  fieldNames.forEach(removeErrorMessageSpan);

  submitButton.disabled = false;

  formModalContainer.classList.remove("active-modal-window");
  body.style.overflow = "";

  const modalBackdrop = document.getElementById("modal-backdrop");
  if (modalBackdrop) {
    modalBackdrop.remove();
  }
}

// Event listener for the order button
orderButton.addEventListener("click", showFormModal);

// Event listener for the close button
const closeButton = document.querySelector(".hero-modal-window__close");
closeButton.addEventListener("click", hideFormModal);

//////////////////////////////////////////////////////////////////////////

/**
 * ORDER SERVICE RESPONSE MODAL WINDOW
 */
/**
 * Show the response modal.
 * @param {string} title - The title of the response modal.
 * @param {string} message - The message of the response modal.
 */
function showResponseModal(title, message, hasErrors) {
  hideFormModal();

  const modalBackdrop = showBackdropOverlay(container);

  createResponseModal();
  clearResponseModalContent();
  createResponseModalContent(title, message, hasErrors);
  activateResponseModal();

  modalBackdrop.style.display = "block";
  body.style.overflow = "hidden";

  const responseModalCloseButton = document.querySelector(
    ".hero-response-modal-window__close"
  );
  responseModalCloseButton.addEventListener("click", hideResponseModal);
}

/**
 * Function to hide the response modal.
 */
function hideResponseModal() {
  const responseModalContainer = document.getElementById(
    "response-modal-container"
  );
  responseModalContainer.classList.remove("active-modal-window");

  clearResponseModalContent();

  const modalBackdrop = document.getElementById("modal-backdrop");
  if (modalBackdrop) {
    modalBackdrop.remove();
  }
}

/**
 * Create response modal and append elements.
 */
function createResponseModal() {
  const responseModal = document.createElement("div");
  responseModal.className = "hero-response-modal-window__container";
  responseModal.setAttribute("id", "response-modal-container");

  formModalContainer.after(responseModal);

  const responseModalCloseButton = document.createElement("span");
  responseModalCloseButton.className =
    "btn__close hero-response-modal-window__close";

  const responseModalContent = document.createElement("div");
  responseModalContent.className = "hero-response-modal-window__content";

  responseModal.append(responseModalCloseButton, responseModalContent);

  const responseMessage = document.createElement("div");
  responseMessage.className = "content__response-message";
  responseMessage.setAttribute("id", "response-message");

  responseModalContent.append(responseMessage);
}

/**
 * Clear the existing content of the response modal.
 */
function clearResponseModalContent() {
  const responseMessage = document.getElementById("response-message");
  responseMessage.innerHTML = "";
}

/**
 * Create and append elements to the response modal content.
 * @param {string} title - The title of the response modal.
 * @param {string} message - The message of the response modal.
 * @param {boolean} hasErrors - Indicates whether the response represents an error.
 */
function createResponseModalContent(title, message, hasErrors) {
  const responseMessage = document.getElementById("response-message");

  const imageElement = document.createElement("img");
  imageElement.className = "response-message__pic";
  if (hasErrors) {
    imageElement.src = "img/reject-symbol.png";
    imageElement.alt = "Reject symbol";
  } else {
    imageElement.src = "img/accept-symbol.png";
    imageElement.alt = "Accept symbol";
  }
  imageElement.width = "100";

  const titleElement = document.createElement("h2");
  titleElement.className = hasErrors
    ? "title response-message__title--reject"
    : "title response-message__title--accept";
  titleElement.textContent = title;

  const textElement = document.createElement("p");
  textElement.className = hasErrors
    ? "response-message__text--reject"
    : "response-message__text--accept";
  textElement.textContent = message;

  responseMessage.append(imageElement);
  responseMessage.append(titleElement);
  responseMessage.append(textElement);
}

/**
 * Activate the response modal.
 */
function activateResponseModal() {
  const responseModalContainer = document.getElementById(
    "response-modal-container"
  );
  responseModalContainer.classList.add("active-modal-window");
}
