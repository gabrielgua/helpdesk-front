import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { Chamado } from 'src/app/models/chamado';
import { Cliente } from 'src/app/models/cliente';
import { Tecnico } from 'src/app/models/tecnico';
import { ChamadoService } from 'src/app/services/chamado.service';
import { ClienteService } from 'src/app/services/cliente.service';
import { TecnicoService } from 'src/app/services/tecnico.service';

@Component({
  selector: 'app-chamado-create',
  templateUrl: './chamado-create.component.html',
  styleUrls: ['./chamado-create.component.css']
})
export class ChamadoCreateComponent implements OnInit {

  chamado: Chamado = {
    prioridade: '',
    status: '',
    titulo: '',
    observacoes: '',
    tecnico: '',
    cliente: '',
    nomeTecnico: '',
    nomeCliente: ''
  };

  clientes: Cliente[] = [];
  tecnicos: Tecnico[] = [];


  prioridade: FormControl =  new FormControl(null, [Validators.required]);
  status:     FormControl =  new FormControl(null, [Validators.required]);
  titulo:     FormControl =  new FormControl(null, [Validators.required]);
  observacoes:  FormControl =  new FormControl(null, [Validators.required]);
  tecnico:    FormControl =  new FormControl([Validators.required]);
  cliente:    FormControl =  new FormControl(null, [Validators.required]);
  
  constructor(
    private chamadoService: ChamadoService,
    private clienteService: ClienteService,
    private tecnicoService: TecnicoService,
    private toastService: ToastrService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.buscarTodosClientes();
    this.buscarTodosTecnicos();
    
  }

  private _filter(value: string): Tecnico[] {
    const filterValue = value.toLowerCase();

    return this.tecnicos.filter(tecnico => tecnico.nome.toLowerCase().includes(filterValue));
  }

  salvar(): void {
    this.chamadoService.salvar(this.chamado).subscribe(res => {
      this.toastService.success('Chamado criado com sucesso', 'Chamado');
      this.router.navigate(['chamados']);
    }, ex => {
      this.toastService.error(ex.error.error, 'Erro');
    });
  }

  buscarTodosClientes(): void {
    this.clienteService.buscarTodos().subscribe(res => {
      this.clientes = res;
    });
  }

  buscarTodosTecnicos(): void {
    this.tecnicoService.buscarTodos().subscribe(res => {
      this.tecnicos = res;
    });
  }
  
  validaCampos(): boolean {
    return  this.prioridade.valid &&
            this.status.valid &&
            this.titulo.valid &&
            this.observacoes.valid &&
            this.tecnico.valid &&
            this.cliente.valid;
  }


}
