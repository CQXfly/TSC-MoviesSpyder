"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const schema = new mongoose_1.Schema({
    title: { type: 'string', unique: true },
    transformName: { type: 'string', unique: true },
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
    hotCount: { type: 'string' },
    download_href: { type: 'string' }
});
schema.methods.createMovieBy = function (movies) {
};
schema.methods.getMoviesByIndexandSize = function (index, size, callback) {
};
schema.methods.searchMoviesByName = function (name, callback) {
    exports.movies.findOne({ 'transformName': name }).exec((err, doc) => {
        callback(doc);
    });
};
/**
 * @type {Model<IMovie>}
 */
exports.movies = mongoose_1.model('movies', schema, 'movies');
class MovieModel {
    constructor(movieModel) {
        this._movieModel = movieModel;
    }
    static createMovieBy(movie) {
        return __awaiter(this, void 0, void 0, function* () {
            let p = new Promise((resolve, reject) => {
                this.searchMoviesByName(movie.transformName).then(doc => {
                    if (doc) {
                        console.log(`已经存在了 ${doc.transformName}`);
                    }
                    else {
                        exports.movies.create(movie, (err, doc) => {
                            if (err) {
                                console.log(`写入 ${movie.transformName}失败`);
                            }
                            else {
                                console.log(`写入数据库成功 ${doc.transformName}`);
                            }
                        });
                    }
                });
            });
            return p;
        });
    }
    static searchMoviesByName(name) {
        console.log(name);
        let p = new Promise((resolve, reject) => {
            exports.movies.findOne({ 'transformName': name }).exec((err, doc) => {
                resolve(doc);
            });
        });
        return p;
    }
    ;
    static getMoviesByIndexandSize(index, size) {
        const p = new Promise((resolve, reject) => {
            let m = new MovieRepository();
            if (index == 0) {
                m.find().sort({ _id: -1 }).limit(size).exec((err, docs) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(docs);
                });
            }
            else {
                var x = index;
                var z = x;
                m.find({ '_id': { '$gt': x } }).limit(size).exec(function (err, docs) {
                    resolve(docs);
                });
            }
        });
        return p;
    }
}
exports.MovieModel = MovieModel;
class RepositoryBase {
    constructor(schemaModel) {
        this._model = schemaModel;
    }
    create(item, callback) {
        this._model.create(item, callback);
    }
    retrieve(callback) {
        this._model.find({}, callback);
    }
    update(_id, item, callback) {
        this._model.update({ _id: _id }, item, callback);
    }
    delete(_id, callback) {
        this._model.remove({ _id: this.toObjectId(_id) }, (err) => callback(err, null));
    }
    findById(_id, callback) {
        this._model.findById(_id, callback);
    }
    findOne(cond, callback) {
        return this._model.findOne(cond, callback);
    }
    find(cond, fields, options, callback) {
        return this._model.find(cond, options, callback);
    }
    toObjectId(_id) {
        return mongoose_1.Types.ObjectId.createFromHexString(_id);
    }
}
exports.RepositoryBase = RepositoryBase;
Object.seal(MovieModel);
class MovieRepository extends RepositoryBase {
    constructor() {
        super(exports.movies);
    }
}
exports.MovieRepository = MovieRepository;
class MovieClassModel {
}
exports.MovieClassModel = MovieClassModel;
//# sourceMappingURL=movie.js.map