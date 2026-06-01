// src/utils/time.ts

/**
 * Converte uma string no formato hh:mm:ss para o total de segundos inteiros.
 * Exemplo: "00:15:32" -> 932 segundos
 */
export function timeStringToSeconds(timeStr: string): number {
  if (!timeStr) return 0;
  
  // Valida o formato estrito hh:mm:ss usando Expressão Regular
  const regex = /^([0-1]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;
  if (!regex.test(timeStr)) {
    throw new Error('Formato de tempo inválido. Utilize o padrão hh:mm:ss');
  }

  const [hours, minutes, seconds] = timeStr.split(':').map(Number);
  
  return (hours * 3600) + (minutes * 60) + seconds;
}

/**
 * Converte um total de segundos inteiros para uma string no formato hh:mm:ss.
 * Exemplo: 932 -> "00:15:32"
 */
export function secondsToTimeString(totalSeconds: number | null | undefined): string {
  if (totalSeconds === null || totalSeconds === undefined || totalSeconds < 0) {
    return '00:00:00';
  }

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  // Garante que os números sempre tenham 2 dígitos (ex: 5 -> "05")
  const pad = (num: number) => String(num).padStart(2, '0');

  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}