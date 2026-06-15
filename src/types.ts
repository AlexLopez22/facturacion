// src/types.ts
export interface Cliente {
  id: number;
  numeroDocumento: string;
  razonSocial: string;
  ubigeo?: string | null;
  direccion?: {
    direccionCompleta?: string;   // 👈 ahora opcional
    ubigeo?: string | null;
  } | null;
}

export interface Producto {
  id: number;
  codigo: string;
  descripcion: string;
  unidadMedida: string;
  afectacionIgv: string;
  estado: string;
}

export interface Documento {
  id: number;
  tipoDocumento: string;
  nombre: string;
}

export interface DetalleFactura {
  productoId: number;
  cantidad: number;
  precioUnitario: number;
  unidadMedida: string;
  descripcion?: string;
  codigo?: string;
  afectacionIgv?: string;
}

export interface FormaPago {
  id: number;
  tipo: string;
}

export interface FacturaForm {
  tipo_comprobante_id: number;
  clienteId: number;
  clienteNombre?: string;     // opcional
  clienteDireccion?: string;  // opcional
  serieId: number;
  serieNombre: string;
  numero: string;
  moneda: string;
  fechaEmision: string;
  horaEmision: string;
  formaPagoId: number;
  items: DetalleFactura[]; 
  tipoOperacion: string;      
}

export interface Serie {
  id: number;
  nombreSerie: string;
}

export interface Factura {
  id: number;
  fecha: string;
  documento: string; // Factura / Boleta
  serie: string;
  correlativo: string;
  numeroDocumentoCliente: string; // RUC o DNI
  clienteNombre: string;
  igv: number;
  total: number;
  estado: string;
  pdf?: string | null;
}
export interface Distrito {
  codigo: string;
  nombre: string;
}

export interface Provincia {
  codigo: string;
  nombre: string;
  distritos: Distrito[];
}

export interface Departamento {
  codigo: string;
  nombre: string;
  provincias: Provincia[];
}

export interface UbigeoRaw {
  codigo: string;
  departamento: string;
  provincia: string;
  distrito: string;
}
export type FiltrosFacturas = {
    fechaInicio?: string;
    fechaFin?: string;
    tipoDocumento?: string;
    serie?: string;
    correlativo?: string;
    clienteId?: number;
};

export type SerieBD = {
  id: number;
  nombreSerie: string;
  idDocumentos: number;
  predeterminada?: boolean;
};

export type SerieForm = {
  idDocumento: string;
  serie: string;
  predeterminada: boolean;
};

export interface Cuota {
    numeroCuota: number;
    fechaVencimiento: string;
    importe: number;
}

export interface Props {
    onClose: () => void;
    onSave: (cuotas: Cuota[]) => void;
    total: number;
}
