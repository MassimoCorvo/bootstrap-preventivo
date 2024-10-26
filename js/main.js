/*Aggiungiamo la componente js di interazione con l’utente.
Quando l’utente fa click sul bottone submit del form, il sito deve calcolare l’ammontare del
preventivo per le ore di lavoro richieste.
Il prezzo finale è dato dal numero di ore per prezzo orario. Supponiamo per semplicità che
ogni progetto richieda lo stesso numero di ore di lavoro (es: 10 ore).
Il prezzo orario per una commissione varia in questo modo:
● se la commissione riguarda lo sviluppo backend il prezzo orario è di 20.50€/l’ora
● se la commissione riguarda lo sviluppo frontend il prezzo orario è di 15.30€/l’ora
● se la commissione riguarda l’analisi progettuale il prezzo orario è di 33.60€/l’ora
L’utente potrebbe decidere di utilizzare un codice promozionale tra i seguenti: YHDNU32,
JANJC63, PWKCN25, SJDPO96, POCIE24.
Se l’utente inserisce un codice promozionale valido, ha diritto ad uno sconto del 25% sul
prezzo finale. Se il codice inserito non è valido, il sito deve informare l’utente che il codice
non è valido e il prezzo finale viene calcolato senza applicare sconti.
Il risultato del calcolo del prezzo finale deve essere visualizzato in “forma umana” (con 2
decimali e il simbolo dell’euro). */

const form = document.querySelector("form");
const nameForm = document.getElementById("inputNome");
const cognomeForm = document.getElementById("inputCognome");
const job = document.getElementById("lavoro");
const email = document.getElementById("inputEmail");
const codiciSconto = ["YHDNU32", "JANJC63", "PWKCN25", "SJDPO96", "POCIE24"];
const codiciScontoLength = codiciSconto.length;
const codiceInput = document.getElementById("codicePromozionale");
const formContainer = document.querySelector(".form-container");
const errorMsg = document.querySelector(".errorMessages");
let errorMessageContainer;

//Event Submit
form.addEventListener("submit", function (event) {
   //Reset error message
   resetError();

   //Reset price
   resetPrice();

   event.preventDefault();

   if (validateName(nameForm.value) && validateName(cognomeForm.value) && validateSelect(job.value) && validateEmail(email.value)) {
      let tariffaOraria;

      if (job.value === "backend")
         tariffaOraria = 20.50;

      else if (job.value === "frontend")
         tariffaOraria = 15.30;

      else if (job.value === "analysis") tariffaOraria = 33.6;

      let discount = checkDiscount(codiceInput.value);

      let price = tariffaOraria * 10 * (1 - discount);

      printPrice(price);

   }

   else {
      printError(validateName(nameForm.value), validateName(cognomeForm.value), validateSelect(job.value), validateEmail(email.value));
   }

});


//FUNCTIONS

/**
 * Funzione che verifica se il nome o il cognome è valido. Restituisce un valore booleano.
 * @param {string} name
 * @returns {boolean}
 */
function validateName(name) {

   let isValid = true;

   //Verifico che sia lunga almeno due caratteri
   if (name.length < 2)
      return false;

   //Creo una stringa senza spazi a partire da name (essa non sostituisce name)
   const nameWithoutSpace = name.replaceAll(" ", "");

   //Per prima cosa verifico che la stringa non sia vuota
   if (nameWithoutSpace === "") {
      isValid = false;
      return isValid;
   }

   //Verifico che non ci siano spazi all'inizio o alla fine
   if (name[0] === " " || name[name.length - 1] === " ")
      return false;

   //Poi verifico che non ci siano spazi consecutivi
   for (let i = 0; i < name.length; i++) {
      let j = i + 1;

      if (name[i] === " " && j < name.length) {

         if (name[j] === " ") {
            isValid = false;
            return isValid;
         }

         //Se non ci sono spazi consecutivi non eseguo nulla
      }

   }

   //Verifico che la stringa senza spazi non abbia numeri
   for (let i = 0; i < nameWithoutSpace.length; i++) {

      //Number: an empty string (like "") converts to 0
      if (isNaN(Number(nameWithoutSpace[i])) === false) {
         isValid = false;
         return isValid;
      }
   }

   //Se tutti i test sono superati restituisco isValid, che in questo caso sarà true
   return isValid;
}


