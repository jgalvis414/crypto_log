import React from 'react';
import FileUpload from './FileUpload';

const EMPTY_BITACORA = [
  {
    Fecha: '',
    Cripto: '',
    Cantidad: '',
    'Precio Compra (USD)': '',
  },
];

export default function WelcomeScreen({ onFileLoaded }) {
  // Cuando el usuario pulsa el botón, carga la estructura vacía
  function handleCreateEmpty() {
    // Carga una bitácora vacía, lista para usar y registrar compras
    onFileLoaded(EMPTY_BITACORA);
  }

  return (
    <div className='flex items-center justify-center min-h-screen bg-gradient-to-tr from-indigo-100 to-white'>
      <div className='bg-white rounded-3xl shadow-2xl p-10 md:p-16 max-w-2xl w-full flex flex-col items-center'>
        <img src='./icon.png' alt='Logo' className='h-20 mb-6' />
        <h1 className='text-4xl md:text-5xl font-extrabold mb-3 text-indigo-700 text-center leading-tight'>
          Bienvenido a tu Bitácora Cripto
        </h1>
        <p className='mb-8 text-lg text-gray-500 text-center max-w-lg'>
          Con esta aplicación puedes gestionar fácilmente tus inversiones en
          criptomonedas.
        </p>

        <div className='w-full mb-8'>
          <div className='bg-indigo-50 border border-indigo-200 rounded-2xl p-4 mb-3'>
            <ul className='space-y-2 text-indigo-900 font-medium text-base'>
              <li>
                📊 <b>Visualiza tu portafolio</b> de criptomonedas de forma
                clara y profesional.
              </li>
              <li>
                ⬆️ <b>Importa tu bitácora</b> desde archivos <b>CSV/XLSX</b>.
              </li>
              <li>
                ➕ <b>Registra nuevas compras</b> de cualquier criptomoneda.
              </li>
              <li>
                ⬇️ <b>Exporta tu bitácora</b> actualizada en cualquier momento.
              </li>
              <li>
                💸 <b>Consulta precios en tiempo real</b> de tus criptos
                favoritas.
              </li>
            </ul>
          </div>
        </div>

        <div className='w-full max-w-sm'>
          <label className='font-semibold mb-2 block text-indigo-700 text-center'>
            Importar Bitácora (.csv, .xlsx):
          </label>
          <FileUpload onDataLoaded={onFileLoaded} />

          <div className='flex flex-col items-center mt-6'>
            <span className='text-gray-500 mb-2'>¿No tienes un archivo?</span>
            <button
              className='bg-indigo-600 hover:bg-indigo-800 text-white font-bold py-2 px-6 rounded-xl shadow transition-all duration-200'
              onClick={handleCreateEmpty}
            >
              Crear Bitácora Nueva
            </button>
          </div>
        </div>
        <div className='mt-10 w-full text-center text-gray-400 text-sm'>
        Desarrollado con <span className='text-red-500'>♥</span> por{' '}
        <a
          href='https://github.com/jgalvis414'
          target='_blank'
          rel='noopener noreferrer'
          className='text-indigo-600 hover:underline font-semibold'
        >
          jgalvis414
        </a>
      </div>
      </div>
      
    </div>
  );
}
