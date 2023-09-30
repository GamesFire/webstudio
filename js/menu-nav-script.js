/**
 * NAVIGATION MENU MANIPULATION
 */
/**
 * TABLET, LAPTOP AND COMPUTER MENU
 */
// Get necessary elements
const menuNav = document.querySelector(".menu-nav");
const targetClassName = "menu-nav__active--link";

/**
 * Sets the active class on the menu navigation link that matches the provided URL.
 *
 * @param {string} url - The URL of the page to mark as active.
 */
function setMenuNavActiveLink(url) {
  const links = menuNav.querySelectorAll(".menu-nav__link");
  links.forEach((link) => {
    if (link.href === url) {
      link.classList.add(targetClassName);
    } else {
      link.classList.remove(targetClassName);
    }
  });
}

/**
 * Handles navigation menu interactions, setting the active link on click.
 *
 * @param {Event} event - The click event.
 */
function handlerMenuNavigation(event) {
  const clickedLink = event.target.closest(".menu-nav__link");
  if (clickedLink) {
    const targetUrl = clickedLink.href;
    setMenuNavActiveLink(targetUrl);
  }
}

// Attach the 'handlerMenuNavigation' function to the 'click' event of the menu navigation
menuNav.addEventListener("click", handlerMenuNavigation);

// Set the active menu navigation link on page load
document.addEventListener("DOMContentLoaded", () => {
  setMenuNavActiveLink(window.location.href);
});

///////////////////////////////////////////////////////////////////////////////

/**
 * MOBILE MENU
 */
const mobileMenuIcon = document.getElementById("mobile-menu-icon");
const mobileMenu = document.getElementById("mobile-menu");
const mobileCloseButton = document.querySelector(".mobile-menu__close");
const mobileTargetClassName = "mobile-menu__active--link";

/**
 * Function to open mobile menu
 */
function openMobileMenu() {
  mobileMenu.classList.add("active");

  document.body.style.overflow = "hidden";
}

/**
 * Function to close mobile menu
 */
function closeMobileMenu() {
  mobileMenu.classList.remove("active");

  document.body.style.overflow = "";
}

// Add mobile menu when the menu icon is clicked
mobileMenuIcon.addEventListener("click", () => {
  openMobileMenu();
});

// Cloes mobile menu when the close button is clicked
mobileCloseButton.addEventListener("click", () => {
  closeMobileMenu();
});

// Close mobile menu when a menu item is clicked
const mobileMenuLinks = mobileMenu.querySelectorAll(".mobile-menu__link");
mobileMenuLinks.forEach((link) => {
  link.addEventListener("click", () => {
    closeMobileMenu();
  });
});

// Set the active mobile menu link on page load
document.addEventListener("DOMContentLoaded", () => {
  const currentUrl = window.location.href;
  const mobileMenuLinks = mobileMenu.querySelectorAll(".mobile-menu__link");
  mobileMenuLinks.forEach((link) => {
    if (link.href === currentUrl) {
      link.classList.add(mobileTargetClassName);
    } else {
      link.classList.remove(mobileTargetClassName);
    }
  });
});
