// src/app/(dashboard)/operadores/[id]/novo-kpi/page.tsx
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getOperatorById } from '@/app/actions/operators';
import { createKpi } from '@/app/actions/kpis';
import styles from './page.module.css';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function NovoKpiPage({ params }: PageProps) {
  const resolvedParams = await params;
  const operator = await getOperatorById(resolvedParams.id);

  if (!operator) {
    redirect('/operadores');
  }

  async function handleSubmit(formData: FormData) {
    'use server';

    await createKpi({
      operatorId: resolvedParams.id,
      startDate: formData.get('startDate') as string,
      endDate: formData.get('endDate') as string,
      csatGeneral: formData.get('csatGeneral') ? Number(formData.get('csatGeneral')) : undefined,
      csatChat: formData.get('csatChat') ? Number(formData.get('csatChat')) : undefined,
      csatVoice: formData.get('csatVoice') ? Number(formData.get('csatVoice')) : undefined,
      tmaChatStr: formData.get('tmaChat') as string || undefined,
      tmaVoiceStr: formData.get('tmaVoice') as string || undefined,
      inactivityRate: formData.get('inactivityRate') ? Number(formData.get('inactivityRate')) : undefined,
      breakOverflowStr: formData.get('breakOverflow') as string || undefined,
      shortCallChat: formData.get('shortCallChat') ? Number(formData.get('shortCallChat')) : undefined,
      shortCallVoice: formData.get('shortCallVoice') ? Number(formData.get('shortCallVoice')) : undefined,
      transferRate: formData.get('transferRate') ? Number(formData.get('transferRate')) : undefined,
      transferRetention: formData.get('transferRetention') ? Number(formData.get('transferRetention')) : undefined,
    });

    redirect(`/operadores/${resolvedParams.id}`);
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Lançar Indicadores Semanais</h1>
        <p>Operador: <strong>{operator.name}</strong> | Equipe: {operator.team}</p>
      </div>

      <form action={handleSubmit} className={styles.form}>
        <h3 className={styles.sectionTitle}>Período de Avaliação</h3>
        <div className={styles.row}>
          <div className={styles.group}>
            <label>Data Inicial</label>
            <input type="date" name="startDate" required className={styles.input} />
          </div>
          <div className={styles.group}>
            <label>Data Final</label>
            <input type="date" name="endDate" required className={styles.input} />
          </div>
        </div>

        <h3 className={styles.sectionTitle}>Indicadores de Satisfação (CSAT)</h3>
        <div className={styles.row}>
          <div className={styles.group}>
            <label>CSAT Geral (%)</label>
            <input type="number" step="0.01" name="csatGeneral" min="0" max="100" className={styles.input} placeholder="Ex: 85.5" />
          </div>
          <div className={styles.group}>
            <label>CSAT Chat (%)</label>
            <input type="number" step="0.01" name="csatChat" min="0" max="100" className={styles.input} placeholder="Ex: 90.0" />
          </div>
          <div className={styles.group}>
            <label>CSAT Voz (%)</label>
            <input type="number" step="0.01" name="csatVoice" min="0" max="100" className={styles.input} placeholder="Ex: 82.3" />
          </div>
        </div>

        <h3 className={styles.sectionTitle}>Tempo Médio de Atendimento & Pausas</h3>
        <div className={styles.row}>
          <div className={styles.group}>
            <label>TMA Chat (hh:mm:ss)</label>
            <input type="text" name="tmaChat" pattern="^([0-1]\d|2[0-3]):([0-5]\d):([0-5]\d)$" className={styles.input} placeholder="00:05:30" />
          </div>
          <div className={styles.group}>
            <label>TMA Voz (hh:mm:ss)</label>
            <input type="text" name="tmaVoice" pattern="^([0-1]\d|2[0-3]):([0-5]\d):([0-5]\d)$" className={styles.input} placeholder="00:03:15" />
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.group}>
            <label>Taxa de Inatividade (%)</label>
            <input type="number" step="0.01" name="inactivityRate" min="0" max="100" className={styles.input} placeholder="Ex: 4.2" />
          </div>
          <div className={styles.group}>
            <label>Estouro de Pausa (hh:mm:ss)</label>
            <input type="text" name="breakOverflow" pattern="^([0-1]\d|2[0-3]):([0-5]\d):([0-5]\d)$" className={styles.input} placeholder="00:01:45" />
          </div>
        </div>

        {/* Insira este bloco dentro do form em src/app/(dashboard)/operadores/[id]/novo-kpi/page.tsx */}
        <h3 className={styles.sectionTitle}>Taxa de Chamadas Curtas & Produtividade</h3>
        <div className={styles.row}>
          <div className={styles.group}>
            <label>Taxa de Short Call Chat (%)</label>
            <input type="number" step="0.01" name="shortCallChat" min="0" max="100" className={styles.input} placeholder="Ex: 4.50" />
          </div>
          <div className={styles.group}>
            <label>Taxa de Short Call Voice (%)</label>
            <input type="number" step="0.01" name="shortCallVoice" min="0" max="100" className={styles.input} placeholder="Ex: 2.15" />
          </div>
        </div>

        <h3 className={styles.sectionTitle}>Métricas de Transferência</h3>
        <div className={styles.row}>
          <div className={styles.group}>
            <label>Taxa de Transferência (%)</label>
            <input type="number" step="0.01" name="transferRate" min="0" max="100" className={styles.input} placeholder="Ex: 12.5" />
          </div>
          <div className={styles.group}>
            <label>Retenção de Transferência (%)</label>
            <input type="number" step="0.01" name="transferRetention" min="0" max="100" className={styles.input} placeholder="Ex: 94.2" />
          </div>
        </div>

        <div className={styles.actions}>
          <Link href={`/operadores/${resolvedParams.id}`} className={styles.btnCancel}>
            Cancelar
          </Link>
          <button type="submit" className={styles.btnSubmit}>
            Salvar Indicadores
          </button>
        </div>
      </form>
    </div>
  );
}