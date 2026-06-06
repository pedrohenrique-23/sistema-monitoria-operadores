// src/app/(dashboard)/operadores/[id]/editar/page.tsx
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getOperatorById, updateOperator } from '@/app/actions/operators';
import styles from '../nova-auditoria/page.module.css'; // Reaproveitando os estilos de formulário limpos

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditarOperadorPage({ params }: PageProps) {
  const resolvedParams = await params;
  const operator = await getOperatorById(resolvedParams.id);

  if (!operator) {
    redirect('/operadores');
  }

  async function handleSubmit(formData: FormData) {
    'use server';

    await updateOperator({
      id: resolvedParams.id,
      name: formData.get('name') as string,
      team: formData.get('team') as string,
      mainChannel: formData.get('mainChannel') as 'chat' | 'voice',
      status: formData.get('status') as 'ativo' | 'inativo' | 'ferias',
      lookerId: formData.get('lookerId') as string || undefined,
    });

    redirect(`/operadores/${resolvedParams.id}`);
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Editar Cadastro do Operador</h1>
        <p>Modifique as informações cadastrais de <strong>{operator.name}</strong></p>
      </div>

      <form action={handleSubmit} className={styles.form}>
        <h3 className={styles.sectionTitle}>Dados Cadastrais</h3>
        
        <div className={styles.group}>
          <label>Nome Completo</label>
          <input type="text" name="name" defaultValue={operator.name} required className={styles.input} />
        </div>

        <div className={styles.row}>
          <div className={styles.group}>
            <label>Equipe / Célula</label>
            <input type="text" name="team" defaultValue={operator.team} required className={styles.input} />
          </div>
          
          <div className={styles.group}>
            <label>Looker ID (Opcional)</label>
            <input type="text" name="lookerId" defaultValue={operator.lookerId || ''} className={styles.input} />
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.group}>
            <label>Canal Principal</label>
            <select name="mainChannel" defaultValue={operator.mainChannel} required className={styles.input}>
              <option value="chat">Chat</option>
              <option value="voice">Voz</option>
            </select>
          </div>

          <div className={styles.group}>
            <label>Status Operacional</label>
            <select name="status" defaultValue={operator.status} required className={styles.input}>
              <option value="ativo">Ativo</option>
              <option value="inativo">Inativo</option>
              <option value="ferias">Férias</option>
            </select>
          </div>
        </div>

        <div className={styles.actions}>
          <Link href={`/operadores/${resolvedParams.id}`} className={styles.btnCancel}>
            Cancelar
          </Link>
          <button type="submit" className={styles.btnSubmit}>
            Salvar Alterações
          </button>
        </div>
      </form>
    </div>
  );
}