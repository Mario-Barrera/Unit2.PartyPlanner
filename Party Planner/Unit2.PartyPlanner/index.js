// I added comments to my code to help me remember my code for future use.


const COHORT = "2503-FTB-ET-WEB-AM";
const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/{COHORT}/events`;

const state = {         // plain object that starts with an empty array
    events: [],         // the APT server will fill it with event objects
}

const fetchAllEvents = async () => {          // arrow function assigned to fetchAllEvents
    try {
        const response = await fetch(API_URL);    // sends an HTTP GET request to API enpoint and retreive its data
        const { data } = await response.json();   // turn the JSON text in JS object and extract the data field and {} mean you're doing object destructuring

        state.events = data;    // updates your local state object
        renderEvents();

        console.log("Events fetched:", state.events);   // debug or confirm that your data was fetched and stored correctly
      
    } catch (error) {   // catches any errors inside the try block
      console.log("Failed to fetch events:", error);    // logs a message to the console about the error  
    }
};

const createNewEvent = async (name, imageUrl, description, date) => {   // arrow function assigned to createNewEvent. name, imageURL, description, and date are parameters
    try {

        const response = await fetch(API_URL, {   // sends an HTTP POST to API endpoint to create a new event
            method: "POST",

            headers: {
                "Content-Type": "application/json",   // server needs to know how to interpret the data your sending and expect a JSON payload in the body of this request
            },

            // this line is part of the fetch configuration when making a POST request
            // body is the content you are sending to the server
            // JSON.stringify converts the JS object into a JSON formatted string
            body: JSON.stringify({
                id, 
                name,          /* all four are shorthand when property names and variable names are the same */
                description,
                date,
                location,
                cohortId
            }),
        });

    await fetchAllEvents()    // calls my existing function 'functionAllEvents' to get the list of events and update the event list with any new events

    } catch (error) {   // catches any errors inside the try block
      console.log("Error creating event:", error);    // logs a message to the console about the error   
    }    
};

// asyn arrow function called removeEvent
// id is the parameter
const removeEvent = async (id) => {
    try {

        await fetch(`${API_URL}/${id}`, {   // sent an HTTP delete requrest to the API to remove the event with the given id
            method: "DELETE"
        })
    
    await fetchAllEvents()    // this function is called to refresh and re-fetch the list of events 

    } catch (error) {   // catches any errors inside the try block
      console.log("Error removing event:", error);    // logs a message to the console about the error 
    }
};

// function called renderEvents to display the list of events on the webpage
function renderEvents() {

  const container = document.getElementById("event-container");   // find the html element with the id event-container and stores a reference to it in the 'container' variable
  container.innerHTML = "";

  for (const item of state.events) {    // for. . .of loop runs once for every event in the list

    // creats an element called 'div' and save this element into a const variable called 'card'
    // so it can be used later to insert content into the webpage
    const card = document.createElement("div");
    card.className = "event-card";

    // using template literals to dynamically insert values from the item object
    card.innerHTML = `
        <h3 class="item-id">${item.id}</p>
        <h3 class="item-name">${item.name}</h3>
        <p class="item-description">${item.description}</p>
        <p class="item-date">${new Date(item.date).toLocaleDateString()}</p>
        <p class="item-location">${item.location}</p>
        <p class="item-cohort">${item.cohortId}</p>
        <button class="delete-button" onclick="removeEvent('${item.id}')">Delete</button>
    `;

      // add the div element with its content to the bottom of the event list
      container.appendChild(card);
  }
}

// script runs only after the entire HTML document has been loaded
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("event-form");   // references the form element with id "event-form"
  const cardContainer = document.getElementById("card-container");    // stores the element where the event card will be added

  form.addEventListener("submit", (e) => {    // event listener when the form is submitted, e represents event
    e.preventDefault();   // prevents the browsers default behavior

    // retrieves values from the form input using id's
    // trim() removes extra spaces from the begining and end of the user's input
    const eventValue = document.getElementById("eventId").value.trim();
    const nameValue = document.getElementById("nameInput").value.trim();
    const descriptionValue = document.getElementById("descriptionInput").value;
    const dateValue = document.getElementById("dateInput").value;
    const venueNameValue = document.getElementById("venue-name").value.trim();
    const venueAddressValue = document.getElementById("venue-address").value.trim();


    // validates the user's input and alert the user if an input has no value
    if (!eventValue || !nameValue || !descriptionValue || !venueNameValue || !venueAddressValue || !dateValue) {
      alert("All fields are required");
      return;
    }

    const formattedDate = new Date(dateValue).toLocaleDateString();   // converts the input string into a date object

    const card = document.createElement('div');   // create a new div element and visually displays the details of the events
    card.className = "event-card";    // adding a class for styling

    // dynamically adds html content using the values from the form
    card.innerHTML = `
      <h3 class="eventId">${eventValue}</h3>
      <h3 class="nameValue">${nameValue}</h3>
      <p class="descriptionValue">${descriptionValue}</p>
      <p class="formattedDate">${formattedDate}</p>
      <p class="venueName">${venueNameValue}</p>
      <p class="venueAddress">${venueAddressValue}</p>
      <button class="deleteBtn">Delete</button>
    `;

    const deleteBtn = card.querySelector('.deleteBtn');   // adding a click event to remove the form input via 'delete' button
      deleteBtn.addEventListener('click', () => {
        card.remove();
      });

    cardContainer.appendChild(card);    // adds a new event the user input in the form and appears on the page

    form.reset();   // resets the form for any additional user inputs
    });
  });
