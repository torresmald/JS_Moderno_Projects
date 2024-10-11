// SELECTORES 

const pacienteInput = document.querySelector('#paciente')
const propietarioInput = document.querySelector('#propietario')
const emailInput = document.querySelector('#email')
const fechaInput = document.querySelector('#fecha')
const sintomasInput = document.querySelector('#sintomas')

const formulario = document.querySelector('#formulario-cita')
const btnEnviar = document.querySelector('#formulario-cita input[type="submit"]')
const contenedorCitas = document.querySelector('#citas')


const pacienteObject = {
    paciente: '',
    propietario: '',
    email: '',
    fecha: '',
    sintomas: '',
}

let editando = false;


class Alerta {
    constructor(mensaje, tipo) {
        this.mensaje = mensaje
        this.tipo = tipo
    }

    mostrarAlerta() {
        const divAlerta = document.createElement('div')
        divAlerta.classList.add('text-center', 'w-full', 'p-3', 'text-white', 'my-5', 'alert', 'uppercase', 'font-bold', 'text-sm')
        divAlerta.textContent = this.mensaje
        this.tipo === 'error' ? divAlerta.classList.add('bg-red-500') : divAlerta.classList.add('bg-green-500')
        this.limpiarAlerta()
        formulario.parentElement.insertBefore(divAlerta, formulario)
        setTimeout(() => {
            divAlerta.remove()
        }, 3000);
    }

    limpiarAlerta() {
        const alerta = document.querySelector('.alert')
        alerta?.remove()
    }

}

class Citas {
    constructor() {
        this.citas = []
    }

    agregarCita(cita) {
        const nuevaCita = {
            ...cita, id: new Date().getMilliseconds()
        }
        this.citas = [...this.citas, nuevaCita]
    }

    mostrarCitas() {
        while (contenedorCitas.firstChild) {
            contenedorCitas.removeChild(contenedorCitas.firstChild)
        }
        if(this.citas.length === 0){
            const noCitas = document.createElement('p');
            noCitas.textContent = 'No hay Pacientes'
            noCitas.classList.add('text-xl', 'mt-5', 'mb-10', 'text-center');
            contenedorCitas.appendChild(noCitas);
            return
        }

        this.citas.forEach(cita => {
            const divCita = document.createElement('div');
            divCita.classList.add('mx-5', 'my-10', 'bg-white', 'shadow-md', 'px-5', 'py-10', 'rounded-xl', 'p-3');

            const paciente = document.createElement('p');
            paciente.classList.add('font-normal', 'mb-3', 'text-gray-700', 'normal-case')
            paciente.innerHTML = `<span class="font-bold uppercase">Paciente: </span> ${cita.paciente}`;

            const propietario = document.createElement('p');
            propietario.classList.add('font-normal', 'mb-3', 'text-gray-700', 'normal-case')
            propietario.innerHTML = `<span class="font-bold uppercase">Propietario: </span> ${cita.propietario}`;

            const email = document.createElement('p');
            email.classList.add('font-normal', 'mb-3', 'text-gray-700', 'normal-case')
            email.innerHTML = `<span class="font-bold uppercase">E-mail: </span> ${cita.email}`;

            const fecha = document.createElement('p');
            fecha.classList.add('font-normal', 'mb-3', 'text-gray-700', 'normal-case')
            fecha.innerHTML = `<span class="font-bold uppercase">Fecha: </span> ${cita.fecha}`;

            const sintomas = document.createElement('p');
            sintomas.classList.add('font-normal', 'mb-3', 'text-gray-700', 'normal-case')
            sintomas.innerHTML = `<span class="font-bold uppercase">Síntomas: </span> ${cita.sintomas}`;

            const divButtons = document.createElement('div');
            divButtons.classList.add('flex', 'justify-between');


            const btnEditar = document.createElement('button');
            btnEditar.classList.add('py-2', 'px-10', 'bg-indigo-600', 'hover:bg-indigo-700', 'text-white', 'font-bold', 'uppercase', 'rounded-lg', 'flex', 'items-center', 'gap-2');
            btnEditar.innerHTML = 'Editar <svg fill="none" class="h-5 w-5" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>'
            btnEditar.onclick = () => {
                this.editarPaciente(cita.id)
            }

            const btnEliminar = document.createElement('button');
            btnEliminar.classList.add('py-2', 'px-10', 'bg-red-600', 'hover:bg-red-700', 'text-white', 'font-bold', 'uppercase', 'rounded-lg', 'flex', 'items-center', 'gap-2');
            btnEliminar.innerHTML = 'Eliminar <svg fill="none" class="h-5 w-5" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>'
            btnEliminar.onclick = () => {
                this.eliminarPaciente(cita.id)
            }

            divButtons.appendChild(btnEditar);
            divButtons.appendChild(btnEliminar);

            // Agregar al HTML
            divCita.appendChild(paciente);
            divCita.appendChild(propietario);
            divCita.appendChild(email);
            divCita.appendChild(fecha);
            divCita.appendChild(sintomas);
            divCita.appendChild(divButtons);
            contenedorCitas.appendChild(divCita);
        });
    }

    limpiarFormulario() {
        formulario.reset()
    }
    limpiarObjectoCita() {
        console.log(pacienteObject);

        Object.assign(pacienteObject, {
            paciente: '',
            propietario: '',
            email: '',
            fecha: '',
            sintomas: '',
        })
    }

    eliminarPaciente(id) {
        const response = confirm('¿Estas seguro en eliminar?')
        if (response) {
            this.citas = this.citas.filter(cita => cita.id !== id)
            this.mostrarCitas()
        }
    }

    editarPaciente(id) {
            const citaEditar = this.citas.find(cita => cita.id === id)
            const {paciente, propietario, email, fecha, sintomas} = citaEditar
            pacienteInput.value = paciente
            propietarioInput.value = propietario
            emailInput.value = email
            fechaInput.value = fecha
            sintomasInput.value = sintomas
            Object.assign(pacienteObject, citaEditar)     
            editando = true   
            btnEnviar.value = 'EDITAR'                
    }

    editarCita(citaActualizada){
        this.citas = this.citas.map(cita => cita.id === citaActualizada.id ? citaActualizada: cita)
        this.mostrarCitas()
    }
}


const cita = new Citas()

//LISTENERS

const loadListeners = () => {
    setListener(pacienteInput, 'change', fillObject)
    setListener(propietarioInput, 'change', fillObject)
    setListener(emailInput, 'change', fillObject)
    setListener(fechaInput, 'change', fillObject)
    setListener(sintomasInput, 'change', fillObject)
    setListener(formulario, 'submit', validate)
}

const setListener = (name, type, callback) => name.addEventListener(type, callback)

const fillObject = (event) => {
    const { name, value } = event.target
    pacienteObject[name] = value
}

const validate = (event) => {
    event.preventDefault();
    if (Object.values(pacienteObject).includes('')) {
        const alerta = new Alerta('Todos los campos son obligatorios', 'error')
        alerta.mostrarAlerta()
        return
    }

    if(editando){
        cita.editarCita({...pacienteObject})
        const alerta = new Alerta('Cita modificada correctamente', 'exito')
        alerta.mostrarAlerta() 
    } else {
        cita.agregarCita({...pacienteObject})
        const alerta = new Alerta('Cita guardada correctamente', 'exito')
        alerta.mostrarAlerta() 
    }
    
    cita.mostrarCitas()
    cita.limpiarFormulario()
    cita.limpiarObjectoCita()
    editando = false
    btnEnviar.value = 'REGISTRAR PACIENTE' 

}


loadListeners()
