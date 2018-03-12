import {Schema,model, Model,Types,Query,Document} from 'mongoose'
import { resolve } from 'dns';

export interface IMovie extends Document {
    title?:string
    transformName?:string
    img?:string
    allimg?:string
    actor?:string
    age?:string
    country?:string
    date?:string
    director?:string
    filter?:string
    href?:string
    introduction?:string
    language?:string
    otherInfo?:string
    size?:string
    subtitle?:string
    time?:string
    webSiteFrom?:string
    hotCount?:string
}

export interface IMovieModle extends IMovie, Document {
    createMovieBy:(callback:(T:IMovie)=>void)=>void
    searchMoviesByName:(name:string,callback:(doc:any)=>void)=>void
    getMoviesByIndexandSize:(index:number,size:number,callback:(doc:any)=>void)=>void
  }
  

const schema = new Schema({
    title: { type: 'string',unique: true},
    transformName: { type: 'string',unique:true },
    img: { type: 'string' },
    allimg: { type: 'string' },
    actor: { type: 'string' },
    age: { type: 'string' },
    country: { type: 'string' },
    date: { type: 'string' },
    director: { type: 'string' },
    filter: { type: 'string' },
    href: { type: 'string' },
    introduction: { type: 'string' },
    language: { type: 'string' },
    otherInfo: { type: 'string' },
    size: { type: 'string' },
    subtitle: { type: 'string' },
    time: { type: 'string' },
    webSiteFrom: { type: 'string' },
    hotCount:{type:'string'}
})

schema.methods.createMovieBy = function (movies:IMovie){
    
}

schema.methods.getMoviesByIndexandSize = function(index:number,size:number,callback:(doc:any)=>void){

}

schema.methods.searchMoviesByName = function(name:string,callback:(doc:any)=>void){
    movies.findOne({'transformName':name}).exec((err,doc) =>{
        callback(doc)
    })
}

/**
 * @type {Model<IMovie>}
 */
export const movies = model<IMovie>('movies',schema,'movies') 


export class MovieModel {

    private _movieModel : IMovie
    
    constructor(movieModel:IMovie){
        this._movieModel = movieModel
    }

    static async createMovieBy(movie:MovieClassModel):Promise<any>{

        let p = new Promise((resolve,reject)=>{
            this.searchMoviesByName(movie.transformName!).then(doc=>{
              
                if (doc) { console.log(`已经存在了 ${doc!.transformName}`)}

                else {
                    movies.create(movie,(err:Error,doc:IMovie)=>{
                        if (err){console.log(`写入 ${movie.transformName}失败`)}
                        else{
                            console.log(`写入数据库成功 ${doc.transformName}`)
                        }
                    })
                }
            })
        })
        return p
        
    }

    static searchMoviesByName (name:string):Promise<IMovie|null> {
        console.log(name);
        let p = new Promise<IMovie|null>((resolve,reject)=>{
            movies.findOne({'transformName':name}).exec((err,doc)=>{
                resolve(doc)
            })
        })
        return p

    };
    

    static  getMoviesByIndexandSize(index:number,size:number):Promise<IMovie[]>{
        
        const p = new Promise<IMovie[]>((resolve,reject)=>{
            let m = new MovieRepository()
            if(index == 0){
                m.find().sort({_id:-1}).limit(size).exec((err,docs) => {
                    if(err){
                        reject(err)
                    }
                    resolve(docs)
                })
            } else {
        
                var x = index;
        
                var z = x;
                m.find({'_id':{'$gt':x}}).limit(size).exec(function (err,docs) {
        
                    resolve(docs)
                })
            } 
        })
        return p      
    }

}

export interface IRead<T> {
    retrieve: (callback: (error: any, result: any) => void) => void;
    findById: (id: string, callback: (error: any, result: T) => void) => void;
    findOne(cond?: Object, callback?: (err: any, res: T) => void): Query<T>;
    find(cond: Object, fields: Object, options: Object, callback?: (err: any, res: T[]) => void): Query<T[]>;
}
  
export interface IWrite<T> {
    create: (item: T, callback: (error: any, result: any) => void) => void;
    update: (_id: Types.ObjectId, item: T, callback: (error: any, result: any) => void) => void;
    delete: (_id: string, callback: (error: any, result: any) => void) => void;
}
  

export class RepositoryBase<T extends Document> implements IRead<T>, IWrite<T> {

  private _model: Model<Document>;

  constructor(schemaModel: Model<Document>) {
    this._model = schemaModel;
  }

  create(item: T, callback: (error: any, result: T) => void) {
    this._model.create(item, callback);
  }

  retrieve(callback: (error: any, result: T) => void) {
    this._model.find({}, callback);
  }

  update(_id: Types.ObjectId, item: T, callback: (error: any, result: any) => void) {
    this._model.update({ _id: _id }, item, callback);
  }

  delete(_id: string, callback: (error: any, result: any) => void) {
    this._model.remove({ _id: this.toObjectId(_id) }, (err) => callback(err, null));
  }

  findById(_id: string, callback: (error: any, result: T) => void) {
    this._model.findById(_id, callback);
  }

  findOne(cond?: Object, callback?: (err: any, res: T) => void): Query<T> {
    return this._model.findOne(cond, callback);
  }

  find(cond?: Object, fields?: Object, options?: Object, callback?: (err: any, res: T[]) => void): Query<T[]> {
    return this._model.find(cond, options, callback);
  }

  private toObjectId(_id: string): Types.ObjectId {
    return Types.ObjectId.createFromHexString(_id);
  }

}


Object.seal(MovieModel)

export class MovieRepository extends RepositoryBase<IMovieModle> {
    constructor() {
      super(movies);
    }
}


export class MovieClassModel {
    title?:string
    transformName?:string
    img?:string
    allimg?:string
    actor?:string
    age?:string
    country?:string
    date?:string
    director?:string
    filter?:string
    href?:string
    introduction?:string
    language?:string
    otherInfo?:string
    size?:string
    subtitle?:string
    time?:string
    webSiteFrom?:string
    hotCount?:string
    originName?:string
    actors?:string
    commentScores?:string

}
