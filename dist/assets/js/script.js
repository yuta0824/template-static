const element = document.querySelector(".js-click-me");

element?.addEventListener("click", (e) => {
  e.preventDefault();
  console.log("Hello, world!");
});
