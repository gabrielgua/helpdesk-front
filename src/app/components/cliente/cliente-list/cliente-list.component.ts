import { Component, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { Cliente } from 'src/app/models/cliente';
import { ClienteService } from 'src/app/services/cliente.service';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';


@Component({
  selector: 'app-cliente-list',
  templateUrl: './cliente-list.component.html',
  styleUrls: ['./cliente-list.component.css']
})
export class ClienteListComponent implements OnInit, OnChanges {

  ELEMENT_DATA: Cliente[] = [];
  
  displayedColumns: string[] = ['id', 'nome', 'cpf', 'email', 'dataCriacao', 'acoes'];
  dataSource = new MatTableDataSource<Cliente>(this.ELEMENT_DATA);

  dialogRef: MatDialogRef<ConfirmDialogComponent>;
  
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(
    private service: ClienteService,
    private dialog: MatDialog,
    private toast: ToastrService) { }

  ngOnInit(): void {
    this.buscarTodos();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.buscarTodos();
  }

  buscarTodos() {
    this.service.buscarTodos().subscribe(resp => {
      this.ELEMENT_DATA = resp;
      this.dataSource = new MatTableDataSource<Cliente>(this.ELEMENT_DATA);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  AbrirDialog(id: any): void {
    this.dialogRef = this.dialog.open(ConfirmDialogComponent);
    this.dialogRef.componentInstance.msg = 'Você tem certeza que deseja remover este cliente?';
    this.dialogRef.componentInstance.titulo = 'Remover Cliente #' + id + '?';

    this.dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.remover(id);
      } 
      this.dialogRef = null;
    })

    
  }

  remover(id: any): void {
    this.service.remover(id).subscribe(() => {
      this.toast.success('Cliente removido com sucesso', 'Remover');
      this.ngOnInit();
    }, ex => {
      if (ex.error.errors) {
        ex.error.errors.forEach(element => {
          this.toast.error(element.message, 'Erro');
        });
      } else {
        this.toast.error(ex.error.message, 'Erro');
      }
    })
  }
}

