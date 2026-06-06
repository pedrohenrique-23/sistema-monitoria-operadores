// src/app/(dashboard)/operadores/[id]/page.tsx
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getOperatorById, updateOperatorNotes } from '@/app/actions/operators';
import { secondsToTimeString } from '@/utils/time';
import { formatDate } from '@/utils/date';
import styles from './page.module.css';
import AiAnalysis from './AiAnalysis';
import DeleteButton from './DeleteButton';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function OperadorPerfilPage({ params }: PageProps) {
    const resolvedParams = await params;
    const operator = await getOperatorById(resolvedParams.id);

    if (!operator) {
        notFound();
    }

    const channelClass = operator.mainChannel === 'chat' ? styles.channelChat : styles.channelVoice;

    let statusClass = styles.statusInativo;
    if (operator.status === 'ativo') statusClass = styles.statusAtivo;
    if (operator.status === 'ferias') statusClass = styles.statusFerias;

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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <h1>{operator.name}</h1>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <Link
                                href={`/operadores/${resolvedParams.id}/editar`}
                                className={styles.btnEditInline}
                            >
                                Editar Cadastro
                            </Link>
                            <span style={{ color: 'var(--color-border)' }}>|</span>
                            <DeleteButton id={resolvedParams.id} />
                        </div>
                    </div>
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
                <Link href={`/operadores/${resolvedParams.id}/novo-kpi`} className={`${styles.actionButton} ${styles.btnKpi}`}>
                    Novo Indicador
                </Link>
                <Link href={`/operadores/${resolvedParams.id}/nova-auditoria`} className={`${styles.actionButton} ${styles.btnAudit}`}>
                    Nova Auditoria
                </Link>
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

            <AiAnalysis operatorId={resolvedParams.id} />

            {/* HISTÓRICO DE KPIS SEMANAIS */}
            <section className={styles.historySection}>
                <h2>Histórico de Indicadores Semanais (KPIs)</h2>
                {operator.kpis.length === 0 ? (
                    <p className={styles.emptyMessage}>Nenhum indicador lançado para este operador até o momento.</p>
                ) : (
                    <div className={styles.tableWrapper}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Período</th>
                                    <th>CSAT Geral</th>
                                    <th>TMA Chat</th>
                                    <th>TMA Voz</th>
                                    <th>Short Call Chat</th>
                                    <th>Short Call Voz</th>
                                </tr>
                            </thead>
                            <tbody>
                                {operator.kpis.map((kpi) => (
                                    <tr key={kpi.id}>
                                        <td>{kpi.startDate.toLocaleDateString('pt-BR')} até {kpi.endDate.toLocaleDateString('pt-BR')}</td>
                                        <td>{kpi.csatGeneral ? `${Number(kpi.csatGeneral)}%` : '-'}</td>
                                        <td>{kpi.tmaChat ? secondsToTimeString(kpi.tmaChat) : '-'}</td>
                                        <td>{kpi.tmaVoice ? secondsToTimeString(kpi.tmaVoice) : '-'}</td>
                                        <td>{kpi.shortCallChat ? `${Number(kpi.shortCallChat)}%` : '-'}</td>
                                        <td>{kpi.shortCallVoice ? `${Number(kpi.shortCallVoice)}%` : '-'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>

            {/* HISTÓRICO DE AUDITORIAS QUALITATIVAS */}
            <section className={styles.historySection}>
                <h2>Histórico de Auditorias de Qualidade</h2>
                {operator.audits.length === 0 ? (
                    <p className={styles.emptyMessage}>Nenhuma auditoria realizada para este operador até o momento.</p>
                ) : (
                    <div className={styles.tableWrapper}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Data/Hora</th>
                                    <th>Auditoria / Protocolo</th>
                                    <th>Canal</th>
                                    <th>Nota (Score)</th>
                                    <th>Pontos Positivos / Negativos</th>
                                </tr>
                            </thead>
                            <tbody>
                                {operator.audits.map((audit) => (
                                    <tr key={audit.id}>
                                        <td>{audit.serviceDatetime.toLocaleString('pt-BR')}</td>
                                        <td>
                                            <strong>Nº:</strong> {audit.auditNumber} <br />
                                            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>Prot: {audit.protocolNumber}</span>
                                        </td>
                                        <td>
                                            <span className={`${styles.badgeChannel} ${audit.serviceChannel === 'chat' ? styles.channelChat : styles.channelVoice}`}>
                                                {audit.serviceChannel}
                                            </span>
                                        </td>
                                        <td><strong>{audit.score.toString()}/100</strong></td>
                                        <td>
                                            <div style={{ fontSize: '0.85rem' }}>
                                                <span style={{ color: 'var(--color-status-active)' }}><strong>(+)</strong></span> {audit.positivePoints}
                                                <br />
                                                <span style={{ color: 'var(--color-status-inactive)' }}><strong>(-)</strong></span> {audit.negativePoints}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </div>
    );
}