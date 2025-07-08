import { useEffect } from "react";

/**
 * Hook para permitir zoom en la app con Ctrl + rueda del mouse y Ctrl + / -
 * y Ctrl + 0 para resetear zoom.
 */
export function useAppZoom(min = 0.5, max = 2, step = 0.05) {
  useEffect(() => {
    // Inicializa zoom si no está seteado
    if (!document.body.style.zoom) document.body.style.zoom = 1;

    function setZoom(newZoom) {
      document.body.style.zoom = Math.max(min, Math.min(max, newZoom));
    }

    // Ctrl + rueda
    function onWheel(e) {
      if (e.ctrlKey) {
        let current = Number(document.body.style.zoom) || 1;
        if (e.deltaY < 0) setZoom(current + step);
        else setZoom(current - step);
        e.preventDefault();
      }
    }

    // Ctrl + +, Ctrl + -, Ctrl + 0
    function onKeyDown(e) {
      if (e.ctrlKey) {
        let current = Number(document.body.style.zoom) || 1;
        if (e.key === "+" || e.key === "=") {
          setZoom(current + step);
          e.preventDefault();
        }
        if (e.key === "-" || e.key === "_") {
          setZoom(current - step);
          e.preventDefault();
        }
        if (e.key === "0") {
          setZoom(1);
          e.preventDefault();
        }
      }
    }

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [min, max, step]);
}