import {IData} from './data';
import {Db} from '@types/mongodb';

export abstract class DataLoader {

  // constructor
  constructor(private db: Db, private data: IData) {
    this.prepareData();
  }

  // main
  prepareData() {
    console.log('\nPrepare collection ' + this.getCollectionName() + ':');
    this.drop();
    this.insert(this.data.getData());
  }

  // drop collection
  drop() {
    this.db.collection(this.getCollectionName()).drop(() => {
      console.log('- Drop collection ' + this.getCollectionName());
    });
  }

  // insert data
  insert(data) {
    this.db.collection(this.getCollectionName()).insertMany(data, () => {
      data.forEach((obj) => {
        console.log('+ ' + this.getCollectionName() + ' added as ' + obj.name);
      });
    });
  }

  // get Collection Name
  abstract getCollectionName(): string;
}
