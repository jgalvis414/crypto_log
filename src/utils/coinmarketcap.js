import axios from 'axios';

// TODO: Usar variables de entorno para la clave de API
const API_KEY = 'd10c9394-40fa-4f74-8461-212b75926a00';

export async function fetchCMCPrices(symbols = []) {
  if (!API_KEY || symbols.length === 0) return {};
  const url = `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${symbols.join(",")}`;
  try {
    const response = await axios.get(url, {
      headers: { "X-CMC_PRO_API_KEY": API_KEY },
    });
    return response.data.data; // { BTC: {quote: {USD: {price: ...}}}, ... }
  } catch (err) {
    console.error("Error CoinMarketCap:", err);
    return {};
  }
}

export async function fetchCMCCandles(symbol) {
  const timeEnd = new Date();
  const timeStart = new Date(Date.now() - 1000 * 60 * 60 * 24 * 30); // 30 días atrás
  const url = `https://pro-api.coinmarketcap.com/v1/cryptocurrency/ohlcv/historical?symbol=${symbol}&convert=USD&time_start=${timeStart.toISOString().split("T")[0]}&time_end=${timeEnd.toISOString().split("T")[0]}`;
  try {
    const { data } = await axios.get(url, {
      headers: { "X-CMC_PRO_API_KEY": API_KEY }
    });
    return data.data?.quotes || [];
  } catch (err) {
    console.error("Error OHLCV:", err);
    return [];
  }
}