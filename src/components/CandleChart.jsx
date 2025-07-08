import React from "react";
import { ComposedChart, XAxis, YAxis, Tooltip, ResponsiveContainer, Bar } from "recharts";

// Genera data en el formato: [{ fecha, open, close, high, low }]
function CandleChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={180}>
      <ComposedChart data={data}>
        <XAxis dataKey="fecha" />
        <YAxis domain={["dataMin", "dataMax"]} />
        <Tooltip
          formatter={(value) => Number(value).toFixed(2)}
          labelFormatter={(label) => `Fecha: ${label}`}
        />
        {/* Dibuja velas con barras: verde si subió, rojo si bajó */}
        {data.map((d, i) => (
          <Bar
            key={i}
            dataKey="open"
            fill={d.close >= d.open ? "#4ade80" : "#ef4444"}
            x={i * 10}
            barSize={4}
            isAnimationActive={false}
            shape={({ x, y, width, height }) => {
              // Altura de la vela
              const minY = Math.min(d.open, d.close);
              const maxY = Math.max(d.open, d.close);
              // Alto de la mecha (shadow)
              const yHigh = d.high;
              const yLow = d.low;
              // Mapea valores para el SVG
              const yScale = (v) =>
                ((Math.max(...data.map((a) => a.high)) - v) /
                  (Math.max(...data.map((a) => a.high)) -
                    Math.min(...data.map((a) => a.low)))) *
                160;
              // Cuerpo de la vela
              return (
                <g>
                  {/* Mecha */}
                  <rect
                    x={x + width / 2 - 0.5}
                    y={yScale(yHigh)}
                    width={1}
                    height={yScale(yLow) - yScale(yHigh)}
                    fill="#555"
                  />
                  {/* Cuerpo */}
                  <rect
                    x={x}
                    y={yScale(maxY)}
                    width={width}
                    height={Math.max(2, yScale(minY) - yScale(maxY))}
                    fill={d.close >= d.open ? "#4ade80" : "#ef4444"}
                  />
                </g>
              );
            }}
          />
        ))}
      </ComposedChart>
    </ResponsiveContainer>
  );
}

export default CandleChart;
