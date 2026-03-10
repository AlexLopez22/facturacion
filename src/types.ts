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