import { Component, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { Tecnico } from 'src/app/models/tecnico';
import { TecnicoService } from 'src/app/services/tecnico.service';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';


@Component({
  selector: 'app-tecnico-list',
  templateUrl: './tecnico-list.component.html',
  styleUrls: ['./tecnico-list.component.css']
})
export class TecnicoListComponent implements OnInit, OnChanges {

  ELEMENT_DATA: Tecnico[] = [];
  
  displayedColumns: string[] = ['id', 'nome', 'cpf', 'email', 'dataCriacao', 'acoes'];
  dataSource = new MatTableDataSource<Tecnico>(this.ELEMENT_DATA);

  dialogRef: MatDialogRef<ConfirmDialogComponent>;
  
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(
    private service: TecnicoService,
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
      this.dataSource = new MatTableDataSource<Tecnico>(this.ELEMENT_DATA);
      this.dataSource.paginator = this.paginator;
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
    this.dialogRef.componentInstance.msg = 'Você tem certeza que deseja remover este técnico?';
    this.dialogRef.componentInstance.titulo = 'Remover Técnico #' + id + '?';

    this.dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.remover(id);
      } 
      this.dialogRef = null;
    })

    
  }

  remover(id: any): void {
    this.service.remover(id).subscribe(() => {
      this.toast.success('Técnico removido com sucesso', 'Remover');
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

