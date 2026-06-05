// src/components/OperatorCard.tsx
import Link from 'next/link';
import styles from './OperatorCard.module.css';

interface OperatorCardProps {
  id: string;
  name: string;
  team: string;
  mainChannel: string;
  status: string;
  notes: string | null;
}

export function OperatorCard({ id, name, team, mainChannel, status, notes }: OperatorCardProps) {
  // Mapeamento dinâmico de classes css baseado nas regras do escopo
  const channelClass = mainChannel === 'chat' ? styles.channelChat : styles.channelVoice;
  
  let statusClass = styles.statusInativo;
  if (status === 'ativo') statusClass = styles.statusAtivo;
  if (status === 'ferias') statusClass = styles.statusFerias;

  return (
    <Link href={`/operadores/${id}`} className={styles.card}>
      <div className={styles.header}>
        <div>
          <h3 className={styles.name}>{name}</h3>
          <p className={styles.team}>Equipe: {team}</p>
        </div>
        <div className={styles.badges}>
          <span className={`${styles.badge} ${channelClass}`}>{mainChannel}</span>
          <span className={`${styles.badge} ${statusClass}`}>{status}</span>
        </div>
      </div>
      
      <div className={styles.previewNotes}>
        {notes ? notes : <em>Nenhuma observação registrada.</em>}
      </div>
    </Link>
  );
}