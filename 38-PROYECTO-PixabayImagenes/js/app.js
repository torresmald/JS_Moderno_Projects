const formulario = document.querySelector('#formulario')
const resultado = document.querySelector('#resultado')
const paginacion = document.querySelector('#paginacion')
const url = 'https://pixabay.com/api/?key=46481488-6439ea13e3ee900529db1c248&'

const validate = event => {
    event.preventDefault();
    const value = document.querySelector('input[type="text"]').value
    if (!value) {
        showError()
        formulario.reset()
        return
    }

    //LLAMADA API
    getImages(value)
    formulario.reset()

}


const getImages = (text) => {
    fetch(`${url}q=${text}`)
        .then(response => response.json())
        .then(response => {
            const paginas = calcularPaginas(response.totalHits)
            console.log(paginas);
            
            crearPaginas(paginas, text)
            
            paintImages(response.hits)})
}

const paintImages = results => {
    limpiarHtml(resultado)
    if(results.length === 0){
        const noResults = document.createElement('p')
        noResults.textContent = 'No hay resultados'
        noResults.classList.add('bg-red-500', 'text-center', 'py-2', 'px-10', 'text-white', 'mt-3', 'mx-auto')
        resultado.appendChild(noResults)
        return
    }
    results.forEach(result => {
        const {largeImageURL, likes, views, pageURL} = result
        const divParent = document.createElement('div')
        divParent.style.maxWidth = '30%'
        divParent.style.margin = '10px'

        const divText = document.createElement('div')
        divText.classList.add('bg-white', 'p-5')

        const image = document.createElement('img')
        image.src = largeImageURL
        image.classList.add('w-full')
        const likesP = document.createElement('p')
        likesP.innerHTML = `
            <span class="font-bold">${likes}</span> Me Gusta    
        `
        const seenP = document.createElement('p')
        seenP.innerHTML = `
            <span class="font-bold">${views}</span> Veces Vista   
        
        `
        const button = document.createElement('a')
        button.classList.add('bg-blue-600', 'px-5', 'w-full', 'mx-auto', 'uppercase', 'text-white', 'text-center', 'block')
        button.textContent = 'Ver Imagen'
        button.href = `${pageURL}`
        button.target = '_blank'


        divParent.appendChild(image)

        divText.appendChild(likesP)
        divText.appendChild(seenP)
        divText.appendChild(button)

        divParent.appendChild(divText)

        resultado.appendChild(divParent)
    });
}

const limpiarHtml = (selector) => {
    while(selector.firstChild){
        selector.removeChild(selector.firstChild)
    }
}

const calcularPaginas = (total) => {    
    return parseInt(Math.ceil(total / 30))
}

const crearPaginas = (paginas, text) => {
    limpiarHtml(paginacion)
    for (let index = 1; index <= paginas; index++) {
        const button = document.createElement('button')
        button.classList.add('bg-blue-600', 'px-5',  'uppercase', 'text-white', 'text-center', 'm-2')
        button.textContent = `${index}`
        button.onclick = () => {
            pasarPagina(index, text)
        }
        paginacion.appendChild(button)
    }

}

const pasarPagina = (pagina, text) => {
    fetch(`${url}q=${text}&page=${pagina}`)
        .then(response => response.json())
        .then(response => {            
            paintImages(response.hits)})
}


const showError = () => {
    cleanError()
    const alert = document.createElement('p')
    alert.textContent = 'Campo de busqueda obligatorio'
    alert.classList.add('bg-red-500', 'text-center', 'p-2', 'text-white', 'mt-3')
    formulario.appendChild(alert)
    setTimeout(() => {
        cleanError()
    }, 3000);
}

const cleanError = () => {
    const alert = document.querySelector('.bg-red-500')
    if (alert) alert.remove()
}


document.addEventListener('submit', validate)