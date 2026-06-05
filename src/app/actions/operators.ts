// src/app/actions/operators.ts
'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export interface CreateOperatorInput {
  name: string;
  team: string;
  mainChannel: 'chat' | 'voice';
  lookerId?: string;
  status?: 'ativo' | 'inativo' | 'ferias';
  notes?: string;
}

/**
 * Busca todos os operadores cadastrados no banco de dados
 */
export async function getOperators() {
  try {
    return await prisma.operator.findMany({
      orderBy: { name: 'asc' },
    });
  } catch (error) {
    console.error('Erro ao buscar operadores:', error);
    throw new Error('Não foi possível carregar a lista de operadores.');
  }
}

/**
 * Cria um novo operador na base de dados
 */
export async function createOperator(data: CreateOperatorInput) {
  try {
    const operator = await prisma.operator.create({
      data: {
        name: data.name,
        team: data.team,
        mainChannel: data.mainChannel,
        lookerId: data.lookerId || null,
        status: data.status || 'ativo',
        notes: data.notes || '',
      },
    });

    // Limpa o cache da página de operadores para exibir o novo dado imediatamente
    revalidatePath('/operadores');
    return operator;
  } catch (error) {
    console.error('Erro ao criar operador:', error);
    throw new Error('Falha ao cadastrar o operador.');
  }
}