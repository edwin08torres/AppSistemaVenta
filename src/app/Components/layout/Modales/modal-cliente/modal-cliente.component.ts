import { Component, OnInit, Inject, inject } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Cliente } from 'src/app/Interfaces/cliente';
import { ClienteService } from 'src/app/Services/cliente.service';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';

@Component({
  selector: 'app-modal-cliente',
  templateUrl: './modal-cliente.component.html',
  styleUrls: ['./modal-cliente.component.css'],
})
export class ModalClienteComponent implements OnInit {
  formularioCliente: FormGroup;
  tituloAccion: string = 'Agregar';
  botonAccion: string = 'Guardar';

  constructor(
    private modalActual: MatDialogRef<ModalClienteComponent>,
    @Inject(MAT_DIALOG_DATA) public datosCliente: Cliente,
    private fb: FormBuilder,
    private _clienteServicio: ClienteService,
    private _utilidadServicio: UtilidadService
  ) {
    this.formularioCliente = this.fb.group({
      nombreCliente: ['', Validators.required],
      cedula: ['', Validators.required],
      direccion: ['', Validators.required],
      telefono: ['', Validators.required],
      correo: ['', Validators.required],
      esActivo: ['1', Validators.required],
    });

    if (this.datosCliente != null) {
      this.tituloAccion = 'Editar';
      this.botonAccion = 'Actualizar';
    }
  }
  ngOnInit(): void {
    if (this.datosCliente != null) {
      this.formularioCliente.patchValue({
        nombreCliente: this.datosCliente.nombreCliente,
        cedula: this.datosCliente.cedula,
        direccion: this.datosCliente.direccion,
        telefono: this.datosCliente.telefono,
        correo: this.datosCliente.correo,
        esActivo: this.datosCliente.esActivo.toString(),
      });
    }
      console.log('cliente a editar', this.datosCliente);
  }

  guardarEditar_Cliente() {
    const _cliente: Cliente = {
      idcliente: this.datosCliente == null ? 0 : this.datosCliente.idcliente,
      nombreCliente: this.formularioCliente.value.nombreCliente,
      cedula: this.formularioCliente.value.cedula,
      direccion: this.formularioCliente.value.direccion,
      telefono: this.formularioCliente.value.telefono,
      correo: this.formularioCliente.value.correo,
      esActivo: parseInt(this.formularioCliente.value.esActivo),
    };

    console.log(_cliente)
    console.log('datos cliente', this.datosCliente)


    if (this.datosCliente == null) {
      this._clienteServicio.guardar(_cliente).subscribe({    
        next: (data) => {
          if (data.status) {
            this._utilidadServicio.mostrarAlerta(
              'El cliente fue registrado',
              'Exito'
            );
            this.modalActual.close('true');
          } else
            this._utilidadServicio.mostrarAlerta(
              'No se pudo registrar el cliente',
              'Error'
            );
        },
        error: (e) => {},
      });
    } else {
      this._clienteServicio.editar(_cliente).subscribe({
        next: (data) => {
          if (data.status) {
            this._utilidadServicio.mostrarAlerta(
              'El cliente fue editado',
              'Exito'
            );
            this.modalActual.close('true');
          } else
            this._utilidadServicio.mostrarAlerta(
              'No se pudo editar el cliente',
              'Error'
            );
        },
        error: (e) => {},
      });
    }
  }
}
