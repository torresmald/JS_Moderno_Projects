let cliente = {
    mesa: '',
    hora: '',
    pedido: [],
}

const categorias = {
    1: 'Comidas',
    2: 'Bebidas',
    3: 'Postres'
}

const contenido = document.querySelector('.contenido')

const agregarPedido = () => {
    const mesa = document.querySelector('#mesa').value
    const hora = document.querySelector('#hora').value
    const camposVacios = [mesa, hora].some(field => field === '')
    if (camposVacios) {
        showErrorModal()
        return
    }
    cliente = { ...cliente, mesa, hora }
    const modalFormulario = document.querySelector('#formulario')
    const modalBootstrap = bootstrap.Modal.getInstance(modalFormulario)
    modalBootstrap.hide()
    mostrarSecciones()
    getPlatillos()

}

const mostrarSecciones = () => {
    const seccionesOcultas = document.querySelectorAll('.d-none')
    seccionesOcultas.forEach(seccion => {
        seccion.classList.remove('d-none')
    });
}

const getPlatillos = () => {
    const url = 'http://localhost:4000/platillos'
    fetch(url)
        .then(response => response.json())
        .then(response => mostrarPlatillos(response))

}

const mostrarPlatillos = platillos => {
    platillos.forEach(platillo => {
        const row = document.createElement('div')
        row.classList.add('row', 'py-3', 'border-top')

        const nombre = document.createElement('div')
        nombre.classList.add('col-md-4')
        nombre.textContent = platillo.nombre

        const precio = document.createElement('div')
        precio.classList.add('col-md-3', 'fw-bold')
        precio.textContent = `${platillo.precio}€`

        const categoria = document.createElement('div')
        categoria.classList.add('col-md-3')
        categoria.textContent = categorias[platillo.categoria]

        const input = document.createElement('input')
        input.type = 'number'
        input.value = 0
        input.min = 0
        input.classList.add('form-control')
        input.id = `producto-${platillo.id}`
        input.onchange = () => {
            const cantidad = parseInt(input.value)
            agregarPlatillo({ ...platillo, cantidad })
        }

        const divInput = document.createElement('div')
        divInput.classList.add('col-md-2')
        divInput.appendChild(input)

        row.appendChild(nombre)
        row.appendChild(precio)
        row.appendChild(categoria)
        row.appendChild(divInput)

        contenido.appendChild(row)

    })
}

const agregarPlatillo = (platillo) => {
    let { pedido } = cliente
    if (platillo.cantidad > 0) {        
        const platilloIndex = pedido.findIndex(p => p.id === platillo.id)
        if (platilloIndex !== -1) {
            //actualizar
            const cantidad = platillo.cantidad
            pedido[platilloIndex].cantidad = cantidad            
        } else {
            cliente.pedido = [...pedido, platillo]
        }
    } else {
        cliente.pedido = cliente.pedido.filter(p => p.id !== platillo.id);
    }

    limpiarHtml()

    actualizarResumen()

    if(cliente.pedido.length === 0){
        noPedido()
    }
}

const limpiarHtml = () => {
    const contenido = document.querySelector('#resumen .contenido')
    while(contenido.firstChild){
        contenido.removeChild(contenido.firstChild)
    }

}

const actualizarResumen = () => {
    const contenido = document.querySelector('#resumen .contenido')

    const resumen = document.createElement('div')
    resumen.classList.add('col-md-6', 'card', 'py-2', 'px-3', 'shadow')

    const mesa = document.createElement('p')
    mesa.textContent = 'Mesa: '
    mesa.classList.add('fw-bold')

    const mesaSpan = document.createElement('span')
    mesaSpan.textContent= cliente.mesa
    mesaSpan.classList.add('fw-normal')

    const hora = document.createElement('p')
    hora.textContent = 'Hora: '
    hora.classList.add('fw-bold')

    const horaSpan = document.createElement('span')
    horaSpan.textContent= cliente.hora
    horaSpan.classList.add('fw-normal')

    const heading = document.createElement('h3')
    heading.textContent = 'Platos Consumidos'
    heading.classList.add('text-center', 'my-4')
    

    mesa.appendChild(mesaSpan)
    hora.appendChild(horaSpan)

    //ITERAR POR PEDIDOS

    const grupo = document.createElement('ul')
    grupo.classList.add('list-group')

    const {pedido} = cliente
    pedido.forEach((pedido) => {
        const {nombre, cantidad, id, precio} = pedido
        const li = document.createElement('li')
        li.classList.add('list-group-item')

        const nombreEl = document.createElement('p')
        nombreEl.textContent = nombre

        const cantidadEl = document.createElement('p')
        cantidadEl.classList.add('fw-bold')
        cantidadEl.textContent = 'Cantidad: '

        const cantidadValor = document.createElement('span')
        cantidadValor.textContent = cantidad
        cantidadValor.classList.add('fw-normal')
        cantidadEl.appendChild(cantidadValor)

        const precioEl = document.createElement('p')
        precioEl.classList.add('fw-bold')
        precioEl.textContent = 'Precio: '


        const precioValor = document.createElement('span')
        precioValor.textContent = precio + '€'
        precioValor.classList.add('fw-normal')
        precioEl.appendChild(precioValor)


        const subtotalEl = document.createElement('p')
        subtotalEl.classList.add('fw-bold')
        subtotalEl.textContent = 'Subtotal: '


        const subtotalValor = document.createElement('span')
        subtotalValor.textContent = precio * cantidad + '€'
        subtotalValor.classList.add('fw-normal')
        subtotalEl.appendChild(subtotalValor)


        const btnEliminar = document.createElement('button')
        btnEliminar.classList.add('btn', 'btn-danger')
        btnEliminar.textContent = 'Eliminar Producto'
        btnEliminar.onclick = () => {
            eliminarProducto(id)
        }

        li.appendChild(nombreEl)
        li.appendChild(cantidadEl)
        li.appendChild(precioEl)
        li.appendChild(subtotalEl)
        li.appendChild(btnEliminar)

        grupo.appendChild(li)

    })


    resumen.appendChild(heading)
    resumen.appendChild(mesa)
    resumen.appendChild(hora)
    resumen.appendChild(grupo)

    contenido.appendChild(resumen)

    mostrarPropinas()
}

