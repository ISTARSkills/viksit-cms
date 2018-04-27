import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AppConfiguration } from '../app.constants';
import 'rxjs/add/operator/takeUntil';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-mediaconvertor',
  templateUrl: './mediaconvertor.component.html',
  styleUrls: ['./mediaconvertor.component.css']
})
export class MediaconvertorComponent implements OnInit {

  public loading = false;
  public url: string = "";
  public fileName: string = "";
  isDowloadTrue: boolean = true;
  fileUrl: Array<any>;
  private ngUnsubscribe: Subject<any> = new Subject();

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.fileUrl = new Array<any>();
  }


  onChangeAudio(event) {


    const files: Array<File> = event.target.files;

    for (let file of files) {
      this.fileName = this.fileName + file.name + ", ";
    }
    this.loading = true;
    for (let i = 0; i < files.length; i++) {
      const formData: any = new FormData();
      var headers = new HttpHeaders();
      headers.append('Content-Type', 'multipart/form-data');
      headers.set('Accept', 'application/json');
      formData.append("item_type", 'AUDIO_CONVERTOR');
      formData.append("item_id", 0);
      formData.append("file", files[i], files[i]['name']);
      this.http.post(AppConfiguration.ServerWithApiUrl + 'image/upload', formData, { headers: headers, responseType: 'text' }).takeUntil(this.ngUnsubscribe)
        .subscribe(res => {
          this.url = res.toString();
          var f = new File([this.url], this.url.split("/")[5]);
          this.fileUrl.push({ name: this.url.split("/")[5], url: this.url, old_file: files[i].size / 1024 + " kb", new_file: f.size / 1024 + " kb" });

        }, error => {
          console.log(error.toString())
          alert("Something Went Wrong Plz Try angain");
          // this.loading = false;
        });
    }
    this.loading = false;
  }
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    console.log("unsubscribe");
  }
}
