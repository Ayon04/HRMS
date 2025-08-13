import { CommonModule } from '@angular/common';
import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { EmployeeDTO } from '../../Models/EmployeeDTO';
import { EmployeeService } from '../../Services/employee.service';
import { DropDownService } from '../../Services/dropDown.service';
import { RouterModule } from '@angular/router';
import { AbstractControl, FormArray, FormBuilder,FormControl,FormGroup,FormsModule,ReactiveFormsModule,Validators} from '@angular/forms';
import { DropDown } from '../../Models/DropDown';
import { EmployeeDocumentDTO } from '../../Models/EmployeeDocumentDTO';
import { EmployeeEducationInfoDTO } from '../../Models/EmployeeEducationInfoDTO';
import { EmployeeFamilyInfoDTO } from '../../Models/EmployeeFamilyInfoDTO ';
import { EmployeeProfessionalCertificationDTO } from '../../Models/EmployeeProfessionalCertificationDTO ';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule],
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.css'
})
export class EmployeeComponent implements OnInit {
  // employees: EmployeeDTO[] = [];
    employees: WritableSignal<EmployeeDTO[]> = signal<EmployeeDTO[]>([]);

  selectedEmployee: EmployeeDTO | null = null;
  employeeImageUrl: SafeUrl | null = null;

  public employeeForm: FormGroup;
  public idClient: number = 10001001;
  isHide = true;
  isShowBtn:boolean = false;

  departments: DropDown[] = [];
  sections: any[] = [];
  designations: any[] = [];
  genders: any[] = [];
  religions: any[] = [];
  jobtyps: any[] = [];
  employeeTypes: any[] = [];
  weekoffs: any[] = [];
  MaritalStatus: any[] = [];
  EducationLevel: any[] = [];
  educationExaminations: any[] = [];
  educationResults: any[] = [];
  relationship: any[] = [];
  educations: EmployeeEducationInfoDTO[] = [];
  family: EmployeeFamilyInfoDTO[] = [];
  professionalCertification: EmployeeProfessionalCertificationDTO[] = [];

  public employeeDto: EmployeeDTO;

  constructor(
    private employeeService: EmployeeService,
    private dropdownService: DropDownService,
    private fb: FormBuilder,
    private sanitizer: DomSanitizer
  ) {
    this.employeeDto = new EmployeeDTO();
    this.employeeForm = this.initForm();
  }

  ngOnInit(): void {

    console.log("HRM System Running");


    // this.employeeEducationInfo.disabled === true;
    // this.employeeDocuments.disabled === true;
    // this.employeeFamilyInfos.disabled === true;
    // this.employeeProfessionalCertifications.disabled === true;

    //this.disableAllControls(this.employeeForm);

    this.employeeForm.enable();
    this.loadEmployees();
    this.getDepartments(this.idClient);
    this.getDesignation(this.idClient);
    this.getJobType(this.idClient);
    this.getGender(this.idClient);
    this.getEmployeeType(this.idClient);
    this.getReligion(this.idClient);
    this.getRelationship(this.idClient);
    this.getSection(this.idClient);
    this.getWeekOff(this.idClient);
    this.getMaritalStatus(this.idClient);
    this.getEducationLevel(this.idClient);
    this.getEducationResult(this.idClient);
    this.getEducationExam(this.idClient);

  }



  initForm(): FormGroup {
    return this.fb.group({
      idClient: new FormControl(this.idClient),
      id: new FormControl(0),
      employeeName: new FormControl(),
      employeeNameBangla: new FormControl(),
      fatherName: new FormControl(),
      motherName: new FormControl(),
      idReportingManager: new FormControl(),
      idJobType: new FormControl(),
      idEmployeeType:new FormControl(),
      birthDate: new FormControl(),
      joiningDate: new FormControl(),
      idGender: new FormControl(),
      idReligion: new FormControl(),
      idDepartment: new FormControl(this.employeeDto.idDepartment , Validators.required),
      idSection: new FormControl(this.employeeDto.idDepartment , Validators.required),
      idDesignation: new FormControl(),
      hasOvertime: new FormControl(),
      hasAttendanceBonus: new FormControl(),
      idWeekOff: new FormControl(),
      nationalIdentificationNumber: new FormControl(),
      contactNo: new FormControl(),
      address: new FormControl(),
      presentAddress: new FormControl(),
      idMaritalStatus: new FormControl(),
      createdBy: ['admin'],
      isActive: [true],
      employeeImage:new FormControl(),
      employeeDocuments: this.fb.array([]),
      employeeEducationInfos: this.fb.array([]),
      employeeProfessionalCertifications: this.fb.array([]),
      employeeFamilyInfos: this.fb.array([]),


    });
  }

  get employeeDocuments(): FormArray {
    return this.employeeForm.get('employeeDocuments') as FormArray;
  }

  get employeeEducationInfo(): FormArray {
    return this.employeeForm.get('employeeEducationInfos') as FormArray;
  }

  get employeeProfessionalCertifications(): FormArray {
  return this.employeeForm.get('employeeProfessionalCertifications') as FormArray;
 }

 get employeeFamilyInfos(): FormArray {
  return this.employeeForm.get('employeeFamilyInfos') as FormArray;
}


  createDocumentForm(): FormGroup {
    return this.fb.group({
      idClient: [this.idClient],
      id: [0],
      idEmployee: [0],
      documentName: [''],
      fileName: [''],
      uploadedFileExtention: [''],
      uploadDate: [new Date()],
      setDate: [new Date()],
      createdBy: ['admin'],
      uploadedFile: new FormControl()
    });
  }



addDocument(): void {
const docs = this.employeeDocuments;
docs.push(this.createDocumentForm());
}

  removeDocument(index: number): void {
    this.employeeDocuments.removeAt(index);
  }


 createEducationInfoForm(): FormGroup {
  return this.fb.group({
    idClient: [this.idClient],
    idEducationLevel: [null],
    idEducationExamination: [null],
    idEducationResult: [null],
    cgpa: [null],
    examScale: [null],
    marks: [null],
    major: [''],
    passingYear: [null],
    instituteName: [''],
    isForeignInstitute: new FormControl(this.employeeDto.idDepartment , Validators.required),
    duration: [null],
    achievement: [''],
    setDate: [new Date()],
    createdBy: ['admin']
    // educationLevelName: [''],
    // examinationName: [''],
    // resultName: ['']
  });
}

  addEducationInfo(): void {
  const ems = this.employeeEducationInfo;
  ems.push(this.createEducationInfoForm());
}

  removeEducationInfo(index: number): void {
    this.employeeEducationInfo.removeAt(index);
  }

  createEmployeeProfessionalCertificationsForm(): FormGroup {
  return this.fb.group({
    idClient: [this.idClient],
    id: [0],
    idEmployee: [0],
    certificationTitle: [''],
    certificationInstitute: [''],
    instituteLocation: [''],
    fromDate: [null],
    toDate: [null],
    setDate: [new Date()],
    createdBy: ['admin']
  });
}


addProfessionalCertification(): void {
  this.employeeProfessionalCertifications
  .push(this.createEmployeeProfessionalCertificationsForm());
}

removeemployeeProfessionalCertifications(index: number): void {
    this.employeeProfessionalCertifications.removeAt(index);
  }

  createEmployeeFamilyInfoForm(): FormGroup {
  return this.fb.group({
    idClient: [this.idClient],
    id: [0],
    idEmployee: [0],
    name: [''],
    idGender: [null],
    idRelationship: [null],
    dateOfBirth: [null],
    contactNo: [''],
    currentAddress: [''],
    permanentAddress: [''],
    setDate: [new Date()],
    createdBy: ['admin']
  });
}

addFamilyInfo(): void {
  this.employeeFamilyInfos.push(this.createEmployeeFamilyInfoForm());
}

removeFamilyInfo(index: number): void {
  this.employeeFamilyInfos.removeAt(index);
}



  clearForm(): void {
    this.employeeForm.reset();
    this.employeeForm.enable();
    this.employeeEducationInfo.clear(); 
    this.employeeDocuments.clear(); 
    this.employeeProfessionalCertifications.clear(); 
    this.employeeFamilyInfos.clear(); 
   // this.employeeImageUrl
    
  }

 addClick():void{

    this.employeeForm.reset();
    this.employeeForm.enable();
    this.employeeEducationInfo.clear(); 
    this.employeeDocuments.clear(); 
    this.employeeProfessionalCertifications.clear(); 
    this.employeeFamilyInfos.clear(); 
    this.isShowBtn = true;
 }

editClick():void{

  this.employeeForm.enable();
  this.isShowBtn =true;

}

// deleteClick(): void {
//   const id = this.employeeForm.get('id')?.value;
//   const idClient = this.employeeForm.get('idClient')?.value;

//   if (id == null || idClient == null) {
//     this.isHide = true;
//   }
//   else{

//     this.isHide = false;

//   }

// }


cancelClick():void{
    this.isShowBtn = false;
    this.employeeForm.disable();
    //this.clearForm();
 }


  disbaleFormOnload():void{

    this.employeeForm.disable();
  }


  // loadEmployees(): void {
  //   this.employeeService.getAllEmployees(this.idClient).subscribe(data => {
  //   this.employees = data;
  //   //this.deleteClick();
  //   this.employeeForm.disable();
  //   });
  // }

  
  loadEmployees(): void {
  this.employeeService.getAllEmployees(this.idClient).subscribe({
    next: (data) => this.employees.set(data),
    error: (error) => console.error('Failed to fetch employees', error)
  });
}


