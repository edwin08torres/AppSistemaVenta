import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';

import { ModalProveedorComponent } from '../../Modales/modal-proveedor/modal-proveedor.component';
import { Proveedor } from 'src/app/Interfaces/proveedor';
import { ProveedorService } from 'src/app/Services/proveedor.service';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-proveedor',
  templateUrl: './proveedor.component.html',
  styleUrls: ['./proveedor.component.css'],
})
export class ProveedorComponent implements OnInit {
  columnasTabla: string[] = [
    'nombre proveedor',
    'telefono',
    'direccion',
    'estado',
    'acciones',
  ];
  dataInicio: Proveedor[] = [];
  dataListaProveedor = new MatTableDataSource(this.dataInicio);
  @ViewChild(MatPaginator) paginacionTabla!: MatPaginator;

  constructor(
    private dialog: MatDialog,
    private _proveedorServicio: ProveedorService,
    private _utilidadServicio: UtilidadService
  ) {}

  obtenerProveedor() {
    this._proveedorServicio.lista().subscribe({
      next: (data) => {
        if (data.status) this.dataListaProveedor.data = data.value;
        else
          this._utilidadServicio.mostrarAlerta(
            'No se encontraron datos',
            'Oops!'
          );
      },
      error: (e) => {},
    });
  }
  ngOnInit(): void {
    this.obtenerProveedor();
  }

  ngAfterViewInit(): void {
    this.dataListaProveedor.paginator = this.paginacionTabla;
  }

  aplicarFiltroTabla(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataListaProveedor.filter = filterValue.trim().toLocaleLowerCase();
  }

  nuevoProveedor() {
    this.dialog
      .open(ModalProveedorComponent, {
        disableClose: true,
      })
      .afterClosed()
      .subscribe((resultado) => {
        if (resultado === 'true') this.obtenerProveedor();
      });
  }

  editarProveedor(proveedor: Proveedor) {
    this.dialog
      .open(ModalProveedorComponent, {
        disableClose: true,
        data: proveedor,
      })
      .afterClosed()
      .subscribe((resultado) => {
        if (resultado === 'true') this.obtenerProveedor();
      });
  }

  eliminarProveedor(proveedor: Proveedor) {
    Swal.fire({
      title: '¿Desea eliminar al proveedor?',
      text: proveedor.nombreProveedor,
      icon: 'warning',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Si, eliminar',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      cancelButtonText: 'No, volver',
    }).then((resultado) => {
      if (resultado.isConfirmed) {
        this._proveedorServicio.eliminar(proveedor.idproveedor).subscribe({
          next: (data) => {
            if (data.status) {
              this._utilidadServicio.mostrarAlerta(
                'El cliente fue eliminado',
                'Listo!'
              );
              this.obtenerProveedor();
            } else
              this._utilidadServicio.mostrarAlerta(
                'No se pudo eliminar el cliente',
                'Error'
              );
          },
          error: (e) => {},
        });
      }
    });
  }
}
