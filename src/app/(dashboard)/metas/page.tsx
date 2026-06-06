// src/app/(dashboard)/metas/page.tsx
import prisma from '@/lib/prisma';
import { createGoal, deleteGoal } from '@/app/actions/goals';
import { redirect } from 'next/navigation';
import styles from '../operadores/[id]/nova-auditoria/page.module.css';
import DeleteGoalButton from './DeleteGoalButton';

const formatSecondsToClock = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const parseClockToSeconds = (clockString: string): number => {
    if (!clockString) return 0;
    const parts = clockString.split(':');
    if (parts.length !== 3) return 0;
    return (parseInt(parts[0], 10) || 0) * 3600 + (parseInt(parts[1], 10) || 0) * 60 + (parseInt(parts[2], 10) || 0);
};

export default async function MetasPage() {
    const goals = await prisma.goal.findMany({
        orderBy: { startDate: 'desc' },
    });

    async function handleCreate(formData: FormData) {
        'use server';

        await createGoal({
            team: formData.get('team') as string,
            startDate: formData.get('startDate') as string,
            endDate: formData.get('endDate') as string,
            targetCsat: Number(formData.get('targetCsat')),
            targetCsatChat: formData.get('targetCsatChat') ? Number(formData.get('targetCsatChat')) : undefined,
            targetCsatVoice: formData.get('targetCsatVoice') ? Number(formData.get('targetCsatVoice')) : undefined,
            targetConvincement: formData.get('targetConvincement') ? Number(formData.get('targetConvincement')) : undefined,
            targetConvincementChat: formData.get('targetConvincementChat') ? Number(formData.get('targetConvincementChat')) : undefined,
            targetConvincementVoice: formData.get('targetConvincementVoice') ? Number(formData.get('targetConvincementVoice')) : undefined,
            targetTmaChat: parseClockToSeconds(formData.get('targetTmaChat') as string),
            targetTmaVoice: parseClockToSeconds(formData.get('targetTmaVoice') as string),
            maxShortCallChat: formData.get('maxShortCallChat') ? Number(formData.get('maxShortCallChat')) : undefined,
            maxShortCallVoice: formData.get('maxShortCallVoice') ? Number(formData.get('maxShortCallVoice')) : undefined,
            maxShortCallRate: Number(formData.get('maxShortCallRate')),
            maxInactivityRate: formData.get('maxInactivityRate') ? Number(formData.get('maxInactivityRate')) : undefined,
            maxBreakOverflow: parseClockToSeconds(formData.get('maxBreakOverflow') as string),
            maxTransferRate: formData.get('maxTransferRate') ? Number(formData.get('maxTransferRate')) : undefined,
            targetTransferRetention: formData.get('targetTransferRetention') ? Number(formData.get('targetTransferRetention')) : undefined,
        });

        redirect('/metas');
    }

    async function handleDelete(formData: FormData) {
        'use server';
        await deleteGoal(formData.get('id') as string);
        redirect('/metas');
    }

    return (
        <div className={styles.container} style={{ maxWidth: '1200px' }}>
            <div className={styles.header}>
                <h1>Configuração de Metas Operacionais</h1>
                <p>Defina as réguas de corte de todas as métricas para as análises comparativas e IA.</p>
            </div>

            <form action={handleCreate} className={styles.form} style={{ marginBottom: '2rem' }}>
                <h3 className={styles.sectionTitle}>Período e Célula</h3>
                <div className={styles.row}>
                    <div className={styles.group}>
                        <label>Equipe</label>
                        <select name="team" required className={styles.input}>
                            <option value="Suporte">Suporte</option>
                            <option value="Backoffice">Backoffice</option>
                            <option value="Atendimento">Atendimento</option>
                        </select>
                    </div>
                    <div className={styles.group}>
                        <label>Início</label>
                        <input type="date" name="startDate" required className={styles.input} />
                    </div>
                    <div className={styles.group}>
                        <label>Fim</label>
                        <input type="date" name="endDate" required className={styles.input} />
                    </div>
                </div>

                <h3 className={styles.sectionTitle}>Metas de Satisfação (CSAT Mínimo %)</h3>
                <div className={styles.row}>
                    <div className={styles.group}>
                        <label>Geral</label>
                        <input type="number" name="targetCsat" step="0.01" required className={styles.input} />
                    </div>
                    <div className={styles.group}>
                        <label>Chat</label>
                        <input type="number" name="targetCsatChat" step="0.01" className={styles.input} />
                    </div>
                    <div className={styles.group}>
                        <label>Voz</label>
                        <input type="number" name="targetCsatVoice" step="0.01" className={styles.input} />
                    </div>
                </div>

                <h3 className={styles.sectionTitle}>Metas de Convencimento (Mínimo %)</h3>
                <div className={styles.row}>
                    <div className={styles.group}>
                        <label>Geral</label>
                        <input type="number" name="targetConvincement" step="0.01" className={styles.input} />
                    </div>
                    <div className={styles.group}>
                        <label>Chat</label>
                        <input type="number" name="targetConvincementChat" step="0.01" className={styles.input} />
                    </div>
                    <div className={styles.group}>
                        <label>Voz</label>
                        <input type="number" name="targetConvincementVoice" step="0.01" className={styles.input} />
                    </div>
                </div>

                <h3 className={styles.sectionTitle}>Tempos Médios (TMA Máximo hh:mm:ss)</h3>
                <div className={styles.row}>
                    <div className={styles.group}>
                        <label>TMA Chat</label>
                        <input type="text" name="targetTmaChat" placeholder="00:05:00" pattern="[0-9]{2}:[0-9]{2}:[0-9]{2}" required className={styles.input} />
                    </div>
                    <div className={styles.group}>
                        <label>TMA Voz</label>
                        <input type="text" name="targetTmaVoice" placeholder="00:03:00" pattern="[0-9]{2}:[0-9]{2}:[0-9]{2}" required className={styles.input} />
                    </div>
                </div>

                <h3 className={styles.sectionTitle}>Limites de Chamadas Curtas, Inatividade e Pausa</h3>
                <div className={styles.row}>
                    <div className={styles.group}>
                        <label>Short Call Geral (%)</label>
                        <input type="number" name="maxShortCallRate" step="0.01" required className={styles.input} />
                    </div>
                    <div className={styles.group}>
                        <label>Short Chat (%)</label>
                        <input type="number" name="maxShortCallChat" step="0.01" className={styles.input} />
                    </div>
                    <div className={styles.group}>
                        <label>Short Voz (%)</label>
                        <input type="number" name="maxShortCallVoice" step="0.01" className={styles.input} />
                    </div>
                </div>
                <div className={styles.row}>
                    <div className={styles.group}>
                        <label>Taxa Inatividade Máx (%)</label>
                        <input type="number" name="maxInactivityRate" step="0.01" className={styles.input} />
                    </div>
                    <div className={styles.group}>
                        <label>Estouro Pausa Máx (hh:mm:ss)</label>
                        <input type="text" name="maxBreakOverflow" placeholder="00:01:00" pattern="[0-9]{2}:[0-9]{2}:[0-9]{2}" required className={styles.input} />
                    </div>
                </div>

                <h3 className={styles.sectionTitle}>Limites de Transferência</h3>
                <div className={styles.row}>
                    <div className={styles.group}>
                        <label>Taxa de Transferência Máx (%)</label>
                        <input type="number" name="maxTransferRate" step="0.01" className={styles.input} />
                    </div>
                    <div className={styles.group}>
                        <label>Retenção Mínima (%)</label>
                        <input type="number" name="targetTransferRetention" step="0.01" className={styles.input} />
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                    <button type="submit" className={styles.btnSubmit}>Salvar Régua de Metas</button>
                </div>
            </form>

            {/* HISTÓRICO DE METAS */}
            <div className={styles.form} style={{ padding: '1.5rem' }}>
                <h3 className={styles.sectionTitle} style={{ marginBottom: '1rem' }}>Metas Vigentes</h3>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                        <thead>
                            <tr style={{ textAlign: 'left', borderBottom: '2px solid var(--color-border)', color: 'var(--color-text-secondary)' }}>
                                <th style={{ padding: '0.5rem' }}>Equipe</th>
                                <th style={{ padding: '0.5rem' }}>Vigência</th>
                                <th style={{ padding: '0.5rem' }}>CSAT (G/C/V)</th>
                                <th style={{ padding: '0.5rem' }}>Convinc. (G/C/V)</th>
                                <th style={{ padding: '0.5rem' }}>TMA (C/V)</th>
                                <th style={{ padding: '0.5rem' }}>Short (G/C/V)</th>
                                <th style={{ padding: '0.5rem' }}>Inat. / Pausa</th>
                                <th style={{ padding: '0.5rem' }}>Transf. (Taxa/Ret.)</th>
                                <th style={{ padding: '0.5rem', textAlign: 'center' }}>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {goals.map((g) => (
                                <tr key={g.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                    <td style={{ padding: '0.75rem 0.5rem', fontWeight: 'bold' }}>{g.team}</td>
                                    <td style={{ padding: '0.75rem 0.5rem' }}>{g.startDate.toLocaleDateString('pt-BR')} - {g.endDate.toLocaleDateString('pt-BR')}</td>
                                    <td style={{ padding: '0.75rem 0.5rem' }}>{Number(g.targetCsat)}% / {g.targetCsatChat ? `${Number(g.targetCsatChat)}%` : '-'} / {g.targetCsatVoice ? `${Number(g.targetCsatVoice)}%` : '-'}</td>
                                    <td style={{ padding: '0.75rem 0.5rem' }}>{g.targetConvincement ? `${Number(g.targetConvincement)}%` : '-'} / {g.targetConvincementChat ? `${Number(g.targetConvincementChat)}%` : '-'} / {g.targetConvincementVoice ? `${Number(g.targetConvincementVoice)}%` : '-'}</td>
                                    <td style={{ padding: '0.75rem 0.5rem' }}>{formatSecondsToClock(g.targetTmaChat)} / {formatSecondsToClock(g.targetTmaVoice)}</td>
                                    <td style={{ padding: '0.75rem 0.5rem' }}>{Number(g.maxShortCallRate)}% / {g.maxShortCallChat ? `${Number(g.maxShortCallChat)}%` : '-'} / {g.maxShortCallVoice ? `${Number(g.maxShortCallVoice)}%` : '-'}</td>
                                    <td style={{ padding: '0.75rem 0.5rem' }}>{g.maxInactivityRate ? `${Number(g.maxInactivityRate)}%` : '-'} / {formatSecondsToClock(g.maxBreakOverflow)}</td>
                                    <td style={{ padding: '0.75rem 0.5rem' }}>{g.maxTransferRate ? `${Number(g.maxTransferRate)}%` : '-'} / {g.targetTransferRetention ? `${Number(g.targetTransferRetention)}%` : '-'}</td>
                                    <td style={{ padding: '0.75rem 0.5rem', textAlign: 'center' }}>
                                        <DeleteGoalButton id={g.id} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}