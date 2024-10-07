const brand = document.querySelector('#marca')
const yearSelect = document.querySelector('#year')
const minPrice = document.querySelector('#minimo')
const maxPrice = document.querySelector('#maximo')
const doors = document.querySelector('#puertas')
const color = document.querySelector('#color')
const transmision = document.querySelector('#transmision')

const results = document.querySelector('#resultado')

const carObject = {
    marca: '',
    year: '',
    minimo: '',
    maximo: '',
    puertas: '',
    color: '',
    transmision: '',
}

const loadListeners = () => {
    setListener(brand, 'change', fillObjectCar)
    setListener(yearSelect, 'change', fillObjectCar)
    setListener(minPrice, 'change', fillObjectCar)
    setListener(maxPrice, 'change', fillObjectCar)
    setListener(doors, 'change', fillObjectCar)
    setListener(color, 'change', fillObjectCar)
    setListener(transmision, 'change', fillObjectCar)

}

const setListener = (name, type, callback) => name.addEventListener(type, callback)

const paintCars = (cars) => {
    cars.forEach(car => {
        const { marca, modelo, year, precio, puertas, color, transmision } = car
        const carHTML = document.createElement('p')
        carHTML.innerHTML = `
            ${marca} ${modelo} - ${year} - ${precio}€ - ${puertas} Puertas - ${color} - ${transmision}
        `
        results.appendChild(carHTML)
    })
}

const insertYears = () => {
    const maxYear = new Date().getFullYear()
    const minYear = maxYear - 10
    for (let index = maxYear; index > minYear; index--) {
        const optionYear = document.createElement('option')
        optionYear.textContent = index
        optionYear.setAttribute('value', index)
        yearSelect.appendChild(optionYear)
    }
}

const fillObjectCar = event => {
    const { target: { value }, srcElement: { id: field } } = event
    carObject[field] = value
    filterCars(value)

}


const filterCars = () => {
    const filteredCars = cars.filter(filterBrand).filter(filterYear)
        .filter(filterMinimum).filter(filterMaximum)
        .filter(filterDoors).filter(filterColor).filter(filterTransmision)
    removeResults()
    if (filteredCars.length === 0) {
        paintNoResults( )
        return
    }
    paintCars(filteredCars)
    //return filteredCars
}

const filterBrand = car => {
    const { marca } = carObject
    if (marca) {
        return car.marca === marca
    }
    return car
}

const filterYear = car => {
    const { year } = carObject
    if (year) {
        return car.year === parseInt(year)
    }
    return car
}

const filterMinimum = car => {
    const { minimo } = carObject
    if (minimo) {
        return car.precio >= minimo
    }
    return car
}

const filterMaximum = car => {
    const { maximo } = carObject
    if (maximo) {
        return car.precio <= maximo
    }
    return car
}

const filterDoors = car => {
    const { puertas } = carObject
    if (puertas) {
        return car.puertas === parseInt(puertas)
    }
    return car
}

const filterColor = car => {
    const { color } = carObject
    if (color) {
        return car.color === color
    }
    return car
}

const filterTransmision = car => {
    const { transmision } = carObject
    if (transmision) {
        return car.transmision === transmision
    }
    return car
}

const removeResults = () => {
    while (results.firstChild) {
        results.removeChild(results.firstChild)
    }
}

const paintNoResults = () => {
    const noResults = document.createElement('p')
    noResults.textContent = 'No hay resultados'
    noResults.classList.add('alerta', 'error')
    results.appendChild(noResults)
}

insertYears()
paintCars(cars)
loadListeners()