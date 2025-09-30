import React, { useState } from 'react';

interface DateRangeFilterProps {
  onApply: (startDate: string, endDate: string) => void;
}

export const DateRangeFilter: React.FC<DateRangeFilterProps> = ({ onApply }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onApply(startDate, endDate);
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
      <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
      <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
      <button type="submit">Terapkan</button>
    </form>
  );
};