  loadEmployeeToForm(emp: EmployeeDTO): void {
    this.selectedEmployee = emp;

    this.employeeService.getEmployeeById(this.idClient, emp.id).subscribe({
      next: (data) => {
        const employeeData = data as EmployeeDTO;
        this.employeeForm.patchValue({
          ...employeeData,
           id: employeeData.id, 
          idClient: this.idClient, 
          birthDate: this.formatDateToInput(employeeData.birthDate),
          joiningDate: this.formatDateToInput(employeeData.joiningDate),
          hasOvertime: employeeData.hasOvertime ?? false,
          hasAttendanceBonus: employeeData.hasAttendenceBonus ?? false,
          isActive: employeeData.isActive ?? true
        });

        // Reset FormArrays
        this.employeeDocuments.clear();
        (employeeData.employeeDocuments || []).forEach(doc => {
          this.employeeDocuments.push(this.fb.group(doc));
        });

        this.employeeEducationInfo.clear();
        (employeeData.employeeEducationInfos || []).forEach(edu => {
          const eduForm = this.createEducationInfoForm();
          eduForm.patchValue(edu);
          this.employeeEducationInfo.push(eduForm);
        });

        this.employeeProfessionalCertifications.clear();
        (employeeData.employeeProfessionalCertifications || []).forEach(cert => {
          const certForm = this.createEmployeeProfessionalCertificationsForm();
          certForm.patchValue(cert);
          this.employeeProfessionalCertifications.push(certForm);
        });

        this.employeeFamilyInfos.clear();
        (employeeData.employeeFamilyInfos || []).forEach(fam => {
          const famForm = this.createEmployeeFamilyInfoForm();
          famForm.patchValue(fam);
          this.employeeFamilyInfos.push(famForm);
        });


        this.educations = employeeData.employeeEducationInfos ?? [];
        this.family = employeeData.employeeFamilyInfos ?? [];
        this.professionalCertification = employeeData.employeeProfessionalCertifications ?? [];
          this.employeeForm.disable({ emitEvent: false });
      },
      error: (error) => {
        console.error('Error loading employee:', error);
      }
    });

    // console.log());
    

  }

  loadEmployeeImageToForm(emp: EmployeeDTO): void {
    this.selectedEmployee = emp;

    this.employeeService.getEmployeeImage(this.idClient, emp.id).subscribe({
      next: (blob: Blob) => {
        const objectURL = URL.createObjectURL(blob);
        this.employeeImageUrl = this.sanitizer.bypassSecurityTrustUrl(objectURL);
      },
      error: (error) => {
        console.error('Error loading image:', error);
      }
    });
  }

  formatDateToInput(date: any): string {
    if (!date) return '';
    const d = new Date(date);
    const offset = d.getTimezoneOffset();
    const localDate = new Date(d.getTime() - offset * 60000);
    return localDate.toISOString().split('T')[0];
  }

  // Dropdown loaders
  getDepartments(idClient: number): void {
    this.dropdownService.getDepartmentDropdown(idClient).subscribe({
      next: data => this.departments = data
    });
  }

  getDesignation(idClient: number): void {
    this.dropdownService.getDesignationDropdown(idClient).subscribe({
      next: data => this.designations = data
    });
  }

  getJobType(idClient: number): void {
    this.dropdownService.getJobTypeDropDown(idClient).subscribe({
      next: data => this.jobtyps = data
    });
  }

  getGender(idClient: number): void {
    this.dropdownService.getGenderDropDown(idClient).subscribe({
      next: data => this.genders = data
    });
  }

  getEmployeeType(idClient: number): void {
    this.dropdownService.getEmployueeTypesDropDown(idClient).subscribe({
      next: data => this.employeeTypes = data
    });
  }

  getReligion(idClient: number): void {
    this.dropdownService.getReligionDropDown(idClient).subscribe({
      next: data => this.religions = data
    });
  }

  getSection(idClient: number): void {
    this.dropdownService.getSectionDropDown(idClient).subscribe({
      next: data => this.sections = data
    });
  }

  getWeekOff(idClient: number): void {
    this.dropdownService.getWeekOffDropDown(idClient).subscribe({
      next: data => this.weekoffs = data
    });
  }

  getMaritalStatus(idClient: number): void {
    this.dropdownService.getMaritalStatusDropDown(idClient).subscribe({
      next: data => this.MaritalStatus = data
    });
  }

  getEducationLevel(idClient: number): void {
    this.dropdownService.getEducationLevelDropDown(idClient).subscribe({
      next: data => this.EducationLevel = data
    });
  }

  getEducationExam(idClient: number): void {
    this.dropdownService.getEducationexaminationDropDown(idClient).subscribe({
      next: data => this.educationExaminations = data
    });
  }

   getEducationResult(idClient: number): void {
    this.dropdownService.getEducationResultDropDown(idClient).subscribe({
      next: data => this.educationResults = data
    });
  }

  getRelationship(idClient: number): void {
    this.dropdownService.getRelationshipdownDropDown(idClient).subscribe({
      next: data => this.relationship = data
    });
  }

 updateDocumentFile(doc: EmployeeDocumentDTO, file: File): void {
  const reader = new FileReader();

  reader.onload = () => {
    doc.uploadedFile = reader.result as string; 
    doc.fileName = file.name;
    doc.uploadedFileExtention = file.name.split('.').pop() || '';
    doc.uploadDate = new Date();

    const index = this.employeeDocuments.controls.findIndex(group => group.value === doc);
    if (index !== -1) {
      this.employeeDocuments.at(index).patchValue(doc);
    }
  };

  reader.readAsDataURL(file); 
}



onDocFileChange(event: any, index: number): void {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader(); 
    reader.onload = () => {
      const base64String = (reader.result as string).split(',')[1];
      const fileName = file.name;
      const fileExtension = file.name.split('.').pop();

      const documentsFormArray = this.employeeForm.get('employeeDocuments') as FormArray;
      const docFormGroup = documentsFormArray.at(index) as FormGroup;

      docFormGroup.patchValue({
        uploadedFile: base64String,
        fileName: fileName,
        uploadedFileExtention: fileExtension
      });
    };
    reader.readAsDataURL(file);
  }
}


 onFileSelected(event: Event, index: number): void {
  const input = event.target as HTMLInputElement;

  if (input.files && input.files.length > 0) {    const file = input.files[0];
    const docFormGroup = this.employeeDocuments.at(index);
    const doc: EmployeeDocumentDTO = docFormGroup.value;

    this.updateDocumentFile(doc, file);
  }
}




// add(): void {
//   if (this.employeeForm.invalid) {
//     console.warn('Form is invalid');
//     return;
//   }

//   this.employeeForm.enable(); // temporarily enable if any part is disabled

//   const formValue = this.employeeForm.getRawValue();
//   console.log('form value', formValue);

//   const employeeDto = new EmployeeDTO({
//     ...formValue,
//     employeeDocuments: formValue.employeeDocuments || [],
//     employeeEducationInfos: formValue.employeeEducationInfos || [],
//     employeeProfessionalCertifications: formValue.employeeProfessionalCertifications || [],
//     employeeFamilyInfos: formValue.employeeFamilyInfos || []
//   });

//   this.employeeService.createEmployee(employeeDto).subscribe({
//     next: (res) => {
//       console.log('mployee saved successfully:', res);
//       alert('Employee saved successfully!');
//       this.clearForm(); 
//       this.employeeForm.disable(); 
//     },
//     error: (err) => {
//       console.error('Error saving employee:', err);
//       alert('Failed to save employee.');
//     }
//   });
// }

