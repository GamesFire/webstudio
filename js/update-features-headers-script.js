/**
 * Updates elements based on screen width.
 * If the screen width is less than 1440 pixels,
 * it changes elements with class "subtitle features-block__header" to "title" and updates the tag to "H2".
 * Otherwise, it resets the elements to their default state.
 */
function updateFeaturesHeaders() {
  const screenWidth = window.innerWidth;
  const headers = document.querySelectorAll(".subtitle.features-block__header");

  headers.forEach((header) => {
    const newHeader = document.createElement(screenWidth < 1440 ? "h2" : "h3");
    newHeader.textContent = header.textContent;
    newHeader.className =
      screenWidth < 1440
        ? "title features-block__header"
        : "subtitle features-block__header";
    header.replaceWith(newHeader);
  });
}

// Call the function initially
updateFeaturesHeaders();

// Add an event listener for window resize to update elements dynamically
window.addEventListener("resize", updateFeaturesHeaders);
