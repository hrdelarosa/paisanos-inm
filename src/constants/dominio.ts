export const USER_ROLES_KEYS = ['admin', 'enlace', 'capturista'] as const

export type UserRole = (typeof USER_ROLES_KEYS)[number]

export const USER_ROLES: Record<UserRole, string> = {
  admin: 'Admin',
  enlace: 'Enlace',
  capturista: 'Capturista',
} as const

export const MODULE_TYPES_KEYS = [
  'airport',
  'bus_station',
  'customs_stop',
  'road',
  'public_square',
  'other',
] as const

export type ModuleType = (typeof MODULE_TYPES_KEYS)[number]

export const MODULE_TYPES: Record<ModuleType, string> = {
  airport: 'Aeropuerto internacional',
  bus_station: 'Central de autobuses',
  customs_stop: 'Parador aduanal',
  road: 'Carretera',
  public_square: 'Plaza pública',
  other: 'Otro',
} as const

export const OPERATIVE_SEASON_KEYS = [
  'holy_week',
  'summer',
  'winter',
  'permanent',
] as const

export type OperativeSeason = (typeof OPERATIVE_SEASON_KEYS)[number]

export const OPERATIVE_SEASONS: Record<OperativeSeason, string> = {
  holy_week: 'Semana Santa',
  summer: 'Verano',
  winter: 'Invierno',
  permanent: 'Permanente',
}

export const REPORT_STATUSES_KEYS = ['draft', 'submitted', 'reviewed'] as const

export type ReportStatus = (typeof REPORT_STATUSES_KEYS)[number]

export const REPORT_STATUSES: Record<ReportStatus, string> = {
  draft: 'Borrador',
  submitted: 'Enviado',
  reviewed: 'Revisado',
} as const

export const ATTENTION_TYPE_SEED = [
  'Importación temporal de vehículos',
  'Permiso de retorno seguro',
  'Cancelación de permiso ITV',
  'Importación definitiva de vehículos',
  'Pago de DNR',
  'Restricciones y permisos de tránsito vehicular',
  'Documentación necesaria para ingresar a México',
  'Actas del registro civil',
  'Servicios consulares',
  'Teléfonos, direcciones y horarios de dependencias',
  'Información para peticiones de ayuda',
  'Información para quejas',
  'Extorsión',
  'Robo',
  'Seguridad personal y patrimonial',
  'Franquicia fiscal, mercancías y equipaje',
  'SENASICA, ingreso de animales y alimentos',
  'Albergues fronterizos mexicanos',
  'Repatriación Humana',
  'Asistencia vial',
  'Servicio médico',
  'Personas detenidas o extraviadas',
  'Asesoría del Programa',
  'Otro',
] as const
