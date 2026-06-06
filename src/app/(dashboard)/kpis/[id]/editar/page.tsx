// src/app/(dashboard)/kpis/[id]/editar/page.tsx
import { redirect } from 'next/navigation';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { updateKpi } from '@/app/actions/kpis';
import styles from '../../../operadores/[id]/nova-auditoria/page.module.css';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditarKpiPage({ params }: PageProps) {
  const resolvedParams = await params;
  
  const kpi = await prisma.kpi.findUnique({
    where: { id: resolvedParams.id },
    include: { operator: true }
  });

  if (!kpi) redirect('/operadores');

  const formatDateForInput = (date: Date) => date.toISOString().split('T')[0];

  async function handleSubmit(formData: FormData) {
    'use server';

    await updateKpi({
      id: resolvedParams.id,
      startDate: formData.get('startDate') as string,
      endDate: formData.get('endDate') as string,
      csatGeneral: formData.get('csatGeneral') ? Number(formData.get('csatGeneral')) : undefined,
      csatChat: formData.get('csatChat') ? Number(formData.get('csatChat')) : undefined,
      csatVoice: formData.get('csatVoice') ? Number(formData.get('csatVoice')) : undefined,
      convincementGeneral: formData.get('convincementGeneral') ? Number(formData.get('convincementGeneral')) : undefined,
      convincementChat: formData.get('convincementChat') ? Number(formData.get('convincementChat')) : undefined,
      convincementVoice: formData.get('convincementVoice') ? Number(formData.get('convincementVoice')) : undefined,
      tmaChat: formData.get('tmaChat') ? Number(formData.get('tmaChat')) : undefined,
      tmaVoice: formData.get('tmaVoice') ? Number(formData.get('tmaVoice')) : undefined,
      shortCallChat: formData.get('shortCallChat') ? Number(formData.get('shortCallChat')) : undefined,
      shortCallVoice: formData.get('shortCallVoice') ? Number(formData.get('shortCallVoice')) : undefined,
      inactivityRate: formData.get('inactivityRate') ? Number(formData.get('inactivityRate')) : undefined,
      breakOverflow: formData.get('breakOverflow') ? Number(formData.get('breakOverflow')) : undefined,
      transferRate: formData.get('transferRate') ? Number(formData.get('transferRate')) : undefined,
      transferRetention: formData.get('transferRetention') ? Number(formData.get('transferRetention')) : undefined,
    });

    redirect(`/operadores/${kpi.operatorId}`);
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Editar Indicadores Semanais (KPIs)</h1>
        <p>Operador: <strong>{kpi.operator.name}</strong></p>
      </div>

      <form action={handleSubmit} className={styles.form}>
        <h3 className={styles.sectionTitle}>Período de Apuração</h3>
        <div className={styles.row}>
          <div className={styles.group}>
            <label>Data de Início</label>
            <input type="date" name="startDate" defaultValue={formatDateForInput(kpi.startDate)} required className={styles.input} />
          </div>
          <div className={styles.group}>
            <label>Data de Fim</label>
            <input type="date" name="endDate" defaultValue={formatDateForInput(kpi.endDate)} required className={styles.input} />
          </div>
        </div>

        <h3 className={styles.sectionTitle}>Índices de Satisfação (CSAT)</h3>
        <div className={styles.row}>
          <div className={styles.group}>
            <label>CSAT Geral (%)</label>
            <input type="number" name="csatGeneral" step="0.01" defaultValue={kpi.csatGeneral ? Number(kpi.csatGeneral) : ''} className={styles.input} />
          </div>
          <div className={styles.group}>
            <label>CSAT Chat (%)</label>
            <input type="number" name="csatChat" step="0.01" defaultValue={kpi.csatChat ? Number(kpi.csatChat) : ''} className={styles.input} />
          </div>
          <div className={styles.group}>
            <label>CSAT Voz (%)</label>
            <input type="number" name="csatVoice" step="0.01" defaultValue={kpi.csatVoice ? Number(kpi.csatVoice) : ''} className={styles.input} />
          </div>
        </div>

        <h3 className={styles.sectionTitle}>Taxa de Convencimento</h3>
        <div className={styles.row}>
          <div className={styles.group}>
            <label>Convencimento Geral (%)</label>
            <input type="number" name="convincementGeneral" step="0.01" defaultValue={kpi.convincementGeneral ? Number(kpi.convincementGeneral) : ''} className={styles.input} />
          </div>
          <div className={styles.group}>
            <label>Convencimento Chat (%)</label>
            <input type="number" name="convincementChat" step="0.01" defaultValue={kpi.convincementChat ? Number(kpi.convincementChat) : ''} className={styles.input} />
          </div>
          <div className={styles.group}>
            <label>Convencimento Voz (%)</label>
            <input type="number" name="convincementVoice" step="0.01" defaultValue={kpi.convincementVoice ? Number(kpi.convincementVoice) : ''} className={styles.input} />
          </div>
        </div>

        <h3 className={styles.sectionTitle}>Tempos de Atendimento (TMA)</h3>
        <div className={styles.row}>
          <div className={styles.group}>
            <label>TMA Chat (segundos)</label>
            <input type="number" name="tmaChat" defaultValue={kpi.tmaChat || ''} className={styles.input} />
          </div>
          <div className={styles.group}>
            <label>TMA Voz (segundos)</label>
            <input type="number" name="tmaVoice" defaultValue={kpi.tmaVoice || ''} className={styles.input} />
          </div>
        </div>

        <h3 className={styles.sectionTitle}>Chamadas Curtas, Inatividade e Pausa</h3>
        <div className={styles.row}>
          <div className={styles.group}>
            <label>Short Call Chat (%)</label>
            <input type="number" name="shortCallChat" step="0.01" defaultValue={kpi.shortCallChat ? Number(kpi.shortCallChat) : ''} className={styles.input} />
          </div>
          <div className={styles.group}>
            <label>Short Call Voz (%)</label>
            <input type="number" name="shortCallVoice" step="0.01" defaultValue={kpi.shortCallVoice ? Number(kpi.shortCallVoice) : ''} className={styles.input} />
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.group}>
            <label>Taxa de Inatividade (%)</label>
            <input type="number" name="inactivityRate" step="0.01" defaultValue={kpi.inactivityRate ? Number(kpi.inactivityRate) : ''} className={styles.input} />
          </div>
          <div className={styles.group}>
            <label>Estouro de Pausa (segundos)</label>
            <input type="number" name="breakOverflow" defaultValue={kpi.breakOverflow || ''} className={styles.input} />
          </div>
        </div>

        <h3 className={styles.sectionTitle}>Transferências</h3>
        <div className={styles.row}>
          <div className={styles.group}>
            <label>Taxa de Transferência (%)</label>
            <input type="number" name="transferRate" step="0.01" defaultValue={kpi.transferRate ? Number(kpi.transferRate) : ''} className={styles.input} />
          </div>
          <div className={styles.group}>
            <label>Retenção de Transferência (%)</label>
            <input type="number" name="transferRetention" step="0.01" defaultValue={kpi.transferRetention ? Number(kpi.transferRetention) : ''} className={styles.input} />
          </div>
        </div>

        <div className={styles.actions}>
          <Link href={`/operadores/${kpi.operatorId}`} className={styles.btnCancel}>Cancelar</Link>
          <button type="submit" className={styles.btnSubmit}>Atualizar KPIs</button>
        </div>
      </form>
    </div>
  );
}