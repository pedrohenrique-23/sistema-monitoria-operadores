// src/utils/date.ts

/**
 * Formata um objeto Date do JavaScript para string no padrão brasileiro dd/mm/aaaa
 */
export function formatDateToBR(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  
  // Tratamento para evitar problemas de fuso horário local deslocando o dia
  const day = String(d.getUTCDate()).padStart(2, '0');
  const month = String(d.getUTCMonth() + 1).padStart(2, '0');
  const year = d.getUTCFullYear();

  return `${day}/${month}/${year}`;
}

/**
 * Gera os textos de exibição do período da semana com base na data de início e fim.
 * Retorna o nome formatado e o intervalo legível.
 */
export function getWeeklyPeriodLabel(startDate: Date | string, endDate: Date | string) {
  const startFormatted = formatDateToBR(startDate);
  const endFormatted = formatDateToBR(endDate);

  return {
    weekName: `Semana ${startFormatted}`,
    periodDisplay: `${startFormatted} a ${endFormatted}`
  };
}