import React, { useEffect, useState } from 'react';
import PriceAreaChart from './PriceAreaChart';

export default function CryptoPriceModal({
  open,
  onClose,
  symbol,
  name,
  actualPrice,
  fetchCandles,
  onRegisterBuy,
}) {
  const [amount, setAmount] = useState('');
  const [price, setPrice] = useState(actualPrice);
  const [candles, setCandles] = useState([]);

  useEffect(() => {
    if (!symbol || !open) return;
    fetchCandles(symbol).then((candlesData) => setCandles(candlesData));
  }, [symbol, open, fetchCandles]);

  useEffect(() => {
    setPrice(actualPrice);
  }, [actualPrice]);

  if (!open) return null;

  return (
    <div className='fixed inset-0 z-30 flex items-center justify-center bg-black bg-opacity-70'>
      <div className='bg-white rounded-3xl shadow-2xl p-10 w-[98vw] max-w-6xl min-h-[540px] relative flex flex-col'>
        <button
          className='absolute top-4 right-6 text-2xl text-gray-400 hover:text-gray-700'
          onClick={onClose}
        >
          ✕
        </button>
        <div className='flex flex-col md:flex-row gap-10'>
          {/* Gráfico y datos */}
          <div className='flex-1'>
            <h2 className='text-2xl font-bold mb-2'>
              {name} <span className='text-gray-400'>({symbol})</span>
            </h2>
            <div className='font-mono text-2xl text-indigo-700 mb-3'>
              Precio actual: $
              {actualPrice?.toLocaleString(undefined, {
                maximumFractionDigits: 6,
              })}
            </div>
            {candles.length > 0 ? (
              <PriceAreaChart data={candles} />
            ) : (
              <div className='text-center text-gray-400 py-12'>
                Cargando gráfico...
              </div>
            )}
          </div>
          {/* Formulario de compra */}
          <div className='w-full md:w-80 mt-8 md:mt-0'>
            <div className='font-bold mb-2'>Registrar nueva compra</div>
            <form
              className='flex flex-col gap-4'
              onSubmit={(e) => {
                e.preventDefault();
                if (Number(amount) > 0 && Number(price) > 0) {
                  onRegisterBuy({
                    symbol,
                    amount: Number(amount),
                    price: Number(price),
                  });
                  setAmount('');
                  setPrice(actualPrice);
                  onClose();
                }
              }}
            >
              <label>
                <span className='block text-sm font-medium mb-1'>
                  Cantidad:
                </span>
                <input
                  className='border rounded-lg px-3 py-2 w-full'
                  type='number'
                  min='0'
                  step='any'
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  placeholder='Ej: 1.25'
                />
              </label>
              <label>
                <span className='block text-sm font-medium mb-1'>
                  Precio de compra:
                </span>
                <input
                  className='border rounded-lg px-3 py-2 w-full'
                  type='number'
                  min='0'
                  step='any'
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                  placeholder='Ej: 64000'
                />
                <button
                  type='button'
                  className='text-xs text-indigo-600 underline mt-1'
                  onClick={() => setPrice(actualPrice)}
                >
                  Usar precio de mercado
                </button>
              </label>
              <button
                type='submit'
                className='mt-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl font-bold'
              >
                Registrar compra
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
