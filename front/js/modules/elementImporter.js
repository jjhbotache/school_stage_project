/**
 * 
 * @param {*} elementRoute the route of the template
 * @param {*} callback what it's doen with the template after been imported
 * @returns 
 */
function importElement(elementRoute) {
  let element;
  return new Promise((resolve, reject) => {
    fetch(elementRoute)
    .then((response) => response.text())
    .then((data) => {
      const template = document.createElement("template");
      template.innerHTML=data;
      element = template.content;
      resolve(element);  
    })
    .catch((error) => {console.log(error);reject();})
  })
}
export default importElement;