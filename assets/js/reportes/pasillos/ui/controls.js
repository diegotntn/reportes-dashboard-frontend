/* ======================================================
   Pasillos UI Controls
   - label()
   - select()
====================================================== */

export function label(t) {
  const l = document.createElement('label');
  l.textContent = t;
  l.style.margin = '0 6px';
  l.style.fontWeight = '500';
  l.style.color = '#374151';
  return l;
}

export function select(vs, c, cb) {
  const s = document.createElement('select');
  s.style.margin = '0 12px 0 4px';
  s.style.padding = '6px 12px';
  s.style.border = '1px solid #d1d5db';
  s.style.borderRadius = '4px';
  s.style.backgroundColor = 'white';

  (vs || []).forEach(v => s.append(new Option(v, v)));
  s.value = c;
  s.onchange = () => cb(s.value);
  return s;
}
