// src/app/(dashboard)/operadores/[id]/DeleteAuditButton.tsx
'use client';

import { deleteAudit } from '@/app/actions/audits';
import styles from './page.module.css';

export default function DeleteAuditButton({ id }: { id: string }) {
  async function handleDelete() {
    const confirmed = window.confirm('Tem certeza que deseja excluir permanentemente esta auditoria?');
    if (confirmed) {
      try {
        await deleteAudit(id);
      } catch (err) {
        alert('Erro ao excluir auditoria.');
      }
    }
  }

  return (
    <button onClick={handleDelete} className={styles.btnTableDelete}>
      Excluir
    </button>
  );
}