private mapFormToEmployeeDto(formValue: any): EmployeeDTO {
  const formatDate = (date: Date | string | null | undefined): string | undefined => {
    if (!date) return undefined;
    const d = new Date(date);
    const pad = (n: number, z = 2) => ('00' + n).slice(-z);
    const ms = ('0000000' + d.getMilliseconds() * 10000).slice(-7);
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}.${ms}`;
  };

  return {
    idClient: this.idClient,
    id: 0,
    employeeName: formValue.employeeName,
    employeeNameBangla: formValue.employeeNameBangla,
    fatherName: formValue.fatherName,
    motherName: formValue.motherName,
    idReportingManager: formValue.idReportingManager,
    idJobType: formValue.idJobType,
    idEmployeeType: formValue.idEmployeeType,
    birthDate: formValue.birthDate ? new Date(formValue.birthDate) : undefined,
    joiningDate: formValue.joiningDate ? new Date(formValue.joiningDate) : undefined,
    idGender: formValue.idGender,
    idReligion: formValue.idReligion,
    idDepartment: +formValue.idDepartment, 
    idSection: +formValue.idSection, 
    idDesignation: formValue.idDesignation,
    hasOvertime: formValue.hasOvertime ?? false,
    hasAttendenceBonus: formValue.hasAttendanceBonus ?? false,
    idWeekOff: formValue.idWeekOff,
    address: formValue.address,
    presentAddress: formValue.presentAddress,
    nationalIdentificationNumber: formValue.nationalIdentificationNumber,
    contactNo: formValue.contactNo,
    idMaritalStatus: formValue.idMaritalStatus,
    isActive: formValue.isActive ?? true,
    createdBy: formValue.createdBy ?? 'admin',
    departmentName: undefined,
    designation: undefined,
    employeeImage: formValue.employeeImage,

    employeeDocuments: formValue.employeeDocuments || [],
    employeeEducationInfos: formValue.employeeEducationInfos || [],
    employeeProfessionalCertifications: formValue.employeeProfessionalCertifications || [],
    employeeFamilyInfos: formValue.employeeFamilyInfos || [],








// employeeDocuments: (formValue.employeeDocuments || []).map((doc: any) => ({
//   ...doc,
//   uploadDate: formatDate(doc.uploadDate),
// })),

// employeeEducationInfos: formValue.employeeEducationInfos || [],

// employeeProfessionalCertifications: (formValue.employeeProfessionalCertifications || []).map((cert: any) => ({
//   ...cert,
//   fromDate: formatDate(cert.fromDate),
//   toDate: formatDate(cert.toDate),
// })),

// employeeFamilyInfos: (formValue.employeeFamilyInfos || []).map((fam: any) => ({
//   ...fam,
//   dateOfBirth: formatDate(fam.dateOfBirth),
// })),

   
  };
}


private mapFormToEmployeeDtoUpdate(formValue: any): EmployeeDTO {
  const formatDate = (date: Date | string | null | undefined): string | undefined => {
    if (!date) return undefined;
    const d = new Date(date);
    const pad = (n: number, z = 2) => ('00' + n).slice(-z);
    const ms = ('0000000' + d.getMilliseconds() * 10000).slice(-7);
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}.${ms}`;
  };

  return {
    idClient: formValue.idClient,
    id: formValue.id,
    employeeName: formValue.employeeName,
    employeeNameBangla: formValue.employeeNameBangla,
    fatherName: formValue.fatherName,
    motherName: formValue.motherName,
    idReportingManager: formValue.idReportingManager,
    idJobType: formValue.idJobType,
    idEmployeeType: formValue.idEmployeeType,
    //birthDate: formatDate(formValue.birthDate),
    //joiningDate: formatDate(formValue.joiningDate),
     birthDate: formValue.birthDate ? new Date(formValue.birthDate) : undefined,
     joiningDate: formValue.joiningDate ? new Date(formValue.joiningDate) : undefined,
    idGender: formValue.idGender,
    idReligion: formValue.idReligion,
    idDepartment: +formValue.idDepartment, 
    idSection: +formValue.idSection, 
    idDesignation: formValue.idDesignation,
    hasOvertime: formValue.hasOvertime ?? false,
    hasAttendenceBonus: formValue.hasAttendanceBonus ?? false,
    idWeekOff: formValue.idWeekOff,
    address: formValue.address,
    presentAddress: formValue.presentAddress,
    nationalIdentificationNumber: formValue.nationalIdentificationNumber,
    contactNo: formValue.contactNo,
    idMaritalStatus: formValue.idMaritalStatus,
    isActive: formValue.isActive ?? true,
   // setDate: formatDate(new Date()),
    createdBy: formValue.createdBy ?? 'admin',
    departmentName: undefined,
    designation: undefined,
    employeeDocuments: formValue.employeeDocuments || [],
    employeeEducationInfos: formValue.employeeEducationInfos || [],
    employeeProfessionalCertifications: formValue.employeeProfessionalCertifications || [],
    employeeFamilyInfos: formValue.employeeFamilyInfos || [],
    employeeImage: formValue.employeeImage
    
  };
}



onFileChange(event: any): void {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader(); 
    reader.onload = () => {
      const base64String = (reader.result as string).split(',')[1];
      this.employeeForm.patchValue({
        employeeImage: base64String
      });
    };
    reader.readAsDataURL(file);
  }
}

// add(): void {

//   this.employeeForm.enable(); // temporarily enable to access values

//   const formValue = this.employeeForm.getRawValue();
//   console.log('Form raw value:', formValue);

//   const employeeDto: EmployeeDTO = this.mapFormToEmployeeDto(formValue);
//   console.log('Mapped EmployeeDTO:', employeeDto);

//   this.employeeService.createEmployee(employeeDto).subscribe({
//     next: (res) => {
//       console.log('Employee saved successfully:', res);
//       alert('Employee saved successfully!');
//       this.clearForm();
//       this.employeeForm.disable();
//     },
//     error: (err) => {
//       console.error('Error saving employee:', err);
//       alert('Failed to save employee.');
//     }
//   });
//   this.employeeForm.enable();
//   this. clearForm();
//   this.loadEmployees();
// }
// add(): void {
//   const formValue = this.employeeForm.getRawValue(); // no need to enable/disable
//   console.log('Form raw value:', formValue);

//   const employeeDto: EmployeeDTO = this.mapFormToEmployeeDto(formValue);
//   console.log('Mapped EmployeeDTO:', employeeDto);

//   this.employeeService.createEmployee(employeeDto).subscribe({
//     next: (res) => {
//       ///console.log('Employee saved successfully:', res);
//       //console.log('Base64 image:', this.employeeForm.get('empImg')?.value);
//       alert('Employee Added successfully!');
//       this.clearForm();
//       this.loadEmployees();
//     },
//     error: (err) => {
//      // console.error('Error saving employee:', err);
//       alert('Failed to add employee.');
//     }
//   });
// }

// add(): void {
//   const formValue = this.employeeForm.getRawValue(); // no need to enable/disable
//   console.log('Form raw value:', formValue);

//   const employeeDto: EmployeeDTO = this.mapFormToEmployeeDto(formValue);
//   console.log('Mapped EmployeeDTO:', employeeDto);

//   this.employeeService.createEmployee(employeeDto).subscribe({
//     next: (res) => {
//       console.log('Employee saved successfully:', res);
//       console.log('Base64 image:', this.employeeForm.get('empImg')?.value);
//       alert('Employee saved successfully!');
//       this.clearForm();
//       this.loadEmployees();
//     },
//     error: (err) => {
//       console.error('Error saving employee:', err);
//       alert('Failed to save employee.');
//     }
//   });
// }

//hehe
// add(): void {
//   const formValue = this.employeeForm.getRawValue(); 
//   console.log('Form raw value:', formValue);

//   const employeeDto: EmployeeDTO = this.mapFormToEmployeeDto(formValue);
//   console.log('Mapped EmployeeDTO:', employeeDto);

//   this.employeeService.createEmployee(employeeDto).subscribe({
//     next: (res) => {
//       console.log('Employee saved successfully:', res);
//       console.log('Base64 image:', this.employeeForm.get('employeeImage')?.value);
//       alert('Employee Added successfully!');
//       this.clearForm();
//       this.loadEmployees();
//     },
//     error: (err) => {
//       console.error('Error saving employee:', err);
//       alert('Failed to save employee.');
//     }
//   });
// }

// update(): void {
//   const formValue = this.employeeForm.getRawValue(); 
//   console.log('Form raw value (update):', formValue);

//   const employeeDto: EmployeeDTO = this.mapFormToEmployeeDto(formValue);
//   console.log('Mapped EmployeeDTO (update):', employeeDto);

//   this.employeeService.updateEmployee(employeeDto).subscribe({
//     next: (res) => {
//       console.log('Employee updated successfully:', res);
//       console.log('Base64 image:', this.employeeForm.get('employeeImage')?.value); 
//       alert('Employee updated successfully!');
//       this.clearForm();    
//       this.loadEmployees(); 
//     },
//     error: (err) => {
//       console.error('Error updating employee:', err);
//       alert('Failed to update employee.');
//     }
//   });
  
// }


successMessage: string | null = null;
errorMessage: string | null = null;

add(): void {


  const formValue = this.employeeForm.getRawValue();
  console.log('Form raw value:', formValue);

  const employeeDto: EmployeeDTO = this.mapFormToEmployeeDto(formValue);
  console.log('Mapped EmployeeDTO:', employeeDto);


  this.employeeService.createEmployee(employeeDto).subscribe({
    next: (res) => {
      console.log('Employee saved successfully:', res);
      console.log('Base64 image:', this.employeeForm.get('employeeImage')?.value);

      this.successMessage = 'Employee saved successfully!';
      this.errorMessage = null;

      this.clearForm(); 
      this.loadEmployees();
      this.employeeForm.reset();
    },
    error: (err) => {
      console.error('Error saving employee:', err);
      this.errorMessage = 'Failed to save employee.';
      this.successMessage = null;
    }

  });

}

update(): void {


  const formValue = this.employeeForm.getRawValue(); 
  console.log('Form raw value (update):', formValue);

  const employeeDto: EmployeeDTO = this.mapFormToEmployeeDtoUpdate(formValue);
  console.log('Mapped EmployeeDTO (update):', employeeDto);

  this.employeeService.updateEmployee(employeeDto).subscribe({
    next: (res) => {
      console.log('Employee updated successfully:', res);
      console.log('Base64 image:', this.employeeForm.get('employeeImage')?.value);

      this.successMessage = 'Employee updated successfully!';
      this.errorMessage = null;

      this.clearForm(); 
      this.loadEmployees();
    },
    error: (err) => {
      console.error('Error updating employee:', err);
      this.errorMessage = 'Failed to update employee.';
      this.successMessage = null;
    }
  });
}



onSave(): void {

    if (!this.employeeForm.get('idDepartment')?.value || !this.employeeForm.get('idSection')?.value ) {
    this.errorMessage = 'Department and Section are required.';
    this.successMessage = null;
    return;
  }

  if (this.employeeForm.invalid) {
    return;
  }

  const formValue = this.employeeForm.getRawValue();

  if (!formValue.id) {
    this.add();
    return;
  }

  this.employeeService.getEmployeeById(this.idClient, formValue.id).subscribe({
    next: () => this.update(),
    error: (err) => {
      if (err.status === 404) {
        this.add();
      } else {
        console.error('Unexpected error:', err);
        alert('An unexpected error occurred while saving the employee.');
      }
    }
  });
}



deleteEmp(): void {
    if (!this.selectedEmployee){

      alert('Please Select employee to delete');
      return;
       
    } 
 
    if (confirm('Are you sure to delete ?')) {
      this.employeeService.deleteEmployee(
        this.idClient,
        this.selectedEmployee.id
      ).subscribe({
        next: () => {
          this.loadEmployees();
          alert('Employee Id : '+ this.selectedEmployee?.id + ' has been Deleted')
        },
        error: (err) => console.error(err)
      });
    }

  this.clearForm();
}

}

