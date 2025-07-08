import React, { useState, useEffect } from 'react';
import WelcomeScreen from './components/Welcome';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import { fetchBinancePrices } from './utils/binance';
import * as XLSX from "xlsx";
import { useAppZoom } from './hooks/useAppZoom';


export default function App() {
  const [records, setRecords] = useState(null);
  const [cryptoPrices, setCryptoPrices] = useState({});
  const [showNotif, setShowNotif] = useState(false); // Para la notificación

  useAppZoom();

  // Cuando subes la bitácora, busca los precios actuales
  useEffect(() => {
    if (!records || records.length === 0) return;
    const symbols = [
      ...new Set(records.map((rec) => (rec.Cripto || '').toUpperCase())),
    ];
    if (symbols.length === 0) return;
    fetchBinancePrices(symbols).then(setCryptoPrices);
  }, [records]);

  function handleRegisterBuy({ symbol, amount, price }) {
    const nuevaCompra = {
      Fecha: new Date().toISOString().split('T')[0], // Fecha hoy en formato yyyy-mm-dd
      Cripto: symbol,
      Cantidad: amount,
      'Precio Compra (USD)': price,
    };
    setRecords((prev) => [...prev, nuevaCompra]); // Agrega la compra a la bitácora
    setShowNotif(true); // Muestra la notificación
    setTimeout(() => setShowNotif(false), 2500); // Oculta después de 2.5s
  }


// records = tu array de bitácora (state)
function exportToExcel(records) {
  // Corrige el nombre de las columnas a como aparecen en tu archivo original
  const ws = XLSX.utils.json_to_sheet(records);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Bitacora");
  XLSX.writeFile(wb, "bitacora_cripto.xlsx");
}

 return (
    <div className="min-h-screen h-screen bg-indigo-50 flex">
      {records ? (
        <div className='flex h-full w-full'>
          <Sidebar />
          <Dashboard
            records={records}
            cryptoPrices={cryptoPrices}
            handleRegisterBuy={handleRegisterBuy}
            exportToExcel={exportToExcel}
          />
          {showNotif && (
            <div className='fixed top-6 right-6 bg-green-500 text-white font-bold py-2 px-6 rounded-xl shadow-lg z-50 animate-bounce-in'>
              Compra registrada en la bitácora
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-1 h-screen min-h-screen items-center justify-center">
          <WelcomeScreen onFileLoaded={setRecords} />
        </div>
      )}
    </div>
  );
}
