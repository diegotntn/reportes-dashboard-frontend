/* ======================================================
   ui/canvas.js
   Canvas helper (Pasillos)
====================================================== */

export function crearCanvas(container) {
  const canvas = document.createElement('canvas');
  canvas.style.width = '100%';
  canvas.style.height = '400px';
  canvas.style.maxHeight = '500px';
  container.appendChild(canvas);
  return canvas;
}
