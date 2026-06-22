export interface ApiResponse<T> {
    codigo: number;
    mensaje: string;
    datos: T;
    paginacion?: PaginacionInfo;
}

export interface PaginacionInfo {
    paginaActual: number;
    tamanoPagina: number;
    totalRegistros: number;
    totalPaginas: number;
}

export interface Cliente {
    clienteID: number;
    identificacion: string;
    nombre: string;
    telefono: string;
    email: string;
    activo: boolean;
    fechaRegistro: Date;
}

export interface Producto {
    productoID: number;
    nombre: string;
    precioUnitario: number;
    stockActual: number;
    activo: boolean;
    fechaCreacion?: Date;
}

export interface Usuario {
    usuarioID: number;
    username: string;
    nombre: string;
    email: string;
    activo: boolean;
    fechaCreacion: Date;
}

export interface Factura {
    facturaID: number;
    numeroFactura: string;
    clienteID: number;
    clienteIdentificacion: string;
    clienteNombre: string;
    clienteTelefono: string;
    clienteEmail: string;
    vendedorID: number;
    vendedorNombre: string;
    fechaFactura: Date;
    subtotal: number;
    iva: number;
    total: number;
    activo: boolean;
    fechaCreacion: Date;
    detalles: FacturaDetalle[];
    pagos: FacturaPago[];
}

export interface FacturaDetalle {
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

export interface FacturaPago {
    pagoID: number;
    facturaID: number;
    formaPagoID: number;
    formaPagoNombre: string;
    monto: number;
    referencia: string;
}

export interface FormaPago {
    formaPagoID: number;
    nombre: string;
    activo: boolean;
}

export interface LoginResponse {
    token: string;
    nombre: string;
    usuario?: Usuario;
}
