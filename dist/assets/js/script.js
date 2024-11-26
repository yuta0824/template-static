var element = document.getElementById("myDIV");

element?.addEventListener("click", (e) => {
  e.preventDefault();
  console.log("Hello, World!");
  alert("Hello, World!");
});