/**
 * Funzione che verifica se il form select è compilato correttamente. Restituisce un valore booleano.
 * @param {string} selectValue
 * @returns {boolean}
 */
function validateSelect(selectValue) {
   let isValid = true;

   if (selectValue === "backend" || selectValue === "frontend" || selectValue === "analysis") {
      return isValid;
   }
   else {
      isValid = false;
      return isValid;
   }

}

/**
 * Verifica se l'email è valida
 * @param {string} email
 * @returns {boolean}
 */
function validateEmail(email) {

   if (email.match(/^[A-Za-z\._\-0-9]*[@][A-Za-z]*[\.][a-z]{2,4}$/))
      return true;
   else return false;

}


/**
 * Genera messaggi in caso di errata compilazione form
 * @param {boolean} firstNameValid
 * @param {boolean} lastNameValid
 * @param {boolean} jobValid
 */
function printError(firstNameValid, lastNameValid, jobValid, emailValid) {

   const arrayError = [];

   if (!firstNameValid)
      arrayError.push("Nome non valido");
   if (!lastNameValid)
      arrayError.push("Cognome non valido");
   if (!jobValid)
      arrayError.push("Inserisci tipo di lavoro");
   if (!emailValid)
      arrayError.push("Email non valida");

   if (arrayError.length > 0) {
      //Create error container
      errorMessageContainer = document.createElement("div");
      errorMessageContainer.classList.add("error-container", "d-flex", "align-items-center");
      const before = document.getElementById("formId");
      formContainer.insertBefore(errorMessageContainer, before);

      //Create icon
      const iconError = document.createElement("span");
      iconError.classList.add("fs-2");
      iconError.innerHTML = "&#9888;";
      errorMessageContainer.appendChild(iconError);

      //Errors list
      const listError = document.createElement("ul");
      errorMessageContainer.appendChild(listError);
      listError.classList.add("my-0");

      //Per ogni errore aggiunge un elemento della lista
      for (let i = 0; i < arrayError.length; i++) {
         listError.innerHTML += "<li>" + arrayError[i] + "</li>";
      }

      //Scroll the element with id="content" into the visible area of the browser window  
      //false -> bottom of the visible area  true-> top  default = top
      //Da rivedere!!!
      document.querySelector(".error-container").scrollIntoView(false);
   }

}

/**
 * Elimina il messaggio di errore, nel caso sia presente
 */
function resetError() {

   if (errorMessageContainer !== null && errorMessageContainer !== undefined) {
      errorMessageContainer.remove();
   }

}


/**
 * Calcola lo sconto e verifica se sia stato inserito uno sconto non valido
 * @param {string} codiceSconto
 * @returns {number}
 */
function checkDiscount(codiceSconto) {
   //const codiceNoSpazi = codiceSconto.replaceAll(" ","");
   let discount = 0;

   //Verifico che il campo non sia vuoto
   if ( codiceSconto !== "" ) {
      let discountValid = false;
      for (let i = 0; i < codiciScontoLength; i++) {

         if (codiciSconto[i] === codiceSconto) {

            discount = 0.25;
            discountValid = true;

         }

      }

      if (!discountValid) {
         printDiscountNotValid();
      }

   }

   return discount;


}


/**
 * Stampa su schermo un messaggio nel caso che il codice sconto inserito non sia valido
 */
function printDiscountNotValid() {

   alert("Codice sconto non valido, non verranno applicati sconti.");

}

function printPrice(price) {

   //Divido la parte intera da i decimali

   let parteIntera = "";
   let decimali = "";
   const priceString = price.toFixed(2);

   let dotFound = false;
   for (let i = 0; i < priceString.length; i++) {

      if (priceString[i] !== "." && !dotFound) {
         parteIntera += priceString[i];
      }
      else if (priceString[i] === ".")
         dotFound = true;
      else {

         decimali += priceString[i];

      }

   }

   document.getElementById("parte-intera").innerText = parteIntera;
   document.getElementById("decimali").innerText = "," + decimali;

}

function resetPrice() {

   document.getElementById("parte-intera").innerText = "0";
   document.getElementById("decimali").innerText = "," + "00";

}