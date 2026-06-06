// src/app/(dashboard)/ia-chat/ChatWindow.tsx
'use client';

import { useState } from 'react';
import { sendChatMessage, ChatMessage } from '@/app/actions/chat';
import styles from './page.module.css';

interface OperatorSelectOption {
  id: string;
  name: string;
  team: string;
}

export default function ChatWindow({ operators }: { operators: OperatorSelectOption[] }) {
  const [operatorId, setOperatorId] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('2026-05-01');
  const [endDate, setEndDate] = useState<string>('2026-06-30');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  async function handleSend() {
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = { role: 'user', text: input };
    const updatedHistory = [...messages, userMsg];
    
    setMessages(updatedHistory);
    setInput('');
    setLoading(true);

    try {
      const responseText = await sendChatMessage({
        operatorId: operatorId || undefined,
        startDate,
        endDate,
        userMessage: input,
        history: messages,
      });

      setMessages([...updatedHistory, { role: 'model', text: responseText }]);
    } catch (err) {
      setMessages([...updatedHistory, { role: 'model', text: '⚠️ Erro ao processar a resposta da IA. Verifique as conexões.' }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.container}>
      {/* PAINEL DE FILTROS DINÂMICOS */}
      <div className={styles.filterCard}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Escopo da Análise</label>
          <select value={operatorId} onChange={e => setOperatorId(e.target.value)} style={{ padding: '0.5rem', borderRadius: '4px' }}>
            <option value="">👥 Equipe Inteira (Visão Geral)</option>
            {operators.map(op => (
              <option key={op.id} value={op.id}>👤 {op.name} ({op.team})</option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Data Inicial</label>
          <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} style={{ padding: '0.5rem', borderRadius: '4px' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Data Final</label>
          <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} style={{ padding: '0.5rem', borderRadius: '4px' }} />
        </div>
      </div>

      {/* CAIXA DO CHAT CONVERSACIONAL */}
      <div className={styles.chatWrapper}>
        <div className={styles.chatBox}>
          {messages.length === 0 && (
            <p style={{ textAlign: 'center', color: 'var(--color-text-secondary)', marginTop: '2rem', fontStyle: 'italic' }}>
              Selecione o operador/equipe e o período acima, digite sua dúvida aqui embaixo e aperte enviar!
            </p>
          )}
          {messages.map((msg, i) => (
            <div key={i} className={msg.role === 'user' ? styles.msgUser : styles.msgModel}>
              {msg.text}
            </div>
          ))}
          {loading && <div className={styles.msgModel} style={{ color: 'var(--color-text-secondary)' }}>typing...</div>}
        </div>

        <div className={styles.inputArea}>
          <input
            type="text"
            className={styles.chatInput}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Ex: Como está a evolução do CSAT desse operador perante a meta?"
            disabled={loading}
          />
          <button onClick={handleSend} className={styles.sendBtn} disabled={loading || !input.trim()}>
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
}