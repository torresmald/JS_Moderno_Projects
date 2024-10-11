// VARIABLES
const formulario = document.querySelector('#agregar-gasto')
const gastosList = document.querySelector('#gastos ul')

// CLASES

class Presupuesto {
    constructor(presupuesto) {
        this.total = presupuesto
        this.restante = presupuesto
        this.gastos = []
    }
    agregarGasto(gasto) {
        this.gastos.push(gasto)
    }

    actualizarRestante(gasto){
        this.restante -= gasto.cantidad
        ui.actualizarRestanteColor()
        ui.deshabilitarFormulario()
    }
    borrarGasto(id){
        const gastoReembolso = this.gastos.find((gasto) => gasto.id === id)
        this.reembolsarGasto(gastoReembolso.cantidad)
        this.gastos = this.gastos.filter(gasto => gasto.id !== id)
        ui.pintarGastos()
    }
    reembolsarGasto(cantidad){
        this.restante += Number(cantidad)
        ui.pintarPresupuesto(presupuesto)
        ui.actualizarRestanteColor()        
    }
}

class UI {
    pintarPresupuesto(presupuesto) {
        const { total, restante } = presupuesto
        document.querySelector('#total').textContent = total
        document.querySelector('#restante').textContent = restante
    }

    mostarAlerta(mensaje, tipo) {
        const divAlerta = document.createElement('div')
        divAlerta.classList.add('text-center', 'alert')
        divAlerta.textContent = mensaje
        tipo === 'alert' ? divAlerta.classList.add('alert-danger') : divAlerta.classList.add('alert-success')
        document.querySelector('.primario').insertBefore(divAlerta, formulario)

        setTimeout(() => {
            divAlerta.remove()
        }, 3000);
        formulario.reset()
    }

    pintarGastos() {
        this.limpiarGastos()
        presupuesto.gastos.forEach((gasto) => {
            const {nombre, cantidad, id} = gasto
            const gastoItem = document.createElement('li')
            gastoItem.className = 'list-group-item d-flex justify-content-between align-items-center'
            gastoItem.dataset.id = id
            gastoItem.innerHTML = `
                 ${nombre}
                <span class="badge badge-primary badge-pill"> ${cantidad}</span>
            `
            const buttonBorrar = document.createElement('button')
            buttonBorrar.classList.add('btn', 'btn-danger', 'borrar-gasto')
            buttonBorrar.textContent = 'X'
            buttonBorrar.onclick = () => {
                presupuesto.borrarGasto(id)
            }
            gastoItem.appendChild(buttonBorrar)
            gastosList.appendChild(gastoItem)

        })

    }

    limpiarGastos(){
        while(gastosList.firstChild){
            gastosList.removeChild(gastosList.firstChild)
        }
    }
    actualizarRestanteColor(){
        document.querySelector('#restante').textContent = presupuesto.restante
        const restanteElement = document.querySelector('.restante');
        if (presupuesto.total / 4 > presupuesto.restante) {
            restanteElement.classList.add('alert-danger');
        } else if (presupuesto.total / 2 > presupuesto.restante) {
            restanteElement.classList.add('alert-warning');
        } else {
            restanteElement.classList.add('alert-success');
        }
       
    }

    deshabilitarFormulario(){
        if(presupuesto.restante <= 0){
            const btnForm = document.querySelector('#agregar-gasto button')
            btnForm.setAttribute('disabled', true)
            this.mostarAlerta('Presupuesto Agotado', 'alert')
        }
    }
}

const ui = new UI();


// FUNCIONES

let presupuesto;

const preguntarPresupuesto = () => {
    const presupuestoUsuario = prompt('¿Cual es el presupuesto?')
    if (presupuestoUsuario <= 0 || isNaN(presupuestoUsuario) || presupuestoUsuario === '' || presupuestoUsuario === null) {
        window.location.reload()
    }

    presupuesto = new Presupuesto(Number(presupuestoUsuario))
    ui.pintarPresupuesto(presupuesto)
}

const agregarGasto = event => {
    event.preventDefault();
    const gastoInput = document.querySelector('#gasto').value
    const cantidadInput = document.querySelector('#cantidad').value
    if (gastoInput.trim() === '' || cantidadInput <= 0 || isNaN(cantidadInput)) {
        ui.mostarAlerta('Todos los campos son Obligatorios', 'alert')
        return
    }
    const gasto = {
        nombre: gastoInput,
        cantidad: cantidadInput,
        id: Date.now()
    }
    presupuesto.agregarGasto(gasto)
    ui.mostarAlerta('Agregado', 'success')
    ui.pintarGastos()
    presupuesto.actualizarRestante(gasto)
}


//LISTENERS

document.addEventListener('DOMContentLoaded', preguntarPresupuesto)
formulario.addEventListener('submit', agregarGasto)
