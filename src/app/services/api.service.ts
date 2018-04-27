import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { GetOutputsRequest, Output } from '../app.datatypes';
import { environment } from '../../environments/environment';

@Injectable()
export class ApiService {

  private url = environment.nodeUrl;

  constructor(private http: Http) { }

  getOutputs(addresses): Observable<Output[]> {
    return addresses ? this.get('outputs', { addrs: addresses }).map((response: GetOutputsRequest) => {
      const outputs: Output[] = [];
      response.head_outputs.forEach(output => outputs.push({
        address: output.address,
        coins: parseFloat(output.coins),
        hash: output.hash,
        hours: output.hours,
      }));
      return outputs;
    }) : Observable.of([]);
  }

  postTransaction(rawTransaction: string): Observable<string> {
    return this.post('injectTransaction', { rawtx: rawTransaction });
  }

  get(url, params = null, options = {}) {
    return this.http.get(this.getUrl(url, params), this.returnRequestOptions(options))
      .map((res: any) => res.json())
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  post(url, body = {}, options: any = {}) {
    return this.getCsrf().first().flatMap(csrf => {
      options.csrf = csrf;
      return this.http.post(this.getUrl(url), body, this.returnRequestOptions(options))
        .map((res: any) => res.json())
        .catch((error: any) => Observable.throw(error || 'Server error'));
    });
  }

  private getHeaders() {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return headers;
  }

  private returnRequestOptions(additionalOptions) {
    const options = new RequestOptions();
    options.headers = this.getHeaders();
    
    if (additionalOptions.csrf) {
      options.headers.append('X-CSRF-Token', additionalOptions.csrf);
    }

    return options;
  }

  private getQueryString(parameters = null) {
    if (!parameters) {
      return '';
    }

    return Object.keys(parameters).reduce((array, key) => {
      array.push(key + '=' + encodeURIComponent(parameters[key]));
      return array;
    }, []).join('&');
  }

  private getUrl(url, options = null) {
    return this.url + url + '?' + this.getQueryString(options);
  }

  private getCsrf() {
    return this.get('csrf').map(response => response.csrf_token);
  }
}
