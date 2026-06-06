// src/app/actions/kpis.ts
'use server';

// 1. Corrigido para importação padrão (sem as chaves)
import prisma from '@/lib/prisma'; 
import { timeStringToSeconds } from '@/utils/time';
// 2. Corrigido para o caminho correto do Next.js
import { revalidatePath } from 'next/cache'; 

export interface CreateKpiInput {
  operatorId: string;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  csatGeneral?: number;
  csatChat?: number;
  csatVoice?: number;
  convincementGeneral?: number;
  convincementChat?: number;
  convincementVoice?: number;
  tmaChatStr?: string;  // hh:mm:ss
  tmaVoiceStr?: string; // hh:mm:ss
  shortCallChat?: number;
  shortCallVoice?: number;
  inactivityRate?: number;
  breakOverflowStr?: string; // hh:mm:ss
  transferRate?: number;
  transferRetention?: number;
}

/**
 * Cadastra ou atualiza os KPIs semanais de um operador
 */
export async function createKpi(data: CreateKpiInput) {
  try {
    // Converte os tempos de hh:mm:ss para segundos inteiros usando nossos utilitários
    const tmaChat = data.tmaChatStr ? timeStringToSeconds(data.tmaChatStr) : null;
    const tmaVoice = data.tmaVoiceStr ? timeStringToSeconds(data.tmaVoiceStr) : null;
    const breakOverflow = data.breakOverflowStr ? timeStringToSeconds(data.breakOverflowStr) : null;

    const kpi = await prisma.kpi.upsert({
      where: {
        operatorId_startDate: {
          operatorId: data.operatorId,
          startDate: new Date(`${data.startDate}T00:00:00Z`),
        },
      },
      update: {
        endDate: new Date(`${data.endDate}T00:00:00Z`),
        csatGeneral: data.csatGeneral,
        csatChat: data.csatChat,
        csatVoice: data.csatVoice,
        convincementGeneral: data.csatGeneral,
        convincementChat: data.convincementChat,
        convincementVoice: data.convincementVoice,
        tmaChat,
        tmaVoice,
        shortCallChat: data.shortCallChat,
        shortCallVoice: data.shortCallVoice,
        inactivityRate: data.inactivityRate,
        breakOverflow,
        transferRate: data.transferRate,
        transferRetention: data.transferRetention,
      },
      create: {
        operatorId: data.operatorId,
        startDate: new Date(`${data.startDate}T00:00:00Z`),
        endDate: new Date(`${data.endDate}T00:00:00Z`),
        csatGeneral: data.csatGeneral,
        csatChat: data.csatChat,
        csatVoice: data.csatVoice,
        convincementGeneral: data.convincementGeneral,
        convincementChat: data.convincementChat,
        convincementVoice: data.convincementVoice,
        tmaChat,
        tmaVoice,
        shortCallChat: data.shortCallChat,
        shortCallVoice: data.shortCallVoice,
        inactivityRate: data.inactivityRate,
        breakOverflow,
        transferRate: data.transferRate,
        transferRetention: data.transferRetention,
      },
    });

    revalidatePath(`/operadores/${data.operatorId}`);
    return kpi;
  } catch (error) {
    console.error('Erro ao salvar KPIs:', error);
    throw new Error('Falha ao registrar os indicadores semanais.');
  }
}