import {Injectable} from '@angular/core';
import {Headers, RequestOptions} from '@angular/http';
import {AuthHttp} from 'angular2-jwt';
import {Observable} from 'rxjs/Observable';
import {Cache} from './cache';

@Injectable()
export abstract class ServiceBase<TItem> {

  protected headers = new Headers({'Content-Type': 'application/json', 'charset': 'UTF-8'});
  protected options = new RequestOptions({headers: this.headers});
  protected serviceUrl: string;

  protected cacheList: Cache<Array<TItem>>;
  protected cache: Cache<TItem>;

  constructor(protected authHttp: AuthHttp, protected cacheKey: string) {
    this.cacheList = new Cache<Array<TItem>>(cacheKey);
    this.cache = new Cache<TItem>(cacheKey);
  }

  readCacheList(): Array<TItem> {
    return this.cacheList.readCache(true);
  }

  readCache(): TItem {
    return this.cache.readCache();
  }

  hasCache(isList = false): boolean {
    return this.cache.hasCache(isList);
  }

  getItem(forceReload = false): Observable<TItem> {
    console.log('Call ServiceBase.getItem');
    if (this.cache.hasCache() && !forceReload) {
      return Observable.create((observer) => {
        this.log('Cache');
        observer.next(this.cache.readCache());
        observer.complete();
      });
    }

    return this.authHttp.get(this.getServiceUrl(false), {withCredentials: true}).map(res => {
      this.log('DB');
      let orderStatus = res.json();
      this.cache.writeCache(orderStatus);
      return (<TItem>orderStatus);
    });
  }

  getAllItems(forceReload = false): Observable<TItem[]> {
    console.log('Call ServiceBase.getAllItems');
    let isList = true;

    if (this.cacheList.hasCache(isList) && !forceReload) {
      return Observable.create((observer) => {
        this.log('Cache', isList);
        observer.next(this.cacheList.readCache(isList));
        observer.complete();
      });
    }

    return this.authHttp.get(this.getServiceUrl(isList), {withCredentials: true}).map(res => {
      this.log('DB', isList);
      let orderStatus = res.json();
      this.cacheList.writeCache(orderStatus, isList);
      return (<TItem[]>orderStatus);
    });
  }

  writeCacheList(items: TItem[]) {
    let isList = true;
    this.cacheList.writeCache(items, isList);
    console.log('Write Cache with ' + this.getKey(isList), JSON.stringify(items));
  }

  writeCache(item: TItem) {
    this.cache.writeCache(item);
    console.log('Write Cache with ' + this.getKey(), JSON.stringify(item));
  }

  removeFromCache() {
    this.cache.removeFromCache();
  }

  clearCache() {
    this.cache.clearCache();
  }

  private log(source: string, isList = false) {
    console.log('Load [' + this.getKey(isList) + '] from ' + source);
  }

  protected getKey(isList = false) {
    return isList ? this.cacheKey + 's' : this.getCacheKey(isList);
  }

  abstract getServiceUrl(isList): string;

  abstract getCacheKey(isList): string;
}
