const btnSave = document.getElementById("btn-save");
const inputName = document.getElementById("input-name");
const inputImg = document.getElementById("input-img");
const inputAi= document.getElementById("input-ai");
const preview = document.getElementById("preview")
const realName = document.getElementById("real-name");

const select = document.getElementById('select-designs');




function sendDesign(name,img,ai) {
  const data = new FormData();
  data.append('name', name);
  data.append('img', img);
  data.append('ai', ai);

  console.log(`sending=`,data);  
  fetch(
    "http://localhost:1000/design",
    {
      method:"POST",
      body:data
    }
  )
  .then(respuesta=>respuesta.text())
  .then(data=>{
    alert(data);
  })
  .catch(e=>{
    alert("somethig went wrong:",e);
  })
}

btnSave.addEventListener("click",()=>{
  if (inputName.value==""){
    alert("Please enter a name");
  }else if (inputImg.files[0].lenght>0) {
    alert("Please enter an Img");
  }else if (inputAi.files[0].lenght>0) {
    alert("Please enter an Ai");
  }else{
    sendDesign(realName.textContent, inputImg.files[0], inputAi.files[0]);
  }
})

function updateRealName(str) {
  str = str||inputName.value;
  if (str=="") {
    alert("Please enter a name");
  }else{
    realName.textContent = (str.split(" ").join("_")).replace(/-/g, "_");
    realName.textContent = realName.textContent.substring(0,realName.textContent.indexOf("."));

  }
  
}

inputName.addEventListener("blur",()=>{updateRealName();});
inputImg.addEventListener('change',()=>{
  inputName.value = inputImg.files[0].name;
  updateRealName();
});


// creates a template
const designViewTemplate = document.createElement("template");
fetch('templates/design-view.html')
.then(response => response.text())
.then(data => {
    // console.log(data);
    designViewTemplate.id         =   "design-view-template";
    designViewTemplate.innerHTML  =   data;
    document.body.appendChild(designViewTemplate);
 })

 let fragment = document.createDocumentFragment()

 console.log(document.querySelector("template"));

const viewContainer = document.getElementById("view-container");
loadDesigns();
let designs = [];
function loadDesigns() {
  fetch('http://127.0.0.1:1000/design')
    .then(response => response.json())
    .then(data => {
      console.log(data);
      // start to make the objects from a template --------------------------------------------------------
      data.forEach(design => {
        designs.push(design)

        // add options with a name
        const option = document.createElement('option');
        // option.id = removeAfterDot(design.name);
        option.value = removeAfterDot(design.name);
        option.textContent = design.name;
        select.appendChild(option);
        option.addEventListener('dblclick', (e) => {
          console.log(("funciono y soy:", option));
          loadAndShowDesign(option.value);
        });
      });
      
    })
    .catch(error => {
      console.error('Error:', error);
      select.innerHTML="";
      fragment.innerHTML="";

      if (confirm("Something went wrong loading the designs, want to try again?")) {loadDesigns();}
    });
}

function loadAndShowDesign(name) {
  const namesList = Array.from(viewContainer.querySelectorAll(".floating-card")).map(view => view.id);
  if (namesList.includes(name)) {
    document.getElementById(name).classList.toggle("d-none");
  }
  else{
    createView(name);
    loadAndShowDesign(name)
  }
}

function createView(name) {
  const design = designs.find(design => design.name === name);
  const newView = document.importNode(
    designViewTemplate.content,
    true
  );
  const apiRoute = "http://127.0.0.1:1000/";
  const id = removeAfterDot(design.name);
  const all = newView.querySelector(".floating-card");
  all.id = id;
  newView.getElementById("img").src = apiRoute + design.img_url;
  newView.getElementById("download-ai").href = apiRoute + design.ai_url;
  newView.getElementById("img-name").textContent = design.name;

  newView.querySelector(".floating-card").addEventListener('click', (e)=>{
    // console.log(e.target);
    if (e.target.id === "bg") all.classList.add("d-none");
    if (e.target.id === "update-img" ) {
      showUpdateWindow(design.name);
    };
    if (e.target.textContent === "Actualizar ai" ) console.log("I update the AI");
  });
  fragment.appendChild(newView);
  viewContainer.appendChild(fragment);
}

function showUpdateWindow(name) {
  console.log(name);
  document.body.innerHTML+=`
<div class="container d-flex flex-column align-items-center rounded-3" id="change-window">
  <h3 class="text-center p-1">Add a new image</h3>
  <label for="input-img" class="form-label">${name}  new png</label>
  <input type="file" accept=".png" class="form-control mb-2 w-50" id="input-update-img">
  <button class="btn btn-success rounded-pill mb-1" id="update-img-btn" onclick='updateDesign("${name}","img")'>Update</button>
</div>
`
}

function updateDesign(name,kind,file) {
  file = file || document.getElementById("input-update-img").files[0]
  console.log("file: ",file);
  if (kind === "img") {
    let dataToUpdate = new FormData()
    dataToUpdate.append("img",file);
  
    fetch(
      `http://127.0.0.1:1000/update/${kind}/${name}`,
      {
        method:"POST",
        body:dataToUpdate
      }
      )
      .then(response => response.json())
      .then(data => {
        console.log(data);
      })
      .catch(e =>console.log("there was an error :C : ",e))
  }
}

  // --------------------------------------------------------------------------------------------------------------
  function removeAfterDot(str) {
    const dotIndex = str.indexOf('.');
    if (dotIndex === -1) return str;
    return str.slice(0, dotIndex);
  }