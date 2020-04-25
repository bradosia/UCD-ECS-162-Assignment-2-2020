// Always include at top of Javascript file
"use strict";

/* Maps button text to css font name */
let fontList = [
  "Indie Flower",
  "Dancing Script",
  "Long Cang",
  "Homemade Apple"
]

/* Maps button text to css font name */
let colorList = [
  "#e6e2cf", "#dbcaac",
  "#c9cbb3", "#bbc9ca",
  "#a6a5b5", "#b5a6ab",
  "#eccfcf", "#eceeeb",
  "#bab9b5"
]

/* Initialize
 * Passing by element is more portable
 */
let myPostcard = new Postcard(document.getElementById("myPostcard"));
myPostcard.setUI(document.getElementById("myPostcardControlFont"),
  document.getElementById("myPostcardControlColor"));
myPostcard.addShareButton(document.getElementById("myShareButton"));
myPostcard.addFontList(fontList);
myPostcard.addColorList(colorList);
myPostcard.initialize();
