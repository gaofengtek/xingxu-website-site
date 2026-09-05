document.documentElement.classList.add("has-js");

document.querySelectorAll("a[href]").forEach((link) => {
  const destination = new URL(link.href, document.baseURI);
  link.dataset.navigation = destination.origin === window.location.origin ? "same-origin" : "external";
});
