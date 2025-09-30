import { CSSProperties } from 'react';

export const modalOverlayStyle: CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
};

export const modalContentStyle: CSSProperties = {
  backgroundColor: '#fff',
  padding: 20,
  borderRadius: 8,
  width: '90%',
  maxWidth: 800,
  maxHeight: '90vh',
  overflowY: 'auto',
  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
};

export const gridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
  gap: 12,
};

export const cancelButtonStyle: CSSProperties = {
  backgroundColor: '#6c757d',
  color: 'white',
  border: 'none',
  padding: '8px 16px',
  borderRadius: 4,
  cursor: 'pointer',
};

export const submitButtonStyle: CSSProperties = {
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  padding: '8px 16px',
  borderRadius: 4,
  cursor: 'pointer',
};