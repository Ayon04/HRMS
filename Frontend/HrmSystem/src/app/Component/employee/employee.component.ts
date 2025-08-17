import { CommonModule } from '@angular/common';
import { Component, OnInit, Signal, signal, WritableSignal } from '@angular/core';
import { EmployeeDTO } from '../../Models/EmployeeDTO';
import { EmployeeService } from '../../Services/employee.service';
import { DropDownService } from '../../Services/dropDown.service';
import { Router, RouterModule } from '@angular/router';
import { AbstractControl, FormArray, FormBuilder,FormControl,FormGroup,FormsModule,ReactiveFormsModule,Validators} from '@angular/forms';
import { DropDown } from '../../Models/DropDown';
import { EmployeeDocumentDTO } from '../../Models/EmployeeDocumentDTO';
import { EmployeeEducationInfoDTO } from '../../Models/EmployeeEducationInfoDTO';
import { EmployeeFamilyInfoDTO } from '../../Models/EmployeeFamilyInfoDTO ';
import { EmployeeProfessionalCertificationDTO } from '../../Models/EmployeeProfessionalCertificationDTO ';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import {  computed } from '@angular/core';
import { switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule],
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.css'
})
export class EmployeeComponent implements OnInit {
  employees: WritableSignal<EmployeeDTO[]> = signal<EmployeeDTO[]>([]);


  selectedEmployee: EmployeeDTO | null = null;
  employeeImageUrl: SafeUrl | null = null;

  public employeeForm: FormGroup;
  public idClient: number = 10001001;
  isHide = true;
  isShowBtn:boolean = false;
  isShowRmvBtn:boolean = false;


private _employees = signal<any[]>([]);
private _departments = signal<any[]>([]);
private _sections = signal<any[]>([]);
private _designations = signal<any[]>([]);
private _genders = signal<any[]>([]);
private _religions = signal<any[]>([]);
private _jobtyps = signal<any[]>([]);
private _employeeTypes = signal<any[]>([]);
private _weekoffs = signal<any[]>([]);
private _MaritalStatus = signal<any[]>([]);
private _EducationLevel = signal<any[]>([]);
private _educationExaminations = signal<any[]>([]);
private _educationResults = signal<any[]>([]);
private _relationship = signal<any[]>([])

employeesList = this._employees.asReadonly();
departments = this._departments.asReadonly();
sections = this._sections.asReadonly();
designations = this._designations.asReadonly();
genders = this._genders.asReadonly();
religions = this._religions.asReadonly();
jobtyps = this._jobtyps.asReadonly();
employeeTypes = this._employeeTypes.asReadonly();
weekoffs = this._weekoffs.asReadonly();
MaritalStatus = this._MaritalStatus.asReadonly();
EducationLevel = this._EducationLevel.asReadonly();
educationExaminations = this._educationExaminations.asReadonly();
educationResults = this._educationResults.asReadonly();
relationship = this._relationship.asReadonly();

documents:EmployeeDocumentDTO[] = [];
educations: EmployeeEducationInfoDTO[] = [];
family: EmployeeFamilyInfoDTO[] = [];
professionalCertification: EmployeeProfessionalCertificationDTO[] = [];

  public employeeDto: EmployeeDTO;

