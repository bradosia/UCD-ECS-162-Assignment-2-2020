// Always include at top of Javascript file
"use strict";

class Postcard {
  constructor(postcardEle) {
    this.postcardData = {
      "photo": "",
      "message": "",
      "font": "",
      "color": ""
    }
    this.fontList = [];
    this.colorList = [];
    this.postcardEle = postcardEle;
  }
  setUI(postcardControlFontEle, postcardControlColorEle) {
    this.postcardControlFontEle = postcardControlFontEle;
    this.postcardControlColorEle = postcardControlColorEle;
  }
  addFontList(fontList) {
    this.fontList = this.fontList.concat(fontList);
  }
  addColorList(colorList) {
    this.colorList = this.colorList.concat(colorList);
  }
  initialize() {
    // make font list items dynamically
    let ulEle = this.postcardControlFontEle.getElementsByTagName("ul")[0];
    let n = this.fontList.length;
    for (let i = 0; i < n; i++) {
      // button element because of semantics
      let buttonEle = document.createElement("button");
      var textNode = document.createTextNode(this.fontList[i]);
      buttonEle.appendChild(textNode);
      buttonEle.style["font-family"] = this.fontList[i];
      ulEle.appendChild(buttonEle);
      buttonEle.addEventListener("click", () => {
        this.changeFont(this.fontList[i]);
      });
    }

    // make color list items dynamically
    ulEle = this.postcardControlColorEle.getElementsByTagName("ul")[0];
    n = this.colorList.length;
    for (let i = 0; i < n; i++) {
      // button element because of semantics
      let buttonEle = document.createElement("button");
      var textNode = document.createTextNode(this.colorList[i]);
      buttonEle.appendChild(textNode);
      buttonEle.style["background-color"] = this.colorList[i];
      ulEle.appendChild(buttonEle);
      buttonEle.addEventListener("click", () => {
        this.changeColor(this.colorList[i]);
      });
    }

    // upload file listener
    this.postcardEle.getElementsByTagName("input")[0].addEventListener("change", (e) => {
      this.uploadFile(e);
    });

    // initialize with first font and color
    this.changeFont(this.fontList[0]);
    this.changeColor(this.colorList[0]);
  }
  changeFont(fontName) {
    // update font
    let textEle = this.postcardEle.getElementsByClassName("text")[0];
    textEle.style["font-family"] = fontName;
    this.postcardData.font = fontName;
    /* update active button */
    let ulEle = this.postcardControlFontEle.getElementsByTagName("ul")[0];
    let buttonEleList = ulEle.getElementsByTagName("button");
    let n = buttonEleList.length;
    for (let i = 0; i < n; i++) {
      buttonEleList[i].className = "";
      if (buttonEleList[i].textContent == fontName) {
        buttonEleList[i].classList.add("active");
      }
    }
  }

  changeColor(colorCode) {
    // update background color
    this.postcardEle.style.backgroundColor = colorCode;
    this.postcardData.color = colorCode;
    /* update active button */
    let ulEle = this.postcardControlColorEle.getElementsByTagName("ul")[0];
    let buttonEleList = ulEle.getElementsByTagName("button");
    let n = buttonEleList.length;
    for (let i = 0; i < n; i++) {
      buttonEleList[i].className = "";
      if (buttonEleList[i].textContent == colorCode) {
        buttonEleList[i].classList.add("active");
      }
    }
  }

  onImageLoad(e, xhr) {
    // Get the server's response body
    console.log(xhr.responseText);
    let responseData = JSON.parse(xhr.responseText);
    // now that the image is on the server, we can display it!
    let imgEle = this.postcardEle.getElementsByTagName("img")[0];
    let imageWrapperEle = this.postcardEle.getElementsByTagName("div")[0];
    let labelEle = this.postcardEle.getElementsByTagName("label")[0];
    imageWrapperEle.className = "imageWrapperAfter";
    labelEle.textContent = "Replace Image";
    imgEle.src = "../images/" + responseData.photo;
    this.postcardData.photo = responseData.photo;
  }

  // UPLOAD IMAGE using a post request
  // Called by the event listener that is waiting for a file to be chosen
  uploadFile(e) {
    // get the file and send
    const selectedFile = this.postcardEle.getElementsByTagName("input")[0].files[0];
    const formData = new FormData();
    formData.append('newImage', selectedFile, selectedFile.name);
    // build a browser-style HTTP request data structure
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/upload", true);
    xhr.addEventListener('loadend', (e) => {
      this.onImageLoad(e, xhr);
    });
    xhr.send(formData);
  }

  /* send postcard data back to server
   */
  addShareButton(shareButtonEle) {
    shareButtonEle.addEventListener("click", () => {
      let textareaEle = this.postcardEle.getElementsByTagName("textarea")[0];
      this.postcardData.message = textareaEle.value;
      const xhr = new XMLHttpRequest();
      xhr.open("POST", "/share", true);
      xhr.addEventListener('loadend', (e) => {
        console.log(xhr.responseText);
        window.location.href = "heartbreaking-display";
      });
      xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
      xhr.send(JSON.stringify(this.postcardData));
    });
  }

  // get data from server for viewer
  getData() {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "/data", true);
    xhr.addEventListener('loadend', (e) => {
      console.log(xhr.responseText);
      let responseData = JSON.parse(xhr.responseText);
      let imgEle = this.postcardEle.getElementsByTagName("img")[0];
      let textEle = this.postcardEle.getElementsByClassName("text")[0];
      imgEle.src = "../images/" + responseData.photo;
      textEle.textContent = responseData.message;
      textEle.style["font-family"] = responseData.font;
      this.postcardEle.style.backgroundColor = responseData.color;
    });
    xhr.send();
  }
}
