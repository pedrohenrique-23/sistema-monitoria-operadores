// src/app/(dashboard)/ia-chat/page.tsx
import prisma from '@/lib/prisma';
import ChatWindow from './ChatWindow';

export default async function IaChatPage() {
  // Busca todos os operadores cadastrados para popular o filtro do select
  const operators = await prisma.operator.findMany({
    orderBy: { name: 'asc' },
    select: { id: true, name: true, team: true }
  });

  return (
    <div style={{ height: '100%' }}>
      <h1 style={{ marginBottom: '0.5rem', fontSize: '1.6rem', color: 'var(--color-text-primary)' }}>
        💬 Central de Inteligência Conversacional
      </h1>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        Pergunte livremente sobre o desempenho e qualidade de um operador individual ou do coletivo cruzando dados e metas.
      </p>
      <ChatWindow operators={operators} />
    </div>
  );
}