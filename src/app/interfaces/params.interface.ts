export interface PaginacionParams {
    filtro?: string;
    numeroPagina?: number;
    tamanoPagina?: number;
    soloActivos?: boolean;
    columnaOrden?: string;
    ordenAscendente?: boolean;
}

export interface FacturaParams extends PaginacionParams {
    numeroFactura?: string;
    clienteID?: number;
    vendedorID?: number;
    fechaDesde?: string;
    fechaHasta?: string;
    montoDesde?: number;
    montoHasta?: number;
}
