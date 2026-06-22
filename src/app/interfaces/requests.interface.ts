export interface ClienteRequest {
    id: number;
    identificacion: string;
    nombre: string;
    telefono: string;
    email: string;
}

export interface ProductoRequest {
    id: number;
    nombre: string;
    precioUnitario: number;
    stockActual: number;
}

export interface UsuarioRequest {
    id: number;
    username: string | null;
    contrasena: string | null;
    nombre: string | null;
    email: string | null;
    activo: boolean;
}

export interface UsuarioUpdateRequest {
    id: number;
    username: string | null;
    nuevaContrasena: string | null;
    nombre: string | null;
    email: string | null;
    activo: boolean;
    actualizarContrasena: boolean;
}

export interface FacturaDetalleRequest {
    productoID: number;
    cantidad: number;
    precioUnitario: number;
}

export interface FacturaPagoRequest {
    formaPagoID: number;
    monto: number;
    referencia: string | null;
}

export interface FacturaRequest {
    id: number;
    clienteID: number;
    vendedorID: number;
    fechaFactura: Date;
    detalles: FacturaDetalleRequest[] | null;
    pagos: FacturaPagoRequest[] | null;
}

export interface LoginRequest {
    userName: string;
    contrasena: string;
}
