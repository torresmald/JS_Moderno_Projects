const cart = document.querySelector('#carrito')
const cartContainer = document.querySelector('#lista-carrito tbody')
const cleanCartButton = document.querySelector('#vaciar-carrito')
const courses = document.querySelector('#lista-cursos')

let cartCourses = []

const loadListeners = () => {
    courses.addEventListener('click', addCourse)
    cleanCartButton.addEventListener('click', cleanCart)
    paintCart()
}

const addCourse = event => {
    event.preventDefault();
    if (event.target.classList.contains('agregar-carrito')) {
        const parentDiv = event.target.parentElement.parentElement
        extractInfoCourse(parentDiv)
    }
}

const cleanCart = () => {
    cartCourses = []
    cartContainer.innerHTML = ''
}

const extractInfoCourse = curso => {
    const courseInfo = {
        image: curso.querySelector('img').src,
        title: curso.querySelector('h4').textContent,
        price: curso.querySelector('.precio span').textContent,
        quantity: 1,
        id: curso.querySelector('a').getAttribute('data-id')
    }
    !existCourse(courseInfo) ? addCourseToCart(courseInfo) : updateCourseQuantity(courseInfo);

    paintCart()
}

const paintCart = () => {
    cleanCartDom()
    const courses = readLocalSotrage()    
    if(courses)
    cartCourses = courses
    cartCourses.forEach(course => {
        const { image, title, price, quantity, id } = course
        const row = document.createElement('tr')
        row.innerHTML = `
            <td><img src=${image} alt="${title}" width="100"/></td>
            <td>${title}</td>
            <td>${price}</td>
            <td>${quantity}</td>
            <td onclick="removeCourse(${id})"><a class="borrar-curso">X</a></td>
        `
        cartContainer.appendChild(row)
    })
}

const cleanCartDom = () => {
    while (cartContainer.firstChild) {
        cartContainer.removeChild(cartContainer.firstChild)
    }
}

const removeCourse = courseId => {
    cartCourses = cartCourses.filter(course => course.id != courseId)
    saveLocalStorage()
    paintCart()
}

const updateCourseQuantity = (course) => {
    const index = cartCourses.findIndex(c => c.id === course.id)
    cartCourses[index].quantity++

}

const addCourseToCart = course => {
    cartCourses.push(course)
    saveLocalStorage()
}

const existCourse = course => cartCourses.length > 0 ? cartCourses.find(c => c.id === course.id) : false;

const saveLocalStorage = () => {
    localStorage.setItem('cart', JSON.stringify(cartCourses))
}

const readLocalSotrage = () => {
    const courses = JSON.parse(localStorage.getItem('cart'))
    return courses
}

loadListeners()