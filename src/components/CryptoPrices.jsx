import React, { useEffect, useState } from 'react';
import { fetchCMCPrices } from '../utils/coinmarketcap';

export default function CryptoPrices() {
  const [symbols, setSymbols] = useState(['BTC', 'ETH', 'DOGE']);
  const [prices, setPrices] = useState({});

  useEffect(() => {
    fetchCMCPrices(symbols).then(setPrices);
  }, [symbols]);

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 mt-8">
      <h2 className="text-2xl font-bold mb-2">Precios CoinMarketCap</h2>
      <div>
        {symbols.map(symbol => (
          <div key={symbol} className="p-2">
            <b>{symbol}</b>: ${prices[symbol]?.quote?.USD?.price?.toFixed(2) ?? 'Cargando...'}
          </div>
        ))}
      </div>
      <label className="block mt-4">Agregar símbolo:</label>
      <input
        className="border rounded p-2 mr-2"
        placeholder="Ej: ADA"
        onKeyDown={e => {
          if (e.key === 'Enter') {
            setSymbols([...symbols, e.target.value.toUpperCase()]);
            e.target.value = '';
          }
        }}
      />
    </div>
  );
}