import React, { useState, useEffect } from 'react';

export const Editable = ({
  value,
  onChange,
  placeholder,
  className,
  style,
  id,
  label,
}) => {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => { setLocalValue(value); }, [value]);

  const handleBlur = () => {
    if (localValue !== value) onChange(localValue);
  };

  const stringValue = typeof localValue === 'string' ? localValue : '';
  const displayValue = stringValue || placeholder || '';

  // KUNCI 1: Tangkap perintah flex-1 dari induk (seperti di baris 5-Why) agar bungkus bisa melebar
  const isFlex1 = className && className.includes('flex-1');

  return (
    // KUNCI 2: Gunakan CSS Grid. Ini membuat Kembaran Gaib dan Textarea saling menumpuk mulus
    <div className={`grid items-start ${isFlex1 ? 'flex-1' : 'w-full'}`}>
      
      {/* KUNCI 3: Kembaran Gaib (Gunakan invisible, BUKAN hidden)
          Karena invisible, ia secara fisik tetap memakan ruang dan mendorong tinggi baris sejak awal */}
      <div 
        className={`print-clone col-start-1 row-start-1 invisible whitespace-pre-wrap break-words border-none p-0 m-0 text-left pointer-events-none ${className || ''}`}
        style={{ ...style, wordBreak: 'break-word' }}
      >
        {displayValue.split('\n').map((line, index) => (
          // Penambahan padding-bottom (pb-[2px]) agar ekor huruf p, g, j, y tidak terpotong
          <div key={index} className="min-h-[1.5em] leading-[1.5] pb-[2px]">{line}</div>
        ))}
      </div>
      
      {/* Textarea Asli */}
      <textarea
        id={id}
        aria-label={label || placeholder || 'Teks dapat diedit'}
        title="Klik untuk mengedit"
        rows={1}
        spellCheck={false}
        className={`print-textarea col-start-1 row-start-1 w-full h-full bg-transparent border-none outline-none resize-none overflow-hidden p-0 m-0 block leading-[1.5] transition-colors ${className || ''}`}
        style={style}
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        onBlur={handleBlur}
        placeholder={placeholder}
      />
      
    </div>
  );
};

const STATUS_LABELS = {
  on: 'On Track',
  off: 'Off Track',
};

export const StatusButton = ({ status, onClick }) => {
  const isOn = status === 'on';
  const label = isOn ? STATUS_LABELS.on : STATUS_LABELS.off;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isOn}
      aria-label={`Status ${label}. Aktifkan untuk mengubah.`}
      className={`status-btn ${isOn ? 'on' : 'off'}`}
    >
      <span className="status-dot" aria-hidden="true" />
      <span>{label.toUpperCase()}</span>
    </button>
  );
};

const JENIS_LABELS = {
  lagging: 'Lagging',
  leading: 'Leading',
  kualitas: 'Kualitas',
};

export const JenisButton = ({ jenis, onClick }) => {
  const key = JENIS_LABELS[jenis] ? jenis : 'lagging';
  const label = JENIS_LABELS[key];

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Jenis KPI ${label}. Aktifkan untuk mengganti.`}
      className={`jenis-btn ${key}`}
    >
      <span className="status-dot" aria-hidden="true" />
      <span>{label.toUpperCase()}</span>
    </button>
  );
};

export const OutcomeButton = ({ outcome, onClick }) => {
  const isDone = outcome === 'done';

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isDone}
      aria-label={`Capaian ${isDone ? 'Tercapai' : 'Belum tercapai'}. Aktifkan untuk mengubah.`}
      className={`outcome-btn ${isDone ? 'done' : 'not'}`}
    >
      <span className="status-dot" aria-hidden="true" />
      <span>{isDone ? 'TERCAPAI' : 'BELUM'}</span>
    </button>
  );
};

export const cycleJenis = (current) => {
  const options = ['lagging', 'leading', 'kualitas'];
  return options[(options.indexOf(current) + 1) % options.length];
};
