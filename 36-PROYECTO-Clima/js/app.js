const formulario = document.querySelector('#formulario')
const resultado = document.querySelector('#resultado')
const APIKEY = '9eab8f76734a534afb009b2da8a4c29c'



const enviarDatos = event => {
    event.preventDefault();
    validate()

    
}


const validate = () => {
    const ciudad = document.querySelector('#ciudad').value
    const pais = document.querySelector('#pais').value

    if(ciudad === '' || pais === '') {
        const previousAlert = document.querySelector('.bg-red-500')
        if(previousAlert){
            cleanAlert()
        }
        const alert = document.createElement('p')
        alert.textContent = 'Todos los campos son obligatorios'
        alert.classList.add('bg-red-500', 'p-2', 'text-white', 'text-center', 'mt-5')
        formulario.appendChild(alert)
        setTimeout(() => {
            alert.remove()
            formulario.reset()
        }, 3000);
        return
    }
    getLatLon(ciudad, pais)
}

const cleanAlert = () => {
    const previousAlert = document.querySelector('.bg-red-500')
    previousAlert.remove()

}

const getLatLon = (ciudad, pais) => {
    const url = `http://api.openweathermap.org/geo/1.0/direct?q=${ciudad},${pais}&appid=${APIKEY}`
   fetch(url)
        .then(response => response.json())
        .then(response =>  consultarDatos(response[0]))
}

const consultarDatos = (datos) => {
    const {lat, lon} = datos
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIKEY}`

    fetch(url)
    .then(response => response.json())
    .then(response =>  paintData(response.main))
}


const paintData = (datos) => {
    console.log('datos',datos)

    limpiarHtml()
    const {temp, temp_min, temp_max} = datos

    const tempP = document.createElement ('p')
    tempP.textContent = temp
    const tempMin = document.createElement ('p')
    tempMin.textContent = temp_min
    const tempMax = document.createElement ('p')
    tempMax.textContent = temp_max

    resultado.appendChild(tempMin)
    resultado.appendChild(tempMax)
    resultado.appendChild(tempP)
}

const limpiarHtml = () => {
    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild)
    }
}

formulario.addEventListener('submit', enviarDatos)