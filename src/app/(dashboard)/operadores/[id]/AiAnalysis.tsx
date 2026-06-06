'use client';

import { useState } from 'react';
import { generateOperatorAnalysis } from '@/app/actions/ai';
import styles from './page.module.css';

interface AiAnalysisProps {
  operatorId: string;
}

export default function AiAnalysis({ operatorId }: AiAnalysisProps) {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGenerate() {
    setLoading(true);
    setError(null);
    try {
      const result = await generateOperatorAnalysis(operatorId);
      setAnalysis(result);
    } catch (err) {
      setError('Não foi possível gerar a análise com o Gemini neste momento.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className={styles.historySection} style={{ marginTop: '1.5rem', borderLeft: '4px solid var(--color-channel-chat)' }}>
      <h2>💡 Insights de Inteligência Artificial (PDI)</h2>
      
      {!analysis && !loading && (
        <div>
          <p className={styles.emptyMessage} style={{ marginBottom: '1rem' }}>
            Cruze o histórico de KPIs e Auditorias deste operador para gerar um diagnóstico automático e Plano de Ação (PDI).
          </p>
          <button onClick={handleGenerate} className={styles.saveButton} style={{ backgroundColor: 'var(--color-channel-chat)' }}>
            Gerar Análise com Gemini
          </button>
        </div>
      )}

      {loading && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--color-text-secondary)' }}>
          <div className={styles.spinner}></div>
          <p>O Gemini está analisando o histórico do operador... Aguarde alguns segundos.</p>
        </div>
      )}

      {error && <p style={{ color: 'var(--color-status-inactive)', fontSize: '0.9rem' }}>{error}</p>}

      {analysis && !loading && (
        <div>
          {/* Renderização direta do texto estruturado do Gemini */}
          <div className={styles.aiOutput} style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
            {analysis}
          </div>
          <button onClick={handleGenerate} className={styles.backLink} style={{ marginTop: '1.5rem', border: 'none', background: 'none', cursor: 'pointer' }}>
            🔄 Atualizar e Reanalisar
          </button>
        </div>
      )}
    </section>
  );
}