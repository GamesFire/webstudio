/**
 * SCRIPT FOR PROJECT CARDS ON THE PORTFOLIO PAGE
 */
// Get necessary elements
const filtersBtnsList = document.querySelector(".filters__btns-list");
const projectCards = document.querySelectorAll(".project-card");
const projectCardsList = document.querySelector(".projects-cards__list");

/**
 * CARD FILTERING
 */
/**
 * Removes the active class from all filter buttons.
 */
function removeActiveClassFromButtons() {
  const filterBtns = filtersBtnsList.querySelectorAll(".filter__btn");
  filterBtns.forEach((btn) => {
    btn.classList.remove("filter__btn-active");
  });
}

/**
 * Filters project cards based on the provided filter type.
 *
 * @param {string} filterType - The type of projects to display.
 */
function filterProjectCards(filterType) {
  projectCards.forEach((card) => {
    const cardType = card.querySelector(
      ".project-card__content--type"
    ).textContent;
    if (filterType === "All" || cardType === filterType) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
}

/**
 * Updates the grid layout of project cards based on the number of visible cards.
 *
 * @param {number} visibleCardsCount - The number of visible project cards.
 * @param {HTMLElement[]} visibleCards - An array of visible project card elements.
 */
function updateGrid(visibleCardsCount, visibleCards) {
  if (window.innerWidth >= 1440) {
    /**
     * Adjusts the grid layout based on the number of visible cards.
     *
     * @param {string} columnTemplate - The CSS grid template columns property.
     * @param {string} columnGap - The CSS column gap property.
     * @param {string} paddingInline - The CSS inline padding property.
     */
    function adjustLayout(columnTemplate, columnGap, paddingInline) {
      projectCardsList.style.gridTemplateColumns = columnTemplate;
      projectCardsList.style.columnGap = columnGap;
      projectCardsList.style.paddingInline = paddingInline;
    }

    if (visibleCardsCount === 1) {
      adjustLayout("1fr", "0", "0");
    } else if (visibleCardsCount === 2) {
      const cardWidth = visibleCards[0].offsetWidth;
      const columnTemplate = `repeat(2, 1fr)`;
      const columnGap = `calc(100% - ${2 * cardWidth}px)`;
      const paddingInline = `144px`;
      adjustLayout(columnTemplate, columnGap, paddingInline);
    } else {
      const columnTemplate = "repeat(3, 1fr)";
      const columnGap = "24px";
      const paddingInline = `0`;
      adjustLayout(columnTemplate, columnGap, paddingInline);
    }
  } else {
    // Reset styles for screens less than 1440 pixels
    projectCardsList.style.gridTemplateColumns = "";
    projectCardsList.style.columnGap = "";
    projectCardsList.style.paddingInline = "";
  }
}

/**
 * Handles the click event on filter buttons via event delegation.
 *
 * @param {Event} event - The click event.
 */
function handleFilterButtonClick(event) {
  const clickedBtn = event.target.closest(".filter__btn");
  if (clickedBtn && filtersBtnsList.contains(clickedBtn)) {
    removeActiveClassFromButtons();
    clickedBtn.classList.add("filter__btn-active");

    const filterType =
      clickedBtn.querySelector(".filter__btn-text").textContent;
    filterProjectCards(filterType);

    const visibleCards = document.querySelectorAll(
      ".project-card[style*='display: block']"
    );
    const visibleCardsCount = visibleCards.length;

    updateGrid(visibleCardsCount, visibleCards);
  }
}

// Attach event listener to the parent element for event delegation
filtersBtnsList.addEventListener("click", handleFilterButtonClick);

// Automatically click the "All" filter button on page load
document.addEventListener("DOMContentLoaded", () => {
  const allFilterBtn = filtersBtnsList.querySelector(".filter__btn");
  if (allFilterBtn) {
    allFilterBtn.click();
  }
});

///////////////////////////////////////////////////////////////

/**
 * FLIP CARDS
 */
/**
 * Toggles the "is-flipped" class on a project card element.
 *
 * @param {HTMLElement} card - The project card element.
 */
function toggleCardFlip(card) {
  card.classList.toggle("is-flipped");
}

/**
 * Adds or removes box shadow based on the "is-flipped" class of a project card element.
 *
 * @param {HTMLElement} card - The project card element.
 */
function updateCardBoxShadow(card) {
  const boxShadow = card.classList.contains("is-flipped")
    ? `0px 2px 1px 0px rgba(46, 47, 66, 0.08), 
      0px 1px 1px 0px rgba(46, 47, 66, 0.16), 
      0px 1px 6px 0px rgba(46, 47, 66, 0.08)`
    : "none";

  card.style.boxShadow = boxShadow;
}

/**
 * Handles the click event on project card elements via event delegation.
 *
 * @param {Event} event - The click event.
 */
function handleProjectCardClick(event) {
  const clickedCard = event.target.closest(".project-card__inner");

  if (clickedCard && !isTextSelected()) {
    toggleCardFlip(clickedCard);
    setTimeout(() => {
      updateCardBoxShadow(clickedCard);
    }, 300);
  }
}

/**
 * Checks if any text is currently selected on the page.
 *
 * @returns {boolean} - True if text is selected, false otherwise.
 */
function isTextSelected() {
  return window.getSelection().toString().length > 0;
}

// Attach event listener to the parent element for project card click events
const projectsCardsList = document.querySelector(".projects-cards__list");
projectsCardsList.addEventListener("click", handleProjectCardClick);

/**
 * Attach event listener to the parent element for project card
 * to prevent text selection ONLY after a double click
 */
projectCardsList.addEventListener(
  "mousedown",
  (event) => {
    if (event.detail > 1) {
      event.preventDefault();
    }
  },
  false
);
