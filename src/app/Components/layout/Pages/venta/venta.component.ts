import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';

import { ProductoService } from 'src/app/Services/producto.service';
import { VentaService } from 'src/app/Services/venta.service';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';

import { Producto } from 'src/app/Interfaces/producto';
import { Venta } from 'src/app/Interfaces/venta';
import { Cliente } from 'src/app/Interfaces/cliente';
import { DetalleVenta } from 'src/app/Interfaces/detalle-venta';

import Swal from 'sweetalert2';
import { ClienteService } from 'src/app/Services/cliente.service';

@Component({
  selector: 'app-venta',
  templateUrl: './venta.component.html',
  styleUrls: ['./venta.component.css'],
})
export class VentaComponent implements OnInit {
  listaProductos: Producto[] = [];
  listaProductosFiltro: Producto[] = [];
  listaCliente: Cliente[] = [];
  listaClienteFiltro: Cliente[] = [];

  listaProductosParaVenta: DetalleVenta[] = [];
  bloquearBotonRegistrar: boolean = false;

  productoSeleccionado!: Producto;
  clienteSeleccionado!: Cliente;
  tipodePagoPorDefecto: string = 'Efectivo';
  totalPagar: number = 0;

  formularioProductoVenta: FormGroup;
  columnasTabla: string[] = [
    'producto',
    'nombreCliente',
    'cedula',
    'cantidad',
    'precio',
    'total',
    'accion',
  ];
  datosDetalleVenta = new MatTableDataSource(this.listaProductosParaVenta);

  retornarProductosPorFiltro(busqueda: any): Producto[] {
    const valorBuscado =
      typeof busqueda === 'string'
        ? busqueda.toLocaleLowerCase()
        : busqueda.nombre.toLocaleLowerCase();

    return this.listaProductos.filter((item) =>
      item.nombre.toLocaleLowerCase().includes(valorBuscado)
    );
  }

  retornarClientePorFiltro(busqueda: any): Cliente[] {
    const valorBuscado =
      typeof busqueda === 'string'
        ? busqueda.toLocaleLowerCase()
        : busqueda.nombreCliente.toLocaleLowerCase();

    return this.listaCliente.filter((item) =>
      item.nombreCliente.toLocaleLowerCase().includes(valorBuscado)
    );
  }

  constructor(
    private fb: FormBuilder,
    private _productoServicio: ProductoService,
    private _clienteServicio: ClienteService,
    private _ventaServicio: VentaService,
    private _utilidadServicio: UtilidadService
  ) {
    this.formularioProductoVenta = this.fb.group({
      producto: ['', Validators.required],
      nombreCliente: ['', Validators.required],
      cantidad: ['', Validators.required],
    });

    this._productoServicio.lista().subscribe({
      next: (data) => {
        if (data.status) {
          const lista = data.value as Producto[];
          this.listaProductos = lista.filter(
            (p) => p.esActivo == 1 && p.stock > 0
          );
        }
      },
      error: (e) => {},
    });

    this._clienteServicio.lista().subscribe({
      next: (data) => {
        if (data.status) {
          const lista = data.value as Cliente[];
          this.listaCliente = lista.filter((p) => p.esActivo == 1);
        }
      },
      error: (e) => {},
    });

    this.formularioProductoVenta
      .get('producto')
      ?.valueChanges.subscribe((value) => {
        this.listaProductosFiltro = this.retornarProductosPorFiltro(value);
      });

    this.formularioProductoVenta
      .get('nombreCliente')
      ?.valueChanges.subscribe((value) => {
        this.listaClienteFiltro = this.retornarClientePorFiltro(value);
      });
  }

  ngOnInit(): void {}

  mostrarProducto(producto: Producto): string {
    return producto.nombre;
  }

  mostrarClientes(cliente: Cliente): string {
    if (cliente && cliente.nombreCliente && cliente.cedula) {
      return `${cliente.nombreCliente} - ${cliente.cedula}`;
    } else {
      return '';
    }
    // return cliente.nombreCliente;
  }

  productoParaVenta(event: any) {
    this.productoSeleccionado = event.option.value;
  }

  clienteParaVenta(event: any) {
    this.clienteSeleccionado = event.option.value;
  }

