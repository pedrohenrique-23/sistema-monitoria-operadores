// src/app/actions/audits.ts
'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export interface CreateAuditInput {
  operatorId: string;
  auditNumber: string;
  protocolNumber: string;
  customerContact: string;
  serviceChannel: 'chat' | 'voice';
  serviceDatetime: string; // ISO string ou YYYY-MM-DDTHH:mm
  score: number;
  auditSummary: string;
  positivePoints: string;
  negativePoints: string;
}

/**
 * Registra uma nova auditoria de qualidade conforme o escopo oficial
 */
export async function createAudit(data: CreateAuditInput) {
  try {
    const audit = await prisma.audit.create({
      data: {
        operatorId: data.operatorId,
        auditNumber: data.auditNumber,
        protocolNumber: data.protocolNumber,
        customerContact: data.customerContact,
        serviceChannel: data.serviceChannel,
        serviceDatetime: new Date(data.serviceDatetime),
        score: data.score,
        auditSummary: data.auditSummary,
        positivePoints: data.positivePoints,
        negativePoints: data.negativePoints,
      },
    });

    // Revalida o perfil do operador para exibir a nova auditoria no histórico
    revalidatePath(`/operadores/${data.operatorId}`);
    return audit;
  } catch (error) {
    console.error('Error saving audit:', error);
    throw new Error('Failed to register the quality audit. Ensure audit number is unique.');
  }
}

export interface UpdateAuditInput {
  id: string;
  auditNumber: string;
  protocolNumber: string;
  customerContact: string;
  serviceChannel: string;
  serviceDatetime: string;
  score: number;
  auditSummary: string;
  positivePoints: string;
  negativePoints: string;
}

/**
 * Atualiza uma auditoria de qualidade existente
 */
export async function updateAudit(data: UpdateAuditInput) {
  try {
    const updated = await prisma.audit.update({
      where: { id: data.id },
      data: {
        auditNumber: data.auditNumber,
        protocolNumber: data.protocolNumber,
        customerContact: data.customerContact,
        serviceChannel: data.serviceChannel,
        serviceDatetime: new Date(data.serviceDatetime),
        score: data.score,
        auditSummary: data.auditSummary,
        positivePoints: data.positivePoints,
        negativePoints: data.negativePoints,
      },
    });

    revalidatePath(`/operadores/${updated.operatorId}`);
    return updated;
  } catch (error) {
    console.error('Error updating audit:', error);
    throw new Error('Falha ao atualizar a auditoria de qualidade.');
  }
}

/**
 * Remove uma auditoria do banco de dados
 */
export async function deleteAudit(id: string) {
  try {
    const deleted = await prisma.audit.delete({
      where: { id },
    });

    revalidatePath(`/operadores/${deleted.operatorId}`);
    return deleted;
  } catch (error) {
    console.error('Error deleting audit:', error);
    throw new Error('Falha ao excluir a auditoria.');
  }
}