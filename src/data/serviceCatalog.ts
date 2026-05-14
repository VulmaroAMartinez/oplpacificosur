export type BusinessLine = 'agency' | 'logistics';

export const SERVICE_IDS_BY_LINE = {
  agency: [
    'agency_ship_agency',
    'agency_provisions',
    'agency_fcl_lcl',
    'agency_cy',
    'agency_cfs',
    'agency_launch',
    'agency_mooring',
  ],
  logistics: [
    'log_customs',
    'log_load_unload',
    'log_road',
    'log_warehouse',
    'log_sanitary',
  ],
} as const;

export type AgencyServiceId = (typeof SERVICE_IDS_BY_LINE.agency)[number];
export type LogisticsServiceId = (typeof SERVICE_IDS_BY_LINE.logistics)[number];
export type CatalogServiceId = AgencyServiceId | LogisticsServiceId;

export const OTHER_SERVICE_ID = 'other' as const;
export type ContactServiceId = CatalogServiceId | typeof OTHER_SERVICE_ID;

export function getLineForService(id: CatalogServiceId): BusinessLine {
  if ((SERVICE_IDS_BY_LINE.agency as readonly string[]).includes(id)) return 'agency';
  return 'logistics';
}

export function getDefaultServiceForLine(line: BusinessLine): CatalogServiceId {
  return SERVICE_IDS_BY_LINE[line][0];
}

export function servicesForLine(line: BusinessLine): readonly CatalogServiceId[] {
  return SERVICE_IDS_BY_LINE[line];
}