  agregarProductoParaVenta() {
    const _cantidad: number = this.formularioProductoVenta.value.cantidad;
    const _precio: number = parseFloat(this.productoSeleccionado.precio);
    const _total: number = _cantidad * _precio;
    this.totalPagar = this.totalPagar + _total;

    this.listaProductosParaVenta.push({
      idProducto: this.productoSeleccionado.idProducto,
      descripcionProducto: this.productoSeleccionado.nombre,
      idCliente: this.clienteSeleccionado.idcliente,
      nombreCliente: this.clienteSeleccionado.nombreCliente,
      cedula: this.clienteSeleccionado.cedula,
      cantidad: _cantidad,
      precioTexto: String(_precio.toFixed(2)),
      totalTexto: String(_total.toFixed(2)),
    });

    this.datosDetalleVenta = new MatTableDataSource(
      this.listaProductosParaVenta
    );

    this.formularioProductoVenta.patchValue({
      producto: '',
      cantidad: '',
      nombreCliente: '',
      cedula: '',
    });

    console.log('probando', this.listaProductosParaVenta);
  }

  // eliminarProducto(detalle: DetalleVenta) {
  //   (this.totalPagar = this.totalPagar - parseFloat(detalle.totalTexto)),
  //     (this.listaProductosParaVenta = this.listaProductosParaVenta.filter(
  //       (p) => p.idProducto != detalle.idProducto
  //     ));

  //   this.datosDetalleVenta = new MatTableDataSource(
  //     this.listaProductosParaVenta
  //   );
  // }

  // registrarVenta() {
  //   if (this.listaProductosParaVenta.length > 0) {
  //     this.bloquearBotonRegistrar = true;

  //     const request: Venta = {
  //       tipoPago: this.tipodePagoPorDefecto,
  //       totalTexto: String(this.totalPagar.toFixed(2)),
  //       detalleVenta: this.listaProductosParaVenta,
  //     };

  //     this._ventaServicio.registrar(request).subscribe({
  //       next: (response) => {
  //         if (response.status) {
  //           this.totalPagar = 0.0;
  //           this.listaProductosParaVenta = [];
  //           this.datosDetalleVenta = new MatTableDataSource(
  //             this.listaProductosParaVenta,
  //           );

  //           console.log(this.listaProductosParaVenta)

  //           Swal.fire({
  //             icon: 'success',
  //             title: 'Venta Registrada!',
  //             text: `Numero de venta: ${response.value.numeroDocumento}`,
  //           });
  //         } else
  //           this._utilidadServicio.mostrarAlerta(
  //             'No se pudo registrar la venta',
  //             'Oops'
  //           );
  //       },
  //       complete: () => {
  //         this.bloquearBotonRegistrar = false;
  //       },
  //       error: (e) => {
  //         console.error(e); // Agregar para ver detalles del error en la consola
  //         this._utilidadServicio.mostrarAlerta(
  //           'Error al registrar la venta',
  //           'Oops'
  //         );
  //       },
  //     });
  //   }
  // }

  eliminarProducto(detalle: DetalleVenta) {
    this.totalPagar -= parseFloat(detalle.totalTexto);
    this.listaProductosParaVenta = this.listaProductosParaVenta.filter(
      (p) => p.idProducto !== detalle.idProducto
    );
    this.actualizarTabla();
  }

  actualizarTabla() {
    this.datosDetalleVenta = new MatTableDataSource(
      this.listaProductosParaVenta
    );
  }

  registrarVenta() {
    if (this.listaProductosParaVenta.length > 0) {
      this.bloquearBotonRegistrar = true;

      const request: Venta = {
        tipoPago: this.tipodePagoPorDefecto,
        totalTexto: String(this.totalPagar.toFixed(2)),
        detalleVenta: this.listaProductosParaVenta,
      };

      this._ventaServicio.registrar(request).subscribe({
        next: (response) => {
          if (response.status) {
            // Restablecer los valores después de una venta exitosa
            this.totalPagar = 0.0;
            this.listaProductosParaVenta = [];
            this.actualizarTabla();

            Swal.fire({
              icon: 'success',
              title: 'Venta Registrada!',
              text: `Numero de venta: ${response.value.numeroDocumento}`,
            });
          } else {
            this._utilidadServicio.mostrarAlerta(
              'No se pudo registrar la venta',
              'Oops'
            );
          }
        },
        error: (e) => {
          console.error(e); // Agregar para ver detalles del error en la consola
          this._utilidadServicio.mostrarAlerta(
            'Error al registrar la venta',
            'Oops'
          );
        },
        complete: () => {
          this.bloquearBotonRegistrar = false;
        },
      });
    }
  }
}
