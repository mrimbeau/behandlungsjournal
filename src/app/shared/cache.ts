export class Cache<T> {

  constructor(private key: string) {
  }

  writeCache(value: T, isList = false): boolean {
    let stringifiedValue = JSON.stringify(value);
    localStorage.setItem(this.getKey(isList), stringifiedValue);
    return true;
  }

  readCache(isList = false): T {
    return JSON.parse(localStorage.getItem(this.getKey(isList)));
  }

  hasCache(isList = false): boolean {
    return !(localStorage.getItem(this.getKey(isList)) === null);
  }

  removeFromCache(isList = false): void {
    return localStorage.removeItem(this.getKey(isList));
  }

  /* tslint:disable-next-line:no-unused-variable */
  clearCache(): void {
    return localStorage.clear();
  }

  private getKey(isList: boolean): string {
    return isList ? this.key + 's' : this.key;
  }
}
