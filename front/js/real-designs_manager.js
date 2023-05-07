import { redirectNoAdmin } from "./modules/globalVars.js";
import { apiRoute } from "./modules/globalVars.js";
import { setRequestConfig } from "./modules/globalVars.js";




// -----------------------------------------------------------

async function setup() {
  redirectNoAdmin()
  await fetch('templates/manager.html')
  .then(response => response.text())
  .then(text => {
    const manager = document.createElement("template");
    manager.innerHTML  =   text;
    const managerTemplate = manager.content.cloneNode(true);
  
    managerTemplate.getElementById("manager-title").textContent = "Real Designs";
    // create a new input and append it to the managerTemplate
    managerTemplate.getElementById("inputs").innerHTML = `
      <label for="input" class="form-label">Name of the design</label>
      <input type="text"class=" form-control" name="" id="input-name" placeholder="eres la flor mas bella en mi vida" maxlength="100">
      <span class="mb-5 fs-6 fst-italic" id="real-name">-</span>
      <div class="alert alert-danger d-none mt-1" role="alert" id="dot-alert">recuerda que a los archivos se les agrega la extension despues del nombre que le das</div>
  
      <img class="img-fluid w-25 my-1 d-block mx-auto rounded-2" id="preview">
  
      <label for="input-img" class="form-label">Design png</label>
      <input type="file" accept=".png" class="form-control mb-2" id="input-img">
      <div class="mt-1">
        <label for="input-dxf" class="form-label">Design dxf</label>
        <a id="btn-download-dxf" class="d-none mx-auto btn btn-sm p-0 btn-info w-50 rounded-pill" >download-dxf</a>
      </div>
      <input type="file" accept=".dxf" class="form-control mb-2" id="input-dxf">
  
  
  
      <button id="btn-save" type="button" class="d-block my-3 mx-auto btn btn-info w-50 rounded-pill" >save</button>
      <button id="btn-update" type="button" class="d-block d-none my-3 mx-auto btn btn-success w-50 rounded-pill" >update</button>  
      <button id="btn-delete" type="button" class="d-block d-none my-3 mx-auto btn btn-danger w-50 rounded-pill" >delete</button>  
    `;
    managerTemplate.getElementById("read-window").innerHTML = `
    <div id="designs-spinner" class="spinner-border text-primary spinner-border-lg d-block mx-auto my-1"role="status"></div>
    <div id="designs" class="mb-3 d-none">
      <label class="form-label">Designs</label>
      <select multiple class="form-select form-select-lg" name="" id="select-designs"></select>
    </div>
    `;
    document.body.appendChild(managerTemplate);
  })

  getDesigns();

}

await setup();

const preview = document.getElementById("preview");
const inputName = document.getElementById("input-name");
const inputImg = document.getElementById("input-img")
const inputDxf = document.getElementById("input-dxf");
const realName = document.getElementById("real-name");

const btnSave = document.getElementById("btn-save").addEventListener('click', ()=>{saveDesign(inputName.value,realName.textContent,inputImg.files[0],inputDxf.files[0])});
const btnUpdate = document.getElementById("btn-update");
const btnDelete = document.getElementById("btn-delete")
const btnDownloadDxf = document.getElementById("btn-download-dxf")

// add event listeners-----------

inputName.addEventListener("input",()=>{
  updateRealName();
});

inputImg.addEventListener('change', ()=>{
  const fileName = inputImg.files[0].name;
  inputName.value = fileName.substring(0, fileName.lastIndexOf("."));
  const reader = new FileReader();
  reader.onloadend = () => {preview.src = reader.result};
  reader.readAsDataURL(inputImg.files[0])
  updateRealName();
});

// --------------------------------------------------------------------------------

