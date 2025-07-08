import axios from "axios";

/**
 * symbol: ejemplo "BTC" (tu portafolio), lo mapea a "BTCUSDT"
 * interval: "1d" (velas diarias)
 * limit: número de velas (máx 1000), aquí 30 días
 */
const symbolToBinancePair = (symbol) => `${symbol.toUpperCase()}USDT`;

export async function fetchBinanceCandles(symbol) {
  const pair = symbolToBinancePair(symbol);
  const url = `https://api.binance.com/api/v3/klines?symbol=${pair}&interval=1d&limit=30`;
  try {
    const { data } = await axios.get(url);
    // Binance retorna un array, cada fila es:
    
    return data.map(d => ({
      fecha: new Date(d[0]).toLocaleDateString(),
      open: Number(d[1]),
      high: Number(d[2]),
      low: Number(d[3]),
      close: Number(d[4]),
      volume: Number(d[5]),
    }));
  } catch (err) {
    console.error("Error Binance OHLCV:", err);
    return [];
  }
}

function getBinancePair(symbol) {
  return symbol.toUpperCase() + "USDT";
} 

export async function fetchBinancePrices(symbols = []) {
  if (!symbols.length) return {};
  try {
    // Obtenemos TODOS los precios, luego filtramos los que queremos
    const { data } = await axios.get("https://api.binance.com/api/v3/ticker/price");
    // Filtramos solo los que te interesan
    const result = {};
    symbols.forEach((symbol) => {
      const pair = getBinancePair(symbol);
      const ticker = data.find(item => item.symbol === pair);
      if (ticker) {
        result[symbol.toUpperCase()] = {
          price: Number(ticker.price),
          quote: { USD: { price: Number(ticker.price) } } // Compatibilidad con tu código actual
        };
      }
    });
    return result;
  } catch (err) {
    console.error("Error Binance Price:", err);
    return {};
  }
}