//--------------------------

// import { CommonModule } from '@angular/common';
// import { Component, OnInit } from '@angular/core';
// import { EmployeeDTO } from '../../Models/EmployeeDTO';
// import { EmployeeService } from '../../Services/employee.service';
// import { DropDownService } from '../../Services/dropDown.service';
// import { RouterModule } from '@angular/router';
// import { FormArray, FormBuilder,FormControl,FormGroup,FormsModule,ReactiveFormsModule,Validators} from '@angular/forms';
// import { DropDown } from '../../Models/DropDown';
// import { EmployeeDocumentDTO } from '../../Models/EmployeeDocumentDTO';
// import { EmployeeEducationInfoDTO } from '../../Models/EmployeeEducationInfoDTO';
// import { EmployeeFamilyInfoDTO } from '../../Models/EmployeeFamilyInfoDTO ';
// import { EmployeeProfessionalCertificationDTO } from '../../Models/EmployeeProfessionalCertificationDTO ';
// import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

// @Component({
//   selector: 'app-employee',
//   standalone: true,
//   imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule],
//   templateUrl: './employee.component.html',
//   styleUrl: './employee.component.css'
// })
// export class EmployeeComponent implements OnInit {
//   employees: EmployeeDTO[] = [];
//   selectedEmployee: EmployeeDTO | null = null;
//   employeeImageUrl: SafeUrl | null = null;

//   public employeeForm: FormGroup;
//   public idClient: number = 10001001;
//   isShowBtn:boolean = false;
//   departments: DropDown[] = [];
//   sections: any[] = [];
//   designations: any[] = [];
//   genders: any[] = [];
//   religions: any[] = [];
//   jobtyps: any[] = [];
//   employeeTypes: any[] = [];
//   weekoffs: any[] = [];
//   MaritalStatus: any[] = [];
//   EducationLevel: any[] = [];
//   educationExaminations: any[] = [];
//   educationResults: any[] = [];
//   relationship: any[] = [];
//   educations: EmployeeEducationInfoDTO[] = [];
//   family: EmployeeFamilyInfoDTO[] = [];
//   professionalCertification: EmployeeProfessionalCertificationDTO[] = [];

//   public employeeDto: EmployeeDTO;

//   constructor(
//     private employeeService: EmployeeService,
//     private dropdownService: DropDownService,
//     private fb: FormBuilder,
//     private sanitizer: DomSanitizer
//   ) {
//     this.employeeDto = new EmployeeDTO();
//     this.employeeForm = this.initForm();
//   }

//   ngOnInit(): void {

//     console.log("HRM System Running");

//     // /this.employeeForm.disable();
//     // this.employeeEducationInfo.disabled === true;
//     // this.employeeDocuments.disabled === true;
//     // this.employeeFamilyInfos.disabled === true;
//     // this.employeeProfessionalCertifications.disabled === true;

//     this.loadEmployees();
//     this.getDepartments(this.idClient);
//     this.getDesignation(this.idClient);
//     this.getJobType(this.idClient);
//     this.getGender(this.idClient);
//     this.getEmployeeType(this.idClient);
//     this.getReligion(this.idClient);
//     this.getRelationship(this.idClient);
//     this.getSection(this.idClient);
//     this.getWeekOff(this.idClient);
//     this.getMaritalStatus(this.idClient);
//     this.getEducationLevel(this.idClient);
//     this.getEducationResult(this.idClient);
//     this.getEducationExam(this.idClient);
//   }

//   initForm(): FormGroup {
//     return this.fb.group({
//       idClient: new FormControl(this.idClient),
//       id: new FormControl(0),
//       employeeName: new FormControl(),
//       employeeNameBangla: new FormControl(),
//       fatherName: new FormControl(),
//       motherName: new FormControl(),
//       idReportingManager: new FormControl(),
//       idJobType: new FormControl(),
//       idEmployeeType:new FormControl(),
//       birthDate: new FormControl(),
//       joiningDate: new FormControl(),
//       idGender: new FormControl(),
//       idReligion: new FormControl(),
//       idDepartment: new FormControl(this.employeeDto.idDepartment , Validators.required),
//       idSection: new FormControl(),
//       idDesignation: new FormControl(),
//       hasOvertime: new FormControl(),
//       hasAttendanceBonus: new FormControl(),
//       idWeekOff: new FormControl(),
//       nationalIdentificationNumber: new FormControl(),
//       contactNo: new FormControl(),
//       address: new FormControl(),
//       presentAddress: new FormControl(),
//       idMaritalStatus: new FormControl(),
//       createdBy: ['admin'],
//       isActive: [true],
//       employeeImage:new FormControl(),
//       employeeDocuments: this.fb.array([]),
//       employeeEducationInfos: this.fb.array([]),
//       employeeProfessionalCertifications: this.fb.array([]),
//       employeeFamilyInfos: this.fb.array([]),


//     });
//   }

//   get employeeDocuments(): FormArray {
//     return this.employeeForm.get('employeeDocuments') as FormArray;
//   }

//   get employeeEducationInfo(): FormArray {
//     return this.employeeForm.get('employeeEducationInfos') as FormArray;
//   }

//   get employeeProfessionalCertifications(): FormArray {
//   return this.employeeForm.get('employeeProfessionalCertifications') as FormArray;
//  }

//  get employeeFamilyInfos(): FormArray {
//   return this.employeeForm.get('employeeFamilyInfos') as FormArray;
// }


//   createDocumentForm(): FormGroup {
//     return this.fb.group({
//       idClient: [this.idClient],
//       id: [0],
//       idEmployee: [0],
//       documentName: [''],
//       fileName: [''],
//       uploadedFileExtention: [''],
//       uploadDate: [new Date()],
//       setDate: [new Date()],
//       createdBy: ['admin'],
//       uploadedFile: new FormControl()
//     });
//   }

//   addDocument(): void {
//   const docs = this.employeeDocuments;
//   docs.push(this.createDocumentForm());
// }

//   removeDocument(index: number): void {
//     this.employeeDocuments.removeAt(index);
//   }


//  createEducationInfoForm(): FormGroup {
//   return this.fb.group({
//     idClient: [this.idClient],
//     idEducationLevel: [null],
//     idEducationExamination: [null],
//     idEducationResult: [null],
//     cgpa: [null],
//     examScale: [null],
//     marks: [null],
//     major: [''],
//     passingYear: [null],
//     instituteName: [''],
//     isForeignInstitute: [null],
//     duration: [null],
//     achievement: [''],
//     setDate: [new Date()],
//     createdBy: ['admin']
//     // educationLevelName: [''],
//     // examinationName: [''],
//     // resultName: ['']
//   });
// }

//   addEducationInfo(): void {
//   const ems = this.employeeEducationInfo;
//   ems.push(this.createEducationInfoForm());
// }

//   removeEducationInfo(index: number): void {
//     this.employeeEducationInfo.removeAt(index);
//   }

//   createEmployeeProfessionalCertificationsForm(): FormGroup {
//   return this.fb.group({
//     idClient: [this.idClient],
//     id: [0],
//     idEmployee: [0],
//     certificationTitle: [''],
//     certificationInstitute: [''],
//     instituteLocation: [''],
//     fromDate: [null],
//     toDate: [null],
//     setDate: [new Date()],
//     createdBy: ['admin']
//   });
// }


// addProfessionalCertification(): void {
//   this.employeeProfessionalCertifications
//   .push(this.createEmployeeProfessionalCertificationsForm());
// }

// removeemployeeProfessionalCertifications(index: number): void {
//     this.employeeProfessionalCertifications.removeAt(index);
//   }

//   createEmployeeFamilyInfoForm(): FormGroup {
//   return this.fb.group({
//     idClient: [this.idClient],
//     id: [0],
//     idEmployee: [0],
//     name: [''],
//     idGender: [null],
//     idRelationship: [null],
//     dateOfBirth: [null],
//     contactNo: [''],
//     currentAddress: [''],
//     permanentAddress: [''],
//     setDate: [new Date()],
//     createdBy: ['admin']
//   });
// }

// addFamilyInfo(): void {
//   this.employeeFamilyInfos.push(this.createEmployeeFamilyInfoForm());
// }

// removeFamilyInfo(index: number): void {
//   this.employeeFamilyInfos.removeAt(index);
// }



//   clearForm(): void {
//     this.employeeForm.reset();
//     this.employeeEducationInfo.clear(); 
//     this.employeeDocuments.clear(); 
//     this.employeeProfessionalCertifications.clear(); 
//     this.employeeFamilyInfos.clear(); 
//    // this.employeeImageUrl
    
//   }

//   loadEmployees(): void {
//     this.employeeService.getAllEmployees(this.idClient).subscribe(data => {
//       this.employees = data;
//     });
//   }

//   loadEmployeeToForm(emp: EmployeeDTO): void {
//     this.selectedEmployee = emp;

//     this.employeeService.getEmployeeById(this.idClient, emp.id).subscribe({
//       next: (data) => {
//         const employeeData = data as EmployeeDTO;
//         this.employeeForm.patchValue({
//           ...employeeData,
//           birthDate: this.formatDateToInput(employeeData.birthDate),
//           joiningDate: this.formatDateToInput(employeeData.joiningDate),
//           hasOvertime: employeeData.hasOvertime ?? false,
//           hasAttendanceBonus: employeeData.hasAttendenceBonus ?? false,
//           isActive: employeeData.isActive ?? true
//         });

