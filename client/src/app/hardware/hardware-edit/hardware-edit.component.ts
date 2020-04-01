import { Component, OnInit } from '@angular/core';
import { Hardware } from '../../model/hardware';
import { ActivatedRoute, Router } from "@angular/router";
import { FormGroup, FormBuilder, Validators  } from "@angular/forms";
import { HardwareApiService } from '../../service/hardware-api.service';

@Component({
  selector: 'app-hardware-edit',
  templateUrl: './hardware-edit.component.html',
  styleUrls: ['./hardware-edit.component.css']
})
export class HardwareEditComponent implements OnInit {
  submitted = false;
  editForm: FormGroup;
  hardwareData: Hardware[];

  constructor(
    public fb: FormBuilder,
    private actRoute: ActivatedRoute,
    private hardwareApiService: HardwareApiService,
    private router: Router
  ) {
    this.updateHardware();
   }

  ngOnInit() {
    this.updateHardware();
    let id = this.actRoute.snapshot.paramMap.get('id');
    this.getHardware(id);
  }
  // Getter to access form control
  get myForm(){
    return this.editForm.controls;
  }

  getHardware(id) {
    this.hardwareApiService.getHardware(id).subscribe(data => {
      this.editForm.setValue({
        Name: data['Name'],
        ClientCapacity: data['ClientCapacity'],
        ClientsSupported: data['ClientsSupported'],
      });
    });
  }

  updateHardware() {
    this.editForm = this.fb.group({
      Name: ['', [
        Validators.required, 
        Validators.minLength(2),
        Validators.pattern('^[a-zA-Z]+$')
      ]],
      ClientCapacity: ['', [
        Validators.required,
        Validators.pattern("^[0-9]*$")
      ]],
      ClientsSupported: ['', [
        Validators.required,
        Validators.pattern("^[0-9]*$")
      ]]
    })
  }

  onSubmit() {
    this.submitted = true;
    if (!this.editForm.valid) {
      return false;
    } else {
      if (window.confirm('Are you sure?')) {
        let id = this.actRoute.snapshot.paramMap.get('id');
        this.hardwareApiService.updateHardware(id, this.editForm.value)
          .subscribe(res => {
            this.router.navigateByUrl('/list-hardware');
            console.log('Content updated successfully!')
          }, (error) => {
            console.log(error)
          })
      }
    }
  }

}
