// Always include at top of Javascript file
"use strict";

/* Initialize
 * Passing by element is more portable
 */
let myPostcard = new Postcard(document.getElementById("myPostcard"));
myPostcard.getData();