//         // Reset FormArrays
//         this.employeeDocuments.clear();
//         (employeeData.employeeDocuments || []).forEach(doc => {
//           this.employeeDocuments.push(this.fb.group(doc));
//         });

//         this.employeeEducationInfo.clear();
//         (employeeData.employeeEducationInfos || []).forEach(edu => {
//           const eduForm = this.createEducationInfoForm();
//           eduForm.patchValue(edu);
//           this.employeeEducationInfo.push(eduForm);
//         });

//         this.employeeProfessionalCertifications.clear();
//         (employeeData.employeeProfessionalCertifications || []).forEach(cert => {
//           const certForm = this.createEmployeeProfessionalCertificationsForm();
//           certForm.patchValue(cert);
//           this.employeeProfessionalCertifications.push(certForm);
//         });

//         this.employeeFamilyInfos.clear();
//         (employeeData.employeeFamilyInfos || []).forEach(fam => {
//           const famForm = this.createEmployeeFamilyInfoForm();
//           famForm.patchValue(fam);
//           this.employeeFamilyInfos.push(famForm);
//         });


//         this.educations = employeeData.employeeEducationInfos ?? [];
//         this.family = employeeData.employeeFamilyInfos ?? [];
//         this.professionalCertification = employeeData.employeeProfessionalCertifications ?? [];
//       },
//       error: (error) => {
//         console.error('Error loading employee:', error);
//       }
//     });
//   }

//   loadEmployeeImageToForm(emp: EmployeeDTO): void {
//     this.selectedEmployee = emp;

//     this.employeeService.getEmployeeImage(this.idClient, emp.id).subscribe({
//       next: (blob: Blob) => {
//         const objectURL = URL.createObjectURL(blob);
//         this.employeeImageUrl = this.sanitizer.bypassSecurityTrustUrl(objectURL);
//       },
//       error: (error) => {
//         console.error('Error loading image:', error);
//       }
//     });
//   }

//   formatDateToInput(date: any): string {
//     if (!date) return '';
//     const d = new Date(date);
//     const offset = d.getTimezoneOffset();
//     const localDate = new Date(d.getTime() - offset * 60000);
//     return localDate.toISOString().split('T')[0];
//   }

//   // Dropdown loaders
//   getDepartments(idClient: number): void {
//     this.dropdownService.getDepartmentDropdown(idClient).subscribe({
//       next: data => this.departments = data
//     });
//   }

//   getDesignation(idClient: number): void {
//     this.dropdownService.getDesignationDropdown(idClient).subscribe({
//       next: data => this.designations = data
//     });
//   }

//   getJobType(idClient: number): void {
//     this.dropdownService.getJobTypeDropDown(idClient).subscribe({
//       next: data => this.jobtyps = data
//     });
//   }

//   getGender(idClient: number): void {
//     this.dropdownService.getGenderDropDown(idClient).subscribe({
//       next: data => this.genders = data
//     });
//   }

//   getEmployeeType(idClient: number): void {
//     this.dropdownService.getEmployueeTypesDropDown(idClient).subscribe({
//       next: data => this.employeeTypes = data
//     });
//   }

//   getReligion(idClient: number): void {
//     this.dropdownService.getReligionDropDown(idClient).subscribe({
//       next: data => this.religions = data
//     });
//   }

//   getSection(idClient: number): void {
//     this.dropdownService.getSectionDropDown(idClient).subscribe({
//       next: data => this.sections = data
//     });
//   }

//   getWeekOff(idClient: number): void {
//     this.dropdownService.getWeekOffDropDown(idClient).subscribe({
//       next: data => this.weekoffs = data
//     });
//   }

//   getMaritalStatus(idClient: number): void {
//     this.dropdownService.getMaritalStatusDropDown(idClient).subscribe({
//       next: data => this.MaritalStatus = data
//     });
//   }

//   getEducationLevel(idClient: number): void {
//     this.dropdownService.getEducationLevelDropDown(idClient).subscribe({
//       next: data => this.EducationLevel = data
//     });
//   }

//   getEducationExam(idClient: number): void {
//     this.dropdownService.getEducationexaminationDropDown(idClient).subscribe({
//       next: data => this.educationExaminations = data
//     });
//   }

//    getEducationResult(idClient: number): void {
//     this.dropdownService.getEducationResultDropDown(idClient).subscribe({
//       next: data => this.educationResults = data
//     });
//   }

//   getRelationship(idClient: number): void {
//     this.dropdownService.getRelationshipdownDropDown(idClient).subscribe({
//       next: data => this.relationship = data
//     });
//   }

//  updateDocumentFile(doc: EmployeeDocumentDTO, file: File): void {
//   const reader = new FileReader();

//   reader.onload = () => {
//     doc.uploadedFile = reader.result as string; 
//     doc.fileName = file.name;
//     doc.uploadedFileExtention = file.name.split('.').pop() || '';
//     doc.uploadDate = new Date();

//     const index = this.employeeDocuments.controls.findIndex(group => group.value === doc);
//     if (index !== -1) {
//       this.employeeDocuments.at(index).patchValue(doc);
//     }
//   };

//   reader.readAsDataURL(file); 
// }



// onDocFileChange(event: any, index: number): void {
//   const file = event.target.files[0];
//   if (file) {
//     const reader = new FileReader(); 
//     reader.onload = () => {
//       const base64String = (reader.result as string).split(',')[1];
//       const fileName = file.name;
//       const fileExtension = file.name.split('.').pop();

//       const documentsFormArray = this.employeeForm.get('employeeDocuments') as FormArray;
//       const docFormGroup = documentsFormArray.at(index) as FormGroup;

//       docFormGroup.patchValue({
//         uploadedFile: base64String,
//         fileName: fileName,
//         uploadedFileExtention: fileExtension
//       });
//     };
//     reader.readAsDataURL(file);
//   }
// }


//  onFileSelected(event: Event, index: number): void {
//   const input = event.target as HTMLInputElement;

//   if (input.files && input.files.length > 0) {    const file = input.files[0];
//     const docFormGroup = this.employeeDocuments.at(index);
//     const doc: EmployeeDocumentDTO = docFormGroup.value;

//     this.updateDocumentFile(doc, file);
//   }
// }




// // add(): void {
// //   if (this.employeeForm.invalid) {
// //     console.warn('Form is invalid');
// //     return;
// //   }

// //   this.employeeForm.enable(); // temporarily enable if any part is disabled

// //   const formValue = this.employeeForm.getRawValue();
// //   console.log('form value', formValue);

// //   const employeeDto = new EmployeeDTO({
// //     ...formValue,
// //     employeeDocuments: formValue.employeeDocuments || [],
// //     employeeEducationInfos: formValue.employeeEducationInfos || [],
// //     employeeProfessionalCertifications: formValue.employeeProfessionalCertifications || [],
// //     employeeFamilyInfos: formValue.employeeFamilyInfos || []
// //   });

// //   this.employeeService.createEmployee(employeeDto).subscribe({
// //     next: (res) => {
// //       console.log('mployee saved successfully:', res);
// //       alert('Employee saved successfully!');
// //       this.clearForm(); 
// //       this.employeeForm.disable(); 
// //     },
// //     error: (err) => {
// //       console.error('Error saving employee:', err);
// //       alert('Failed to save employee.');
// //     }
// //   });
// // }

// private mapFormToEmployeeDto(formValue: any): EmployeeDTO {
//   const formatDate = (date: Date | string | null | undefined): string | undefined => {
//     if (!date) return undefined;
//     const d = new Date(date);
//     const pad = (n: number, z = 2) => ('00' + n).slice(-z);
//     const ms = ('0000000' + d.getMilliseconds() * 10000).slice(-7);
//     return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}.${ms}`;
//   };

//   return {
//     idClient: formValue.idClient,
//     id: formValue.id,
//     employeeName: formValue.employeeName,
//     employeeNameBangla: formValue.employeeNameBangla,
//     fatherName: formValue.fatherName,
//     motherName: formValue.motherName,
//     idReportingManager: formValue.idReportingManager,
//     idJobType: formValue.idJobType,
//     idEmployeeType: formValue.idEmployeeType,
//     //birthDate: formatDate(formValue.birthDate),
//     //joiningDate: formatDate(formValue.joiningDate),

//     birthDate: formValue.birthDate ? new Date(formValue.birthDate) : undefined,
//     joiningDate: formValue.joiningDate ? new Date(formValue.joiningDate) : undefined,
//     idGender: formValue.idGender,
//     idReligion: formValue.idReligion,
//     idDepartment: +formValue.idDepartment, // ensure number
//     idSection: +formValue.idSection,       // ensure number
//     idDesignation: formValue.idDesignation,
//     hasOvertime: formValue.hasOvertime ?? false,
//     hasAttendenceBonus: formValue.hasAttendanceBonus ?? false,
//     idWeekOff: formValue.idWeekOff,
//     address: formValue.address,
//     presentAddress: formValue.presentAddress,
//     nationalIdentificationNumber: formValue.nationalIdentificationNumber,
//     contactNo: formValue.contactNo,
//     idMaritalStatus: formValue.idMaritalStatus,
//     isActive: formValue.isActive ?? true,
//    // setDate: formatDate(new Date()),
//     createdBy: formValue.createdBy ?? 'admin',
//     departmentName: undefined,
//     designation: undefined,
//     employeeDocuments: formValue.employeeDocuments || [],
//     employeeEducationInfos: formValue.employeeEducationInfos || [],
//     employeeProfessionalCertifications: formValue.employeeProfessionalCertifications || [],
//     employeeFamilyInfos: formValue.employeeFamilyInfos || [],
//     employeeImage: formValue.employeeImage
//   };
// }

