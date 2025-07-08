import React from 'react';

const CRYPTOS = [
  { symbol: 'BTC', name: 'Bitcoin' },
  { symbol: 'ETH', name: 'Ethereum' },
  { symbol: 'ADA', name: 'Cardano' },
  { symbol: 'DOGE', name: 'Dogecoin' },
  { symbol: 'SOL', name: 'Solana' },
  { symbol: 'XRP', name: 'Ripple' },
  { symbol: 'DOT', name: 'Polkadot' },
  { symbol: 'LTC', name: 'Litecoin' },
  { symbol: 'BCH', name: 'Bitcoin Cash' },
];

export function SelectCryptoModal({ open, onClose, onSelect }) {
  if (!open) return null;
  return (
    <div className='fixed inset-0 z-40 bg-black bg-opacity-50 flex items-center justify-center'>
      <div className='bg-white rounded-2xl shadow-xl p-8 max-w-md w-full relative'>
        <button
          className='absolute top-2 right-4 text-2xl text-gray-400 hover:text-gray-600'
          onClick={onClose}
        >
          ✕
        </button>
        <h2 className='text-xl font-bold mb-5'>Selecciona la criptomoneda</h2>
        <div className='grid grid-cols-2 gap-4'>
          {CRYPTOS.map((crypto) => (
            <button
              key={crypto.symbol}
              onClick={() => onSelect(crypto.symbol)}
              className='p-4 rounded-xl bg-green-50 hover:bg-green-200 text-green-900 font-bold text-lg transition-all border border-green-200'
            >
              {crypto.symbol}
              <div className='text-xs font-normal text-gray-500'>
                {crypto.name}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
