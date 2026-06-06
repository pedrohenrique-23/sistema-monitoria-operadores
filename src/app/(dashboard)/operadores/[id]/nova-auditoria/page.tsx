// src/app/(dashboard)/operadores/[id]/nova-auditoria/page.tsx
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getOperatorById } from '@/app/actions/operators';
import { createAudit } from '@/app/actions/audits';
import styles from './page.module.css';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function NovaAuditoriaPage({ params }: PageProps) {
  const resolvedParams = await params;
  const operator = await getOperatorById(resolvedParams.id);

  if (!operator) {
    redirect('/operadores');
  }

  async function handleSubmit(formData: FormData) {
    'use server';

    await createAudit({
      operatorId: resolvedParams.id,
      auditNumber: formData.get('auditNumber') as string,
      protocolNumber: formData.get('protocolNumber') as string,
      customerContact: formData.get('customerContact') as string,
      serviceChannel: formData.get('serviceChannel') as 'chat' | 'voice',
      serviceDatetime: formData.get('serviceDatetime') as string,
      score: Number(formData.get('score')),
      auditSummary: formData.get('auditSummary') as string,
      positivePoints: formData.get('positivePoints') as string,
      negativePoints: formData.get('negativePoints') as string,
    });

    redirect(`/operadores/${resolvedParams.id}`);
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Nova Auditoria de Qualidade</h1>
        <p>Operador: <strong>{operator.name}</strong> | Equipe: {operator.team}</p>
      </div>

      <form action={handleSubmit} className={styles.form}>
        <h3 className={styles.sectionTitle}>Identificação da Auditoria</h3>
        <div className={styles.row}>
          <div className={styles.group}>
            <label>Número da Auditoria (Único)</label>
            <input type="text" name="auditNumber" required className={styles.input} placeholder="Ex: AUD-2026-001" />
          </div>
          <div className={styles.group}>
            <label>Número do Protocolo</label>
            <input type="text" name="protocolNumber" required className={styles.input} placeholder="Ex: 20260605112" />
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.group}>
            <label>Contato do Cliente (E-mail/Telefone)</label>
            <input type="text" name="customerContact" required className={styles.input} placeholder="cliente@email.com" />
          </div>
          <div className={styles.group}>
            <label>Canal de Atendimento</label>
            <select name="serviceChannel" required className={styles.input}>
              <option value="chat">Chat</option>
              <option value="voice">Voz</option>
            </select>
          </div>
          <div className={styles.group}>
            <label>Data e Hora do Atendimento</label>
            <input type="datetime-local" name="serviceDatetime" required className={styles.input} />
          </div>
        </div>

        <h3 className={styles.sectionTitle}>Resultado da Avaliação</h3>
        <div className={styles.row}>
          <div className={styles.group}>
            <label>Nota Final (0 a 100)</label>
            <input type="number" name="score" min="0" max="100" required className={styles.input} placeholder="Ex: 95" />
          </div>
        </div>

        <h3 className={styles.sectionTitle}>Conteúdo da Auditoria</h3>
        <div className={styles.group}>
          <label>Resumo do Atendimento</label>
          <textarea name="auditSummary" required className={styles.textarea} placeholder="Forneça um resumo detalhado de como foi a interação..." />
        </div>

        <div className={styles.group}>
          <label>Pontos Positivos</label>
          <textarea name="positivePoints" required className={styles.textarea} placeholder="O que o operador fez bem? (ex: boa comunicação, resolução rápida)..." />
        </div>

        <div className={styles.group}>
          <label>Pontos Negativos / Oportunidades</label>
          <textarea name="negativePoints" required className={styles.textarea} placeholder="O que precisa ser melhorado? (ex: pulou etapas do sistema, erro de postura)..." />
        </div>

        <div className={styles.actions}>
          <Link href={`/operadores/${resolvedParams.id}`} className={styles.btnCancel}>
            Cancelar
          </Link>
          <button type="submit" className={styles.btnSubmit}>
            Salvar Auditoria
          </button>
        </div>
      </form>
    </div>
  );
}