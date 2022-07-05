import { Component, OnInit } from '@angular/core';
import {  FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Cliente } from 'src/app/models/cliente';
import { ClienteService } from 'src/app/services/cliente.service';

@Component({
  selector: 'app-cliente-update',
  templateUrl: './cliente-update.component.html',
  styleUrls: ['./cliente-update.component.css']
})
export class ClienteUpdateComponent implements OnInit {

  cliente: Cliente = {
    id: '',
    nome: '',
    cpf: '',
    email: '',
    senha: '',
    perfis: [],
    dataCriacao: ''
  }

  nome: FormControl = new FormControl(null, Validators.minLength(3));
  cpf: FormControl = new FormControl(null, Validators.required);
  email: FormControl = new FormControl(null, Validators.email);
  senha: FormControl = new FormControl(null, Validators.minLength(6));

  constructor(
    private service: ClienteService,
    private toast: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.cliente.id = this.route.snapshot.paramMap.get('id');
    this.buscarPorId();
  }

  atualizarCliente(): void {
    this.service.editar(this.cliente).subscribe(() => {
      this.toast.success('Cliente atualizado no sistema!', 'Atualização');
      this.router.navigate(['clientes']);
    }, ex => {
      console.log(ex);
      if(ex.error.errors) {
        ex.error.errors.forEach(element => {
          this.toast.error(element.message, 'Cadastro');
        });
      } else {
        this.toast.error(ex.error.message, 'Cadastro');
      }
    })
  }

  adicionarPerfil(perfil: any): void {
    if(this.cliente.perfis.includes(perfil)) {
      this.cliente.perfis.splice(this.cliente.perfis.indexOf(perfil), 1);
    } else {
      this.cliente.perfis.push(perfil)
    }

    console.log('adicionar perfil: ', this.cliente.perfis)
  }

  validaCampos(): Boolean {
    return this.nome.valid && 
      this.cpf.valid && 
      this.email.valid && 
      this.senha.valid;
  }

  buscarPorId(): void {
    this.service.buscarPorId(this.cliente.id).subscribe(resp => {
      this.cliente = resp;
      this.cliente.perfis = this.transformarPerfisToNumeros(resp.perfis);
    });
  }  

  transformarPerfisToNumeros(perfis: string[]): string[] {
    let perfisAux: string[] = [];

    perfis.forEach(p => {
      switch (p) {
        case 'ADMIN': perfisAux.push('0'); break;
        case 'CLIENTE': perfisAux.push('1'); break;
        case 'TECNICO': perfisAux.push('2'); break;
        default: break;
      }

    })
    return perfisAux;
  }

  buscarPerfil(perfil: string): boolean {
    if(this.cliente.perfis.includes(perfil)) {
      return true;
    } 

    return false;
  }
}
