// PLAN:
// Core Requirements -
// Create STATE object
//      - all breweries array = by_state Fetch.
// Add event listener for form submit - #select-state-form
//      - make sure submit is not empty / and is an actual state.
//          - if statement on input.value.length / .lowercase.find() on us state array. 
//              - US States array = all states in separate strings
//              - used to compare with the #select-state-form submit.
//          - if state has space in it, replace with underscore and save to variable.
//      - prevent default behaviour.
//      - Call GET function.
// Create GET FUNCTION
//      - make a fetch request by_state from brewery API, using saved state variable:
//      - GET https://api.openbrewerydb.org/breweries?by_state=USER_SUBMITTED_STATE&per_page=50
//      - save data to all breweries array in state object.
//      - filter the breweries array 3 times. (Could be its own Function and called here.)
//          - Once for Micro Breweries. Save to respective Array.
//          - Once for Regional Breweries. Save to respective Array.
//          - Once for BrewPub Breweries. Save to respective Array.
// Create variables for Micro, Regional, BrewPub - default value True.
// Create Render Function
//      - clear inner html
//      - Render state.micro AND/OR state.regional AND/OR state.brewpub 
//          - IF relevant variable is true - Render.
//      - loop through correct array
//          - create document elements
//          - add attributes
//          - append
// Filter By Type selector
//      - By default Micro, Regional, Brewpub variables will be true.
//      - Add Event listener to drop down menu
//          - change variables to false if not selected.
//          - ReRender

// PLAN:
// Core Requirements -
// Create STATE object
//      - all breweries array = by_state Fetch.
// Add event listener for form submit - #select-state-form
//      - make sure submit is not empty / and is an actual state.
//          - if statement on input.value.length / .lowercase.find() on us state array. 
//          - if state has space in it, replace with underscore and save to variable.
//      - prevent default behaviour.
//      - Call GET function.
// Create GET FUNCTION
//      - make a fetch request by_state from brewery API, using saved state variable:
//      - GET https://api.openbrewerydb.org/breweries?by_state=USER_SUBMITTED_STATE&per_page=50
//      - save data to all breweries array in state object.
// Create Render Function
//      - clear inner html
//      - breweries.filter what we want
//          - Render filtered array
//            - loop through correct array
//            - create document elements
//            - add attributes
//            - append
// Filter By Type selector
//      - Add Event listener to drop down menu
//          - filter to what we want
//          - render filtered array.



// STATE
const state = {
    breweries: [],
};

// VARIABLES
const usStates = [
    "alabama", "alaska", "arizona", "arkansas", 
    "california", "colorado", "connecticut", "delaware", 
    "florida", "georgia", "hawaii", "idaho", 
    "illinois", "indiana", "iowa", "kansas", 
    "kentucky", "louisiana", "maine", "maryland", 
    "massachusetts", "michigan", "minnesota", "mississippi", 
    "missouri", "montana", "nebraska", "nevada", 
    "new hampshire", "new jersey", "new mexico", "new york", 
    "north carolina", "north dakota", "ohio", "oklahoma", 
    "oregon", "pennsylvania", "rhode island", "south carolina", 
    "south dakota", "tennessee", "texas", "utah", 
    "vermont", "virginia", "washington", "west virginia", 
    "wisconsin"
]

// SELECT EXISTING HTML ELEMENTS
const stateForm = document.querySelector("#select-state-form")
const stateInput = document.querySelector("#select-state")
const breweryUL = document.querySelector("#breweries-list")

// EVENT LISTENERS

function submitFormListen() {
    stateForm.addEventListener('submit', (event) => {
        event.preventDefault()
        // stateInput.value = what was typed in.
        const stateSubmit = stateInput.value.toLowerCase()
        if(stateSubmit.length < 4){
            // shortest state name is 4 characters.
            return alert("Must be at least 4 character long")
        }
        if(usStates.find(stateName => stateName === stateSubmit) === undefined){
            return alert("That is not a real/correctly spelt State")
        }

        const true_state = (stateSubmit.replace(/ /g,"_"))
        getAllBreweries(true_state)
    })
}

// NETWORK REQUESTS
function getAllBreweries(stateName) {
    fetch(`https://api.openbrewerydb.org/breweries?by_state=${stateName}&per_page=50`)
    .then((response) => {
        console.log(response.status)
        return response.json()
    })
    .then((allBreweries) => {
        state.breweries = allBreweries
        console.log(state.breweries)
        renderAllBreweries()
    })

}

// RENDERING
function renderAllBreweries() {
    breweryUL.innerHTML = "";
    console.log("Beginning of render all breweries")
    // filter for all micro, regional, AND brewpubs.
    const filteredBreweries = state.breweries.filter((data) => {
        if(data.brewery_type === "micro" || data.brewery_type === "regional" || data.brewery_type === "brewpub") {
            return true
        }
    })
    console.log("Filtered breweries:", filteredBreweries)
    // Render reduced version
    filteredBreweries.forEach((brewery) => {
        console.log("Inside filtered for each")
        // CREATING
        const brewLI = document.createElement("li")

        const brewH2 = document.createElement("h2")
        brewH2.innerText = brewery.name

        const brewDiv = document.createElement("div")
        brewDiv.className = "type"
        brewDiv.innerText = brewery.brewery_type

        const addressSection = document.createElement("section")
        addressSection.className = "address"

        const addressH3 = document.createElement("h3")
        const roadP = document.createElement("p")
        const areaP = document.createElement("p")

        addressH3.innerText = "Address:"
        roadP.innerText = brewery.street
        // areaP.innerText = "<strong>${brewery.city}, ${brewery.postal_code}</strong>"

        // APPENDING
        addressSection.append(addressH3, roadP, areaP)

        // CREATING
        const phoneSection = document.createElement("section")
        phoneSection.className = "phone"

        const phoneH3 = document.createElement("h3")
        const phoneP = document.createElement("p")

        phoneH3.innerText = "Phone:"
        if(brewery.phone === null){
            phoneP.innerText = "N/A"
        } else {
            phoneP.innerText = brewery.phone
        }

        // APPENDING
        phoneSection.append(phoneH3, phoneP)

        // CREATING
        const websiteSection = document.createElement("section")
        websiteSection.className = "link"

        const websiteAn = document.createElement("a")
        websiteAn.href = brewery.website_url
        websiteAn.target = "_blank"
        websiteAn.innerText = "Visit Website"

        // APPENDING
        websiteSection.append(websiteAn)

        //FINAL APPEND
        brewLI.append(brewH2, brewDiv, addressSection, phoneSection, websiteSection)
        breweryUL.append(brewLI)
    })
  }

// START
submitFormListen()
renderAllBreweries()