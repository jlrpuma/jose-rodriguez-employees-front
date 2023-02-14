import { Component } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {EmployeePair} from "./models/EmployeePair";
import {EmployeeProject} from "./models/EmployeeProject";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'employees-front';

  sourceData: EmployeeProject[] = [];
  csvData: string | null = null;
  selectedFile: File | null = null;
  collapsed = false;

  responseData: EmployeePair[] = [];

  constructor(private http: HttpClient) { }

  onFileSelected(event: any): void {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      const csvData = reader.result as string;
      const lines = csvData.split('\n');
      this.sourceData = lines.slice(0)
        .map(line => {
          return {
            empId: Number(line.split(',')[0]),
            projectId: Number(line.split(',')[1]),
            dateFrom: line.split(',')[2],
            dateTo: (line.split(',')[3].trim() === "NULL")  ? new Date().toISOString() : line.split(',')[3]
          }
        });
      this.csvData = csvData;
    };

    reader.readAsText(file);
    this.selectedFile = file;
  }

  onDragOver(event: any): void {
    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer.dropEffect = 'copy';
    event.currentTarget.classList.add('dragover');
  }

  onUpload(): void {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('file', this.selectedFile, this.selectedFile.name);
      this.http.post<any>('http://localhost:8080/multipleOverlaps', formData)
        .subscribe(response => {
          console.log(response);
          this.responseData = response;
        });
    }
  }


}
