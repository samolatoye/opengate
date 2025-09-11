document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");
  const messageBox = document.getElementById("formMessage");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Simulate form submission
    setTimeout(() => {
      messageBox.style.display = "block";
      messageBox.textContent = "Thank you for contacting us!";
      form.reset();
    }, 500);
  });
});
