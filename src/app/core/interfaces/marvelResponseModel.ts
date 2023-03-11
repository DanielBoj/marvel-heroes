/*
 * Esta interface define el modelo de la respuesta de la API de Marvel
 */

export interface MarvelResponseModel {
  attributionHTML: string; // Atribución HTML
  attributionText: string; // Atribución texto
  code: number; // Código de respuesta
  copyright: string; // Copyright
  data: MarvelData; // Datos de la respuesta
  etag: string; // Etag
  status: string; // Estado de la respuesta
}

export interface MarvelData {
  count: number; // Número de elementos devueltos
  limit: number; // Número de elementos solicitados
  offset: number; // Número de elementos saltados
  results: any[]; // Resultados de la búsqueda
  total: number; // Número total de elementos
}

export interface MarvelCache {
  characters?: MarvelData;
  comics?: MarvelData;
  creators?: MarvelData;
  events?: MarvelData;
  series?: MarvelData;
  stories?: MarvelData;
}
