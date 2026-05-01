/**
 * Dada una fecha la parsea para devolver hh-mm
 * @param date Fecha a transformar
 * @returns string hh-mm
 */
export const formatDateTime = (date: string | Date): string => {
  return new Date(date).toLocaleTimeString([], { hour12: false }).split(":").slice(0, 2).join(":")
}

/**
 * Dada una fecha la parsea para devolver dd-MM-yyyy
 * @param date Fecha a transformar
 * @returns string dd-MM-yyyy
 */
export const formatDate = (date: string | Date): string => {
  let [anio, mes, dia] = new Date(date).toISOString().split("T")[0].split("-");

  return `${dia}-${mes}-${anio}`;
}