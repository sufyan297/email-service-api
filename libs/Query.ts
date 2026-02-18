import { getConnection, FindOneOptions, FindManyOptions, SaveOptions, Not, In, MoreThan, MoreThanOrEqual, LessThan, LessThanOrEqual, Like, IsNull, Between, Raw, ObjectType, ObjectLiteral } from "typeorm";
import { map, trim, upperCase } from 'lodash';

/**
 * Connection Object
 * @param {string} connectionName 
 * @returns connection
 */

interface IPaginationOptions extends FindManyOptions {
    page: number;
    limit: number;
}

export interface IPaginationResults<T> {
    pagesCount: number,
    results: T[],
    total: number
}

const _getConnection = (connectionName: string = 'default') => {
    return getConnection(connectionName ? connectionName : 'default');
}

export const hasSpace = (str: string): boolean => {
  return /\s/.test(str)
}


/**
 * Get Single Record
 */
const _getOne = <T extends ObjectLiteral>(modelName: string, options: FindOneOptions<any>, connectionName?: string): Promise<T | null> => {
    return new Promise(async (resolve, reject) => {
        try {
            const connection = _getConnection(connectionName);
            const repository = connection.getRepository(modelName);
            if (options.where) {
                options.where = _getWhere({...options.where, ...options.withDeleted == false || options.withDeleted == undefined ? { is_deleted: false } : {}});
            } else {
                options.where = {
                    ...options.withDeleted == false || options.withDeleted == undefined ? { is_deleted: false } : {}
                }
            }
            const data = await repository.findOne(options);
            resolve(data as T | null);
        } catch (error) {
            reject(error);
        }
    });
}

/**
 * Get Many Records
 */
const _getMany = <T extends ObjectLiteral>(modelName: string, options: FindManyOptions<unknown> | undefined, connectionName?: string):Promise<T[]> => {
    return new Promise(async (resolve, reject) => {
        try {
            const connection = _getConnection(connectionName);
            const repository = connection.getRepository(modelName);            
            if (options && options.where) {
                options.where = _getWhere({...options.where, ...options.withDeleted == false || options.withDeleted == undefined ? { is_deleted: false } : {}});
            } else {
                options = {};
                options.where = {
                    // ...options.withDeleted == false || options.withDeleted == undefined ? { is_deleted: false } : {}
                }
            }
            const data = await repository.find({...options, take: options.limit, skip: options.skip });
            // await repository.find({withDeleted})
            resolve(data as T[]);
        } catch (error) {
            reject(error);
        }
    });
}

/**
 * Get Records count
 */
const _getCount = <T extends ObjectLiteral>(modelName: string, options: FindManyOptions<unknown> | undefined, connectionName?: string): Promise<number> => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!modelName) return resolve(0);
            const connection = _getConnection(connectionName);
            const repository = connection.getRepository(modelName);
            if (options && options.where) {
                let newWhere = options.where;
                if (Array.isArray(options.where)) {
                    //@ts-ignore
                    options.where = newWhere.map((itm: any) => {
                        itm.is_deleted = itm.is_deleted != undefined ? itm.is_deleted : false
                        return _getWhere(itm);
                    })
                } else {
                    options.where = _getWhere(options.where);
                }
            } else {
                options = {};
                options.where = {
                    ...options.withDeleted == false || options.withDeleted == undefined ? { is_deleted: false } : {}
                }
            }
            const data = await repository.count(options);
            resolve(data);
        } catch (error) {
            reject(error);
        }
    });
}

/**
 * Get Pagination
 */
const _getPagination = <T extends ObjectLiteral>(modelName: string, options :IPaginationOptions, connectionName?: string) :Promise<IPaginationResults<T>> => {
    return new Promise (async (resolve, reject) => {
        try {
            let { page, limit } = options;

            //Pagination Part
            let skip = 0;
            if (page > 0) {
                skip = (page - 1) * limit;
            }
            //===================

            const connection = _getConnection(connectionName);
            const repository = connection.getRepository(modelName);
            if (options && options.where) {
                let newWhere = options.where;
                if (Array.isArray(options.where)) {
                    newWhere.map((itm: any) => {
                        if (options.withDeleted == false || options.withDeleted == undefined) {
                            itm.is_deleted = false;
                        }
                    })
                }
                options.where = _getWhere(newWhere);
            } else {
                options.where = {
                    ...options.withDeleted == false || options.withDeleted == undefined ? { is_deleted: false } : {}
                }
            }
            //@ts-ignore
            const resp = await repository.findAndCount({ ...options, take: limit, skip: skip });

            const data = resp[0] as T[];
            const total = resp[1];

            resolve({
                pagesCount: Math.ceil(total / limit),
                results: data,
                total
            });
        } catch (error) {
            reject(error);
        }
    });
}

/**
 * Save Data (If new record inserted else updated)
 */
const _saveData = <T extends ObjectLiteral>(modelName: string, fields: any, connectionName?: string):Promise<T | T[]> => {
    return new Promise(async (resolve, reject) => {
        try {
            const connection = _getConnection(connectionName);
            const repository = connection.getRepository(modelName);
            // console.log("Repository: ", repository);
            const data = await repository.save(fields);
            resolve(data);
        } catch (error) {
            reject(error);
        }
    });
}

/**
 * Construct the Where condition
 */
