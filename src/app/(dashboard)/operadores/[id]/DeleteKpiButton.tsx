// src/app/(dashboard)/operadores/[id]/DeleteKpiButton.tsx
'use client';

import { deleteKpi } from '@/app/actions/kpis';
import styles from './page.module.css'; // Importa o arquivo de estilos local

export default function DeleteKpiButton({ id }: { id: string }) {
  async function handleDelete() {
    const confirmed = window.confirm('Deseja realmente remover este registro de KPI?');
    if (confirmed) {
      try {
        await deleteKpi(id);
      } catch (err) {
        alert('Erro ao deletar indicador.');
      }
    }
  }

  return (
    <button 
      onClick={handleDelete} 
      className={styles.btnTableDelete} // Aplica a nova classe de hover
    >
      Excluir
    </button>
  );
}