// src/app/actions/chat.ts
'use server';

import { GoogleGenAI } from '@google/genai';
import prisma from '@/lib/prisma';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface ChatRequestInput {
  operatorId?: string; // Se vazio, analisa a equipe toda
  startDate: string;
  endDate: string;
  userMessage: string;
  history: ChatMessage[];
}

/**
 * Processa a conversa do chat contextualizando com KPIs, Auditorias e Metas
 */
export async function sendChatMessage(input: ChatRequestInput) {
  try {
    const start = new Date(input.startDate);
    const end = new Date(input.endDate);

    // 1. Busca as metas cadastradas para o período
    const goals = await prisma.goal.findMany({
      where: {
        startDate: { gte: start },
        endDate: { lte: end },
      },
    });

    let contextData: any = {};

    if (input.operatorId) {
      // Cenário A: Análise de um Operador Específico
      const operator = await prisma.operator.findUnique({
        where: { id: input.operatorId },
        include: {
          kpis: {
            where: { startDate: { gte: start }, endDate: { lte: end } },
          },
          audits: {
            where: { serviceDatetime: { gte: start, lte: end } },
          },
        },
      });

      if (!operator) throw new Error('Operator not found');

      contextData = {
        type: 'individual_analysis',
        operatorName: operator.name,
        team: operator.team,
        mainChannel: operator.mainChannel,
        kpis: operator.kpis,
        audits: operator.audits,
      };
    } else {
      // Cenário B: Análise Consolidada da Equipe Toda
      const allKpis = await prisma.kpi.findMany({
        where: { startDate: { gte: start }, endDate: { lte: end } },
        include: { operator: true },
      });

      const allAudits = await prisma.audit.findMany({
        where: { serviceDatetime: { gte: start, lte: end } },
      });

      contextData = {
        type: 'team_collective_analysis',
        totalKPIsRecords: allKpis.length,
        totalAuditsRecords: allAudits.length,
        kpisRaw: allKpis.map(k => ({ team: k.operator.team, csat: k.csatGeneral, tmaChat: k.tmaChat, tmaVoice: k.tmaVoice })),
        auditsRaw: allAudits.map(a => ({ score: a.score, channel: a.serviceChannel })),
      };
    }

    // 2. Engenharia de Prompt e Injeção de Contexto Rígido
    const systemInstruction = `
      Você é um analista sênior de BI e Qualidade de Operações de Atendimento.
      Você está conversando com o supervisor da operação.
      
      CONTEXTO DA OPERAÇÃO DISPONÍVEL:
      - Período Filtrado: ${input.startDate} até ${input.endDate}
      - Metas da Operação (Régua de Corte para bom/ruim): ${JSON.stringify(goals)}
      - Dados Reais Extraídos do Banco: ${JSON.stringify(contextData)}

      REGRAS DE COMPORTAMENTO:
      1. Use as Metas fornecidas para julgar os resultados reais. Se um indicador real não atingiu a meta, classifique explicitamente como 'Abaixo da Meta' ou 'Ruim'. Se superou, elogie.
      2. Seja direto, focado em dados e didático. Evite rodeios técnicos inúteis.
      3. Responda em português nativo.
    `;

    // 3. Formata o histórico anterior exigido pelo novo SDK
    const contents = [
      ...input.history.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      })),
      {
        role: 'user',
        parts: [{ text: `Instruções de Contexto: ${systemInstruction}\n\nPergunta do Supervisor: ${input.userMessage}` }]
      }
    ];

    // 4. Executa a chamada com o modelo rápido e conversacional
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: contents,
    });

    return response.text;
  } catch (error) {
    console.error('Chat Action Error:', error);
    
    throw new Error('Falha ao processar resposta do Chat da IA.');
    throw new Error(`Erro Real no Chat: ${error?.message || JSON.stringify(error)}`);
  }
}