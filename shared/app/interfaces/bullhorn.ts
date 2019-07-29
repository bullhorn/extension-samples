import { Candidate, EntityTypes, JobOrder } from '@bullhorn/bullhorn-types';

/**
 * Useful Bullhorn API types for use in extensions
 */
export interface CandidateResponse {
  data: Candidate;
  meta: BullhornMeta;
}

export interface JobOrderResponse {
  data: JobOrder;
  meta: BullhornMeta;
}

export interface SearchResponse {
  data: any[];
  meta?: BullhornMeta;
  total: number;
  start: number;
  count: number;
}

export interface BullhornMeta {
  entity?: EntityTypes;
  entityMetaUrl?: string;
  label?: string;
  dateLastModified?: string;
  sectionHeaders?: BullhornSectionHeader[];
  trackTrigger?: string;
  tracks?: [{ name: string; values: string[] }];
  fields?: BullhornField[];
}

export interface BullhornField {
  name: string;
  label: string;
  type: BullhornType;
  description?: string;
  required?: boolean;
  dataSpecialization?: BullhornDataSpecialization;
  maxLength?: number;
  disabled?: boolean;
  hidden?: boolean;
  optional?: boolean;
  multiValue?: boolean;
  inputType?: BullhornInputType;
  options?: { value: string; label: string }[];
  optionsUrl?: string;
  optionsType?: string;
  hideFromSearch?: boolean;
  sortOrder?: number;
  associatedEntity?: BullhornMeta;
  encrypted?: boolean;
  defaultValue?: any;
}

// Data types are used here:
// tslint:disable-next-line:max-line-length
// https://github.com/bullhorn/novo-elements/blob/master/projects/novo-elements/src/elements/value/Render.ts#L199https://github.com/bullhorn/novo-elements/blob/master/projects/novo-elements/src/elements/value/Render.ts#L199
export type BullhornType =
  | 'TO_MANY'
  | 'TO_ONE'
  | 'Address'
  | 'AddressWithoutCountry'
  | 'DateTime'
  | 'Timestamp'
  | 'Year'
  | 'Phone'
  | 'Email'
  | 'Money'
  | 'Percentage'
  | 'Double'
  | 'BigDecimal'
  | 'Integer'
  | 'Options'
  | 'ToMany'
  | 'Country'
  | 'Html'
  | 'select' // Must include options
  | 'tiles' // Must include options
  | 'checklist'
  | 'checkbox'
  | 'date'
  | 'time'
  | 'date-time'
  | 'address'
  | 'file'
  | 'editor'
  | 'ace-editor'
  | 'radio'
  | 'text-area'
  | 'quick-note'
  | 'password'
  | 'text';

export type BullhornInputType =
  | 'CHECKBOX'
  | 'SELECT'
  | 'TEXTAREA';

export type BullhornDataSpecialization =
  | 'DATE'
  | 'DATETIME'
  | 'FLOAT'
  | 'HTML-MINIMAL'
  | 'HTML'
  | 'INTEGER'
  | 'MONEY'
  | 'NO_HTML'
  | 'PERCENTAGE'
  | 'SECTION_HEADER'
  | 'STRING'
  | 'SYSTEM'
  | 'TEXTAREA'
  | 'TIME'
  | 'YEAR';

export interface BullhornSectionHeader {
  label: string;
  name: string;
  sortOrder: number;
  enabled: boolean;
  icon?: string;
}

export interface NovoFieldset {
  title?: string;
  icon?: string;
  controls: any[];
}

// Response format when getting user related settings from Bullhorn
export interface UserSettings {
  userId: number;
  privateLabelId: {
    id: number;
    name: string;
  }
  corporationId: number;
  novoEnabled: boolean;
}
