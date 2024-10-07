const buttonSubmit = document.querySelector('input')
const textArea = document.querySelector('textarea')
const divTweets = document.querySelector('#lista-tweets')
let tweetsArray = []
let tweet = ''
const form = document.querySelector('#formulario')

// Obtener texto del área de texto
const getText = event => {
    tweet = event.target.value
    showError()
}

// Enviar formulario y agregar tweet al array
const submitForm = (event) => {
    event.preventDefault()
    if (tweet.trim() === '') return // Evitar agregar tweets vacíos
    tweetsArray.push(tweet)
    saveTweets()
    paintTweet()
    form.reset()
}

// Pintar los tweets en el DOM
const paintTweet = () => {
    if (readTweets()) {
        removeTweets() // Limpiar el contenido actual
        tweetsArray = readTweets()
        tweetsArray.forEach((tweet, index) => {
            const newTweet = document.createElement('li')
            const btnEliminar = document.createElement('a')
            btnEliminar.classList.add('borrar-tweet')
            btnEliminar.textContent = 'X'
            btnEliminar.dataset.index = index // Guardar el índice en un atributo data
            newTweet.textContent = tweet
            newTweet.appendChild(btnEliminar)
            divTweets.appendChild(newTweet)
        })
    }
}

// Guardar los tweets en localStorage
const saveTweets = () => {
    localStorage.setItem('tweets', JSON.stringify(tweetsArray))
}

// Mostrar error si el área de texto está vacía
const showError = () => {
    if (tweet.trim() === ''){
        cleanError()
        const error = document.createElement('p')
        error.classList.add('error')
        error.textContent = 'Mete texto'
        form.appendChild(error)
    } else {
        cleanError()
    }
}

// Limpiar el mensaje de error
const cleanError = () => {    
    const error = document.querySelector('.error')
    if (error) error.remove()
}

// Leer los tweets de localStorage
const readTweets = () => {
    return JSON.parse(localStorage.getItem('tweets')) || []
}

// Eliminar todos los tweets del DOM
const removeTweets = () => {
    while (divTweets.firstChild) {
        divTweets.removeChild(divTweets.firstChild)
    }
}

// Delegación de eventos para eliminar tweets
divTweets.addEventListener('click', (event) => {
    if (event.target.classList.contains('borrar-tweet')) {
        const tweetIndex = event.target.dataset.index
        removeTweet(tweetIndex)
    }
})

// Función para eliminar un tweet específico
const removeTweet = (index) => {
    tweetsArray.splice(index, 1) // Eliminar el tweet del array
    saveTweets() // Actualizar localStorage
    paintTweet() // Repintar los tweets
}

// Escuchar el evento para obtener el texto del área de texto
textArea.addEventListener('blur', getText)
// Escuchar el evento de envío del formulario
buttonSubmit.addEventListener('click', submitForm)

// Leer y pintar los tweets cuando se carga la página
tweetsArray = readTweets()
paintTweet()