// read
async function getDesigns() {
  const designsSpinner = document.getElementById("designs-spinner");
  const selectDesigns = document.getElementById("select-designs");

  const config = setRequestConfig();
  await fetch(apiRoute+"read/real_designs", config)
  .then(response => response.json())
  .then(data => {
    console.log(data);
    designsSpinner.remove();
    data.forEach(design => {
      // destructure a list of 4 elements
      const [id, name, img, dxf] = design;

      const option = document.createElement("option");
      option.value = id;
      option.textContent = name;
      option.addEventListener('click', ()=>{putInEditor(name, img, dxf,id);})
      selectDesigns.appendChild(option);
    });


    selectDesigns.parentNode.classList.remove("d-none");
  })
  .catch(error => console.log(error))
}

// read&update
async function putInEditor(name, img, dxf,id) {
  inputName.value = name;
  updateRealName();
  preview.src = apiRoute + img + "/-";
  btnDownloadDxf.href = apiRoute + dxf + "/" + localStorage.getItem("token");

  document.getElementById("btn-save").classList.add("d-none");
  document.getElementById("btn-update").classList.remove("d-none");
  document.getElementById("btn-delete").classList.remove("d-none");
  document.getElementById("btn-download-dxf").classList.remove("d-none");

  await new Promise((resolve, reject) => {
    btnUpdate.addEventListener('click', ()=>{resolve("update")});   
    btnDelete.addEventListener('click', ()=>{confirm("desea eliminar este diseño?")?resolve("delete"):window.location.reload()});   
  })
  .then((action) => {
    if (action == "update") {
      updateDesign(id,name);
    }
    else if (action == "delete") {
      deleteDesign(id);
    }
  })
}

function updateDesign(id,name) {
  if (inputName.value!=name) {
    console.log(`Changing name from ${name} to ${inputName.value}`);
    fetch(
      apiRoute+"update_real_design/"+id+"/name",
      setRequestConfig("POST",JSON.stringify({new_data:`"${inputName.value}"`}))
    )
    .then(response => response.json())
    .then((data) => console.log(data))  
    .catch(error => console.log(error));
  }
  if (inputImg.files.length>0) {
    console.log(`Changing img file`);
    const data = new FormData();
    data.append("img",inputImg.files[0])
    

    // console.log(inputImg.files[0]);
    fetch(apiRoute+"update_real_design/"+id+"/img",
      setRequestConfig("POST",data,true)
    )
    .then(response => response.json())
    .then(data => console.log(data))  
    .catch(error => console.log(error));
  }
  if (inputDxf.files.length>0) {
    console.log(`Changing dxf file`);
  
    const data = new FormData();
    data.append("dxf",inputDxf.files[0])
  
    fetch(
      apiRoute+"update_real_design/"+id+"/dxf",
      setRequestConfig("POST",data,true)
    )
    .then(response => response.json())
    .then((data) => {console.log(data);})  
    .catch(error => console.log(error));
  }
  // alert("updating design with id: "+id);
  window.location.reload();
}
function deleteDesign(id){
  fetch(
    apiRoute+"delete_real_design/"+id,
    setRequestConfig("DELETE",null,true)
  )
  .then(response => response.json())
  .then((data) => {console.log(data);})
  .catch(error => console.log(error));
}
 
// create
function saveDesign(name,filesName,img,dxf) {
  console.log(name,filesName,img,dxf);
  const data = new FormData();
  data.append('name', name);
  data.append('filesName', filesName);
  data.append('img', img);
  data.append('dxf', dxf);
  console.log(`sending=`,data);
  fetch(
    apiRoute+"real_design",
    setRequestConfig("POST",data,true)
  ).then(response=>response.text())
  .then(data=>{
    alert(data);
    // window.location.reload();
  })
  .catch((error) => {
    console.log(error);
  })
}

// auxiliary functions -----------------------
// function removeAfterDot(str) {
//   return str.substring(0, str.indexOf("."));
// }

function updateRealName(str) {
  str = str||inputName.value;
  realName.textContent = (str.split(" ").join("_")).replace(/[\\/*<>| ]/g, "_");
  realName.textContent = realName.textContent.replace(/[?:"]/g, "-");
  realName.textContent = realName.textContent.substring(0,realName.textContent.indexOf(".")!=-1?realName.textContent.indexOf("."):realName.textContent.length)
  realName.textContent += "_REAL_DESIGN";
}