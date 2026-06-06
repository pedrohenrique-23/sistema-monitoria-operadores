// src/app/(dashboard)/operadores/[id]/DeleteButton.tsx
'use client';

import { deleteOperator } from '@/app/actions/operators';
import { useRouter } from 'next/navigation';

export default function DeleteButton({ id }: { id: string }) {
  const router = useRouter();

  async function handleDelete() {
    const confirmed = window.confirm('Tem certeza absoluta que deseja excluir este operador? Todos os históricos de KPIs e Auditorias serão apagados definitivamente.');
    
    if (confirmed) {
      try {
        await deleteOperator(id);
        router.push('/operadores');
      } catch (err) {
        alert('Erro ao excluir operador.');
      }
    }
  }

  return (
    <button 
      onClick={handleDelete} 
      style={{
        backgroundColor: 'transparent',
        color: 'var(--color-status-inactive)',
        border: '1px solid var(--color-status-inactive)',
        padding: '0.4rem 1rem',
        borderRadius: 'var(--radius-md)',
        cursor: 'pointer',
        fontSize: '0.85rem',
        fontWeight: 'bold'
      }}
    >
      Excluir Operador
    </button>
  );
}