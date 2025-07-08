import React, { useMemo, useState } from 'react';
import PortfolioChart from './PortfolioChart';
import CryptoPriceModal from './CryptoPriceModal';
import { fetchCMCCandles } from '../utils/coinmarketcap';
import { fetchBinanceCandles } from '../utils/binance';
import BuyCryptoFAB from './BuyCryptoFAB';

const symbolToName = {
  BTC: 'Bitcoin',
  ETH: 'Ethereum',
  XRP: 'Ripple',
  ADA: 'Cardano',
  DOGE: 'Dogecoin',
  SOL: 'Solana',
};

export default function Dashboard({
  records,
  cryptoPrices,
  handleRegisterBuy,
  exportToExcel,
}) {
  const [modalSymbol, setModalSymbol] = useState(null);
  const [onOpen, setOnOpen] = useState(null);
  // Agrupar y calcular assets
 const portfolioAssets = useMemo(() => {
  const grouped = {};
  records.forEach((rec) => {
    const symbol = (rec.Cripto || '').toUpperCase();
    if (!grouped[symbol]) {
      grouped[symbol] = {
        symbol,
        name: symbolToName[symbol] || symbol,
        amount: 0,
        invested: 0,
      };
    }
    const qty = Number(rec.Cantidad) || 0;
    const buyPrice = Number(rec["Precio Compra (USD)"]) || 0;
    grouped[symbol].amount += qty;
    grouped[symbol].invested += qty * buyPrice;
  });
  return Object.values(grouped).map((asset) => {
    const price = cryptoPrices[asset.symbol]?.quote?.USD?.price || 0;
    const value = asset.amount * price;
    const invested = asset.invested;
    const gainPct = invested > 0 ? ((value - invested) / invested) * 100 : 0;
    return {
      ...asset,
      price,
      value,
      invested,
      gainPct,
    };
  });
}, [records, cryptoPrices]);
  // Total portfolio value
  const totalValue = portfolioAssets.reduce(
    (sum, asset) => sum + asset.value,
    0
  );

  // Simulación de priceHistory para el chart (puedes mejorarlo)
  const priceHistory = useMemo(() => {
    // Simula evolución diaria, puedes conectar a datos reales si quieres
    let hist = [];
    let base = totalValue * 0.95;
    for (let i = 0; i < 10; i++) {
      hist.push({
        fecha: `Día ${i + 1}`,
        valor: Math.round(base + Math.random() * totalValue * 0.1),
      });
      base += totalValue * 0.01;
    }
    return hist;
  }, [totalValue]);

  // Recent transactions (ejemplo con las 3 últimas del archivo)
  const recentTx = records
    .slice(-5)
    .reverse()
    .map((rec) => ({
      amount: rec.Cantidad,
      symbol: rec.Cripto,
      timeAgo: 'hace unos días', // aquí podrías usar dayjs para tiempo real
      value:
        Number(rec.Cantidad) *
        (cryptoPrices[rec.Cripto?.toUpperCase()]?.quote?.USD?.price || 0),
    }));

  function getFakePriceHistory(actualPrice) {
    let hist = [];
    let base = actualPrice * 0.9;
    for (let i = 0; i < 12; i++) {
      hist.push({
        fecha: `Día ${i + 1}`,
        precio: Math.max(0, base + Math.random() * actualPrice * 0.13),
      });
      base += actualPrice * (Math.random() - 0.5) * 0.04;
    }
    return hist;
  }

  // Checklist
  const checklist = [
    { text: 'Confirm your settings', done: true },
    { text: 'Add all exchanges', done: false },
  ];

  return (
    <div className='flex-1 bg-indigo-50/40 p-8 min-h-screen'>
      <div className='flex flex-col md:flex-row'>
        {/* Panel principal */}
        <div className='flex-1'>
          <div className='bg-white rounded-2xl shadow-md p-6 mb-6'>
            <div className='flex justify-between items-center mb-4'>
              <div>
                <h2 className='text-2xl font-bold'>Portfolio</h2>
                <p className='text-3xl font-extrabold text-indigo-700'>
                  $
                  {totalValue.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
                <span className='text-sm font-bold text-green-500'>
                  +{(Math.random() * 10).toFixed(2)}%
                </span>
              </div>
              
              <button
                onClick={() => exportToExcel(records)}
                className='fixed bottom-8 right-8 bg-indigo-600 hover:bg-indigo-800 text-white font-bold py-3 px-7 rounded-full shadow-lg transition-all duration-200'
              >
                Exportar Bitácora
              </button>
              <BuyCryptoFAB
                fetchCandles={fetchBinanceCandles}
                onRegisterBuy={handleRegisterBuy}
                getActualPrice={(symbol) =>
                  cryptoPrices[symbol]?.quote?.USD?.price || 0
                }
                symbolToName={symbolToName}
              />
            </div>
            <PortfolioChart data={priceHistory} />
          </div>
          <div className='bg-white rounded-2xl shadow-md p-6'>
  <h3 className='font-bold mb-4'>Tus fondos</h3>
  <table className='w-full text-sm'>
    <thead>
      <tr>
        <th align='left'>Cripto</th>
        <th align='right'>Cantidad</th>
        <th align='right'>Total invertido</th>
        <th align='right'>Valor actual</th>
        <th align='right'>% Ganancia</th>
      </tr>
    </thead>
    <tbody>
      {portfolioAssets.map((asset) => (
        <tr key={asset.symbol}>
          <td className='py-2 flex items-center gap-2'>
            <span className='font-bold'>{asset.symbol}</span>
            <span className='text-gray-400'>{asset.name}</span>
          </td>
          <td align='right'>{asset.amount}</td>
          <td align='right'>
            ${asset.invested.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </td>
          <td align='right'>
            ${asset.value.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </td>
          <td align='right'>
            <span className={asset.gainPct >= 0 ? 'text-green-500' : 'text-red-500'}>
              {asset.gainPct >= 0 ? '+' : ''}
              {asset.gainPct.toFixed(2)}%
            </span>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

          <div className='bg-white rounded-2xl shadow-md p-6 mt-8'>
            <div className='flex items-center gap-2 mb-6'>
              <span className='inline-flex items-center px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 font-semibold text-sm shadow-sm border border-yellow-300'>
                ⚠️ Importante
              </span>
              <span className='text-yellow-900 font-medium text-sm'>
                Para registrar una compra, haz <b>clic sobre el nombre</b> de la
                cripto que deseas agregar.
              </span>
            </div>
            <h3 className='font-bold mb-2'>Precios actuales de tus criptos</h3>
            <table className='w-full text-sm mb-4'>
              <thead>
                <tr>
                  <th align='left'>Cripto</th>
                  <th align='right'>Precio actual (USD)</th>
                </tr>
              </thead>
              <tbody>
                {portfolioAssets.map((asset) => (
                  <tr key={asset.symbol}>
                    <td className='py-2 flex items-center gap-2'>
                      {/* El nombre es un botón para abrir el modal */}
                      <button
                        onClick={() => setModalSymbol(asset.symbol)}
                        className='font-bold text-indigo-700 hover:underline'
                      >
                        {asset.symbol}
                      </button>
                      <span className='text-gray-400'>{asset.name}</span>
                    </td>
                    <td align='right'>
                      $
                      {asset.price?.toLocaleString(undefined, {
                        maximumFractionDigits: 6,
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Modal de gráfica y compra */}
          <CryptoPriceModal
            open={!!modalSymbol}
            onClose={() => setModalSymbol(null)}
            symbol={modalSymbol}
            name={symbolToName[modalSymbol]}
            actualPrice={
              portfolioAssets.find((a) => a.symbol === modalSymbol)?.price
            }
            fetchCandles={fetchBinanceCandles}
            onRegisterBuy={handleRegisterBuy}
          />
        </div>
        {/* Panel derecho */}
        <div className='bg-white rounded-2xl shadow-md p-6 ml-2.5'>
          <div className='font-bold mb-2'>Transacciones recientes</div>
          <ul>
            {recentTx.map((tx, idx) => (
              <li key={idx} className='flex items-center gap-2 mb-1'>
                <span className='w-2 h-2 bg-green-500 rounded-full'></span>
                <span>Recibido</span>
                <span className='font-bold'>
                  {tx.amount} {tx.symbol}
                </span>
                <span className='ml-auto text-gray-400 text-xs'>
                  {tx.timeAgo}
                </span>
                <span className='ml-2 text-xs'>
                  $
                  {tx.value.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
