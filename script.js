document.addEventListener('DOMContentLoaded', () => {
    const countriesContainer = document.getElementById('countries-container');
    const searchInput = document.getElementById('search');
    const regionFilter = document.getElementById('region-filter');
    const themeSwitcher = document.getElementById('theme-switcher');
    const countryDetailsModal = document.getElementById('country-details');
    const countryInfo = document.getElementById('country-info');
    const modalClose = document.querySelector('.close');

    let allCountries = [];

    fetch('data.json') 
        .then(response => response.json())
        .then(data => {
            allCountries = data;
            displayCountries(data);
        });

    
    function displayCountries(countries) {
        countriesContainer.innerHTML = '';
        countries.forEach(country => {
            const countryCard = document.createElement('div');
            countryCard.classList.add('country-card');
            countryCard.innerHTML = `
                <img src="${country.flags.png}" alt="${country.name}">
                <div class="card-content">
                    <h3>${country.name}</h3>
                    <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
                    <p><strong>Region:</strong> ${country.region}</p>
                    <p><strong>Capital:</strong> ${country.capital}</p>
                </div>
            `;
            countryCard.addEventListener('click', () => showCountryDetails(country));
            countriesContainer.appendChild(countryCard);
        });
    }

    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredCountries = allCountries.filter(country => 
            country.name.toLowerCase().includes(searchTerm)
        );
        displayCountries(filteredCountries);
    });

    regionFilter.addEventListener('change', () => {
        const region = regionFilter.value;
        const filteredCountries = region ? 
            allCountries.filter(country => country.region === region) : 
            allCountries;
        displayCountries(filteredCountries);
    });

    themeSwitcher.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        themeSwitcher.textContent = document.body.classList.contains('dark-mode') ? 'Light Mode' : 'Dark Mode';
    });

    function showCountryDetails(country) {
        countryInfo.innerHTML = `
            <h2>${country.name}</h2>
            <img src="${country.flags.png}" alt="${country.name}">
            <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
            <p><strong>Region:</strong> ${country.region}</p>
            <p><strong>Sub Region:</strong> ${country.subregion}</p>
            <p><strong>Capital:</strong> ${country.capital}</p>
            <p><strong>Top Level Domain:</strong> ${country.topLevelDomain.join(', ')}</p>
            <p><strong>Currencies:</strong> ${country.currencies.map(c => c.name).join(', ')}</p>
            <p><strong>Languages:</strong> ${country.languages.map(l => l.name).join(', ')}</p>
            <h3>Border Countries:</h3>
            <div class="border-countries">
                ${country.borders.map(border => `<button class="border-country">${border}</button>`).join('')}
            </div>
        `;
        countryDetailsModal.style.display = 'block';

        document.querySelectorAll('.border-country').forEach(button => {
            button.addEventListener('click', () => {
                const borderCountry = allCountries.find(c => c.alpha3Code === button.textContent);
                showCountryDetails(borderCountry);
            });
        });
    }

    
    modalClose.addEventListener('click', () => {
        countryDetailsModal.style.display = 'none';
    });

    
    window.addEventListener('click', (event) => {
        if (event.target == countryDetailsModal) {
            countryDetailsModal.style.display = 'none';
        }
    });
});
