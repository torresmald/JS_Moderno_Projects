const form = document.querySelector('#formulario')
const emailInput = document.querySelector('#email')
const asuntoInput = document.querySelector('#asunto')
const textInput = document.querySelector('#mensaje')
const textCC = document.querySelector('#cc')

const submitButton = document.querySelector('#formulario button[type="submit"]')
const resetButton = document.querySelector('#formulario button[type="reset"]')

const objectToSend = {
    email: '',
    subject: '',
    cc: '',
    message: '',
}

const loadListeners = () => {
    setListener(emailInput, 'blur', validate)
    setListener(asuntoInput, 'blur', validate)
    setListener(textInput, 'blur', validate)
    setListener(textCC, 'blur', validate)
    setListener(submitButton, 'click', submitForm)
    setListener(resetButton, 'click', resetForm)
}
const setListener = (name, type, callback) => name.addEventListener(type, callback)

const validate = event => {
    const elementName = event.srcElement.name
    const reference = event.target.parentElement
    const value = event.target.value
    const isInvalidEmail = elementName === 'email' && !isValidEmail(value);
    const isInvalidCC = elementName === 'cc' && !isValidEmail(value) && value !== '';
    if ((value.trim() === '' && elementName !== 'cc') || isInvalidEmail || isInvalidCC) {
        console.log('Entro aqui');

        showAlert(elementName, reference);
        setObjectToSend(event);
        toggleSubmitState(false);
        return;
    }
    removeAlert(reference)
    setObjectToSend(event, true)
    if (!Object.values(objectToSend).includes('')) {
        toggleSubmitState(true)
    }
}

const showAlert = (field, reference) => {
    hasPreviousAlert(reference);
    const alert = document.createElement('p');
    field === 'email' ? alert.textContent = `El campo ${field} es obligatorio o no tiene formato válido` : field === 'cc' ? alert.textContent = `El campo ${field} no tiene formato valido` : alert.textContent = `El campo ${field} es obligatorio`
    alert.classList.add('bg-red-600', 'p-2', 'text-center', 'text-white')
    alert.setAttribute('data-field', field);
    reference.appendChild(alert)
}


const removeAlert = reference => {
    hasPreviousAlert(reference)
}

const hasPreviousAlert = reference => {
    const previousAlert = reference.querySelector('.bg-red-600')
    if (previousAlert) previousAlert.remove()
}

const isValidEmail = email => {
    const regex = /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/;
    const result = regex.test(email)
    return result
}


const setObjectToSend = (event, condition = false) => {
    const { target: { name, value } } = event
    condition ?
        objectToSend[name] = value.trim().toLowerCase()
        :
        objectToSend[name] = ''
}

const toggleSubmitState = isValid => {
    submitButton.toggleAttribute('disabled', !isValid);
    submitButton.classList.toggle('bg-pink-600-opacity', !isValid);
    submitButton.classList.toggle('opacity-50', !isValid);
    submitButton.classList.toggle('bg-pink-600', isValid);
};



const submitForm = event => {
    event.preventDefault();
    console.log('Submititn', objectToSend);
    paintSpinner()
    setTimeout(() => {
        removeSpinner()
        successSend()
        resetForm(event)
    }, 2000);
}

const resetForm = event => {
    event.preventDefault();
    objectToSend.email = ''
    objectToSend.message = ''
    objectToSend.subject = ''
    objectToSend.cc = ''
    form.reset()
}

const paintSpinner = () => {
    const parentDiv = document.createElement('div');
    parentDiv.classList.add('sk-fading-circle');
    for (let index = 1; index < 13; index++) {
        const childDiv = document.createElement('div');
        childDiv.classList.add('sk-circle', `sk-circle${index}`);
        parentDiv.appendChild(childDiv)
    }
    form.appendChild(parentDiv)
}

const removeSpinner = () => {
    const parentSpinner = document.querySelector('.sk-fading-circle')
    parentSpinner.remove()
}

const successSend = () => {
    const parentDiv = document.createElement('div');
    parentDiv.textContent = 'Enviado con Éxito'
    parentDiv.classList.add('bg-green-500', 'text-center', 'text-white', 'p-2')
    form.appendChild(parentDiv)
}

loadListeners()

