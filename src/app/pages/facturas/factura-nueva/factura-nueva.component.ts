import { Component, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import { ClienteService } from '../../../services/cliente.service';
import { ProductoService } from '../../../services/producto.service';
import { FormaPagoService } from '../../../services/forma-pago.service';
import { FacturaService } from '../../../services/factura.service';
import { UsuarioService } from '../../../services/usuario.service';
import { 
  ClienteResponse, 
  ProductoResponse, 
  FormaPagoResponse,
  FacturaRequest,
  FacturaDetalleRequest,
  FacturaPagoRequest
} from '../../../interfaces/api-models.interface';

interface DetalleTemporal {
  producto: ProductoResponse;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
  iva: number;
  total: number;
}

interface PagoTemporal {
  formaPago: FormaPagoResponse;
  monto: number;
  referencia: string;
}

@Component({
  selector: 'app-factura-nueva',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './factura-nueva.component.html',
  styleUrls: ['./factura-nueva.component.css']
})
export class FacturaNuevaComponent implements OnInit {
  activeStep: number = 1;

  // Master lists
  clientes: ClienteResponse[] = [];
  productos: ProductoResponse[] = [];
  formasPago: FormaPagoResponse[] = [];

  // Active Seller ID (resolved at startup)
  vendedorId: number = 0;

  // Inputs
  selectedClienteId: string = '';
  fechaFactura: string = '';

  // Step 2 inputs (adding item)
  selectedProductoId: string = '';
  cantidadItem: number = 1;
  precioManual: number = 0;
  
  // Step 3 inputs (adding payment)
  selectedFormaPagoId: string = '';
  montoPago: number = 0;
  referenciaPago: string = '';

  // Temporary list states
  detalles: DetalleTemporal[] = [];
  pagos: PagoTemporal[] = [];

  // Totals
  subtotalFactura: number = 0;
  ivaFactura: number = 0;
  totalFactura: number = 0;
  totalPagado: number = 0;
  saldoRestante: number = 0;

  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  // The backend uses a hardcoded 0% IVA rate.
  // We mirror that rate here to ensure calculations match exactly and payment validation passes.
  private readonly IVA_PORCENTAJE = 0.00;

  constructor(
    private authService: AuthService,
    private clienteService: ClienteService,
    private productoService: ProductoService,
    private formaPagoService: FormaPagoService,
    private usuarioService: UsuarioService,
    private facturaService: FacturaService,
    private router: Router
  ) {
    const today = new Date();
    this.fechaFactura = today.toISOString().split('T')[0];
  }

  ngOnInit(): void {
    this.cargarListasMaster();
  }

  cargarListasMaster(): void {
    this.isLoading = true;
    this.errorMessage = '';

    const currentUsername = this.authService.currentUserSignal()?.username;

    forkJoin({
      clientes: this.clienteService.getAll('', 1, 100, true),
      productos: this.productoService.getAll('', 1, 100, true),
      formas: this.formaPagoService.getActive(),
      usuarios: this.usuarioService.getAll('', 1, 100, true)
    }).subscribe({
      next: (res) => {
        this.isLoading = false;
        
        if (res.clientes.codigo === 200) this.clientes = res.clientes.datos;
        if (res.productos.codigo === 200) this.productos = res.productos.datos;
        if (res.formas.codigo === 200) this.formasPago = res.formas.datos;
        
        // Resolve current seller ID by matching username
        if (res.usuarios.codigo === 200 && currentUsername) {
          const matchedUser = res.usuarios.datos.find(u => u.username.toLowerCase() === currentUsername.toLowerCase());
          if (matchedUser) {
            this.vendedorId = matchedUser.usuarioID;
          } else {
            this.errorMessage = 'No se pudo resolver su ID de vendedor en el sistema.';
          }
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'Error al cargar los catálogos del servidor. Verifique la conexión.';
        console.error(err);
      }
    });
  }

  changeStep(step: number): void {
    if (step === 2) {
      if (!this.selectedClienteId) {
        this.errorMessage = 'Debe seleccionar un cliente antes de continuar.';
        return;
      }
    }
    
    if (step === 3) {
      if (this.detalles.length === 0) {
        this.errorMessage = 'Debe agregar al menos un producto a la factura.';
        return;
      }
      this.montoPago = Number((this.totalFactura - this.totalPagado).toFixed(2));
      if (this.montoPago < 0) this.montoPago = 0;
    }

    this.errorMessage = '';
    this.activeStep = step;
  }

  onProductoChange(): void {
    const prod = this.productos.find(p => p.productoID === parseInt(this.selectedProductoId));
    if (prod) {
      this.precioManual = prod.precioUnitario;
    } else {
      this.precioManual = 0;
    }
  }

  agregarItem(): void {
    if (!this.selectedProductoId) {
      this.errorMessage = 'Debe seleccionar un producto.';
      return;
    }
    if (this.cantidadItem <= 0) {
      this.errorMessage = 'La cantidad debe ser mayor a cero.';
      return;
    }
    if (this.precioManual < 0) {
      this.errorMessage = 'El precio no puede ser negativo.';
      return;
    }

    const prod = this.productos.find(p => p.productoID === parseInt(this.selectedProductoId));
    if (!prod) return;

    if (this.cantidadItem > prod.stockActual) {
      this.errorMessage = `La cantidad supera las existencias en stock (${prod.stockActual}).`;
      return;
    }

    const existingIndex = this.detalles.findIndex(d => d.producto.productoID === prod.productoID);

    if (existingIndex > -1) {
      const newQty = this.detalles[existingIndex].cantidad + this.cantidadItem;
      if (newQty > prod.stockActual) {
        this.errorMessage = `La cantidad acumulada supera las existencias en stock (${prod.stockActual}).`;
        return;
      }
      this.detalles[existingIndex].cantidad = newQty;
      this.recalcularFila(existingIndex);
    } else {
      const subtotal = this.cantidadItem * this.precioManual;
      const iva = subtotal * this.IVA_PORCENTAJE;
      const total = subtotal + iva;

      this.detalles.push({
        producto: prod,
        cantidad: this.cantidadItem,
        precioUnitario: this.precioManual,
        subtotal,
        iva,
        total
      });
    }

    this.recalcularTotales();
    this.errorMessage = '';
    this.selectedProductoId = '';
    this.cantidadItem = 1;
    this.precioManual = 0;
  }

  recalcularFila(index: number): void {
    const d = this.detalles[index];
    d.subtotal = d.cantidad * d.precioUnitario;
    d.iva = d.subtotal * this.IVA_PORCENTAJE;
    d.total = d.subtotal + d.iva;
  }

  removerItem(index: number): void {
    this.detalles.splice(index, 1);
    this.recalcularTotales();
  }

  recalcularTotales(): void {
    this.subtotalFactura = this.detalles.reduce((acc, curr) => acc + curr.subtotal, 0);
    this.ivaFactura = this.detalles.reduce((acc, curr) => acc + curr.iva, 0);
    this.totalFactura = this.detalles.reduce((acc, curr) => acc + curr.total, 0);

    this.subtotalFactura = Number(this.subtotalFactura.toFixed(2));
    this.ivaFactura = Number(this.ivaFactura.toFixed(2));
    this.totalFactura = Number(this.totalFactura.toFixed(2));

    this.recalcularPagos();
  }

  agregarPago(): void {
    if (!this.selectedFormaPagoId) {
      this.errorMessage = 'Debe seleccionar un medio de pago.';
      return;
    }
    if (this.montoPago <= 0) {
      this.errorMessage = 'El monto de pago debe ser mayor a cero.';
      return;
    }

    const forma = this.formasPago.find(f => f.formaPagoID === parseInt(this.selectedFormaPagoId));
    if (!forma) return;

    const roundedMonto = Number(this.montoPago.toFixed(2));
    const maxPermitted = Number((this.totalFactura - this.totalPagado).toFixed(2));
    if (roundedMonto > maxPermitted) {
      this.errorMessage = `El monto excede el saldo restante de la factura ($${maxPermitted}).`;
      return;
    }

    const existingIndex = this.pagos.findIndex(p => p.formaPago.formaPagoID === forma.formaPagoID);
    if (existingIndex > -1) {
      this.pagos[existingIndex].monto = Number((this.pagos[existingIndex].monto + roundedMonto).toFixed(2));
    } else {
      this.pagos.push({
        formaPago: forma,
        monto: roundedMonto,
        referencia: this.referenciaPago.trim()
      });
    }

    this.recalcularPagos();
    this.errorMessage = '';
    this.selectedFormaPagoId = '';
    this.montoPago = Number((this.totalFactura - this.totalPagado).toFixed(2));
    this.referenciaPago = '';
  }

  removerPago(index: number): void {
    this.pagos.splice(index, 1);
    this.recalcularPagos();
  }

  recalcularPagos(): void {
    this.totalPagado = this.pagos.reduce((acc, curr) => acc + curr.monto, 0);
    this.totalPagado = Number(this.totalPagado.toFixed(2));
    
    this.saldoRestante = this.totalFactura - this.totalPagado;
    this.saldoRestante = Number(this.saldoRestante.toFixed(2));
  }

  guardarFactura(): void {
    this.errorMessage = '';

    if (!this.selectedClienteId) {
      this.errorMessage = 'Por favor seleccione un cliente.';
      return;
    }
    if (this.vendedorId <= 0) {
      this.errorMessage = 'ID de vendedor inválido. Recargue e intente nuevamente.';
      return;
    }
    if (this.detalles.length === 0) {
      this.errorMessage = 'Debe agregar al menos un producto.';
      return;
    }
    if (this.saldoRestante > 0) {
      this.errorMessage = `Debe cubrir la totalidad de la factura. Saldo restante: $${this.saldoRestante}`;
      return;
    }

    const reqDetalles: FacturaDetalleRequest[] = this.detalles.map(d => ({
      productoID: d.producto.productoID,
      cantidad: d.cantidad,
      precioUnitario: d.precioUnitario
    }));

    const reqPagos: FacturaPagoRequest[] = this.pagos.map(p => ({
      formaPagoID: p.formaPago.formaPagoID,
      monto: p.monto,
      referencia: p.referencia
    }));

    const payload: FacturaRequest = {
      id: 0,
      clienteID: parseInt(this.selectedClienteId),
      vendedorID: this.vendedorId,
      fechaFactura: new Date(this.fechaFactura).toISOString(),
      detalles: reqDetalles,
      pagos: reqPagos
    };

    this.isLoading = true;
    this.facturaService.create(payload).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.codigo === 200) {
          this.successMessage = 'Factura emitida con éxito.';
          setTimeout(() => {
            this.router.navigate(['/facturas']);
          }, 1500);
        } else {
          this.errorMessage = response.mensaje;
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.mensaje || 'Error al emitir la factura en el servidor.';
        console.error(err);
      }
    });
  }
}
