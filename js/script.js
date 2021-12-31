const dropList = document.querySelectorAll("form select"),
fromCurrency = document.querySelector(".from select"),
toCurrency = document.querySelector(".to select"),
getButton = document.querySelector("form button");

for (let i = 0; i < dropList.length; i++) {
    for(let currency_code in country_list){
        // Seleccion de Colombia y Usa como divisas por defecto
        let selected = i == 0 ? currency_code == "COP" ? "selected" : "" : currency_code == "USD" ? "selected" : "";
        // Se crea la opcion de tag, para pasar la seleccion de codigo de divisa como txt y valor
        let optionTag = `<option value="${currency_code}" ${selected}>${currency_code}</option>`;
        // Insertar la opcion Tag dentro del tag de seleccion 
        dropList[i].insertAdjacentHTML("beforeend", optionTag);
    }
    dropList[i].addEventListener("change", e =>{
        loadFlag(e.target); // Aca llamamos a LoadFlag para pasar el elemento como argumento
    });
}

function loadFlag(element){
    for(let code in country_list){
        if(code == element.value){ // Si el codigo de divisa de la lista de pais
            let imgTag = element.parentElement.querySelector("img"); // selecciona la imagen del la lista
            // pasa el codigo de pais a el codigo de divisa por medio de un url
            imgTag.src = `https://flagcdn.com/48x36/${country_list[code].toLowerCase()}.png`;
        }
    }
}

window.addEventListener("load", ()=>{
    getExchangeRate();
});

getButton.addEventListener("click", e =>{
    e.preventDefault(); // Cancela el evento
    getExchangeRate();
});

const exchangeIcon = document.querySelector("form .icon");
exchangeIcon.addEventListener("click", ()=>{
    let tempCode = fromCurrency.value; // temporary currency code of FROM drop list
    fromCurrency.value = toCurrency.value; // pasa De codigo de divisa A codigo de divisa
    toCurrency.value = tempCode; // pasa temporalmente la divisa 
    loadFlag(fromCurrency); // Carga las banderas de la divisa en la lista De cierta divisa
    loadFlag(toCurrency); // Carga las banderas de la divisa en la Lista A cierta divisa
    getExchangeRate(); // 
})

function getExchangeRate(){
    const amount = document.querySelector("form input");
    const exchangeRateTxt = document.querySelector("form .exchange-rate");
    let amountVal = amount.value;
    // Si el valor de monto es 0 o ninguno se pone 1 por defecto
    if(amountVal == "" || amountVal == "0"){
        amount.value = "1";
        amountVal = 1;
    }
    exchangeRateTxt.innerText = "Opteniendo cambio..";
    let url = `https://v6.exchangerate-api.com/v6/e08835294f12f0250195abc4/latest/${fromCurrency.value}`;
    // Se trae a la API que nos ayuda a optener las divisas y sus valores actuales
    fetch(url).then(response => response.json()).then(result =>{
        let exchangeRate = result.conversion_rates[toCurrency.value]; // optiene la divisa segun la seleccion
        let totalExRate = (amountVal * exchangeRate).toFixed(2); // Se multiplica el monto del valor por la divisa 
        exchangeRateTxt.innerText = `${amountVal} ${fromCurrency.value} = ${totalExRate} ${toCurrency.value}`;
    }).catch(() =>{ // Si el usuario no esta en linea u ocurre algun error 
        exchangeRateTxt.innerText = "Ha ocurrido un error";
    });
}