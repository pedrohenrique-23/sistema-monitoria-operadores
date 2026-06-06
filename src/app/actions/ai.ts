// src/app/actions/ai.ts
'use server';

import { GoogleGenAI } from '@google/genai';
import { getOperatorById } from './operators';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

/**
 * Solicita ao Gemini a geração de um relatório de feedback estruturado e PDI
 */
export async function generateOperatorAnalysis(operatorId: string) {
  try {
    // 1. Busca o operador com todo o histórico que implementamos na Fase 8
    const operator = await getOperatorById(operatorId);

    if (!operator) {
      throw new Error('Operator not found for AI analysis.');
    }

    // 2. Monta o payload de dados sanitizados para enviar no prompt
    const contextData = {
      name: operator.name,
      team: operator.team,
      mainChannel: operator.mainChannel,
      notes: operator.notes,
      kpis: operator.kpis.map(k => ({
        period: `${k.startDate.toISOString().split('T')[0]} to ${k.endDate.toISOString().split('T')[0]}`,
        csatGeneral: k.csatGeneral?.toString(),
        tmaChatSeconds: k.tmaChat,
        tmaVoiceSeconds: k.tmaVoice,
        shortCallChatRate: k.shortCallChat?.toString(),
        shortCallVoiceRate: k.shortCallVoice?.toString(),
      })),
      audits: operator.audits.map(a => ({
        date: a.serviceDatetime.toISOString().split('T')[0],
        channel: a.serviceChannel,
        score: a.score.toString(),
        positive: a.positivePoints,
        negative: a.negativePoints,
        summary: a.auditSummary,
      }))
    };

    // 3. Engenharia de Prompt focada em Call Center e Suporte Técnico
    const prompt = `
      Você é um especialista em monitoria de qualidade e coordenação de operações de atendimento (suporte/call center).
      Analise o histórico do operador abaixo e gere um relatório de feedback estruturado para o supervisor.
      
      Dados do Operador e Histórico:
      ${JSON.stringify(contextData, null, 2)}

      O seu retorno DEVE ser em Markdown, em português, claro, direto e focado em melhoria de performance, contendo:
      1. **Diagnóstico Geral**: Resumo do momento atual do operador (está consistente? oscilando? abaixo da média?).
      2. **Pontos Fortes**: O que os dados de KPIs e as auditorias mostram que ele domina.
      3. **Oportunidades de Melhoria**: Gargalos identificados (ex: TMA alto, queda de CSAT, taxas de short call elevadas).
      4. **Plano de Ação (PDI)**: 3 ações práticas e mensuráveis para o supervisor aplicar com o operador na próxima semana.
    `;

    // 4. Executa a chamada usando o modelo rápido e ideal para texto
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text;
  } catch (error: any) {
  console.error('Error generating AI analysis:', error);
  // Repassa o erro real para o front-end expor o diagnóstico
  throw new Error(`Erro Real: ${error?.message || JSON.stringify(error)}`);
}
}