import { CSSProperties } from 'react';

export const modalOverlayStyle: CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.6)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
  backdropFilter: 'blur(4px)',
  padding: '20px'
};

export const modalContentStyle: CSSProperties = {
  backgroundColor: '#fff',
  padding: '32px',
  borderRadius: '16px',
  width: '90%',
  maxWidth: '800px',
  maxHeight: '90vh',
  overflowY: 'auto',
  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  border: '1px solid var(--border-color)'
};

export const gridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
  gap: '20px',
  marginBottom: '24px'
};

export const cancelButtonStyle: CSSProperties = {
  backgroundColor: 'transparent',
  color: 'var(--text-secondary)',
  border: '2px solid var(--border-color)',
  padding: '12px 24px',
  borderRadius: '8px',
  cursor: 'pointer',
  fontWeight: '600',
  fontSize: '14px',
  transition: 'all 0.2s ease'
};

export const submitButtonStyle: CSSProperties = {
  backgroundColor: 'var(--primary-color)',
  color: 'white',
  border: 'none',
  padding: '12px 24px',
  borderRadius: '8px',
  cursor: 'pointer',
  fontWeight: '600',
  fontSize: '14px',
  transition: 'all 0.2s ease'
};

export const modalHeaderStyle: CSSProperties = {
  fontSize: '24px',
  fontWeight: '700',
  marginBottom: '24px',
  color: 'var(--text-primary)',
  display: 'flex',
  alignItems: 'center',
  gap: '12px'
};