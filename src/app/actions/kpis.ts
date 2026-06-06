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


export interface UpdateKpiInput {
  id: string;
  startDate: string;
  endDate: string;
  csatGeneral?: number;
  csatChat?: number;
  csatVoice?: number;
  convincementGeneral?: number;
  convincementChat?: number;
  convincementVoice?: number;
  tmaChat?: number;
  tmaVoice?: number;
  shortCallChat?: number;
  shortCallVoice?: number;
  inactivityRate?: number;
  breakOverflow?: number;
  transferRate?: number;
  transferRetention?: number;
}

export async function updateKpi(data: UpdateKpiInput) {
  try {
    const updated = await prisma.kpi.update({
      where: { id: data.id },
      data: {
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        csatGeneral: data.csatGeneral !== undefined ? data.csatGeneral : null,
        csatChat: data.csatChat !== undefined ? data.csatChat : null,
        csatVoice: data.csatVoice !== undefined ? data.csatVoice : null,
        convincementGeneral: data.convincementGeneral !== undefined ? data.convincementGeneral : null,
        convincementChat: data.convincementChat !== undefined ? data.convincementChat : null,
        convincementVoice: data.convincementVoice !== undefined ? data.convincementVoice : null,
        tmaChat: data.tmaChat !== undefined ? data.tmaChat : null,
        tmaVoice: data.tmaVoice !== undefined ? data.tmaVoice : null,
        shortCallChat: data.shortCallChat !== undefined ? data.shortCallChat : null,
        shortCallVoice: data.shortCallVoice !== undefined ? data.shortCallVoice : null,
        inactivityRate: data.inactivityRate !== undefined ? data.inactivityRate : null,
        breakOverflow: data.breakOverflow !== undefined ? data.breakOverflow : null,
        transferRate: data.transferRate !== undefined ? data.transferRate : null,
        transferRetention: data.transferRetention !== undefined ? data.transferRetention : null,
      },
    });

    revalidatePath(`/operadores/${updated.operatorId}`);
    return updated;
  } catch (error) {
    console.error('Error updating KPI:', error);
    throw new Error('Falha ao atualizar os indicadores.');
  }
}
export async function deleteKpi(id: string) {
  try {
    const deleted = await prisma.kpi.delete({
      where: { id },
    });

    revalidatePath(`/operadores/${deleted.operatorId}`);
    return deleted;
  } catch (error) {
    console.error('Error deleting KPI:', error);
    throw new Error('Falha ao excluir o registro de KPI.');
  }
}