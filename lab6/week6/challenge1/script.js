// Select the div with id "main"
const mainDiv = document.getElementById("main");

// Get all paragraph elements inside that div
const paragraphs = mainDiv.getElementsByTagName("p");

// Loop through and apply styles
for (let i = 0; i < paragraphs.length; i++) {
    paragraphs[i].style.fontSize = "24px";
    paragraphs[i].style.color = "red";
}