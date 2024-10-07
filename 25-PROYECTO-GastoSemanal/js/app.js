// VARIABLES
const formulario = document.querySelector('#agregar-gasto')

// CLASES

class Presupuesto {
    constructor(presupuesto) {
        this.total = presupuesto
        this.restante = presupuesto
        this.gastos = []
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
        cantidad: cantidadInput
    }
    presupuesto.gastos.push(gasto)
    console.log(presupuesto);
    ui.mostarAlerta('Agregado', 'success')
}


//LISTENERS

document.addEventListener('DOMContentLoaded', preguntarPresupuesto)
formulario.addEventListener('submit', agregarGasto)
//loadListeners()