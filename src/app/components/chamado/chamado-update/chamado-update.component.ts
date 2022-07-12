import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { Chamado } from 'src/app/models/chamado';
import { Cliente } from 'src/app/models/cliente';
import { Tecnico } from 'src/app/models/tecnico';
import { ChamadoService } from 'src/app/services/chamado.service';
import { ClienteService } from 'src/app/services/cliente.service';
import { TecnicoService } from 'src/app/services/tecnico.service';

@Component({
  selector: 'app-chamado-update',
  templateUrl: './chamado-update.component.html',
  styleUrls: ['./chamado-update.component.css']
})
export class ChamadoUpdateComponent implements OnInit {

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
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.chamado.id = this.route.snapshot.paramMap.get('id');
    this.buscarPorId();
    this.buscarTodosClientes();
    this.buscarTodosTecnicos();
  }

  buscarPorId(): void {
    this.chamadoService.buscarPorId(this.chamado.id).subscribe(res => {
      this.chamado = res;
    }, ex => {
      this.toastService.error(ex.error.error);
    });
  }

  editar(): void {
    this.chamadoService.editar(this.chamado).subscribe(res => {
      this.toastService.success('Chamado atualizado com sucesso', 'Chamado');
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
    return  this.titulo.valid &&
            this.observacoes.valid;
  }

  retornaStatus(status: any): string {
    switch (status) {
      case 0: return 'Aberto';
      case 1: return 'Em andamento'; 
      default: return 'Encerrado';
    }
  }

  retornaPrioridade(prioridade: any): string {
    switch (prioridade) {
      case 0: return 'Baixa';
      case 1: return 'Média'; 
      default: return 'Alta';
    }
  }
}
