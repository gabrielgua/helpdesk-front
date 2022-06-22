import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Tecnico } from 'src/app/models/tecnico';
import { TecnicoService } from 'src/app/services/tecnico.service';

@Component({
  selector: 'app-tecnico-update',
  templateUrl: './tecnico-update.component.html',
  styleUrls: ['./tecnico-update.component.css']
})
export class TecnicoUpdateComponent implements OnInit {

  tecnico: Tecnico = {
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
    private service: TecnicoService,
    private toast: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private _formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.tecnico.id = this.route.snapshot.paramMap.get('id');
    this.buscarPorId();
  }

  atualizarTecnico(): void {
    this.service.editar(this.tecnico).subscribe(() => {
      this.toast.success('Técnico atualizado no sistema!', 'Atualização');
      this.router.navigate(['tecnicos']);
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
    if(this.tecnico.perfis.includes(perfil)) {
      this.tecnico.perfis.splice(this.tecnico.perfis.indexOf(perfil), 1);
    } else {
      this.tecnico.perfis.push(perfil)
    }

    console.log('adicionar perfil: ', this.tecnico.perfis)
  }

  validaCampos(): Boolean {
    return this.nome.valid && 
      this.cpf.valid && 
      this.email.valid && 
      this.senha.valid;
  }

  buscarPorId(): void {
    this.service.buscarPorId(this.tecnico.id).subscribe(resp => {
      this.tecnico = resp;
      this.tecnico.perfis = this.transformarPerfisToNumeros(resp.perfis);
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
    if(this.tecnico.perfis.includes(perfil)) {
      return true;
    } 

    return false;
  }
}