// onFileChange(event: any): void {
//   const file = event.target.files[0];
//   if (file) {
//     const reader = new FileReader(); 
//     reader.onload = () => {
//       const base64String = (reader.result as string).split(',')[1];
//       this.employeeForm.patchValue({
//         employeeImage: base64String
//       });
//     };
//     reader.readAsDataURL(file);
//   }
// }

// // add(): void {

// //   this.employeeForm.enable(); // temporarily enable to access values

// //   const formValue = this.employeeForm.getRawValue();
// //   console.log('Form raw value:', formValue);

// //   const employeeDto: EmployeeDTO = this.mapFormToEmployeeDto(formValue);
// //   console.log('Mapped EmployeeDTO:', employeeDto);

// //   this.employeeService.createEmployee(employeeDto).subscribe({
// //     next: (res) => {
// //       console.log('Employee saved successfully:', res);
// //       alert('Employee saved successfully!');
// //       this.clearForm();
// //       this.employeeForm.disable();
// //     },
// //     error: (err) => {
// //       console.error('Error saving employee:', err);
// //       alert('Failed to save employee.');
// //     }
// //   });
// //   this.employeeForm.enable();
// //   this. clearForm();
// //   this.loadEmployees();
// // }
// add(): void {
//   const formValue = this.employeeForm.getRawValue(); // no need to enable/disable
//   console.log('Form raw value:', formValue);

//   const employeeDto: EmployeeDTO = this.mapFormToEmployeeDto(formValue);
//   console.log('Mapped EmployeeDTO:', employeeDto);

//   this.employeeService.createEmployee(employeeDto).subscribe({
//     next: (res) => {
//       console.log('Employee saved successfully:', res);
//       console.log('Base64 image:', this.employeeForm.get('empImg')?.value);
//       alert('Employee saved successfully!');
//       this.clearForm();
//       this.loadEmployees();
//     },
//     error: (err) => {
//       console.error('Error saving employee:', err);
//       alert('Failed to save employee.');
//     }
//   });
// }

// update(): void {
//   const formValue = this.employeeForm.getRawValue(); 
//   console.log('Form raw value (update):', formValue);

//   const employeeDto: EmployeeDTO = this.mapFormToEmployeeDto(formValue);
//   console.log('Mapped EmployeeDTO (update):', employeeDto);

//   this.employeeService.updateEmployee(employeeDto).subscribe({
//     next: (res) => {
//       console.log('Employee updated successfully:', res);
//       console.log('Base64 image:', this.employeeForm.get('employeeImage')?.value); 
//       alert('Employee updated successfully!');
//       this.clearForm();     // clear the form
//       this.loadEmployees(); // reload employee list
//     },
//     error: (err) => {
//       console.error('Error updating employee:', err);
//       alert('Failed to update employee.');
//     }
//   });
// }


// // delete(idClient: number, id: number): void {
// //   if (!confirm('Are you sure you want to hide this employee?')) return;

// //   this.employeeService.deleteEmployee(idClient, id).subscribe({
// //     next: (res) => {
// //       console.log('Hide response:', res);
// //       alert('Employee hidden successfully!');
// //       this.loadEmployees(); // reload the list
// //     },
// //     error: (err) => {
// //       console.error('Error hiding employee:', err);
// //       alert('Failed to hide employee.');
// //     }
// //   });
// // }

// deleteEmp(): void {
//     if (!this.selectedEmployee){

//       alert('Please Select employee to delete');
//       return;
       
//     } 
 
//     if (confirm('Are you sure to delete ?')) {
//       this.employeeService.deleteEmployee(
//         this.idClient,
//         this.selectedEmployee.id
//       ).subscribe({
//         next: () => {
//           this.loadEmployees();
//           alert('Employee Id : '+ this.selectedEmployee?.id + ' has been Deleted')
//         },
//         error: (err) => console.error(err)
//       });
//     }


// }
//   addClick():void{
//      this.employeeForm.reset();
//      this.employeeForm.enable();
//      this.employeeEducationInfo.clear(); 
//      this.employeeDocuments.clear(); 
//      this.employeeProfessionalCertifications.clear(); 
//      this.employeeFamilyInfos.clear(); 
//      this.isShowBtn = true;
// }
//  editClick():void{
//    this.employeeForm.enable();
//    this.isShowBtn =true
//  }

//   cancelClick():void{
//     this.isShowBtn = false;
//     this.employeeForm.disable();
//     //this.clearForm();
  

//   }

//  disbaleFormOnload():void{
  
//   this.employeeForm.disable();
// }



// }


// import { CommonModule } from '@angular/common';
// import { Component, OnInit } from '@angular/core';
// import { EmployeeDTO } from '../../Models/EmployeeDTO';
// import { EmployeeService } from '../../Services/employee.service';
// import { DropDownService } from '../../Services/dropDown.service';
// import { RouterModule } from '@angular/router';
// import { FormArray, FormBuilder,FormControl,FormGroup,FormsModule,ReactiveFormsModule,Validators} from '@angular/forms';
// import { DropDown } from '../../Models/DropDown';
// import { EmployeeDocumentDTO } from '../../Models/EmployeeDocumentDTO';
// import { EmployeeEducationInfoDTO } from '../../Models/EmployeeEducationInfoDTO';
// import { EmployeeFamilyInfoDTO } from '../../Models/EmployeeFamilyInfoDTO ';
// import { EmployeeProfessionalCertificationDTO } from '../../Models/EmployeeProfessionalCertificationDTO ';
// import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

// @Component({
//   selector: 'app-employee',
//   standalone: true,
//   imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule],
//   templateUrl: './employee.component.html',
//   styleUrl: './employee.component.css'
// })
// export class EmployeeComponent implements OnInit {
//   employees: EmployeeDTO[] = [];
//   selectedEmployee: EmployeeDTO | null = null;
//   employeeImageUrl: SafeUrl | null = null;

//   public employeeForm: FormGroup;
//   public idClient: number = 10001001;
//   isShowBtn:boolean = false;

//   departments: DropDown[] = [];
//   sections: any[] = [];
//   designations: any[] = [];
//   genders: any[] = [];
//   religions: any[] = [];
//   jobtyps: any[] = [];
//   employeeTypes: any[] = [];
//   weekoffs: any[] = [];
//   MaritalStatus: any[] = [];
//   EducationLevel: any[] = [];
//   educationExaminations: any[] = [];
//   educationResults: any[] = [];
//   relationship: any[] = [];
//   educations: EmployeeEducationInfoDTO[] = [];
//   family: EmployeeFamilyInfoDTO[] = [];
//   professionalCertification: EmployeeProfessionalCertificationDTO[] = [];

//   public employeeDto: EmployeeDTO;

//   constructor(
//     private employeeService: EmployeeService,
//     private dropdownService: DropDownService,
//     private fb: FormBuilder,
//     private sanitizer: DomSanitizer
//   ) {
//     this.employeeDto = new EmployeeDTO();
//     this.employeeForm = this.initForm();
//   }

//   ngOnInit(): void {

//     console.log("HRM System Running");

//     // /this.employeeForm.disable();
//     // this.employeeEducationInfo.disabled === true;
//     // this.employeeDocuments.disabled === true;
//     // this.employeeFamilyInfos.disabled === true;
//     // this.employeeProfessionalCertifications.disabled === true;

//     this.loadEmployees();
//     this.getDepartments(this.idClient);
//     this.getDesignation(this.idClient);
//     this.getJobType(this.idClient);
//     this.getGender(this.idClient);
//     this.getEmployeeType(this.idClient);
//     this.getReligion(this.idClient);
//     this.getRelationship(this.idClient);
//     this.getSection(this.idClient);
//     this.getWeekOff(this.idClient);
//     this.getMaritalStatus(this.idClient);
//     this.getEducationLevel(this.idClient);
//     this.getEducationResult(this.idClient);
//     this.getEducationExam(this.idClient);
//   }

//   initForm(): FormGroup {
//     return this.fb.group({
//       idClient: new FormControl(this.idClient),
//       id: new FormControl(0),
//       employeeName: new FormControl(),
//       employeeNameBangla: new FormControl(),
//       fatherName: new FormControl(),
//       motherName: new FormControl(),
//       idReportingManager: new FormControl(),
//       idJobType: new FormControl(),
//       idEmployeeType:new FormControl(),
//       birthDate: new FormControl(),
//       joiningDate: new FormControl(),
//       idGender: new FormControl(),
//       idReligion: new FormControl(),
//       idDepartment: new FormControl(),
//       idSection: new FormControl(),
//       idDesignation: new FormControl(),
//       hasOvertime: new FormControl(),
//       hasAttendanceBonus: new FormControl(),
//       idWeekOff: new FormControl(),
//       nationalIdentificationNumber: new FormControl(),
//       contactNo: new FormControl(),
//       address: new FormControl(),
//       presentAddress: new FormControl(),
//       idMaritalStatus: new FormControl(),
//       createdBy: ['admin'],
//       isActive: [true],
//       employeeImage:new FormControl(),
//       employeeDocuments: this.fb.array([]),
//       employeeEducationInfos: this.fb.array([]),
//       employeeProfessionalCertifications: this.fb.array([]),
//       employeeFamilyInfos: this.fb.array([]),


//     });
//   }

//   get employeeDocuments(): FormArray {
//     return this.employeeForm.get('employeeDocuments') as FormArray;
//   }

//   get employeeEducationInfo(): FormArray {
//     return this.employeeForm.get('employeeEducationInfos') as FormArray;
//   }

//   get employeeProfessionalCertifications(): FormArray {
//   return this.employeeForm.get('employeeProfessionalCertifications') as FormArray;
//  }