const _getWhere = (where: any) => {
    if (!where) return false;
    let newWhere: any = {};
    if (Array.isArray(where)) {
        newWhere = []; //Make it Array
        where.map((item: any) => {
            newWhere.push(_getWhere(item));
        })
    } else {
        map(where, (value, key:string) => {
            if (typeof value == 'object' && !Array.isArray(value) && value != null) {
                newWhere = {
                    ...newWhere,
                    [key]: _getWhere(value)
                }
            } else  {
                //1. Does field contain space?
                if (hasSpace(key)) {
                    const field = key.split(' ') as string[];
                    if (field && field[0]  && field[1]) {
                        const operator = trim(field[1]);
                        console.log("OPERATOR: ", operator);
                        // console.log("FIELD: [0] : ", field[0]);
                        // console.log("FIELD: [1] : ", field[1]);
                        switch (operator) {
                            case '!=': newWhere = {...newWhere, [field[0]]: Not(value)}; break; //"id !=": "1"
                            case 'IN': newWhere = {...newWhere, [field[0]]: In(value) }; break;// "id IN": ["1","2"]
                            case 'NOT_IN': newWhere = {...newWhere, [field[0]]: Not(In(value)) }; break; //"id NOT_IN": ["1"]
                            case '>': newWhere = {...newWhere, [field[0]]: MoreThan(value) }; break;
                            case '>=': newWhere = {...newWhere, [field[0]]: MoreThanOrEqual(value) }; break;
                            case '<': newWhere = {...newWhere, [field[0]]: LessThan(value) }; break;
                            case '<=': newWhere = {...newWhere, [field[0]]: LessThanOrEqual(value) }; break;
                            case 'LIKE': newWhere = {...newWhere, [field[0]]: Like(value) }; break; //"id LIKE": ["1"]
                            case 'NOT_LIKE': newWhere = {...newWhere, [field[0]]: Not(Like(value)) }; break; //"id NOT_LIKE": ["1"]
                            case 'RAW': newWhere = {...newWhere, [field[0]]: Raw(value) }; break; //"first_name RAW": "REGEXP "
                            case 'BETWEEN': {
                                if (value && Array.isArray(value)) {
                                    newWhere = {...newWhere, [field[0]]: Between(value[0], value[1])}; 
                                }
                                break;
                            }
                            case 'NOT': {
                                if (value === null) {
                                    newWhere = {...newWhere, [field[0]]: Not(IsNull())} //"id NOT": null
                                }
                                break;
                            }
                            default: {
                                newWhere = {...newWhere, [trim(field[0])]: trim(value)}
                            }
                        }
                    }
                } else if (value == null) {
                    newWhere = { ...newWhere, [key]: IsNull() } // "id": null
                } else {
                    newWhere = {
                        ...newWhere,
                        [key]: value
                    }
                }
            }
        });
    }
    // console.log("NewWhere: ", newWhere);
    return newWhere;
}

const _rawQuery = (query: string, connectionName?: string) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!query) return resolve(false);
            const connection = _getConnection(connectionName);
            const data = await connection.query(query);
            resolve(data);
        } catch (error) {
            reject(error);
            console.error("[_rawQuery] ", error);
        }
    })
}

const _bulkInsert = async(model:string,data:any[],connectionName='default')=>{
    try {
        const connection = _getConnection(connectionName);
        const repository = connection.getRepository(model);

        return await repository.insert(data);
    } catch (error) {
        console.error(error);
        throw error;
    }
}

/**
 * Soft delete records
 */
// const _softDelete = (modelName: string, where = {}, options = {}) => {
//     return new Promise(async (resolve, reject) => {
//        try {
//             if (!modelName) return resolve(false);
//             const records = await _getMany(modelName, {where, select: ['id']});
//             const updateDeletedAt = [];
//             records.map((record) => {
//                 updateDeletedAt.push({
//                     id: record.id,
//                     // deleted_at: new Date()
//                 });
//             });
//             await _saveData(modelName, updateDeletedAt);
//             resolve(updateDeletedAt);
//        } catch (error) {
//            console.error("[softDelete] ERROR: ",error);
//            reject(error);
//        } 
//     });
// }

/**
 * Restore from SoftDelete
 */
// const _recoverDelete = (modelName: string, where = {}, options = {}) => {
//     return new Promise(async (resolve, reject) => {
//        try {
//             if (!modelName) return resolve(false);
//             console.log("WHERE: ", where);
//             const records = await _getMany(modelName, {where, select: ['id', 'name'], withDeleted: true});
//             const updateDeletedAt = [];
//             records.map((record) => {
//                 updateDeletedAt.push({
//                     id: record.id,
//                     deleted_at: null
//                 });
//             });
//             console.log("[recover Delete] Records: ", records);
//             await _saveData(modelName, updateDeletedAt);
//             resolve(updateDeletedAt);
//         } catch (error) {
//             console.error("[recoverDelete] ERROR: ",error);
//             reject(error);
//         }
//     });
// }

export {
    _getOne as getOne,
    _getMany as getMany,
    _getCount as getCount,
    _getPagination as getPagination,
    _saveData as saveData,
    _rawQuery as rawQuery,
    _bulkInsert as bulkInsert
    // _softDelete as softDelete,
    // _recoverDelete as recoverDelete
}
