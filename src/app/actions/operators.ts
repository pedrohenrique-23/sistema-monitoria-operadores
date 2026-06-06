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

export async function getOperatorById(id: string) {
  try {
    return await prisma.operator.findUnique({
      where: { id },
      include: {
        kpis: {
          orderBy: { startDate: 'desc' },
        },
        audits: {
          orderBy: { serviceDatetime: 'desc' },
        },
      },
    });
  } catch (error) {
    console.error(`Erro ao buscar operador completo ${id}:`, error);
    throw new Error('Não foi possível carregar o perfil completo do operador.');
  }
}

/**
 * Atualiza o campo de observações permanentes (notes) de um operador
 */
export async function updateOperatorNotes(id: string, notes: string) {
  try {
    const updated = await prisma.operator.update({
      where: { id },
      data: { notes },
    });

    // Revalida os caminhos para atualizar tanto a listagem quanto o perfil
    revalidatePath('/operadores');
    revalidatePath(`/operadores/${id}`);
    return updated;
  } catch (error) {
    console.error(`Erro ao atualizar notas do operador ${id}:`, error);
    throw new Error('Falha ao salvar as observações.');
  }
}

export interface UpdateOperatorInput {
  id: string;
  name: string;
  team: string;
  mainChannel: 'chat' | 'voice';
  status: 'ativo' | 'inativo' | 'ferias';
  lookerId?: string;
}

/**
 * Atualiza os dados cadastrais de um operador
 */
export async function updateOperator(data: UpdateOperatorInput) {
  try {
    const updated = await prisma.operator.update({
      where: { id: data.id },
      data: {
        name: data.name,
        team: data.team,
        mainChannel: data.mainChannel,
        status: data.status,
        lookerId: data.lookerId || null,
      },
    });

    revalidatePath('/operadores');
    revalidatePath(`/operadores/${data.id}`);
    return updated;
  } catch (error) {
    console.error('Error updating operator:', error);
    throw new Error('Falha ao atualizar os dados do operador.');
  }
}

/**
 * Exclui um operador e todos os seus históricos (Cascading no Banco)
 */
export async function deleteOperator(id: string) {
  try {
    await prisma.operator.delete({
      where: { id },
    });

    revalidatePath('/operadores');
  } catch (error) {
    console.error('Error deleting operator:', error);
    throw new Error('Falha ao excluir o operador. Verifique se existem dependências rígidas.');
  }
}