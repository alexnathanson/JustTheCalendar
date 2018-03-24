(function() {
  /**
   * Check and set a global guard variable.
   * If this content script is injected into the same page again,
   * it will do nothing next time.
   */
  if (window.hasRun) {
    return;
  }
  window.hasRun = true;

  /**
   * Given a URL to a beast image, remove all existing beasts, then
   * create and style an IMG node pointing to
   * that image, then insert the node into the document.
   */
  function insertBeast(beastURL) {
    removeExistingBeasts();
    let beastImage = document.createElement("img");
    beastImage.setAttribute("src", beastURL);
    beastImage.style.height = "100vh";
    beastImage.className = "beastify-image";
    document.body.appendChild(beastImage);
  }

  /**
   * Remove every beast from the page.
   */
  function removeExistingBeasts() {
    let existingBeasts = document.querySelectorAll(".beastify-image");
    for (let beast of existingBeasts) {
      beast.remove();
    }
  }

  /**
   * Listen for messages from the background script.
   * Call "beastify()" or "reset()".
  */
  browser.runtime.onMessage.addListener((message) => {
    if (message.command === "beastify") {
      insertBeast(message.beastURL);
    } else if (message.command === "reset") {
      removeExistingBeasts();
    }
  });

})();



/*
beastify():
* removes every node in the document.body,
* then inserts the chosen beast
* then removes itself as a listener
*/

/*
function beastify(request, sender, sendResponse) {
  removeEverything();
  insertBeast(request.beastURL);
  browser.runtime.onMessage.removeListener(beastify);
}

/*
Remove every node under document.body
*//*
function removeEverything() {
  while (document.body.firstChild) {
    document.body.firstChild.remove();
  }
}

/*
Given a URL to a beast image, create and style an IMG node pointing to
that image, then insert the node into the document.
*//*
function insertBeast(beastURL) {
  var beastImage = document.createElement("img");
  beastImage.setAttribute("src", beastURL);
  beastImage.setAttribute("style", "width: 100vw");
  beastImage.setAttribute("style", "height: 100vh");
  document.body.appendChild(beastImage);
}

/*
Assign beastify() as a listener for messages from the extension.
*//*
browser.runtime.onMessage.addListener(beastify);*/