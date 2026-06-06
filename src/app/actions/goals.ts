// src/app/actions/goals.ts
'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export interface CreateGoalInput {
  team: string;
  startDate: string;
  endDate: string;
  targetCsat: number;
  targetCsatChat?: number;
  targetCsatVoice?: number;
  targetConvincement?: number;
  targetConvincementChat?: number;
  targetConvincementVoice?: number;
  targetTmaChat: number;
  targetTmaVoice: number;
  maxShortCallChat?: number;
  maxShortCallVoice?: number;
  maxShortCallRate: number;
  maxInactivityRate?: number;
  maxBreakOverflow: number;
  maxTransferRate?: number;
  targetTransferRetention?: number;
}

export async function createGoal(data: CreateGoalInput) {
  try {
    const goal = await prisma.goal.create({
      data: {
        team: data.team,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        targetCsat: data.targetCsat,
        targetCsatChat: data.targetCsatChat,
        targetCsatVoice: data.targetCsatVoice,
        targetConvincement: data.targetConvincement,
        targetConvincementChat: data.targetConvincementChat,
        targetConvincementVoice: data.targetConvincementVoice,
        targetTmaChat: data.targetTmaChat,
        targetTmaVoice: data.targetTmaVoice,
        maxShortCallChat: data.maxShortCallChat,
        maxShortCallVoice: data.maxShortCallVoice,
        maxShortCallRate: data.maxShortCallRate,
        maxInactivityRate: data.maxInactivityRate,
        maxBreakOverflow: data.maxBreakOverflow,
        maxTransferRate: data.maxTransferRate,
        targetTransferRetention: data.targetTransferRetention,
      },
    });

    revalidatePath('/metas');
    return goal;
  } catch (error: any) {
    console.error('Error creating goal:', error);
    throw new Error(`Falha ao cadastrar o conjunto de metas: ${error?.message || JSON.stringify(error)}`);
  }
}

export async function deleteGoal(id: string) {
  try {
    await prisma.goal.delete({ where: { id } });
    revalidatePath('/metas');
  } catch (error) {
    console.error('Error deleting goal:', error);
    throw new Error('Falha ao remover a meta.');
  }
}