const eliminarProducto = id => {
    cliente.pedido = cliente.pedido.filter(p => p.id !== id);

    const productoInput = document.querySelector(`#producto-${id}`)
    productoInput.value = 0

    limpiarHtml()

    actualizarResumen()

    if(cliente.pedido.length === 0){
        noPedido()
    }
}
const mostrarPropinas = () => {
    const contenido = document.querySelector('#resumen .contenido')

    const formulario = document.createElement('div')
    formulario.classList.add('col-md-6', 'formulario')

    const divFormulario = document.createElement('div')
    divFormulario.classList.add('card', 'py-2', 'px-3', 'shadow', 'propinas')
    
    const heading = document.createElement('h3')
    heading.textContent = 'Propina'
    heading.classList.add('my-4', 'text-center')




    
    
    formulario.appendChild(divFormulario)
    divFormulario.appendChild(heading)
    
    contenido.appendChild(formulario)
    createRadios(0, 'Sin Propina')
    createRadios(10, '10%')
    createRadios(20, '20%')
    createRadios(50, '50%')
}

const createRadios = (propina, textContent) => {
    const formulario = document.querySelector('.propinas')
    const radio = document.createElement('input')
    radio.type ='radio'
    radio.value = propina
    radio.name = 'propina'
    radio.classList.add('form-check-input')
    radio.onclick = () => {
        calcularPropina(propina)
    }

    const radioLabel = document.createElement('label')
    radioLabel.textContent = textContent
    radioLabel.classList.add('form-check-label')

    const radioDiv = document.createElement('div')
    radioDiv.classList.add('form-check')

    radioDiv.appendChild(radio)
    radioDiv.appendChild(radioLabel)
        
    formulario.appendChild(radioDiv)    
    
}

const calcularPropina = (propina) => {
    const {pedido} = cliente
    let subtotal = 0

    pedido.forEach(producto => subtotal+= producto.cantidad * producto.precio)

    const propinaTotal = (subtotal * propina) / 100

    const total = propinaTotal + subtotal
    
    mostrarTotal(subtotal, propinaTotal, total)
}

const mostrarTotal = (subtotal, propina, total) => {
    const previousDivTotales = document.querySelector('.total-pagar')
    if(previousDivTotales){
        previousDivTotales.remove()
    }
    const divTotales = document.createElement('div')
    divTotales.classList.add('total-pagar')
    
    const subtotalParrafo = document.createElement('p')
    subtotalParrafo.classList.add('fs-3', 'fw-bold', 'mt-5')
    subtotalParrafo.textContent = 'Subtotal: '

    const subtotalSpan = document.createElement('span')
    subtotalSpan.classList.add('fw-normal')
    subtotalSpan.textContent = subtotal + '€'
    subtotalParrafo.appendChild(subtotalSpan)

    const propinaParrafo = document.createElement('p')
    propinaParrafo.classList.add('fs-3', 'fw-bold', 'mt-5')
    propinaParrafo.textContent = 'Propina: '

    const propinaSpan = document.createElement('span')
    propinaSpan.classList.add('fw-normal')
    propinaSpan.textContent = propina + '€'
    propinaParrafo.appendChild(propinaSpan)


    const totalParrafo = document.createElement('p')
    totalParrafo.classList.add('fs-3', 'fw-bold', 'mt-5')
    totalParrafo.textContent = 'Total: '

    const totalSpan = document.createElement('span')
    totalSpan.classList.add('fw-normal')
    totalSpan.textContent = total + '€'
    totalParrafo.appendChild(totalSpan)



    divTotales.appendChild(subtotalParrafo)
    divTotales.appendChild(propinaParrafo)
    divTotales.appendChild(totalParrafo)

    const formulario = document.querySelector('.formulario > div')
    formulario.appendChild(divTotales)
}

const showErrorModal = () => {
    const previousAlert = document.querySelector('.modal-error')
    if (previousAlert) {
        previousAlert.remove()
    }
    const body = document.querySelector('.modal-body')
    const alert = document.createElement('p')
    alert.textContent = 'Todos los campos son obligatorios'
    alert.classList.add('modal-error')
    body.appendChild(alert)
    setTimeout(() => {
        alert.remove()
    }, 3000);
}

const noPedido = () => {
    const previousDivTotales = document.querySelector('.propinas')
    const contenido = document.querySelector('#resumen .contenido')
    const card = document.querySelector('.card')
    card.remove()
    previousDivTotales.remove()

    const texto = document.createElement('p')
    texto.classList.add('text-center')
    texto.textContent = 'Añade los elementos del pedido'

    contenido.appendChild(texto)
}

const btnAgregarPedido = document.querySelector('#guardar-cliente')
btnAgregarPedido.addEventListener('click', agregarPedido)
