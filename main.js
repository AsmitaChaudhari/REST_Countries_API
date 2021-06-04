// IIFE
(function () {
    class Country {
      #country;
      #neighborCapitals;
  
      findExactCountry(countries, countryName) {
        if (!Array.isArray(countries)) {
          throw Error("Please pass in valid countries array!");
        }
        if (countries.length > 1) {
          return countries.filter((country) => {
            return country.name.toLowerCase() == countryName.toLowerCase();
          })[0];
        }
        return countries[0];
      }
  
      getCapital() {
        if (this.#country) {
          return this.#country.capital;
        }
        return "";
      }
  
      async fetchCountryByName(name) {
        try {
          const response = await fetch(
            `https://restcountries.eu/rest/v2/name/${name}`
          );
          const countries = await response.json();
          if (countries.status == 404) {
            return false;
          }
          return this.findExactCountry(countries, name);
        } catch (err) {
          return console.error(`Unable to fetch details of ${name}`, err);
        }
      }
  
      async fetchNeighborCapitals(neighborCountries) {
        if (!Array.isArray(neighborCountries)) {
          throw Error(
            "Please pass in valid borders' list of neighbor countries!"
          );
        }
  
        const capitals = [];
        const numberOfNeighborhoods = neighborCountries.length;
  
        for (let i = 0; i < numberOfNeighborhoods; i++) {
          try {
            const response = await fetch(
              `https://restcountries.eu/rest/v2/alpha?codes=${neighborCountries[i]}`
            );
            const country = await response.json();
  
            if (country) {
              capitals.push(country[0].capital);
            }
  
            if (i == numberOfNeighborhoods - 1) {
              return capitals;
            }
          } catch (err) {
            return console.error(
              `Unable to fetch details of country ${neighborCountries[i]}!`
            );
          }
        }
      }
  
      async init(countryName) {
        this.#country = await this.fetchCountryByName(countryName);
  
        this.#neighborCapitals = this.#country
          ? await this.fetchNeighborCapitals(this.#country.borders)
          : [];
        this.render();
      }
  
      render() {
        const countryNode = document.querySelector('#country');
        const capitalNode = document.querySelector("#capital");
        const neighborCapitalList = document.querySelector("#neighborCapital");
        
        countryNode.innerText = (this.#country) ? this.#country.name : '';
        capitalNode.innerText = this.getCapital();
  
        if (neighborCapitalList.children.length > 0) {
          this.removeChildren(neighborCapitalList);
        }
  
        const capitalsFragment = document.createDocumentFragment();
        this.#neighborCapitals.forEach((capital) => {
          const li = document.createElement("li");
          li.innerText = capital;
          capitalsFragment.appendChild(li);
        });
  
        neighborCapitalList.appendChild(capitalsFragment);
      }
  
      removeChildren(element) {
        while (element.firstChild) {
          element.firstChild.remove();
        }
      }
    }
  
    const country = new Country();
    const btnFetchCountry = document.querySelector("#btnFetchCountry");
    btnFetchCountry.addEventListener("click", updateUI);
  
    function updateUI() {
      const countryEl = document.querySelector("#country-name");
      const countryName = countryEl.value;
      
      country.init(countryName);
    }
  })();
  