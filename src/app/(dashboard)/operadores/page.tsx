// src/app/(dashboard)/operadores/page.tsx
import { getOperators } from '@/app/actions/operators';
import { OperatorCard } from '@/components/OperatorCard';
import styles from './page.module.css';

export const revalidate = 0; // Força a página a buscar dados atualizados do banco sempre

export default async function OperadoresPage() {
  const operators = await getOperators();

  return (
    <div className={styles.container}>
      <div className={styles.titleSection}>
        <h1>Monitoria de Operadores</h1>
        <p>Selecione um colaborador abaixo para analisar indicadores, auditorias e relatórios de IA.</p>
      </div>

      <div className={styles.grid}>
        {operators.length === 0 ? (
          <div className={styles.emptyState}>
            <p>Nenhum operador cadastrado no sistema até o momento.</p>
          </div>
        ) : (
          operators.map((operator) => (
            <OperatorCard
              key={operator.id}
              id={operator.id}
              name={operator.name}
              team={operator.team}
              mainChannel={operator.mainChannel}
              status={operator.status}
              notes={operator.notes}
            />
          ))
        )}
      </div>
    </div>
  );
}