
const criptoSelect = document.querySelector('#criptomonedas')

const consultarCripto = () => {
    const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD'

    fetch(url)
        .then(response => response.json())
        .then(response => {
            rellenarCripto(response.Data)
        })
}

const rellenarCripto = (criptos) => {
    criptos.forEach(cripto => {
        const option = document.createElement('option')
        option.value = cripto.CoinInfo.Name
        option.textContent = cripto.CoinInfo.FullName
        criptoSelect.appendChild(option)
    });
    
}
window.addEventListener('DOMContentLoaded', consultarCripto)