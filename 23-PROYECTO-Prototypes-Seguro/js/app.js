const formulario = document.querySelector('#cotizar-seguro')
const resultadoDiv = document.querySelector('#resultado')


function Seguro(marca, year, tipo) {
    this.marca = marca
    this.year = year
    this.tipo = tipo
}

Seguro.prototype.calcularPrecio = function () {
    let cantidad;
    const base = 2000;
    switch (this.marca) {
        case '1':
            cantidad = base * 1.15
            break;
        case '2':
            cantidad = base * 1.05
            break;
        case '3':
            cantidad = base * 1.35
            break;
        default:
            break;
    }
    const diferencia = new Date().getFullYear() - this.year
    cantidad -= ((diferencia * 3) * cantidad) / 100
    if (this.tipo === 'basico') {
        cantidad *= 1.30
    } else {
        cantidad *= 1.50
    }
    return cantidad
}



function UI() { }


UI.prototype.llenarOpciones = () => {
    const max = new Date().getFullYear()
    const min = max - 20
    const select = document.querySelector('#year')
    for (let index = max; index > min; index--) {
        const opcion = document.createElement('option')
        opcion.value = index
        opcion.textContent = index
        select.appendChild(opcion)
    }
}

UI.prototype.showMessage = function (message, className) {
    const error = document.createElement('p')
    error.classList.add(className)
    error.textContent = message
    formulario.appendChild(error)
    setTimeout(() => {
        ui.cleanMessage()
    }, 3000);
}



UI.prototype.cleanMessage = () => {
    const message = document.querySelector('.error') || document.querySelector('.correcto')
    if (message)
        message.remove()
}

UI.prototype.borrarResultado = () => {
    while (resultadoDiv.firstChild)
        resultadoDiv.removeChild(resultadoDiv.firstChild)
}

UI.prototype.mostrarResultado = (total, seguro) => {
    let marca;
    switch (seguro.marca) {
        case '1':
            marca = 'Americano'
            break;
        case '2':
            marca = 'Asiatico'
            break;
        case '3':
            marca = 'Europeo'
            break;
        default:
            break;
    }
    const divTotal = document.createElement('div')
    divTotal.classList.add('mt-10')
    divTotal.innerHTML = `
        <p class="header">Tu resumen</p>
        <p class="font-bold">Total: ${total}€</p>
        <p class="font-bold">Marca: ${marca}</p>
        <p class="font-bold">Año: ${seguro.year}</p>
        <p class="font-bold">Tipo: ${seguro.tipo}</p>
    `
    const spinner = document.querySelector('#cargando')
    spinner.style.display = 'block'
    setTimeout(() => {
        spinner.style.display = 'none'
        resultadoDiv.appendChild(divTotal)

    }, 3000);
}

const ui = new UI()

document.addEventListener('DOMContentLoaded', () => {
    ui.llenarOpciones()
})



const loadListeners = () => {
    formulario.addEventListener('submit', cotizar)
}

const cotizar = event => {
    event.preventDefault();
    ui.cleanMessage()
    const marca = document.querySelector('#marca').value
    const year = document.querySelector('#year').value
    const tipo = document.querySelector('input[name="tipo"]:checked').value
    if (marca === '' || year === '' || tipo === '') {
        console.log('Mostrar error');
        ui.showMessage('Revisa el Formulario', 'error')
        // showError()
    } else {
        console.log('TODO OK');
        ui.showMessage('Cotizando', 'correcto')
        ui.borrarResultado()
        const seguro = new Seguro(marca, year, tipo)
        const total = seguro.calcularPrecio()

        ui.mostrarResultado(total, seguro)
    }


}
loadListeners()