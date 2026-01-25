export interface StoneDeckManifesto {
  StoneDeck: boolean;
  title: string;
  subtitle?: string;
  theme: string;
  author?: string;
}

export interface ListItem {
  text: string;
  level: number;
  bullet_type: 'dot' | 'square' | 'arrow' | 'dash' | 'number' | string;
}

export interface TableCell {
  text: string;
  isHeader: boolean;
  align?: 'left' | 'center' | 'right';
}

export interface SlideStyle {
  font_size?: number;
  font_family?: string;
  color?: string;
  image_fit?: 'cover' | 'contain';
  full_bleed?: boolean;
  background?: {
    type: 'color' | 'image' | 'gradient';
    value?: string;
    src?: string;
    opacity?: number;
    fit?: 'cover' | 'contain';
    colors?: string[];
    direction?: string;
  };
  content_align?: {
    horizontal?: 'left' | 'center' | 'right';
    vertical?: 'top' | 'middle' | 'bottom';
  };
  card?: {
    background?: string;
    radius?: string;
    border?: string;
    shadow?: boolean;
    image_fit?: 'cover' | 'contain';
    content_align?: {
      horizontal?: 'left' | 'center' | 'right';
      vertical?: 'top' | 'middle' | 'bottom';
    };
  };
  list?: {
    bullet_type?: string;
    bullet_color?: string;
    spacing?: string;
    indent?: string;
  };
  [key: string]: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export type SlotContent = {
  type: 'markdown';
  raw: string;
} | {
  type: 'list';
  items: ListItem[];
} | {
  type: 'table';
  rows: TableCell[][];
} | {
  type: 'image';
  src: string;
  alt?: string;
};

export interface Slide {
  layout_id: string;
  title?: string; // Optional slide title
  style: SlideStyle;
  slots: SlotContent[]; // Content of each slot (Structured)
  warnings?: string[] | undefined;
  metrics?: {
    heights: number[]; // Height of each slot in pt
  } | undefined;
}

export interface StoneDeckIR {
  manifesto: StoneDeckManifesto;
  slides: Slide[];
  basePath: string; // Base directory for resource resolution (images, themes)
  warnings?: string[] | undefined;
}

export interface LayoutSlot {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Layout {
  id: string;
  slots: LayoutSlot[];
}
