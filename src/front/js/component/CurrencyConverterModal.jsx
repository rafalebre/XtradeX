import React, { useState } from "react";

const CurrencyConverterModal = ({ baseValue, baseCurrency, onClose }) => {
  const [targetCurrency, setTargetCurrency] = useState("");
  const [convertedValue, setConvertedValue] = useState("");

  const convertCurrency = async () => {
    const api_key = process.env.EXCHANGE_RATE_API_KEY;
    const response = await fetch(
      `https://api.exchangerate-api.com/v4/latest/${baseCurrency}?api_key=${api_key}`
    );
    const data = await response.json();
    const exchangeRate = data.rates[targetCurrency];

    setConvertedValue(baseValue * exchangeRate);
  };

  return (
    <div>
      <h2>Currency Converter</h2>
      <p>Base value: {baseValue}</p>
      <p>Base currency: {baseCurrency}</p>
      <select
        value={targetCurrency}
        onChange={(e) => setTargetCurrency(e.target.value)}
      >
        <option value="">Select a currency</option>
        <option value="USD">United States Dollar (USD)</option>
        <option value="EUR">Euro (EUR)</option>
        <option value="JPY">Japanese Yen (JPY)</option>
        <option value="GBP">British Pound (GBP)</option>
        <option value="AUD">Australian Dollar (AUD)</option>
        <option value="CAD">Canadian Dollar (CAD)</option>
        <option value="CHF">Swiss Franc (CHF)</option>
        <option value="CNY">Chinese Yuan (CNY)</option>
        <option value="SEK">Swedish Krona (SEK)</option>
        <option value="NZD">New Zealand Dollar (NZD)</option>
        <option value="MXN">Mexican Peso (MXN)</option>
        <option value="SGD">Singapore Dollar (SGD)</option>
        <option value="HKD">Hong Kong Dollar (HKD)</option>
        <option value="NOK">Norwegian Krone (NOK)</option>
        <option value="KRW">South Korean Won (KRW)</option>
        <option value="TRY">Turkish Lira (TRY)</option>
        <option value="RUB">Russian Ruble (RUB)</option>
        <option value="INR">Indian Rupee (INR)</option>
        <option value="BRL">Brazilian Real (BRL)</option>
        <option value="ZAR">South African Rand (ZAR)</option>
      </select>
      <button onClick={convertCurrency}>Convert</button>
      {convertedValue && (
        <p>
          Converted value: {convertedValue} {targetCurrency}
        </p>
      )}
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default CurrencyConverterModal;
