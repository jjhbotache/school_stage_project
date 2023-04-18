export const userInfoKeys = ["id", "first_name", "last_name", "phone", "email"];

export function checkLocalStorageItems(items) {
  // Comprobar si el localStorage está disponible en el navegador
  if (!window.localStorage) {
    console.error("El localStorage no está disponible en este navegador.");
    return false;
  }
  
  // Comprobar si los items están almacenados en el localStorage
  for (let item of items) {
    if (!localStorage.getItem(item)) {
      console.error(`El item ${item} no está almacenado en el localStorage.`);
      return false;
    }
  }
  
  // Todos los items están almacenados en el localStorage
  console.log("Todos los items están almacenados en el localStorage.");
  return true;
}