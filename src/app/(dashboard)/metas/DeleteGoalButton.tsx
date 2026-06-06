// src/app/(dashboard)/metas/DeleteGoalButton.tsx
'use client';

import { deleteGoal } from '@/app/actions/goals';

export default function DeleteGoalButton({ id }: { id: string }) {
  async function handleDelete() {
    const confirmed = window.confirm('Deseja realmente remover esta meta?');
    if (confirmed) {
      try {
        await deleteGoal(id);
      } catch (err) {
        alert('Erro ao deletar a meta.');
      }
    }
  }

  return (
    <button 
      onClick={handleDelete} 
      style={{ 
        background: 'none', 
        border: 'none', 
        color: 'var(--color-status-inactive)', 
        cursor: 'pointer', 
        fontWeight: 'bold',
        fontSize: '0.8rem'
      }}
    >
      Excluir
    </button>
  );
}