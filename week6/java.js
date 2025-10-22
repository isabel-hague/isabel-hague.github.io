const cover = document.querySelector("#cover");
const caption = document.querySelector("#caption");
const button = document.querySelector("#changeButton");
const issues = [
  { img: "Spring1977.jpg", text: "Spring 1977: “How to Run the Arms Race Backwards”" },
  { img: "Summer1991.jpg", text: "Summer 1977: “Access to Tools and Ideas”" },
  { img: "March1971.jpg", text: "March 1971: “The Last Supplement to the Whole Earth Catalog”" },
  { img: "Summer1981.jpg", text: "Summer 1981: “The Politics of Place”" }
];
let index = 0;

// When button is clicked, change image + caption
button.addEventListener("click", () => {
  index = (index + 1) % issues.length;
  cover.src = issues[index].img;
  caption.textContent = issues[index].text;
});
