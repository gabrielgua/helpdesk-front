import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Chamado } from 'src/app/models/chamado';
import { ChamadoService } from 'src/app/services/chamado.service';
import { DialogComponent } from '../../dialog/dialog.component';

@Component({
  selector: 'app-chamado-list',
  templateUrl: './chamado-list.component.html',
  styleUrls: ['./chamado-list.component.css']
})
export class ChamadoListComponent implements OnInit {

  ELEMENT_DATA: Chamado[] = [];
  FILTRED_DATA: Chamado[] = [];

  displayedColumns: string[] = ['id', 'titulo', 'cliente', 'tecnico', 'dataAbertura', 'prioridade', 'status', 'acoes'];
  dataSource = new MatTableDataSource<Chamado>(this.ELEMENT_DATA);


  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(
    private service: ChamadoService,
    private dialog: MatDialog
    ) { }

  ngOnInit(): void {
    this.buscarTodos();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  buscarTodos(): void {
    this.service.buscarTodos().subscribe(resp => {
      this.ELEMENT_DATA = resp;
      this.dataSource = new MatTableDataSource<Chamado>(this.ELEMENT_DATA);
      this.dataSource.paginator = this.paginator;
    });
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

  ordenarPorStatus(status: any): void {
    let list: Chamado[] = [];
    this.ELEMENT_DATA.forEach(element => {
      if(element.status == status) {
        list.push(element);
      }
    });
    this.FILTRED_DATA = list;
    this.dataSource = new MatTableDataSource<Chamado>(this.FILTRED_DATA);
    this.dataSource.paginator = this.paginator;
  }

  retornarDefault(): void {
    this.dataSource = new MatTableDataSource<Chamado>(this.ELEMENT_DATA);
    this.dataSource.paginator = this.paginator;
  }

  abrirDialog(chamado: Chamado): void {
    this.dialog.open(DialogComponent, {
      data: {
        id: chamado.id,
        dataAbertura: chamado.dataAbertura,
        dataFechamento: chamado.dataFechamento,
        prioridade: this.retornaPrioridade(chamado.prioridade),
        status: this.retornaStatus(chamado.status),
        titulo: chamado.titulo,
        observacoes: chamado.observacoes,
        tecnico: chamado.tecnico,
        cliente: chamado.cliente,
        nomeCliente: chamado.nomeCliente,
        nomeTecnico: chamado.nomeTecnico
      },
      width: "70rem",
      autoFocus: false
    });
  }
 
}