  constructor(
    private employeeService: EmployeeService,
    private dropdownService: DropDownService,
    private fb: FormBuilder,
    private sanitizer: DomSanitizer,
    private router: Router
  
  ) {
    this.employeeDto = new EmployeeDTO();
    this.employeeForm = this.initForm();
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

  ngOnInit(): void {

    console.log("HRM System Running");
    this.employeeForm.enable();
    this.loadEmployees();
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

reloadCurrentRoute() {
  const currentUrl = this.router.url;
  this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
    this.router.navigate([currentUrl]);
  });
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

cancelClick():void{
    this.isShowBtn = false;
    this.employeeForm.disable();
 }


  disbaleFormOnload():void{

    this.employeeForm.disable();
  }

  loadEmployees(): void {
  this.employeeService.getAllEmployees(this.idClient).subscribe({
    next: (data) => this.employees.set(data),
    error: (error) => console.error('Failed to fetch employees', error)
  });
  this.employeeForm.disable();
   
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


getDepartments(idClient: number): void {
  this.departments = toSignal(
    this.dropdownService.getDepartmentDropdown(idClient),
    { initialValue: [] }
  );
}

getDesignation(idClient: number): void {
  this.designations = toSignal(
    this.dropdownService.getDesignationDropdown(idClient),
    { initialValue: [] }
  );
}

getJobType(idClient: number): void {
  this.jobtyps = toSignal(
    this.dropdownService.getJobTypeDropDown(idClient),
    { initialValue: [] }
  );
}

getGender(idClient: number): void {
  this.genders = toSignal(
    this.dropdownService.getGenderDropDown(idClient),
    { initialValue: [] }
  );
}

getEmployeeType(idClient: number): void {
  this.employeeTypes = toSignal(
    this.dropdownService.getEmployueeTypesDropDown(idClient),
    { initialValue: [] }
  );
}

getReligion(idClient: number): void {
  this.religions = toSignal(
    this.dropdownService.getReligionDropDown(idClient),
    { initialValue: [] }
  );
}

getSection(idClient: number): void {
  this.sections = toSignal(
    this.dropdownService.getSectionDropDown(idClient),
    { initialValue: [] }
  );
}

getWeekOff(idClient: number): void {
  this.weekoffs = toSignal(
    this.dropdownService.getWeekOffDropDown(idClient),
    { initialValue: [] }
  );
}

getMaritalStatus(idClient: number): void {
  this.MaritalStatus = toSignal(
    this.dropdownService.getMaritalStatusDropDown(idClient),
    { initialValue: [] }
  );
}

getEducationLevel(idClient: number): void {
  this.EducationLevel = toSignal(
    this.dropdownService.getEducationLevelDropDown(idClient),
    { initialValue: [] }
  );
}

getEducationExam(idClient: number): void {
  this.educationExaminations = toSignal(
    this.dropdownService.getEducationexaminationDropDown(idClient),
    { initialValue: [] }
  );
}

getEducationResult(idClient: number): void {
  this.educationResults = toSignal(
    this.dropdownService.getEducationResultDropDown(idClient),
    { initialValue: [] }
  );
}

getRelationship(idClient: number): void {
  this.relationship = toSignal(
    this.dropdownService.getRelationshipdownDropDown(idClient),
    { initialValue: [] }
  );
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



successMessage = signal<string | null>(null);
errorMessage = signal<string | null>(null);


add(): void {

  const formValue = this.employeeForm.getRawValue();
  const employeeDto: EmployeeDTO = this.mapFormToEmployeeDto(formValue);
  
  this.employeeService.createEmployee(employeeDto).subscribe({
    next: (res) => {
      this.successMessage.set('Employee Added successfully!');
      this.errorMessage.set(null);

      this.clearForm(); 
      this.loadEmployees();
      this.employeeForm.reset();
      this.reloadCurrentRoute();
    },
    error: (err) => {
      this.errorMessage.set('Failed to add data.');
      this.successMessage.set(null);
    }
  });
    this.isShowBtn = false;

}

update(): void {

  const formValue = this.employeeForm.getRawValue(); 
  const employeeDto: EmployeeDTO = this.mapFormToEmployeeDtoUpdate(formValue);

  this.employeeService.updateEmployee(employeeDto).subscribe({
    next: (res) => {

      this.successMessage .set('Employee Updated successfully!');
      this.errorMessage.set(null);

      this.clearForm(); 
      this.loadEmployees();
      this.reloadCurrentRoute();
    },
    error: (err) => {
      this.errorMessage.set('Failed to update data.');
      this.successMessage.set(null);
    }
  });
  this.isShowBtn = false;
}



onSave(): void {

    if (!this.employeeForm.get('idDepartment')?.value || !this.employeeForm.get('idSection')?.value ) {
    this.errorMessage.set( 'Department and Section are required.');
    this.successMessage.set(null);
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
        alert('An unexpected error occurred while saving the employee.');
      }
    }
  });

  
}

deleteEmp(): void {
  if (!this.selectedEmployee) {
    this.errorMessage.set('Please select an employee to delete.');
    return;
  }

  const confirmDelete = confirm('Are you sure you want to delete?');
  if (!confirmDelete) return;

  this.employeeService.deleteEmployee(this.idClient, this.selectedEmployee.id)
    .subscribe({
      next: () => {
        this.loadEmployees();       
        this.successMessage.set(`Employee ID ${this.selectedEmployee?.id} has been deleted.`);
        this.errorMessage.set(null);
        this.clearForm();
      },
      error: (err) => {
        console.error(err);
        this.errorMessage.set('Failed to delete employee.');
        this.successMessage.set(null);
      }
    });
}

childAddBtnClick():void{

  this.isShowBtn = true

}

  onDownloadClick(idClient: number, idEmployee: number, fileName: string): void {
    this.employeeService.downloadFile(idClient, idEmployee, fileName);
  }




}
