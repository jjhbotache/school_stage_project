const btnSave = document.getElementById("btn-save");
const btnUpdate = document.getElementById("btn-update");
const inputName = document.getElementById("input-name");
const inputImg = document.getElementById("input-img");
const inputAi= document.getElementById("input-ai");
const preview = document.getElementById("preview")
const realName = document.getElementById("real-name");


const select = document.getElementById('select-designs');

// -------------
let fragment = document.createDocumentFragment()
const viewContainer = document.getElementById("view-container");
const designs = [];
const designViewTemplate = document.createElement("template");
// -------------

btnSave.addEventListener("click",()=>{
  if (inputName.value==""){
    alert("Please enter a name");
  }else if (inputImg.files[0].lenght>0) {
    alert("Please enter an Img");
  }else if (inputAi.files[0].lenght>0) {
    alert("Please enter an Ai");
  }else{
    sendDesign(inputName.value,realName.textContent, inputImg.files[0], inputAi.files[0]);
  }
})
inputName.addEventListener("input",()=>{
  updateRealName();
});
inputImg.addEventListener('change',()=>{
  inputName.value = inputImg.files[0].name;
  const reader = new FileReader();
  reader.onloadend = () => {preview.src = reader.result};
  reader.readAsDataURL(inputImg.files[0])

  preview.src = inputImg.files[0]
  updateRealName();
});

// =========================================================================================

function sendDesign(name,filesName,img,ai) {
  const data = new FormData();
  data.append('name', name);
  data.append('filesName', filesName);
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

function loadDesigns() {
  fetch('http://127.0.0.1:1000/design')
    .then(response => response.json())
    .then(data => {
      document.getElementById("designs").classList.remove("d-none")
      document.getElementById("designs-spinner").classList.add("d-none")

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
          loadAndShowDesign(option.value);
        });
      });
      
    })
    .catch(error => {
      console.error('Error:', error);
      select.innerHTML="";
      fragment.innerHTML="";
      setTimeout(() => {
        console.log("trying again...");
        loadDesigns()
      }, 1000);
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
      updateDesign(design.name);
      all.classList.add("d-none");
    };
    if (e.target.id === "delete") {
      if (confirm(`Do you want do delete "${design.name}" design?`)) {
        fetch(apiRoute+"delete_design/"+design.id.toString(),{method:"DELETE"})
        .then((response) => {
          response.json()
        })
        .then((data) => {
          console.log(data);
        })
        .catch((e) => {
          console.log(e);
        })
      }
    };
  });
  fragment.appendChild(newView);
  viewContainer.appendChild(fragment);
}

function waitForUpdate(name) {
  return new Promise(resolve => {
    btnUpdate.addEventListener('click', () => {
      if (confirm(`
      Are you sure do you want to update ${name} to:\n
      NAME:
      ${inputName.value}
      PNG:
      ${inputImg.files.length == 0?"*The same*":inputImg.files[0].name}
      AI:
      ${inputAi.files.length == 0?"*The same*":inputAi.files[0].name}
      `)) resolve('Botón presionado');
    });
  });
}

async function updateDesign(name) {
  const design = designs.find(design => design.name === name);
  inputName.value = design.name
  updateRealName()
  preview.src = 'http://127.0.0.1:1000/'+design.img_url;
 
  document.getElementById("title").textContent = "Edit your design"
  btnSave.classList.add("d-none");
  btnUpdate.classList.remove("d-none");
  
  await waitForUpdate(design.name);
  
  if (inputAi.files.length>0) {
    console.log(`Changing ai file`);
  
    const data = new FormData();
    data.append("ai",inputAi.files[0])
  
    fetch(`http://127.0.0.1:1000/update_design/${design.id}/ai`,
    {
      method: 'POST',
      body:data
    })
    .then(response => response.json())
    .then((data) => {console.log(data);})  
    .catch(error => console.log(error));
  }
  if (inputImg.files.length>0) {
    console.log(`Changing img file`);

    const data = new FormData();
    data.append("img",inputImg.files[0])

    fetch(`http://127.0.0.1:1000/update_design/${design.id}/img`,
    {
      method: 'POST',
      body:data
    })
    .then(response => response.json())
    .then((data) => {console.log(data);})  
    .catch(error => console.log(error));
  }
  if (inputName.value != design.name) {
    console.log(`Changing name from ${design.name} to ${inputName.value}`);
    fetch(`http://127.0.0.1:1000/update_design/${design.id}/name`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body:JSON.stringify(
        {
          new_data:inputName.value
        }
      )
    })
    .then(response => response.json())
    .then((data) => {console.log(data);})  
    .catch(error => console.log(error));
  }


  btnUpdate.classList.add("d-none");
  btnSave.classList.remove("d-none");
  document.getElementById("title").textContent = "Add your design"
  
  alert("updated!")
  window.location.reload();
}

// =========================================================================================
// --------------------------------------------------------------------------------------------------------------
function removeAfterDot(str) {
  const dotIndex = str.indexOf('.');
  if (dotIndex === -1) return str;
  return str.slice(0, dotIndex);
}

function updateRealName(str) {
  str = str||inputName.value;
  console.log(str);
  if (inputName.value.includes(".")) {
    document.getElementById("dot-alert").classList.remove("d-none");
  }else{document.getElementById("dot-alert").classList.add("d-none");}

  realName.textContent = (str.split(" ").join("_")).replace(/[\\/*<>| ]/g, "_");
  realName.textContent = realName.textContent.replace(/[?:"]/g, "-");
  realName.textContent = realName.textContent.substring(0,realName.textContent.indexOf(".")!=-1?realName.textContent.indexOf("."):realName.textContent.length)
  
}
// -------------------------------------------------------------------------------------------------------------

// creates a template
fetch('templates/design-view.html')
.then(response => response.text())
.then(data => {
    // console.log(data);
    designViewTemplate.id         =   "design-view-template";
    designViewTemplate.innerHTML  =   data;
    document.body.appendChild(designViewTemplate);
})

loadDesigns();