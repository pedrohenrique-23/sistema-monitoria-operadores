// src/app/page.tsx
import Link from 'next/link';

export default function Home() {
  return (
    <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
        Sistema de Monitoria de Operadores
      </h1>
      <p style={{ margin: '0.5rem 0 2rem 0', color: 'var(--color-text-secondary)' }}>
        Plataforma centralizada de gestão de qualidade, indicadores semanais e relatórios analíticos corporativos.
      </p>
      <Link 
        href="/operadores" 
        style={{
          display: 'inline-block',
          padding: '0.75rem 1.5rem',
          backgroundColor: 'var(--color-channel-chat)',
          color: '#ffffff',
          borderRadius: 'var(--radius-md)',
          fontWeight: 'bold',
          transition: 'var(--transition-smooth)'
        }}
      >
        Acessar Painel de Operadores
      </Link>
    </div>
  );
}