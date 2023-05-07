import { redirectNoAdmin } from "./modules/globalVars.js";
import { setRequestConfig } from "./modules/globalVars.js";

const designsContainer = document.getElementById("designs-container");
const spinner = document.getElementById("designs-spinner");
const apiRoute = "http://127.0.0.1:1000/";

const DesignTemplate = document.getElementById("design-template").content;

let designsData = [];

function getDesign(id) {
  alert(id);
}

while (designsData.length<1) {
  async function getDesignsFunction() {
    return fetch(apiRoute+'design')
    .then(response => response.json())
    .then(data => {
      spinner.remove()
      return data
    })
  }
  designsData = await getDesignsFunction();
  if (designsData.length<1) {break}
}

designsData.forEach(design => {
  console.log(design);
  // clone the design template
  const clone = document.importNode(DesignTemplate, true);
  // set the design name
  clone.querySelector(".col.text-center").id = `design-${design.id}`;
  clone.querySelector(".col.text-center").onclick = ()=>{getDesign(design.id)};
  clone.querySelector("h3").textContent = design.name;
  clone.querySelector("img").src = apiRoute+design.img_url;

  designsContainer.appendChild(clone);
});
 