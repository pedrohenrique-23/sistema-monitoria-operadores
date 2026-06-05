// src/app/(dashboard)/operadores/[id]/page.tsx
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getOperatorById, updateOperatorNotes } from '@/app/actions/operators';
import styles from './page.module.css';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function OperadorPerfilPage({ params }: PageProps) {
  const resolvedParams = await params;
  const operator = await getOperatorById(resolvedParams.id);

  if (!operator) {
    notFound();
  }

  // Define as classes dinâmicas de estilo baseadas nas regras de negócio
  const channelClass = operator.mainChannel === 'chat' ? styles.channelChat : styles.channelVoice;
  
  let statusClass = styles.statusInativo;
  if (operator.status === 'ativo') statusClass = styles.statusAtivo;
  if (operator.status === 'ferias') statusClass = styles.statusFerias;

  // Server Action inline para lidar com o envio do formulário de notas
  async function handleSaveNotes(formData: FormData) {
    'use server';
    const notesText = formData.get('notes') as string;
    await updateOperatorNotes(resolvedParams.id, notesText);
  }

  return (
    <div className={styles.container}>
      <Link href="/operadores" className={styles.backLink}>
        ← Voltar para a listagem
      </Link>

      {/* CABEÇALHO DO PERFIL */}
      <section className={styles.profileHeader}>
        <div className={styles.operatorInfo}>
          <h1>{operator.name}</h1>
          <div className={styles.metaGrid}>
            <span><strong>Equipe:</strong> {operator.team}</span>
            {operator.lookerId && <span><strong>Looker ID:</strong> {operator.lookerId}</span>}
          </div>
        </div>

        <div className={styles.badges}>
          <span className={`${styles.badge} ${channelClass}`}>{operator.mainChannel}</span>
          <span className={`${styles.badge} ${statusClass}`}>{operator.status}</span>
        </div>
      </section>

      {/* AÇÕES RÁPIDAS */}
      <section className={styles.quickActions}>
        <button className={`${styles.actionButton} ${styles.btnKpi}`}>
          Novo Indicador
        </button>
        <button className={`${styles.actionButton} ${styles.btnAudit}`}>
          Nova Auditoria
        </button>
      </section>

      {/* FORMULÁRIO DE OBSERVAÇÕES PERMANENTES */}
      <section className={styles.notesSection}>
        <h2>Observações Permanentes</h2>
        <form action={handleSaveNotes}>
          <textarea
            name="notes"
            className={styles.textarea}
            defaultValue={operator.notes || ''}
            placeholder="Digite aqui observações permanentes sobre o histórico, perfil ou alinhamentos deste operador..."
          />
          <button type="submit" className={styles.saveButton}>
            Salvar Observações
          </button>
        </form>
      </section>

      {/* HISTÓRICOS (SERÃO IMPLEMENTADOS NAS PRÓXIMAS FASES) */}
      <section className={styles.historyPlaceholder}>
        <strong>Histórico de KPIs e Auditorias</strong>
        <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
          Os gráficos e tabelas detalhadas de evolução serão acoplados aqui nas próximas etapas.
        </p>
      </section>
    </div>
  );
}