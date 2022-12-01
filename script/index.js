
//ellements in the DOM
const search = document.getElementById("search");
const filter = document.getElementById("filter");
const modal = document.getElementById("window");

//call to api
async function getData() {
    const resp = await fetch("https://restcountries.com/v3.1/all");
    const data = await resp.json();
    return data;
}
//filter by region
filter.addEventListener("change", async () => {
    const countries = await getData();
    const filterList = countries.filter(element => element.region == filter.value);
    print(filterList, 250);
})
//filter by search
search.addEventListener("input", async (e) => {
    const countries = await getData();
    const searchLists = countries.filter(element => element.name.common.toLowerCase().includes(e.target.value.toLowerCase()));
    print(searchLists, 10);
})
//print ellements to DOM, items determines the number of items to display
async function print(data, items) {
    const infoCountry = await data;
    const container = document.getElementById("container");
    let acumulator = "";
    const condition = infoCountry.length > items ? items : infoCountry.length;
    for (let i = 0; i < condition; i++) {
        acumulator += `
        <div class="card" style="width: 18rem;">
            <img src="${infoCountry[i].flags.png}" class="card-img-top" alt="flag">
            <div class="card-body">
                <h5 class="card-title">${infoCountry[i].name.common}</h5>
                <p class="card-text"><b>Population:</b> ${infoCountry[i].population}</p>
                <p class="card-text"><b>Region:</b> ${infoCountry[i].region}</p>
                <p class="card-text"><b>Capital:</b> ${infoCountry[i].capital}</p>
                <button type="button" id="${infoCountry[i].name.common}" data-bs-toggle="modal" onclick="filterByName(this, getData())" data-bs-target="#infoModal" class="btn btn-primary">Show more info</button>
            </div>
        </div>
        `
    }
    container.innerHTML = acumulator;
}
//filter by name country selected
async function filterByName(country, data) {
    const array = await data;
    const countryName = country.id;
    const countryTarget = array.find(element => element.name.common == countryName);
    
    showInfo(countryTarget);
}


//print info in modal
function showInfo(data){
    //items to change
    const imgFlag = document.getElementById("imgFlag");
    const countryName = document.getElementById("modalTitle");
    const population = document.getElementById("population");
    const nativeName = document.getElementById("nativeName");
    const area = document.getElementById("area");
    const region = document.getElementById("region");
    const capital = document.getElementById("capital");
    const currencies = document.getElementById("currencies");
    const languages = document.getElementById("languages");
    const map = document.getElementById("map");

    //getInfo
    // get the data of the names of the currencies
    const getCurrencies = Object.values(data.currencies);
    let nameCurrencies ="";
    getCurrencies.forEach((e, index )=> {
        //if index is less than one, the name of the coin is printed, if it is equal to or greater than index it means that there is more than one element,
        // so we separate each element by comma
        index < 1 ? nameCurrencies += e.name  : nameCurrencies += ", " +  e.name;
    }); 
    // get the data of the languages
    const getLanguages = Object.values(data.languages);

    //show info
    imgFlag.src = data.flags.png;
    countryName.innerHTML = data.name.common;
    population.innerHTML = "<b> Population: </b>" +  new Intl.NumberFormat().format(data.population);
    nativeName.innerHTML = "<b> Native name: </b>" + data.name.official;
    area.innerHTML = " <b> Area: </b>" + new Intl.NumberFormat().format(data.area) + " km2";
    region.innerHTML = "<b> Region: </b>" + data.region;
    capital.innerHTML = "<b> Capital: </b>" + data.capital;
    currencies.innerHTML = "<b> Currencies: </b>" + nameCurrencies;
    languages.innerHTML = "<b> Languages: </b>" + getLanguages.join(", ");
    map.setAttribute("href", data.maps.googleMaps)
}



print(getData(), 10);

