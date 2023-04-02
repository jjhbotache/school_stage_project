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
function loadDesigns() {
  fetch('http://127.0.0.1:1000/design')
    .then(response => response.json())
    .then(data => {
      console.log(data);
      // start to make the objects from a template --------------------------------------------------------
      data.forEach(design => {


        // add options with a name
        const option = document.createElement('option');
        // option.id = removeAfterDot(design.name);
        option.value = removeAfterDot(design.name);
        option.textContent = design.name;
        select.appendChild(option);
        option.addEventListener('dblclick', (e) => {
          console.log(("funciono y soy:", option));
          document.getElementById(removeAfterDot(design.name)).classList.toggle("d-none");
        });

        const apiRoute = "http://127.0.0.1:1000/";

        const newView = document.importNode(
          designViewTemplate.content,
          true
        );
        const id = removeAfterDot(design.name);
        newView.querySelector(".floating-card").id = id;
        newView.getElementById("img").src = apiRoute + design.img_url;
        newView.getElementById("download-ai").href = apiRoute + design.ai_url;
        newView.getElementById("img-name").textContent = design.name;

        fragment.appendChild(newView);
      });
      viewContainer.appendChild(fragment);
    })
    .catch(error => {
      console.error('Error:', error);
      select.innerHTML="";
      fragment.innerHTML="";

      if (confirm("Something went wrong loading the designs, want to try again?")) {loadDesigns();}
    });
}

  // --------------------------------------------------------------------------------------------------------------
  function removeAfterDot(str) {
    const dotIndex = str.indexOf('.');
    if (dotIndex === -1) return str;
    return str.slice(0, dotIndex);
  }