import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-form',
  templateUrl: './dataSubmissionForm.html',
  styleUrls: ['./dataSubmissionForm.css'],
})
export class DataSubmissionFormComponent implements OnInit {
  dataForm: FormGroup;
  file: File = null;

  constructor(private router: Router) {
    this.dataForm = new FormGroup({
      file: new FormControl(null),
      text: new FormControl(''),
    });
  }

  ngOnInit(): void {}

  onFileChange(event): void {
    this.file = event.target.files[0];
  }

  validateInput(): boolean {
    if (!this.dataForm.value.text && this.file == null) {
      window.alert(
        'Both fields are empty!\nPlease select a file or paste the data in the text box!'
      );
      return false;
    } else if (!this.dataForm.value.text) {
      if (this.file.name.length < 3) {
        window.alert(
          'Wrong file type! Please upload binary file with .pb extension.'
        );
        return false;
      }
      if (this.file.name.substr(this.file.name.length - 3, 3) !== '.pb') {
        window.alert(
          'Wrong file type! Please upload binary file with .pb extension.'
        );
        return false;
      }
    }

    return true;
  }

  onSubmit(): void {
    if (this.validateInput() === false) {
      return;
    }

    if (this.dataForm.value.text) {
      window.localStorage.setItem('data', this.dataForm.value.text);
    } else {
      const fileReader: FileReader = new FileReader();
      fileReader.onload = event => {
        let result: string;
        if (typeof event.target.result === 'string') {
          result = event.target.result as string;
        } else {
          result = this.arrayBufferToString(event.target.result as ArrayBuffer);
        }
        window.localStorage.setItem('binaryData', result);
      };
      fileReader.readAsBinaryString(this.file);
    }

    this.router.navigate(['env']);
  }

  arrayBufferToString(buf: ArrayBuffer): string {
    return String.fromCharCode.apply(null, new Uint16Array(buf));
  }
}
