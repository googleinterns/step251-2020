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

  onSubmit(): void {
    if (!this.dataForm.value.text && this.file == null) {
      window.alert(
        'Both fields are empty!\nPlease select a file or paste the data in the text box!'
      );
      return;
    }

    if (this.dataForm.value.text) {
      window.localStorage.setItem('data', this.dataForm.value.text);
    } else {
      const fileReader: FileReader = new FileReader();
      fileReader.onload = event => {
        window.localStorage.setItem('data', event.target.result.toString());
      };
      fileReader.readAsText(this.file);
    }

    this.router.navigate(['env']);
  }
}