//  get employeeFamilyInfos(): FormArray {
//   return this.employeeForm.get('employeeFamilyInfos') as FormArray;
// }


//   createDocumentForm(): FormGroup {
//     return this.fb.group({
//       idClient: [this.idClient],
//       id: [0],
//       idEmployee: [0],
//       documentName: [''],
//       fileName: [''],
//       uploadedFileExtention: [''],
//       uploadDate: [new Date()],
//       setDate: [new Date()],
//       createdBy: ['admin'],
//       uploadedFile:[new Date()],
//     });
//   }

//   addDocument(): void {
//   const docs = this.employeeDocuments;
//   docs.push(this.createDocumentForm());
// }

//   removeDocument(index: number): void {
//     this.employeeDocuments.removeAt(index);
//   }


//  createEducationInfoForm(): FormGroup {
//   return this.fb.group({
//     idClient: [this.idClient],
//     id: [0],
//     idEducationLevel: [null],
//     idEducationExamination: [null],
//     idEducationResult: [null],
//     cgpa: [null],
//     examScale: [null],
//     marks: [null],
//     major: [''],
//     passingYear: [null],
//     instituteName: [''],
//     isForeignInstitute: [null],
//     duration: [null],
//     achievement: [''],
//     setDate: [new Date()],
//     createdBy: ['admin']
//     // educationLevelName: [''],
//     // examinationName: [''],
//     // resultName: ['']
//   });
// }

//   addEducationInfo(): void {
//   const ems = this.employeeEducationInfo;
//   ems.push(this.createEducationInfoForm());
// }

//   removeEducationInfo(index: number): void {
//     this.employeeEducationInfo.removeAt(index);
//   }

//   createEmployeeProfessionalCertificationsForm(): FormGroup {
//   return this.fb.group({
//     idClient: [this.idClient],
//     id: [0],
//     idEmployee: [0],
//     certificationTitle: [''],
//     certificationInstitute: [''],
//     instituteLocation: [''],
//     fromDate: [null],
//     toDate: [null],
//     setDate: [new Date()],
//     createdBy: ['admin']
//   });
// }


// addProfessionalCertification(): void {
//   this.employeeProfessionalCertifications
//   .push(this.createEmployeeProfessionalCertificationsForm());
// }

// removeemployeeProfessionalCertifications(index: number): void {
//     this.employeeProfessionalCertifications.removeAt(index);
//   }

//   createEmployeeFamilyInfoForm(): FormGroup {
//   return this.fb.group({
//     idClient: [this.idClient],
//     id: [0],
//     idEmployee: [0],
//     name: [''],
//     idGender: [null],
//     idRelationship: [null],
//     dateOfBirth: [null],
//     contactNo: [''],
//     currentAddress: [''],
//     permanentAddress: [''],
//     setDate: [new Date()],
//     createdBy: ['admin']
//   });
// }

// addFamilyInfo(): void {
//   this.employeeFamilyInfos.push(this.createEmployeeFamilyInfoForm());
// }

// removeFamilyInfo(index: number): void {
//   this.employeeFamilyInfos.removeAt(index);
// }



//   clearForm(): void {
//     this.employeeForm.reset();
//     this.employeeEducationInfo.clear(); 
//     this.employeeDocuments.clear(); 
//     this.employeeProfessionalCertifications.clear(); 
//     this.employeeFamilyInfos.clear(); 
//    // this.employeeImageUrl
    
//   }

//   loadEmployees(): void {
//     this.employeeService.getAllEmployees(this.idClient).subscribe(data => {
//       this.employees = data;
//       this.employeeForm.disable();

//     });
//   }

//   loadEmployeeToForm(emp: EmployeeDTO): void {
//     this.selectedEmployee = emp;

//     this.employeeService.getEmployeeById(this.idClient, emp.id).subscribe({
//       next: (data) => {
//         const employeeData = data as EmployeeDTO;
//         this.employeeForm.patchValue({
//           ...employeeData,
//            id: employeeData.id, 
//           idClient: this.idClient, 
//           birthDate: this.formatDateToInput(employeeData.birthDate),
//           joiningDate: this.formatDateToInput(employeeData.joiningDate),
//           hasOvertime: employeeData.hasOvertime ?? false,
//           hasAttendanceBonus: employeeData.hasAttendenceBonus ?? false,
//           isActive: employeeData.isActive ?? true
//         });

//         // Reset FormArrays
//         this.employeeDocuments.clear();
//         (employeeData.employeeDocuments || []).forEach(doc => {
//           this.employeeDocuments.push(this.fb.group(doc));
//         });

//         this.employeeEducationInfo.clear();
//         (employeeData.employeeEducationInfos || []).forEach(edu => {
//           const eduForm = this.createEducationInfoForm();
//           eduForm.patchValue(edu);
//           this.employeeEducationInfo.push(eduForm);
//         });

//         this.employeeProfessionalCertifications.clear();
//         (employeeData.employeeProfessionalCertifications || []).forEach(cert => {
//           const certForm = this.createEmployeeProfessionalCertificationsForm();
//           certForm.patchValue(cert);
//           this.employeeProfessionalCertifications.push(certForm);
//         });

//         this.employeeFamilyInfos.clear();
//         (employeeData.employeeFamilyInfos || []).forEach(fam => {
//           const famForm = this.createEmployeeFamilyInfoForm();
//           famForm.patchValue(fam);
//           this.employeeFamilyInfos.push(famForm);
//         });


//         this.educations = employeeData.employeeEducationInfos ?? [];
//         this.family = employeeData.employeeFamilyInfos ?? [];
//         this.professionalCertification = employeeData.employeeProfessionalCertifications ?? [];
//        this.employeeForm.disable({ emitEvent: false });
//       },
//       error: (error) => {
//         console.error('Error loading employee:', error);
//       }
//     });

//     // console.log());

//   }

//   loadEmployeeImageToForm(emp: EmployeeDTO): void {
//     this.selectedEmployee = emp;

//     this.employeeService.getEmployeeImage(this.idClient, emp.id).subscribe({
//       next: (blob: Blob) => {
//         const objectURL = URL.createObjectURL(blob);
//         this.employeeImageUrl = this.sanitizer.bypassSecurityTrustUrl(objectURL);
//       },
//       error: (error) => {
//         console.error('Error loading image:', error);
//       }
//     });
//   }

//   formatDateToInput(date: any): string {
//     if (!date) return '';
//     const d = new Date(date);
//     const offset = d.getTimezoneOffset();
//     const localDate = new Date(d.getTime() - offset * 60000);
//     return localDate.toISOString().split('T')[0];
//   }

//   // Dropdown loaders
//   getDepartments(idClient: number): void {
//     this.dropdownService.getDepartmentDropdown(idClient).subscribe({
//       next: data => this.departments = data
//     });
//   }

//   getDesignation(idClient: number): void {
//     this.dropdownService.getDesignationDropdown(idClient).subscribe({
//       next: data => this.designations = data
//     });
//   }

//   getJobType(idClient: number): void {
//     this.dropdownService.getJobTypeDropDown(idClient).subscribe({
//       next: data => this.jobtyps = data
//     });
//   }

//   getGender(idClient: number): void {
//     this.dropdownService.getGenderDropDown(idClient).subscribe({
//       next: data => this.genders = data
//     });
//   }

//   getEmployeeType(idClient: number): void {
//     this.dropdownService.getEmployueeTypesDropDown(idClient).subscribe({
//       next: data => this.employeeTypes = data
//     });
//   }

//   getReligion(idClient: number): void {
//     this.dropdownService.getReligionDropDown(idClient).subscribe({
//       next: data => this.religions = data
//     });
//   }

//   getSection(idClient: number): void {
//     this.dropdownService.getSectionDropDown(idClient).subscribe({
//       next: data => this.sections = data
//     });
//   }

//   getWeekOff(idClient: number): void {
//     this.dropdownService.getWeekOffDropDown(idClient).subscribe({
//       next: data => this.weekoffs = data
//     });
//   }

//   getMaritalStatus(idClient: number): void {
//     this.dropdownService.getMaritalStatusDropDown(idClient).subscribe({
//       next: data => this.MaritalStatus = data
//     });
//   }

//   getEducationLevel(idClient: number): void {
//     this.dropdownService.getEducationLevelDropDown(idClient).subscribe({
//       next: data => this.EducationLevel = data
//     });
//   }

//   getEducationExam(idClient: number): void {
//     this.dropdownService.getEducationexaminationDropDown(idClient).subscribe({
//       next: data => this.educationExaminations = data
//     });
//   }

//    getEducationResult(idClient: number): void {
//     this.dropdownService.getEducationResultDropDown(idClient).subscribe({
//       next: data => this.educationResults = data
//     });
//   }

//   getRelationship(idClient: number): void {
//     this.dropdownService.getRelationshipdownDropDown(idClient).subscribe({
//       next: data => this.relationship = data
//     });
//   }

//  updateDocumentFile(doc: EmployeeDocumentDTO, file: File): void {
//   const reader = new FileReader();

//   reader.onload = () => {
//     doc.uploadedFile = reader.result as string; 
//     doc.fileName = file.name;
//     doc.uploadedFileExtention = file.name.split('.').pop() || '';
//     doc.uploadDate = new Date();

//     const index = this.employeeDocuments.controls.findIndex(group => group.value === doc);
//     if (index !== -1) {
//       this.employeeDocuments.at(index).patchValue(doc);
//     }
//   };

//   reader.readAsDataURL(file); 
// }



