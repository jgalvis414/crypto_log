import React, { useState, useEffect } from "react";
import { SelectCryptoModal } from "./SelectCryptoModal";
import CryptoPriceModal from "./CryptoPriceModal";
import { fetchBinanceCandles } from "../utils/binance"; 

export default function BuyCryptoFAB({
  fetchCandles,
  onRegisterBuy,
  symbolToName
}) {
  const [showSelect, setShowSelect] = useState(false);
  const [modalSymbol, setModalSymbol] = useState(null);
  const [actualPrice, setActualPrice] = useState(null);
  const [loadingPrice, setLoadingPrice] = useState(false);

  // Cuando se selecciona un símbolo, obten el precio actual desde fetchBinanceCandles
  useEffect(() => {
    if (!modalSymbol) return;
    setLoadingPrice(true);
    fetchBinanceCandles(modalSymbol).then(candles => {
      // Tomamos el cierre más reciente
      const lastCandle = candles && candles.length > 0 ? candles[candles.length - 1] : null;
      setActualPrice(lastCandle ? lastCandle.close : null);
      setLoadingPrice(false);
    });
  }, [modalSymbol]);

  return (
    <>
      {/* FAB: Botón para registrar compra */}
      <button
        onClick={() => setShowSelect(true)}
        className="fixed bottom-25 right-8 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-7 rounded-full shadow-lg flex items-center gap-2 text-lg z-50 transition-all duration-200"
        title="Registrar nueva compra"
      >
        <span className="text-2xl font-bold">+</span>
        Registrar compra
      </button>

      {/* Modal para seleccionar la cripto */}
      <SelectCryptoModal
        open={showSelect}
        onClose={() => setShowSelect(false)}
        onSelect={(symbol) => {
          setModalSymbol(symbol);
          setShowSelect(false);
        }}
      />

      {/* Modal de gráfica y registro de compra */}
      <CryptoPriceModal
        open={!!modalSymbol}
        onClose={() => {
          setModalSymbol(null);
          setActualPrice(null);
        }}
        symbol={modalSymbol}
        name={symbolToName[modalSymbol]}
        actualPrice={actualPrice}
        fetchCandles={fetchCandles}
        onRegisterBuy={onRegisterBuy}
        loadingPrice={loadingPrice}
      />
    </>
  );
}