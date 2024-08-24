// import { Component } from '@angular/core';
// import { MatDialog } from '@angular/material/dialog';
// import { EmpDetailsComponent } from './emp-details/emp-details.component';

// @Component({
//   selector: 'app-root',
//   templateUrl: './app.component.html',
//   styleUrls: ['./app.component.scss']
// })
// export class AppComponent {
//   title = 'crudApplication';

//   constructor(private _dialog: MatDialog) {}

//   openAddEditEmpForm() {
//     this._dialog.open(EmpDetailsComponent);
//   }

// }

import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EmpDetailsComponent } from './emp-details/emp-details.component';
import { EmployeeService } from './services/employee.service';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { CoreService } from './core.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{


  displayedColumns: string[] = [
    'firstName',
    'lastName',
     'email',
      'dob',
      'gender',
      'education',
      'company',
      'experience',
      'package',
      'action',
    ];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private _dialog:MatDialog,
    private _empService:EmployeeService,
  private _coreservice:CoreService ){}

ngOnInit(): void {
  this.getEmployeeList();
}

  openAddEditForm(){
   const dialogRef= this._dialog.open(EmpDetailsComponent);
   dialogRef.afterClosed().subscribe({
    next:(val)=>{
      if(val){
        this.getEmployeeList();
      }
    }
   })
  }

  getEmployeeList(){
    this._empService.getEmployeeList().subscribe({
      next:(res)=>{
        this.dataSource=new MatTableDataSource(res);
        this.dataSource.sort=this.sort;
        this.dataSource.paginator=this.paginator;
      },
      error:(err)=>{
        console.log(err);
      }
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  deleteEmployee(id:number){
    this._empService.deleteEmployee(id).subscribe({
      next:(res)=>{

        this._coreservice.openSnackBar('Employee deleted','done')
        this.getEmployeeList();
      },
      error:console.log,
    });
  }

  openEditForm(data:any){
  const dialogRef=  this._dialog.open(EmpDetailsComponent,{
      data,
    });
    dialogRef.afterClosed().subscribe({
      next:(val)=>{
        if(val){
          this.getEmployeeList();
        }
      }
     })
   }
}

