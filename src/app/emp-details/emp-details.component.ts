import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { EmployeeService } from '../services/employee.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CoreService } from '../core.service';

@Component({
  selector: 'app-emp-details',
  templateUrl: './emp-details.component.html',
  styleUrls: ['./emp-details.component.scss']
})
export class EmpDetailsComponent {


  empForm:FormGroup;
  isSubmitting=false;

   education : string[]=[
    'Matric',
    'Diploma',
    'Intermediate',
    'Graduate',
    'Post Graduate',
   ];

   constructor(private _fb:FormBuilder,
    private _empService:EmployeeService,
    private _dialogRef:MatDialogRef<EmpDetailsComponent>,
    @Inject(MAT_DIALOG_DATA)public data:any,
    private _coreService:CoreService
  ){
    this.empForm=this._fb.group({
      firstName:'',
      lastName:'',
      email:'',
      dob:'',
      gender:'',
      education:'',
      company:'',
      experience:'',
      package:'',
    })

   }

   ngOnInit(): void {
     this.empForm.patchValue(this.data);
   }

   onFormSubmit(){
    if(this.empForm.valid && !this.isSubmitting){
      this.isSubmitting = true;  // Set flag to true to prevent duplicate submissions

      if(this.data){
        this._empService.updateEmployee(this.data.id,this.empForm.value).subscribe({
          next: (_val:any) => {
            this._coreService.openSnackBar('Employee updated successfully');
            this._dialogRef.close(true);
          },
          error: (err:any) => {
            console.log(err);
            this.isSubmitting = false;  // Reset flag on error
          }
        });
      } else {
        this._empService.addEmployee(this.empForm.value).subscribe({
          next: (_val:any) => {
            this._coreService.openSnackBar('Employee added successfully');
            this._dialogRef.close(true);
          },
          error: (err:any) => {
            console.log(err);
            this.isSubmitting = false;  // Reset flag on error
          }
        });
      }
    }
  }
}
