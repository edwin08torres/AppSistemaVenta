import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LayoutRoutingModule } from './layout-routing.module';

// VISTAS
import { DashBoardComponent } from './Pages/dash-board/dash-board.component';
import { UsuarioComponent } from './Pages/usuario/usuario.component';
import { ProductoComponent } from './Pages/producto/producto.component';
import { VentaComponent } from './Pages/venta/venta.component';
import { HistorialVentaComponent } from './Pages/historial-venta/historial-venta.component';
import { ReporteComponent } from './Pages/reporte/reporte.component';
import { ClienteComponent } from './Pages/cliente/cliente.component';
import { ProveedorComponent } from './Pages/proveedor/proveedor.component';


import { SharedModule } from 'src/app/Reutilizable/shared/shared.module';
// MODALES
import { ModalUsuarioComponent } from './Modales/modal-usuario/modal-usuario.component';
import { ModalProductoComponent } from './Modales/modal-producto/modal-producto.component';
import { ModalDetalleVentaComponent } from './Modales/modal-detalle-venta/modal-detalle-venta.component';
import { ModalClienteComponent } from './Modales/modal-cliente/modal-cliente.component';
import { ModalProveedorComponent } from './Modales/modal-proveedor/modal-proveedor.component';



@NgModule({
  declarations: [
    DashBoardComponent,
    UsuarioComponent,
    ProductoComponent,
    VentaComponent,
    HistorialVentaComponent,
    ReporteComponent,
    ModalUsuarioComponent,
    ModalProductoComponent,
    ModalDetalleVentaComponent,
    ClienteComponent,
    ProveedorComponent,
    ModalClienteComponent,
    ModalProveedorComponent
  ],
  imports: [
    CommonModule,
    LayoutRoutingModule,

    SharedModule
  ]
})
export class LayoutModule { }