// onDocFileChange(event: any, index: number): void {
//   const file = event.target.files[0];
//   if (file) {
//     const reader = new FileReader(); 
//     reader.onload = () => {
//       const base64String = (reader.result as string).split(',')[1];
//       const fileName = file.name;
//       const fileExtension = file.name.split('.').pop();

//       const documentsFormArray = this.employeeForm.get('employeeDocuments') as FormArray;
//       const docFormGroup = documentsFormArray.at(index) as FormGroup;

//       docFormGroup.patchValue({
//         uploadedFile: base64String,
//         fileName: fileName,
//         uploadedFileExtention: fileExtension
//       });
//     };
//     reader.readAsDataURL(file);
//   }
// }


//  onFileSelected(event: Event, index: number): void {
//   const input = event.target as HTMLInputElement;

//   if (input.files && input.files.length > 0) {    const file = input.files[0];
//     const docFormGroup = this.employeeDocuments.at(index);
//     const doc: EmployeeDocumentDTO = docFormGroup.value;

//     this.updateDocumentFile(doc, file);
//   }
// }




// // add(): void {
// //   if (this.employeeForm.invalid) {
// //     console.warn('Form is invalid');
// //     return;
// //   }

// //   this.employeeForm.enable(); // temporarily enable if any part is disabled

// //   const formValue = this.employeeForm.getRawValue();
// //   console.log('form value', formValue);

// //   const employeeDto = new EmployeeDTO({
// //     ...formValue,
// //     employeeDocuments: formValue.employeeDocuments || [],
// //     employeeEducationInfos: formValue.employeeEducationInfos || [],
// //     employeeProfessionalCertifications: formValue.employeeProfessionalCertifications || [],
// //     employeeFamilyInfos: formValue.employeeFamilyInfos || []
// //   });

// //   this.employeeService.createEmployee(employeeDto).subscribe({
// //     next: (res) => {
// //       console.log('mployee saved successfully:', res);
// //       alert('Employee saved successfully!');
// //       this.clearForm(); 
// //       this.employeeForm.disable(); 
// //     },
// //     error: (err) => {
// //       console.error('Error saving employee:', err);
// //       alert('Failed to save employee.');
// //     }
// //   });
// // }

// private mapFormToEmployeeDto(formValue: any): EmployeeDTO {
//   const formatDate = (date: Date | string | null | undefined): string | undefined => {
//     if (!date) return undefined;
//     const d = new Date(date);
//     const pad = (n: number, z = 2) => ('00' + n).slice(-z);
//     const ms = ('0000000' + d.getMilliseconds() * 10000).slice(-7);
//     return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}.${ms}`;
//   };

//   return {
//     idClient: formValue.idClient,
//     id: formValue.id,
//     employeeName: formValue.employeeName,
//     employeeNameBangla: formValue.employeeNameBangla,
//     fatherName: formValue.fatherName,
//     motherName: formValue.motherName,
//     idReportingManager: formValue.idReportingManager,
//     idJobType: formValue.idJobType,
//     idEmployeeType: formValue.idEmployeeType,
//     //birthDate: formatDate(formValue.birthDate),
//     //joiningDate: formatDate(formValue.joiningDate),
//     // birthDate: formValue.birthDate ? new Date(formValue.birthDate) : undefined,
//     // joiningDate: formValue.joiningDate ? new Date(formValue.joiningDate) : undefined,
//     idGender: formValue.idGender,
//     idReligion: formValue.idReligion,
//     idDepartment: +formValue.idDepartment, 
//     idSection: +formValue.idSection, 
//     idDesignation: formValue.idDesignation,
//     hasOvertime: formValue.hasOvertime ?? false,
//     hasAttendenceBonus: formValue.hasAttendanceBonus ?? false,
//     idWeekOff: formValue.idWeekOff,
//     address: formValue.address,
//     presentAddress: formValue.presentAddress,
//     nationalIdentificationNumber: formValue.nationalIdentificationNumber,
//     contactNo: formValue.contactNo,
//     idMaritalStatus: formValue.idMaritalStatus,
//     isActive: formValue.isActive ?? true,
//    // setDate: formatDate(new Date()),
//     createdBy: formValue.createdBy ?? 'admin',
//     departmentName: undefined,
//     designation: undefined,
//     employeeDocuments: formValue.employeeDocuments || [],
//     employeeEducationInfos: formValue.employeeEducationInfos || [],
//     employeeProfessionalCertifications: formValue.employeeProfessionalCertifications || [],
//     employeeFamilyInfos: formValue.employeeFamilyInfos || [],
//     employeeImage: formValue.employeeImage
    
//   };
// }

// onFileChange(event: any): void {
//   const file = event.target.files[0];
//   if (file) {
//     const reader = new FileReader(); 
//     reader.onload = () => {
//       const base64String = (reader.result as string).split(',')[1];
//       this.employeeForm.patchValue({
//         employeeImage: base64String
//       });
//     };
//     reader.readAsDataURL(file);
//   }
// }


// successMessage: string | null = null;
// errorMessage: string | null = null;

// add(): void {

//   if (!this.employeeForm.get('idDepartment')?.value || !this.employeeForm.get('idSection')?.value) {
//     this.errorMessage = 'Department and Section are required.';
//     this.successMessage = null;
//     return;
//   }
//   const formValue = this.employeeForm.getRawValue();
//   console.log('Form raw value:', formValue);

//   const employeeDto: EmployeeDTO = this.mapFormToEmployeeDto(formValue);
//   console.log('Mapped EmployeeDTO:', employeeDto);


//   this.employeeService.createEmployee(employeeDto).subscribe({
//     next: (res) => {
//       console.log('Employee saved successfully:', res);
//       console.log('Base64 image:', this.employeeForm.get('employeeImage')?.value);

//       this.successMessage = 'Employee saved successfully!';
//       this.errorMessage = null;

//       this.clearForm(); 
//       this.loadEmployees();
//       this.employeeForm.reset();
//     },
//     error: (err) => {
//       console.error('Error saving employee:', err);
//       this.errorMessage = 'Failed to save employee.';
//       this.successMessage = null;
//     }
//   });
// }

// update(): void {

//     if (!this.employeeForm.get('idDepartment')?.value || !this.employeeForm.get('idSection')?.value) {
//     this.errorMessage = 'Department and Section are required.';
//     this.successMessage = null;
//     return;
//   }
//   const formValue = this.employeeForm.getRawValue(); 
//   console.log('Form raw value (update):', formValue);

//   const employeeDto: EmployeeDTO = this.mapFormToEmployeeDto(formValue);
//   console.log('Mapped EmployeeDTO (update):', employeeDto);

//   this.employeeService.updateEmployee(employeeDto).subscribe({
//     next: (res) => {
//       console.log('Employee updated successfully:', res);
//       console.log('Base64 image:', this.employeeForm.get('employeeImage')?.value);

//       this.successMessage = 'Employee updated successfully!';
//       this.errorMessage = null;

//       this.clearForm(); 
//       this.loadEmployees();
//     },
//     error: (err) => {
//       console.error('Error updating employee:', err);
//       this.errorMessage = 'Failed to update employee.';
//       this.successMessage = null;
//     }
//   });
// }



// // update(): void {
// //   const formValue = this.employeeForm.getRawValue(); 
// //   console.log('Form raw value (update):', formValue);

// //   const employeeDto: EmployeeDTO = this.mapFormToEmployeeDto(formValue);
// //   console.log('Mapped EmployeeDTO (update):', employeeDto);

// //   this.employeeService.updateEmployee(employeeDto).subscribe({
// //     next: (res) => {
// //       console.log('Employee updated successfully:', res);
// //       console.log('Base64 image:', this.employeeForm.get('employeeImage')?.value); 
// //       alert('Employee updated successfully!');
// //       this.clearForm(); 
// //       this.loadEmployees();
// //     },
// //     error: (err) => {
// //       console.error('Error updating employee:', err);
// //       alert('Failed to update employee.');
// //     }
// //   });
// // }



// deleteEmp(): void {
//     if (!this.selectedEmployee){

//       alert('Please Select employee to delete');
//       return;
       
//     } 
 
//     if (confirm('Are you sure to delete ?')) {
//       this.employeeService.deleteEmployee(
//         this.idClient,
//         this.selectedEmployee.id
//       ).subscribe({
//         next: () => {
//           this.loadEmployees();
//           alert('Employee Id : '+ this.selectedEmployee?.id + ' has been Deleted')
//         },
//         error: (err) => console.error(err)
//       });
//     }


// }

//  addClick():void{

//     this.employeeForm.reset();
//     this.employeeForm.enable();
//     this.employeeEducationInfo.clear(); 
//     this.employeeDocuments.clear(); 
//     this.employeeProfessionalCertifications.clear(); 
//     this.employeeFamilyInfos.clear(); 
//     this.isShowBtn = true;
//  }

// editClick():void{

//   this.employeeForm.enable();
//   this.isShowBtn =true;

// }

// cancelClick():void{
//     this.isShowBtn = false;
//     this.employeeForm.disable();
//     //this.clearForm();
//  }


//  onSave(): void {
//   if (this.employeeForm.invalid) {
//     return;
//   }

//   const formValue = this.employeeForm.getRawValue();

//   if (!formValue.id) {
//     this.add();
//     return;
//   }

//   this.employeeService.getEmployeeById(this.idClient, formValue.id).subscribe({
//     next: () => this.update(),
//     error: (err) => {
//       if (err.status === 404) {
//         this.add();
//       } else {
//         console.error('Unexpected error:', err);
//         alert('An unexpected error occurred while saving the employee.');
//       }
//     }
//   });
// }


//  disbaleFormOnload():void{
  
//   this.employeeForm.disable();
// }

// }