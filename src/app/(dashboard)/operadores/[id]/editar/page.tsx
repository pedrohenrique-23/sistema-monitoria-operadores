// src/app/(dashboard)/auditorias/[id]/editar/page.tsx
import { redirect } from 'next/navigation';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { updateAudit } from '@/app/actions/audits';
import styles from '../../../operadores/[id]/nova-auditoria/page.module.css';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditarAuditoriaPage({ params }: PageProps) {
  const resolvedParams = await params;

  const audit = await prisma.audit.findUnique({
    where: { id: resolvedParams.id },
    include: { operator: true },
  });

  if (!audit) redirect('/operadores');

  const formatDatetimeForInput = (date: Date) => {
    return date.toISOString().slice(0, 16); // Formato YYYY-MM-DDTHH:MM exigido pelo datetime-local
  };

  async function handleSubmit(formData: FormData) {
    'use server';

    await updateAudit({
      id: resolvedParams.id,
      auditNumber: formData.get('auditNumber') as string,
      protocolNumber: formData.get('protocolNumber') as string,
      customerContact: formData.get('customerContact') as string,
      serviceChannel: formData.get('serviceChannel') as string,
      serviceDatetime: formData.get('serviceDatetime') as string,
      score: Number(formData.get('score')),
      auditSummary: formData.get('auditSummary') as string,
      positivePoints: formData.get('positivePoints') as string,
      negativePoints: formData.get('negativePoints') as string,
    });

    redirect(`/operadores/${audit.operatorId}`);
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Editar Auditoria de Qualidade</h1>
        <p>Operador: <strong>{audit.operator.name}</strong></p>
      </div>

      <form action={handleSubmit} className={styles.form}>
        <h3 className={styles.sectionTitle}>Identificação do Atendimento</h3>
        <div className={styles.row}>
          <div className={styles.group}>
            <label>Número da Auditoria</label>
            <input type="text" name="auditNumber" defaultValue={audit.auditNumber} required className={styles.input} />
          </div>
          <div className={styles.group}>
            <label>Número do Protocolo</label>
            <input type="text" name="protocolNumber" defaultValue={audit.protocolNumber} required className={styles.input} />
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.group}>
            <label>Contato do Cliente</label>
            <input type="text" name="customerContact" defaultValue={audit.customerContact} required className={styles.input} />
          </div>
          <div className={styles.group}>
            <label>Canal de Atendimento</label>
            <select name="serviceChannel" defaultValue={audit.serviceChannel} required className={styles.input}>
              <option value="chat">Chat</option>
              <option value="voice">Voz</option>
            </select>
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.group}>
            <label>Data e Hora do Atendimento</label>
            <input type="datetime-local" name="serviceDatetime" defaultValue={formatDatetimeForInput(audit.serviceDatetime)} required className={styles.input} />
          </div>
          <div className={styles.group}>
            <label>Nota da Auditoria (0 a 100)</label>
            <input type="number" name="score" step="0.01" defaultValue={Number(audit.score)} required className={styles.input} />
          </div>
        </div>

        <h3 className={styles.sectionTitle}>Avaliação Detalhada</h3>
        <div className={styles.group}>
          <label>Resumo da Auditoria</label>
          <textarea name="auditSummary" defaultValue={audit.auditSummary} required className={styles.input} style={{ height: '80px' }} />
        </div>
        <div className={styles.group}>
          <label>Pontos Positivos</label>
          <textarea name="positivePoints" defaultValue={audit.positivePoints} required className={styles.input} style={{ height: '60px' }} />
        </div>
        <div className={styles.group}>
          <label>Pontos Negativos / Oportunidades</label>
          <textarea name="negativePoints" defaultValue={audit.negativePoints} required className={styles.input} style={{ height: '60px' }} />
        </div>

        <div className={styles.actions}>
          <Link href={`/operadores/${audit.operatorId}`} className={styles.btnCancel}>Cancelar</Link>
          <button type="submit" className={styles.btnSubmit}>Atualizar Auditoria</button>
        </div>
      </form>
    </div>
  );
}