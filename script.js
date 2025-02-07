
const sign = document.getElementById("theme");
const signn = document.getElementById("signn");
const openPopupButton = document.getElementById('openPopup');
const popup = document.getElementById('popup');
const close1 = document.getElementById('close');
openPopupButton.addEventListener('click', () => {
    popup.style.display = 'grid'; 
  });
close1.addEventListener('click', () => {
    popup.style.display = 'none'; 
  });
  // Ваш API-ключ от CurrencyAPI
const apiKey = "cur_live_rwpkXZHGZHlgDTZGb7bjZFhH6rdqxRyGjSUZVr26";

const fromCurrencySelect = document.getElementById("from-currency");
const toCurrencySelect = document.getElementById("to-currency");
const inputAmount = document.getElementById("amount");
const convertButton = document.getElementById("convert-button");
const resultElement = document.getElementById("result");
const lastUpdatedElement = document.getElementById("last-updated");
const historyElement = document.getElementById("history");
let history = null;

async function getExchangeRates() {
    const url = `https://api.currencyapi.com/v3/latest?apikey=${apiKey}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("Ошибка при запросе: " + response.status);
        }
        const data = await response.json();
        return data; 
    } catch (error) {
        console.error("Произошла ошибка:", error);
        resultElement.innerText = "Ошибка при загрузке курсов валют.";
        return null;
    }
}

async function convertCurrency() {
    const amount = parseFloat(inputAmount.value);
    const fromCurrency = fromCurrencySelect.value; 
    const toCurrency = toCurrencySelect.value;

    if (isNaN(amount) || amount <= 0) {
        resultElement.innerText = "Введите корректную сумму.";
        lastUpdatedElement.innerText = ""; 
        return;
    }

    const apiResponse = await getExchangeRates(); 

    if (!apiResponse) {
        resultElement.innerText = "Не удалось загрузить курсы валют.";
        lastUpdatedElement.innerText = ""; 
        return;
    }

    const rates = apiResponse.data;
    const lastUpdated = apiResponse.meta.last_updated_at; 

   
    if (!rates[fromCurrency] || !rates[toCurrency]) {
        resultElement.innerText = "Одна из выбранных валют недоступна.";
        lastUpdatedElement.innerText = ""; 
        return;
    }

    const fromRate = rates[fromCurrency].value;
    const toRate = rates[toCurrency].value;
    const convertedAmount = (amount / fromRate) * toRate;

    resultElement.innerText =` ${amount.toFixed(3)} ${fromCurrency} = ${convertedAmount.toFixed(3)} ${toCurrency}`;

    const lastUpdatedDate = new Date(lastUpdated).toLocaleString(); 
    lastUpdatedElement.innerText = `Курсы обновлены: ${lastUpdatedDate}`;
}
document.getElementById('result').addEventListener('click', async function () {
  const textToCopy = this.textContent;

  try {
    await navigator.clipboard.writeText(textToCopy);
    const notification = document.getElementById('notification');
    notification.classList.remove('hidden');
    notification.classList.add('show');
    setTimeout(() => {
      notification.classList.remove('show');
      notification.classList.add('hidden');
    }, 2000);
  } catch (err) {
    console.error('Не удалось скопировать текст: ', err);
  }
});
convertButton.addEventListener("click", convertCurrency);