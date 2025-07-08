import React from 'react';
import * as XLSX from 'xlsx';

export default function FileUpload({ onDataLoaded }) {
  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws, { defval: '' });
      onDataLoaded(data);
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div className="mb-4">
      <label className="block mb-2 font-semibold">Importar Bitácora (.csv, .xlsx):</label>
      <input type="file" accept=".csv,.xlsx" onChange={handleFile} className="border p-2 rounded" />
    </div>
  );
}
