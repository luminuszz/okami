export interface NotionPage {
  object: string;
  id: string;
  created_time: Date;
  last_edited_time: Date;
  created_by: TedBy;
  last_edited_by: TedBy;
  cover: null;
  icon: Icon;
  parent: Parent;
  archived: boolean;
  properties: Properties;
  url: string;
}

export interface TedBy {
  object: string;
  id: string;
}

export interface Icon {
  type: string;
  emoji: string;
}

export interface Parent {
  type: string;
  database_id: string;
}

export interface Properties {
  URL: URL;
  Nota: Nota;
  cap: Nota;
  'last edited': LastEdited;
  Created: Created;
  status: Tipo;
  'CAPITULO NOVO': CapituloNovo;
  Observações: Notas;
  Notas: Notas;
  Tipo: Tipo;
  Animes: Animes;
  scan: Gêneros;
  'current-cap': CurrentCap;
  id: CurrentCap;
  Gêneros: Gêneros;
  Name: Name;
  image: any;
}

export interface CapituloNovo {
  id: string;
  type: string;
  checkbox: boolean;
}

export interface Created {
  id: string;
  type: string;
  created_time: Date;
}

export interface Gêneros {
  id: string;
  type: string;
  multi_select: Select[];
}

export interface Select {
  id: string;
  name: string;
  color: string;
}

export interface Name {
  id: string;
  type: string;
  title: Title[];
}

export interface Title {
  type: string;
  text: Text;
  annotations: Annotations;
  plain_text: string;
  href: null;
}

export interface Annotations {
  bold: boolean;
  italic: boolean;
  strikethrough: boolean;
  underline: boolean;
  code: boolean;
  color: string;
}

export interface Text {
  content: string;
  link: null;
}

export interface Nota {
  id: string;
  type: string;
  number: number | null;
}

export interface Notas {
  id: string;
  type: string;
  rich_text: Title[];
}

export interface Tipo {
  id: string;
  type: string;
  select: Select;
}

export interface URL {
  id: string;
  type: string;
  url: string;
}

export interface CurrentCap {
  id: string;
  type: string;
  formula: Formula;
}

export interface Formula {
  type: string;
  string: string;
}

export interface LastEdited {
  id: string;
  type: string;
  last_edited_time: Date;
}

export interface Animes {
  id: string;
  type: string;
  relation: any[];
  has_more: boolean;
}
