export interface InfoPaginacion {
  totalRegistros: number;
  pagina: number;
  tamañoPagina: number;
  totalPaginas: number;
}

export interface RespuestaApi<T> {
  codigo: number;
  mensaje: string;
  datos: T;
  paginacion?: InfoPaginacion;
}

// Authentication
export interface LoginResponse {
  username: string;
  nombre: string;
  email: string;
  token: string;
}

// Usuarios
export interface UsuarioRequest {
  id: number;
  username: string;
  contrasena: string;
  nombre: string;
  email: string;
}

export interface UsuarioUpdateRequest {
  id: number;
  username: string;
  contrasenaNueva?: string;
  nombre: string;
  email: string;
  activo: boolean;
}

export interface UsuarioResponse {
  usuarioID: number;
  username: string;
  nombre: string;
  email: string;
  activo: boolean;
  fechaCreacion: string;
}

// Clientes
export interface ClienteRequest {
  id: number;
  identificacion: string;
  nombre: string;
  telefono: string;
  email: string;
}

export interface ClienteResponse {
  clienteID: number;
  identificacion: string;
  nombre: string;
  telefono: string;
  email: string;
  fechaRegistro: string;
  activo: boolean;
}

// Productos
export interface ProductoRequest {
  id: number;
  nombre: string;
  precioUnitario: number;
  stockActual: number;
}

export interface ProductoResponse {
  productoID: number;
  nombre: string;
  precioUnitario: number;
  stockActual: number;
  activo: boolean;
}

// Formas de Pago
export interface FormaPagoResponse {
  formaPagoID: number;
  nombre: string;
  descripcion: string;
  activo: boolean;
}

// Facturas
export interface FacturaDetalleRequest {
  productoID: number;
  cantidad: number;
  precioUnitario: number;
}

export interface FacturaPagoRequest {
  formaPagoID: number;
  monto: number;
  referencia: string;
}

export interface FacturaRequest {
  id: number;
  clienteID: number;
  vendedorID: number;
  fechaFactura: string;
  detalles: FacturaDetalleRequest[];
  pagos: FacturaPagoRequest[];
}

export interface FacturaDetalleResponse {
  detalleID: number;
  facturaID: number;
  productoID: number;
  productoNombre: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
  iva: number;
  total: number;
}

export interface FacturaPagoResponse {
  pagoID: number;
  facturaID: number;
  formaPagoID: number;
  formaPagoNombre: string;
  monto: number;
  referencia: string;
}

export interface FacturaResponse {
  facturaID: number;
  numeroFactura: string;
  clienteID: number;
  clienteIdentificacion: string;
  clienteNombre: string;
  clienteTelefono: string;
  clienteEmail: string;
  vendedorID: number;
  vendedorNombre: string;
  fechaFactura: string;
  subtotal: number;
  iva: number;
  total: number;
  activo: boolean;
  fechaCreacion: string;
  detalles: FacturaDetalleResponse[];
  pagos: FacturaPagoResponse[];
}

export interface FacturaFiltroRequest {
  numeroFactura?: string;
  clienteID?: number;
  vendedorID?: number;
  fechaDesde?: string;
  fechaHasta?: string;
  montoDesde?: number;
  montoHasta?: number;
  pagina: number;
  registrosPorPagina: number;
}
