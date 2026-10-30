
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model ScanRun
 * 
 */
export type ScanRun = $Result.DefaultSelection<Prisma.$ScanRunPayload>
/**
 * Model WatchKeyword
 * 
 */
export type WatchKeyword = $Result.DefaultSelection<Prisma.$WatchKeywordPayload>
/**
 * Model Finding
 * 
 */
export type Finding = $Result.DefaultSelection<Prisma.$FindingPayload>
/**
 * Model Comment
 * 
 */
export type Comment = $Result.DefaultSelection<Prisma.$CommentPayload>
/**
 * Model Briefing
 * 
 */
export type Briefing = $Result.DefaultSelection<Prisma.$BriefingPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more ScanRuns
 * const scanRuns = await prisma.scanRun.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more ScanRuns
   * const scanRuns = await prisma.scanRun.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.scanRun`: Exposes CRUD operations for the **ScanRun** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ScanRuns
    * const scanRuns = await prisma.scanRun.findMany()
    * ```
    */
  get scanRun(): Prisma.ScanRunDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.watchKeyword`: Exposes CRUD operations for the **WatchKeyword** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more WatchKeywords
    * const watchKeywords = await prisma.watchKeyword.findMany()
    * ```
    */
  get watchKeyword(): Prisma.WatchKeywordDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.finding`: Exposes CRUD operations for the **Finding** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Findings
    * const findings = await prisma.finding.findMany()
    * ```
    */
  get finding(): Prisma.FindingDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.comment`: Exposes CRUD operations for the **Comment** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Comments
    * const comments = await prisma.comment.findMany()
    * ```
    */
  get comment(): Prisma.CommentDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.briefing`: Exposes CRUD operations for the **Briefing** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Briefings
    * const briefings = await prisma.briefing.findMany()
    * ```
    */
  get briefing(): Prisma.BriefingDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.19.2
   * Query Engine version: c2990dca591cba766e3b7ef5d9e8a84796e47ab7
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    ScanRun: 'ScanRun',
    WatchKeyword: 'WatchKeyword',
    Finding: 'Finding',
    Comment: 'Comment',
    Briefing: 'Briefing'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "scanRun" | "watchKeyword" | "finding" | "comment" | "briefing"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      ScanRun: {
        payload: Prisma.$ScanRunPayload<ExtArgs>
        fields: Prisma.ScanRunFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ScanRunFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScanRunPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ScanRunFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScanRunPayload>
          }
          findFirst: {
            args: Prisma.ScanRunFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScanRunPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ScanRunFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScanRunPayload>
          }
          findMany: {
            args: Prisma.ScanRunFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScanRunPayload>[]
          }
          create: {
            args: Prisma.ScanRunCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScanRunPayload>
          }
          createMany: {
            args: Prisma.ScanRunCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ScanRunCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScanRunPayload>[]
          }
          delete: {
            args: Prisma.ScanRunDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScanRunPayload>
          }
          update: {
            args: Prisma.ScanRunUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScanRunPayload>
          }
          deleteMany: {
            args: Prisma.ScanRunDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ScanRunUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ScanRunUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScanRunPayload>[]
          }
          upsert: {
            args: Prisma.ScanRunUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScanRunPayload>
          }
          aggregate: {
            args: Prisma.ScanRunAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateScanRun>
          }
          groupBy: {
            args: Prisma.ScanRunGroupByArgs<ExtArgs>
            result: $Utils.Optional<ScanRunGroupByOutputType>[]
          }
          count: {
            args: Prisma.ScanRunCountArgs<ExtArgs>
            result: $Utils.Optional<ScanRunCountAggregateOutputType> | number
          }
        }
      }
      WatchKeyword: {
        payload: Prisma.$WatchKeywordPayload<ExtArgs>
        fields: Prisma.WatchKeywordFieldRefs
        operations: {
          findUnique: {
            args: Prisma.WatchKeywordFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WatchKeywordPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.WatchKeywordFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WatchKeywordPayload>
          }
          findFirst: {
            args: Prisma.WatchKeywordFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WatchKeywordPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.WatchKeywordFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WatchKeywordPayload>
          }
          findMany: {
            args: Prisma.WatchKeywordFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WatchKeywordPayload>[]
          }
          create: {
            args: Prisma.WatchKeywordCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WatchKeywordPayload>
          }
          createMany: {
            args: Prisma.WatchKeywordCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.WatchKeywordCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WatchKeywordPayload>[]
          }
          delete: {
            args: Prisma.WatchKeywordDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WatchKeywordPayload>
          }
          update: {
            args: Prisma.WatchKeywordUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WatchKeywordPayload>
          }
          deleteMany: {
            args: Prisma.WatchKeywordDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.WatchKeywordUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.WatchKeywordUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WatchKeywordPayload>[]
          }
          upsert: {
            args: Prisma.WatchKeywordUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WatchKeywordPayload>
          }
          aggregate: {
            args: Prisma.WatchKeywordAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateWatchKeyword>
          }
          groupBy: {
            args: Prisma.WatchKeywordGroupByArgs<ExtArgs>
            result: $Utils.Optional<WatchKeywordGroupByOutputType>[]
          }
          count: {
            args: Prisma.WatchKeywordCountArgs<ExtArgs>
            result: $Utils.Optional<WatchKeywordCountAggregateOutputType> | number
          }
        }
      }
      Finding: {
        payload: Prisma.$FindingPayload<ExtArgs>
        fields: Prisma.FindingFieldRefs
        operations: {
          findUnique: {
            args: Prisma.FindingFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FindingPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.FindingFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FindingPayload>
          }
          findFirst: {
            args: Prisma.FindingFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FindingPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.FindingFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FindingPayload>
          }
          findMany: {
            args: Prisma.FindingFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FindingPayload>[]
          }
          create: {
            args: Prisma.FindingCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FindingPayload>
          }
          createMany: {
            args: Prisma.FindingCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.FindingCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FindingPayload>[]
          }
          delete: {
            args: Prisma.FindingDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FindingPayload>
          }
          update: {
            args: Prisma.FindingUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FindingPayload>
          }
          deleteMany: {
            args: Prisma.FindingDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.FindingUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.FindingUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FindingPayload>[]
          }
          upsert: {
            args: Prisma.FindingUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FindingPayload>
          }
          aggregate: {
            args: Prisma.FindingAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateFinding>
          }
          groupBy: {
            args: Prisma.FindingGroupByArgs<ExtArgs>
            result: $Utils.Optional<FindingGroupByOutputType>[]
          }
          count: {
            args: Prisma.FindingCountArgs<ExtArgs>
            result: $Utils.Optional<FindingCountAggregateOutputType> | number
          }
        }
      }
      Comment: {
        payload: Prisma.$CommentPayload<ExtArgs>
        fields: Prisma.CommentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CommentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CommentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommentPayload>
          }
          findFirst: {
            args: Prisma.CommentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CommentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommentPayload>
          }
          findMany: {
            args: Prisma.CommentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommentPayload>[]
          }
          create: {
            args: Prisma.CommentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommentPayload>
          }
          createMany: {
            args: Prisma.CommentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CommentCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommentPayload>[]
          }
          delete: {
            args: Prisma.CommentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommentPayload>
          }
          update: {
            args: Prisma.CommentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommentPayload>
          }
          deleteMany: {
            args: Prisma.CommentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CommentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.CommentUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommentPayload>[]
          }
          upsert: {
            args: Prisma.CommentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommentPayload>
          }
          aggregate: {
            args: Prisma.CommentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateComment>
          }
          groupBy: {
            args: Prisma.CommentGroupByArgs<ExtArgs>
            result: $Utils.Optional<CommentGroupByOutputType>[]
          }
          count: {
            args: Prisma.CommentCountArgs<ExtArgs>
            result: $Utils.Optional<CommentCountAggregateOutputType> | number
          }
        }
      }
      Briefing: {
        payload: Prisma.$BriefingPayload<ExtArgs>
        fields: Prisma.BriefingFieldRefs
        operations: {
          findUnique: {
            args: Prisma.BriefingFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BriefingPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.BriefingFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BriefingPayload>
          }
          findFirst: {
            args: Prisma.BriefingFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BriefingPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.BriefingFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BriefingPayload>
          }
          findMany: {
            args: Prisma.BriefingFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BriefingPayload>[]
          }
          create: {
            args: Prisma.BriefingCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BriefingPayload>
          }
          createMany: {
            args: Prisma.BriefingCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.BriefingCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BriefingPayload>[]
          }
          delete: {
            args: Prisma.BriefingDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BriefingPayload>
          }
          update: {
            args: Prisma.BriefingUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BriefingPayload>
          }
          deleteMany: {
            args: Prisma.BriefingDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.BriefingUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.BriefingUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BriefingPayload>[]
          }
          upsert: {
            args: Prisma.BriefingUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BriefingPayload>
          }
          aggregate: {
            args: Prisma.BriefingAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateBriefing>
          }
          groupBy: {
            args: Prisma.BriefingGroupByArgs<ExtArgs>
            result: $Utils.Optional<BriefingGroupByOutputType>[]
          }
          count: {
            args: Prisma.BriefingCountArgs<ExtArgs>
            result: $Utils.Optional<BriefingCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory | null
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    scanRun?: ScanRunOmit
    watchKeyword?: WatchKeywordOmit
    finding?: FindingOmit
    comment?: CommentOmit
    briefing?: BriefingOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type ScanRunCountOutputType
   */

  export type ScanRunCountOutputType = {
    findings: number
  }

  export type ScanRunCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    findings?: boolean | ScanRunCountOutputTypeCountFindingsArgs
  }

  // Custom InputTypes
  /**
   * ScanRunCountOutputType without action
   */
  export type ScanRunCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScanRunCountOutputType
     */
    select?: ScanRunCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ScanRunCountOutputType without action
   */
  export type ScanRunCountOutputTypeCountFindingsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FindingWhereInput
  }


  /**
   * Count Type FindingCountOutputType
   */

  export type FindingCountOutputType = {
    comments: number
  }

  export type FindingCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    comments?: boolean | FindingCountOutputTypeCountCommentsArgs
  }

  // Custom InputTypes
  /**
   * FindingCountOutputType without action
   */
  export type FindingCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FindingCountOutputType
     */
    select?: FindingCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * FindingCountOutputType without action
   */
  export type FindingCountOutputTypeCountCommentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CommentWhereInput
  }


  /**
   * Models
   */

  /**
   * Model ScanRun
   */

  export type AggregateScanRun = {
    _count: ScanRunCountAggregateOutputType | null
    _avg: ScanRunAvgAggregateOutputType | null
    _sum: ScanRunSumAggregateOutputType | null
    _min: ScanRunMinAggregateOutputType | null
    _max: ScanRunMaxAggregateOutputType | null
  }

  export type ScanRunAvgAggregateOutputType = {
    totalFound: number | null
    newItems: number | null
    languagesCovered: number | null
  }

  export type ScanRunSumAggregateOutputType = {
    totalFound: number | null
    newItems: number | null
    languagesCovered: number | null
  }

  export type ScanRunMinAggregateOutputType = {
    id: string | null
    scope: string | null
    focusCategory: string | null
    status: string | null
    totalFound: number | null
    newItems: number | null
    languagesCovered: number | null
    startedAt: Date | null
    completedAt: Date | null
  }

  export type ScanRunMaxAggregateOutputType = {
    id: string | null
    scope: string | null
    focusCategory: string | null
    status: string | null
    totalFound: number | null
    newItems: number | null
    languagesCovered: number | null
    startedAt: Date | null
    completedAt: Date | null
  }

  export type ScanRunCountAggregateOutputType = {
    id: number
    scope: number
    focusCategory: number
    status: number
    totalFound: number
    newItems: number
    languagesCovered: number
    startedAt: number
    completedAt: number
    _all: number
  }


  export type ScanRunAvgAggregateInputType = {
    totalFound?: true
    newItems?: true
    languagesCovered?: true
  }

  export type ScanRunSumAggregateInputType = {
    totalFound?: true
    newItems?: true
    languagesCovered?: true
  }

  export type ScanRunMinAggregateInputType = {
    id?: true
    scope?: true
    focusCategory?: true
    status?: true
    totalFound?: true
    newItems?: true
    languagesCovered?: true
    startedAt?: true
    completedAt?: true
  }

  export type ScanRunMaxAggregateInputType = {
    id?: true
    scope?: true
    focusCategory?: true
    status?: true
    totalFound?: true
    newItems?: true
    languagesCovered?: true
    startedAt?: true
    completedAt?: true
  }

  export type ScanRunCountAggregateInputType = {
    id?: true
    scope?: true
    focusCategory?: true
    status?: true
    totalFound?: true
    newItems?: true
    languagesCovered?: true
    startedAt?: true
    completedAt?: true
    _all?: true
  }

  export type ScanRunAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ScanRun to aggregate.
     */
    where?: ScanRunWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ScanRuns to fetch.
     */
    orderBy?: ScanRunOrderByWithRelationInput | ScanRunOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ScanRunWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ScanRuns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ScanRuns.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ScanRuns
    **/
    _count?: true | ScanRunCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ScanRunAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ScanRunSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ScanRunMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ScanRunMaxAggregateInputType
  }

  export type GetScanRunAggregateType<T extends ScanRunAggregateArgs> = {
        [P in keyof T & keyof AggregateScanRun]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateScanRun[P]>
      : GetScalarType<T[P], AggregateScanRun[P]>
  }




  export type ScanRunGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ScanRunWhereInput
    orderBy?: ScanRunOrderByWithAggregationInput | ScanRunOrderByWithAggregationInput[]
    by: ScanRunScalarFieldEnum[] | ScanRunScalarFieldEnum
    having?: ScanRunScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ScanRunCountAggregateInputType | true
    _avg?: ScanRunAvgAggregateInputType
    _sum?: ScanRunSumAggregateInputType
    _min?: ScanRunMinAggregateInputType
    _max?: ScanRunMaxAggregateInputType
  }

  export type ScanRunGroupByOutputType = {
    id: string
    scope: string
    focusCategory: string | null
    status: string
    totalFound: number
    newItems: number
    languagesCovered: number
    startedAt: Date
    completedAt: Date | null
    _count: ScanRunCountAggregateOutputType | null
    _avg: ScanRunAvgAggregateOutputType | null
    _sum: ScanRunSumAggregateOutputType | null
    _min: ScanRunMinAggregateOutputType | null
    _max: ScanRunMaxAggregateOutputType | null
  }

  type GetScanRunGroupByPayload<T extends ScanRunGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ScanRunGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ScanRunGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ScanRunGroupByOutputType[P]>
            : GetScalarType<T[P], ScanRunGroupByOutputType[P]>
        }
      >
    >


  export type ScanRunSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    scope?: boolean
    focusCategory?: boolean
    status?: boolean
    totalFound?: boolean
    newItems?: boolean
    languagesCovered?: boolean
    startedAt?: boolean
    completedAt?: boolean
    findings?: boolean | ScanRun$findingsArgs<ExtArgs>
    _count?: boolean | ScanRunCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["scanRun"]>

  export type ScanRunSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    scope?: boolean
    focusCategory?: boolean
    status?: boolean
    totalFound?: boolean
    newItems?: boolean
    languagesCovered?: boolean
    startedAt?: boolean
    completedAt?: boolean
  }, ExtArgs["result"]["scanRun"]>

  export type ScanRunSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    scope?: boolean
    focusCategory?: boolean
    status?: boolean
    totalFound?: boolean
    newItems?: boolean
    languagesCovered?: boolean
    startedAt?: boolean
    completedAt?: boolean
  }, ExtArgs["result"]["scanRun"]>

  export type ScanRunSelectScalar = {
    id?: boolean
    scope?: boolean
    focusCategory?: boolean
    status?: boolean
    totalFound?: boolean
    newItems?: boolean
    languagesCovered?: boolean
    startedAt?: boolean
    completedAt?: boolean
  }

  export type ScanRunOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "scope" | "focusCategory" | "status" | "totalFound" | "newItems" | "languagesCovered" | "startedAt" | "completedAt", ExtArgs["result"]["scanRun"]>
  export type ScanRunInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    findings?: boolean | ScanRun$findingsArgs<ExtArgs>
    _count?: boolean | ScanRunCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ScanRunIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type ScanRunIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $ScanRunPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ScanRun"
    objects: {
      findings: Prisma.$FindingPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      scope: string
      focusCategory: string | null
      status: string
      totalFound: number
      newItems: number
      languagesCovered: number
      startedAt: Date
      completedAt: Date | null
    }, ExtArgs["result"]["scanRun"]>
    composites: {}
  }

  type ScanRunGetPayload<S extends boolean | null | undefined | ScanRunDefaultArgs> = $Result.GetResult<Prisma.$ScanRunPayload, S>

  type ScanRunCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ScanRunFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ScanRunCountAggregateInputType | true
    }

  export interface ScanRunDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ScanRun'], meta: { name: 'ScanRun' } }
    /**
     * Find zero or one ScanRun that matches the filter.
     * @param {ScanRunFindUniqueArgs} args - Arguments to find a ScanRun
     * @example
     * // Get one ScanRun
     * const scanRun = await prisma.scanRun.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ScanRunFindUniqueArgs>(args: SelectSubset<T, ScanRunFindUniqueArgs<ExtArgs>>): Prisma__ScanRunClient<$Result.GetResult<Prisma.$ScanRunPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ScanRun that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ScanRunFindUniqueOrThrowArgs} args - Arguments to find a ScanRun
     * @example
     * // Get one ScanRun
     * const scanRun = await prisma.scanRun.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ScanRunFindUniqueOrThrowArgs>(args: SelectSubset<T, ScanRunFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ScanRunClient<$Result.GetResult<Prisma.$ScanRunPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ScanRun that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScanRunFindFirstArgs} args - Arguments to find a ScanRun
     * @example
     * // Get one ScanRun
     * const scanRun = await prisma.scanRun.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ScanRunFindFirstArgs>(args?: SelectSubset<T, ScanRunFindFirstArgs<ExtArgs>>): Prisma__ScanRunClient<$Result.GetResult<Prisma.$ScanRunPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ScanRun that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScanRunFindFirstOrThrowArgs} args - Arguments to find a ScanRun
     * @example
     * // Get one ScanRun
     * const scanRun = await prisma.scanRun.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ScanRunFindFirstOrThrowArgs>(args?: SelectSubset<T, ScanRunFindFirstOrThrowArgs<ExtArgs>>): Prisma__ScanRunClient<$Result.GetResult<Prisma.$ScanRunPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ScanRuns that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScanRunFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ScanRuns
     * const scanRuns = await prisma.scanRun.findMany()
     * 
     * // Get first 10 ScanRuns
     * const scanRuns = await prisma.scanRun.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const scanRunWithIdOnly = await prisma.scanRun.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ScanRunFindManyArgs>(args?: SelectSubset<T, ScanRunFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ScanRunPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ScanRun.
     * @param {ScanRunCreateArgs} args - Arguments to create a ScanRun.
     * @example
     * // Create one ScanRun
     * const ScanRun = await prisma.scanRun.create({
     *   data: {
     *     // ... data to create a ScanRun
     *   }
     * })
     * 
     */
    create<T extends ScanRunCreateArgs>(args: SelectSubset<T, ScanRunCreateArgs<ExtArgs>>): Prisma__ScanRunClient<$Result.GetResult<Prisma.$ScanRunPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ScanRuns.
     * @param {ScanRunCreateManyArgs} args - Arguments to create many ScanRuns.
     * @example
     * // Create many ScanRuns
     * const scanRun = await prisma.scanRun.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ScanRunCreateManyArgs>(args?: SelectSubset<T, ScanRunCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ScanRuns and returns the data saved in the database.
     * @param {ScanRunCreateManyAndReturnArgs} args - Arguments to create many ScanRuns.
     * @example
     * // Create many ScanRuns
     * const scanRun = await prisma.scanRun.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ScanRuns and only return the `id`
     * const scanRunWithIdOnly = await prisma.scanRun.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ScanRunCreateManyAndReturnArgs>(args?: SelectSubset<T, ScanRunCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ScanRunPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ScanRun.
     * @param {ScanRunDeleteArgs} args - Arguments to delete one ScanRun.
     * @example
     * // Delete one ScanRun
     * const ScanRun = await prisma.scanRun.delete({
     *   where: {
     *     // ... filter to delete one ScanRun
     *   }
     * })
     * 
     */
    delete<T extends ScanRunDeleteArgs>(args: SelectSubset<T, ScanRunDeleteArgs<ExtArgs>>): Prisma__ScanRunClient<$Result.GetResult<Prisma.$ScanRunPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ScanRun.
     * @param {ScanRunUpdateArgs} args - Arguments to update one ScanRun.
     * @example
     * // Update one ScanRun
     * const scanRun = await prisma.scanRun.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ScanRunUpdateArgs>(args: SelectSubset<T, ScanRunUpdateArgs<ExtArgs>>): Prisma__ScanRunClient<$Result.GetResult<Prisma.$ScanRunPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ScanRuns.
     * @param {ScanRunDeleteManyArgs} args - Arguments to filter ScanRuns to delete.
     * @example
     * // Delete a few ScanRuns
     * const { count } = await prisma.scanRun.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ScanRunDeleteManyArgs>(args?: SelectSubset<T, ScanRunDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ScanRuns.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScanRunUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ScanRuns
     * const scanRun = await prisma.scanRun.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ScanRunUpdateManyArgs>(args: SelectSubset<T, ScanRunUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ScanRuns and returns the data updated in the database.
     * @param {ScanRunUpdateManyAndReturnArgs} args - Arguments to update many ScanRuns.
     * @example
     * // Update many ScanRuns
     * const scanRun = await prisma.scanRun.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ScanRuns and only return the `id`
     * const scanRunWithIdOnly = await prisma.scanRun.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ScanRunUpdateManyAndReturnArgs>(args: SelectSubset<T, ScanRunUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ScanRunPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ScanRun.
     * @param {ScanRunUpsertArgs} args - Arguments to update or create a ScanRun.
     * @example
     * // Update or create a ScanRun
     * const scanRun = await prisma.scanRun.upsert({
     *   create: {
     *     // ... data to create a ScanRun
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ScanRun we want to update
     *   }
     * })
     */
    upsert<T extends ScanRunUpsertArgs>(args: SelectSubset<T, ScanRunUpsertArgs<ExtArgs>>): Prisma__ScanRunClient<$Result.GetResult<Prisma.$ScanRunPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ScanRuns.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScanRunCountArgs} args - Arguments to filter ScanRuns to count.
     * @example
     * // Count the number of ScanRuns
     * const count = await prisma.scanRun.count({
     *   where: {
     *     // ... the filter for the ScanRuns we want to count
     *   }
     * })
    **/
    count<T extends ScanRunCountArgs>(
      args?: Subset<T, ScanRunCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ScanRunCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ScanRun.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScanRunAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ScanRunAggregateArgs>(args: Subset<T, ScanRunAggregateArgs>): Prisma.PrismaPromise<GetScanRunAggregateType<T>>

    /**
     * Group by ScanRun.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScanRunGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ScanRunGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ScanRunGroupByArgs['orderBy'] }
        : { orderBy?: ScanRunGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ScanRunGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetScanRunGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ScanRun model
   */
  readonly fields: ScanRunFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ScanRun.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ScanRunClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    findings<T extends ScanRun$findingsArgs<ExtArgs> = {}>(args?: Subset<T, ScanRun$findingsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FindingPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ScanRun model
   */
  interface ScanRunFieldRefs {
    readonly id: FieldRef<"ScanRun", 'String'>
    readonly scope: FieldRef<"ScanRun", 'String'>
    readonly focusCategory: FieldRef<"ScanRun", 'String'>
    readonly status: FieldRef<"ScanRun", 'String'>
    readonly totalFound: FieldRef<"ScanRun", 'Int'>
    readonly newItems: FieldRef<"ScanRun", 'Int'>
    readonly languagesCovered: FieldRef<"ScanRun", 'Int'>
    readonly startedAt: FieldRef<"ScanRun", 'DateTime'>
    readonly completedAt: FieldRef<"ScanRun", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ScanRun findUnique
   */
  export type ScanRunFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScanRun
     */
    select?: ScanRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ScanRun
     */
    omit?: ScanRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScanRunInclude<ExtArgs> | null
    /**
     * Filter, which ScanRun to fetch.
     */
    where: ScanRunWhereUniqueInput
  }

  /**
   * ScanRun findUniqueOrThrow
   */
  export type ScanRunFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScanRun
     */
    select?: ScanRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ScanRun
     */
    omit?: ScanRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScanRunInclude<ExtArgs> | null
    /**
     * Filter, which ScanRun to fetch.
     */
    where: ScanRunWhereUniqueInput
  }

  /**
   * ScanRun findFirst
   */
  export type ScanRunFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScanRun
     */
    select?: ScanRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ScanRun
     */
    omit?: ScanRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScanRunInclude<ExtArgs> | null
    /**
     * Filter, which ScanRun to fetch.
     */
    where?: ScanRunWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ScanRuns to fetch.
     */
    orderBy?: ScanRunOrderByWithRelationInput | ScanRunOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ScanRuns.
     */
    cursor?: ScanRunWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ScanRuns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ScanRuns.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ScanRuns.
     */
    distinct?: ScanRunScalarFieldEnum | ScanRunScalarFieldEnum[]
  }

  /**
   * ScanRun findFirstOrThrow
   */
  export type ScanRunFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScanRun
     */
    select?: ScanRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ScanRun
     */
    omit?: ScanRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScanRunInclude<ExtArgs> | null
    /**
     * Filter, which ScanRun to fetch.
     */
    where?: ScanRunWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ScanRuns to fetch.
     */
    orderBy?: ScanRunOrderByWithRelationInput | ScanRunOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ScanRuns.
     */
    cursor?: ScanRunWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ScanRuns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ScanRuns.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ScanRuns.
     */
    distinct?: ScanRunScalarFieldEnum | ScanRunScalarFieldEnum[]
  }

  /**
   * ScanRun findMany
   */
  export type ScanRunFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScanRun
     */
    select?: ScanRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ScanRun
     */
    omit?: ScanRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScanRunInclude<ExtArgs> | null
    /**
     * Filter, which ScanRuns to fetch.
     */
    where?: ScanRunWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ScanRuns to fetch.
     */
    orderBy?: ScanRunOrderByWithRelationInput | ScanRunOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ScanRuns.
     */
    cursor?: ScanRunWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ScanRuns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ScanRuns.
     */
    skip?: number
    distinct?: ScanRunScalarFieldEnum | ScanRunScalarFieldEnum[]
  }

  /**
   * ScanRun create
   */
  export type ScanRunCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScanRun
     */
    select?: ScanRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ScanRun
     */
    omit?: ScanRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScanRunInclude<ExtArgs> | null
    /**
     * The data needed to create a ScanRun.
     */
    data?: XOR<ScanRunCreateInput, ScanRunUncheckedCreateInput>
  }

  /**
   * ScanRun createMany
   */
  export type ScanRunCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ScanRuns.
     */
    data: ScanRunCreateManyInput | ScanRunCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ScanRun createManyAndReturn
   */
  export type ScanRunCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScanRun
     */
    select?: ScanRunSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ScanRun
     */
    omit?: ScanRunOmit<ExtArgs> | null
    /**
     * The data used to create many ScanRuns.
     */
    data: ScanRunCreateManyInput | ScanRunCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ScanRun update
   */
  export type ScanRunUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScanRun
     */
    select?: ScanRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ScanRun
     */
    omit?: ScanRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScanRunInclude<ExtArgs> | null
    /**
     * The data needed to update a ScanRun.
     */
    data: XOR<ScanRunUpdateInput, ScanRunUncheckedUpdateInput>
    /**
     * Choose, which ScanRun to update.
     */
    where: ScanRunWhereUniqueInput
  }

  /**
   * ScanRun updateMany
   */
  export type ScanRunUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ScanRuns.
     */
    data: XOR<ScanRunUpdateManyMutationInput, ScanRunUncheckedUpdateManyInput>
    /**
     * Filter which ScanRuns to update
     */
    where?: ScanRunWhereInput
    /**
     * Limit how many ScanRuns to update.
     */
    limit?: number
  }

  /**
   * ScanRun updateManyAndReturn
   */
  export type ScanRunUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScanRun
     */
    select?: ScanRunSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ScanRun
     */
    omit?: ScanRunOmit<ExtArgs> | null
    /**
     * The data used to update ScanRuns.
     */
    data: XOR<ScanRunUpdateManyMutationInput, ScanRunUncheckedUpdateManyInput>
    /**
     * Filter which ScanRuns to update
     */
    where?: ScanRunWhereInput
    /**
     * Limit how many ScanRuns to update.
     */
    limit?: number
  }

  /**
   * ScanRun upsert
   */
  export type ScanRunUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScanRun
     */
    select?: ScanRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ScanRun
     */
    omit?: ScanRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScanRunInclude<ExtArgs> | null
    /**
     * The filter to search for the ScanRun to update in case it exists.
     */
    where: ScanRunWhereUniqueInput
    /**
     * In case the ScanRun found by the `where` argument doesn't exist, create a new ScanRun with this data.
     */
    create: XOR<ScanRunCreateInput, ScanRunUncheckedCreateInput>
    /**
     * In case the ScanRun was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ScanRunUpdateInput, ScanRunUncheckedUpdateInput>
  }

  /**
   * ScanRun delete
   */
  export type ScanRunDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScanRun
     */
    select?: ScanRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ScanRun
     */
    omit?: ScanRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScanRunInclude<ExtArgs> | null
    /**
     * Filter which ScanRun to delete.
     */
    where: ScanRunWhereUniqueInput
  }

  /**
   * ScanRun deleteMany
   */
  export type ScanRunDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ScanRuns to delete
     */
    where?: ScanRunWhereInput
    /**
     * Limit how many ScanRuns to delete.
     */
    limit?: number
  }

  /**
   * ScanRun.findings
   */
  export type ScanRun$findingsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Finding
     */
    select?: FindingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Finding
     */
    omit?: FindingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FindingInclude<ExtArgs> | null
    where?: FindingWhereInput
    orderBy?: FindingOrderByWithRelationInput | FindingOrderByWithRelationInput[]
    cursor?: FindingWhereUniqueInput
    take?: number
    skip?: number
    distinct?: FindingScalarFieldEnum | FindingScalarFieldEnum[]
  }

  /**
   * ScanRun without action
   */
  export type ScanRunDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScanRun
     */
    select?: ScanRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ScanRun
     */
    omit?: ScanRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScanRunInclude<ExtArgs> | null
  }


  /**
   * Model WatchKeyword
   */

  export type AggregateWatchKeyword = {
    _count: WatchKeywordCountAggregateOutputType | null
    _min: WatchKeywordMinAggregateOutputType | null
    _max: WatchKeywordMaxAggregateOutputType | null
  }

  export type WatchKeywordMinAggregateOutputType = {
    id: string | null
    term: string | null
    createdAt: Date | null
  }

  export type WatchKeywordMaxAggregateOutputType = {
    id: string | null
    term: string | null
    createdAt: Date | null
  }

  export type WatchKeywordCountAggregateOutputType = {
    id: number
    term: number
    createdAt: number
    _all: number
  }


  export type WatchKeywordMinAggregateInputType = {
    id?: true
    term?: true
    createdAt?: true
  }

  export type WatchKeywordMaxAggregateInputType = {
    id?: true
    term?: true
    createdAt?: true
  }

  export type WatchKeywordCountAggregateInputType = {
    id?: true
    term?: true
    createdAt?: true
    _all?: true
  }

  export type WatchKeywordAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which WatchKeyword to aggregate.
     */
    where?: WatchKeywordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WatchKeywords to fetch.
     */
    orderBy?: WatchKeywordOrderByWithRelationInput | WatchKeywordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: WatchKeywordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WatchKeywords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WatchKeywords.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned WatchKeywords
    **/
    _count?: true | WatchKeywordCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: WatchKeywordMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: WatchKeywordMaxAggregateInputType
  }

  export type GetWatchKeywordAggregateType<T extends WatchKeywordAggregateArgs> = {
        [P in keyof T & keyof AggregateWatchKeyword]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateWatchKeyword[P]>
      : GetScalarType<T[P], AggregateWatchKeyword[P]>
  }




  export type WatchKeywordGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WatchKeywordWhereInput
    orderBy?: WatchKeywordOrderByWithAggregationInput | WatchKeywordOrderByWithAggregationInput[]
    by: WatchKeywordScalarFieldEnum[] | WatchKeywordScalarFieldEnum
    having?: WatchKeywordScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: WatchKeywordCountAggregateInputType | true
    _min?: WatchKeywordMinAggregateInputType
    _max?: WatchKeywordMaxAggregateInputType
  }

  export type WatchKeywordGroupByOutputType = {
    id: string
    term: string
    createdAt: Date
    _count: WatchKeywordCountAggregateOutputType | null
    _min: WatchKeywordMinAggregateOutputType | null
    _max: WatchKeywordMaxAggregateOutputType | null
  }

  type GetWatchKeywordGroupByPayload<T extends WatchKeywordGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<WatchKeywordGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof WatchKeywordGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], WatchKeywordGroupByOutputType[P]>
            : GetScalarType<T[P], WatchKeywordGroupByOutputType[P]>
        }
      >
    >


  export type WatchKeywordSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    term?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["watchKeyword"]>

  export type WatchKeywordSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    term?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["watchKeyword"]>

  export type WatchKeywordSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    term?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["watchKeyword"]>

  export type WatchKeywordSelectScalar = {
    id?: boolean
    term?: boolean
    createdAt?: boolean
  }

  export type WatchKeywordOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "term" | "createdAt", ExtArgs["result"]["watchKeyword"]>

  export type $WatchKeywordPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "WatchKeyword"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      term: string
      createdAt: Date
    }, ExtArgs["result"]["watchKeyword"]>
    composites: {}
  }

  type WatchKeywordGetPayload<S extends boolean | null | undefined | WatchKeywordDefaultArgs> = $Result.GetResult<Prisma.$WatchKeywordPayload, S>

  type WatchKeywordCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<WatchKeywordFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: WatchKeywordCountAggregateInputType | true
    }

  export interface WatchKeywordDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['WatchKeyword'], meta: { name: 'WatchKeyword' } }
    /**
     * Find zero or one WatchKeyword that matches the filter.
     * @param {WatchKeywordFindUniqueArgs} args - Arguments to find a WatchKeyword
     * @example
     * // Get one WatchKeyword
     * const watchKeyword = await prisma.watchKeyword.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends WatchKeywordFindUniqueArgs>(args: SelectSubset<T, WatchKeywordFindUniqueArgs<ExtArgs>>): Prisma__WatchKeywordClient<$Result.GetResult<Prisma.$WatchKeywordPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one WatchKeyword that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {WatchKeywordFindUniqueOrThrowArgs} args - Arguments to find a WatchKeyword
     * @example
     * // Get one WatchKeyword
     * const watchKeyword = await prisma.watchKeyword.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends WatchKeywordFindUniqueOrThrowArgs>(args: SelectSubset<T, WatchKeywordFindUniqueOrThrowArgs<ExtArgs>>): Prisma__WatchKeywordClient<$Result.GetResult<Prisma.$WatchKeywordPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first WatchKeyword that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WatchKeywordFindFirstArgs} args - Arguments to find a WatchKeyword
     * @example
     * // Get one WatchKeyword
     * const watchKeyword = await prisma.watchKeyword.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends WatchKeywordFindFirstArgs>(args?: SelectSubset<T, WatchKeywordFindFirstArgs<ExtArgs>>): Prisma__WatchKeywordClient<$Result.GetResult<Prisma.$WatchKeywordPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first WatchKeyword that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WatchKeywordFindFirstOrThrowArgs} args - Arguments to find a WatchKeyword
     * @example
     * // Get one WatchKeyword
     * const watchKeyword = await prisma.watchKeyword.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends WatchKeywordFindFirstOrThrowArgs>(args?: SelectSubset<T, WatchKeywordFindFirstOrThrowArgs<ExtArgs>>): Prisma__WatchKeywordClient<$Result.GetResult<Prisma.$WatchKeywordPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more WatchKeywords that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WatchKeywordFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all WatchKeywords
     * const watchKeywords = await prisma.watchKeyword.findMany()
     * 
     * // Get first 10 WatchKeywords
     * const watchKeywords = await prisma.watchKeyword.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const watchKeywordWithIdOnly = await prisma.watchKeyword.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends WatchKeywordFindManyArgs>(args?: SelectSubset<T, WatchKeywordFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WatchKeywordPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a WatchKeyword.
     * @param {WatchKeywordCreateArgs} args - Arguments to create a WatchKeyword.
     * @example
     * // Create one WatchKeyword
     * const WatchKeyword = await prisma.watchKeyword.create({
     *   data: {
     *     // ... data to create a WatchKeyword
     *   }
     * })
     * 
     */
    create<T extends WatchKeywordCreateArgs>(args: SelectSubset<T, WatchKeywordCreateArgs<ExtArgs>>): Prisma__WatchKeywordClient<$Result.GetResult<Prisma.$WatchKeywordPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many WatchKeywords.
     * @param {WatchKeywordCreateManyArgs} args - Arguments to create many WatchKeywords.
     * @example
     * // Create many WatchKeywords
     * const watchKeyword = await prisma.watchKeyword.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends WatchKeywordCreateManyArgs>(args?: SelectSubset<T, WatchKeywordCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many WatchKeywords and returns the data saved in the database.
     * @param {WatchKeywordCreateManyAndReturnArgs} args - Arguments to create many WatchKeywords.
     * @example
     * // Create many WatchKeywords
     * const watchKeyword = await prisma.watchKeyword.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many WatchKeywords and only return the `id`
     * const watchKeywordWithIdOnly = await prisma.watchKeyword.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends WatchKeywordCreateManyAndReturnArgs>(args?: SelectSubset<T, WatchKeywordCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WatchKeywordPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a WatchKeyword.
     * @param {WatchKeywordDeleteArgs} args - Arguments to delete one WatchKeyword.
     * @example
     * // Delete one WatchKeyword
     * const WatchKeyword = await prisma.watchKeyword.delete({
     *   where: {
     *     // ... filter to delete one WatchKeyword
     *   }
     * })
     * 
     */
    delete<T extends WatchKeywordDeleteArgs>(args: SelectSubset<T, WatchKeywordDeleteArgs<ExtArgs>>): Prisma__WatchKeywordClient<$Result.GetResult<Prisma.$WatchKeywordPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one WatchKeyword.
     * @param {WatchKeywordUpdateArgs} args - Arguments to update one WatchKeyword.
     * @example
     * // Update one WatchKeyword
     * const watchKeyword = await prisma.watchKeyword.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends WatchKeywordUpdateArgs>(args: SelectSubset<T, WatchKeywordUpdateArgs<ExtArgs>>): Prisma__WatchKeywordClient<$Result.GetResult<Prisma.$WatchKeywordPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more WatchKeywords.
     * @param {WatchKeywordDeleteManyArgs} args - Arguments to filter WatchKeywords to delete.
     * @example
     * // Delete a few WatchKeywords
     * const { count } = await prisma.watchKeyword.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends WatchKeywordDeleteManyArgs>(args?: SelectSubset<T, WatchKeywordDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more WatchKeywords.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WatchKeywordUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many WatchKeywords
     * const watchKeyword = await prisma.watchKeyword.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends WatchKeywordUpdateManyArgs>(args: SelectSubset<T, WatchKeywordUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more WatchKeywords and returns the data updated in the database.
     * @param {WatchKeywordUpdateManyAndReturnArgs} args - Arguments to update many WatchKeywords.
     * @example
     * // Update many WatchKeywords
     * const watchKeyword = await prisma.watchKeyword.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more WatchKeywords and only return the `id`
     * const watchKeywordWithIdOnly = await prisma.watchKeyword.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends WatchKeywordUpdateManyAndReturnArgs>(args: SelectSubset<T, WatchKeywordUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WatchKeywordPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one WatchKeyword.
     * @param {WatchKeywordUpsertArgs} args - Arguments to update or create a WatchKeyword.
     * @example
     * // Update or create a WatchKeyword
     * const watchKeyword = await prisma.watchKeyword.upsert({
     *   create: {
     *     // ... data to create a WatchKeyword
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the WatchKeyword we want to update
     *   }
     * })
     */
    upsert<T extends WatchKeywordUpsertArgs>(args: SelectSubset<T, WatchKeywordUpsertArgs<ExtArgs>>): Prisma__WatchKeywordClient<$Result.GetResult<Prisma.$WatchKeywordPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of WatchKeywords.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WatchKeywordCountArgs} args - Arguments to filter WatchKeywords to count.
     * @example
     * // Count the number of WatchKeywords
     * const count = await prisma.watchKeyword.count({
     *   where: {
     *     // ... the filter for the WatchKeywords we want to count
     *   }
     * })
    **/
    count<T extends WatchKeywordCountArgs>(
      args?: Subset<T, WatchKeywordCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], WatchKeywordCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a WatchKeyword.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WatchKeywordAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends WatchKeywordAggregateArgs>(args: Subset<T, WatchKeywordAggregateArgs>): Prisma.PrismaPromise<GetWatchKeywordAggregateType<T>>

    /**
     * Group by WatchKeyword.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WatchKeywordGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends WatchKeywordGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: WatchKeywordGroupByArgs['orderBy'] }
        : { orderBy?: WatchKeywordGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, WatchKeywordGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetWatchKeywordGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the WatchKeyword model
   */
  readonly fields: WatchKeywordFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for WatchKeyword.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__WatchKeywordClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the WatchKeyword model
   */
  interface WatchKeywordFieldRefs {
    readonly id: FieldRef<"WatchKeyword", 'String'>
    readonly term: FieldRef<"WatchKeyword", 'String'>
    readonly createdAt: FieldRef<"WatchKeyword", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * WatchKeyword findUnique
   */
  export type WatchKeywordFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WatchKeyword
     */
    select?: WatchKeywordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WatchKeyword
     */
    omit?: WatchKeywordOmit<ExtArgs> | null
    /**
     * Filter, which WatchKeyword to fetch.
     */
    where: WatchKeywordWhereUniqueInput
  }

  /**
   * WatchKeyword findUniqueOrThrow
   */
  export type WatchKeywordFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WatchKeyword
     */
    select?: WatchKeywordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WatchKeyword
     */
    omit?: WatchKeywordOmit<ExtArgs> | null
    /**
     * Filter, which WatchKeyword to fetch.
     */
    where: WatchKeywordWhereUniqueInput
  }

  /**
   * WatchKeyword findFirst
   */
  export type WatchKeywordFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WatchKeyword
     */
    select?: WatchKeywordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WatchKeyword
     */
    omit?: WatchKeywordOmit<ExtArgs> | null
    /**
     * Filter, which WatchKeyword to fetch.
     */
    where?: WatchKeywordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WatchKeywords to fetch.
     */
    orderBy?: WatchKeywordOrderByWithRelationInput | WatchKeywordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for WatchKeywords.
     */
    cursor?: WatchKeywordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WatchKeywords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WatchKeywords.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of WatchKeywords.
     */
    distinct?: WatchKeywordScalarFieldEnum | WatchKeywordScalarFieldEnum[]
  }

  /**
   * WatchKeyword findFirstOrThrow
   */
  export type WatchKeywordFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WatchKeyword
     */
    select?: WatchKeywordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WatchKeyword
     */
    omit?: WatchKeywordOmit<ExtArgs> | null
    /**
     * Filter, which WatchKeyword to fetch.
     */
    where?: WatchKeywordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WatchKeywords to fetch.
     */
    orderBy?: WatchKeywordOrderByWithRelationInput | WatchKeywordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for WatchKeywords.
     */
    cursor?: WatchKeywordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WatchKeywords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WatchKeywords.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of WatchKeywords.
     */
    distinct?: WatchKeywordScalarFieldEnum | WatchKeywordScalarFieldEnum[]
  }

  /**
   * WatchKeyword findMany
   */
  export type WatchKeywordFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WatchKeyword
     */
    select?: WatchKeywordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WatchKeyword
     */
    omit?: WatchKeywordOmit<ExtArgs> | null
    /**
     * Filter, which WatchKeywords to fetch.
     */
    where?: WatchKeywordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WatchKeywords to fetch.
     */
    orderBy?: WatchKeywordOrderByWithRelationInput | WatchKeywordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing WatchKeywords.
     */
    cursor?: WatchKeywordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WatchKeywords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WatchKeywords.
     */
    skip?: number
    distinct?: WatchKeywordScalarFieldEnum | WatchKeywordScalarFieldEnum[]
  }

  /**
   * WatchKeyword create
   */
  export type WatchKeywordCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WatchKeyword
     */
    select?: WatchKeywordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WatchKeyword
     */
    omit?: WatchKeywordOmit<ExtArgs> | null
    /**
     * The data needed to create a WatchKeyword.
     */
    data: XOR<WatchKeywordCreateInput, WatchKeywordUncheckedCreateInput>
  }

  /**
   * WatchKeyword createMany
   */
  export type WatchKeywordCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many WatchKeywords.
     */
    data: WatchKeywordCreateManyInput | WatchKeywordCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * WatchKeyword createManyAndReturn
   */
  export type WatchKeywordCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WatchKeyword
     */
    select?: WatchKeywordSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the WatchKeyword
     */
    omit?: WatchKeywordOmit<ExtArgs> | null
    /**
     * The data used to create many WatchKeywords.
     */
    data: WatchKeywordCreateManyInput | WatchKeywordCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * WatchKeyword update
   */
  export type WatchKeywordUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WatchKeyword
     */
    select?: WatchKeywordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WatchKeyword
     */
    omit?: WatchKeywordOmit<ExtArgs> | null
    /**
     * The data needed to update a WatchKeyword.
     */
    data: XOR<WatchKeywordUpdateInput, WatchKeywordUncheckedUpdateInput>
    /**
     * Choose, which WatchKeyword to update.
     */
    where: WatchKeywordWhereUniqueInput
  }

  /**
   * WatchKeyword updateMany
   */
  export type WatchKeywordUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update WatchKeywords.
     */
    data: XOR<WatchKeywordUpdateManyMutationInput, WatchKeywordUncheckedUpdateManyInput>
    /**
     * Filter which WatchKeywords to update
     */
    where?: WatchKeywordWhereInput
    /**
     * Limit how many WatchKeywords to update.
     */
    limit?: number
  }

  /**
   * WatchKeyword updateManyAndReturn
   */
  export type WatchKeywordUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WatchKeyword
     */
    select?: WatchKeywordSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the WatchKeyword
     */
    omit?: WatchKeywordOmit<ExtArgs> | null
    /**
     * The data used to update WatchKeywords.
     */
    data: XOR<WatchKeywordUpdateManyMutationInput, WatchKeywordUncheckedUpdateManyInput>
    /**
     * Filter which WatchKeywords to update
     */
    where?: WatchKeywordWhereInput
    /**
     * Limit how many WatchKeywords to update.
     */
    limit?: number
  }

  /**
   * WatchKeyword upsert
   */
  export type WatchKeywordUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WatchKeyword
     */
    select?: WatchKeywordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WatchKeyword
     */
    omit?: WatchKeywordOmit<ExtArgs> | null
    /**
     * The filter to search for the WatchKeyword to update in case it exists.
     */
    where: WatchKeywordWhereUniqueInput
    /**
     * In case the WatchKeyword found by the `where` argument doesn't exist, create a new WatchKeyword with this data.
     */
    create: XOR<WatchKeywordCreateInput, WatchKeywordUncheckedCreateInput>
    /**
     * In case the WatchKeyword was found with the provided `where` argument, update it with this data.
     */
    update: XOR<WatchKeywordUpdateInput, WatchKeywordUncheckedUpdateInput>
  }

  /**
   * WatchKeyword delete
   */
  export type WatchKeywordDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WatchKeyword
     */
    select?: WatchKeywordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WatchKeyword
     */
    omit?: WatchKeywordOmit<ExtArgs> | null
    /**
     * Filter which WatchKeyword to delete.
     */
    where: WatchKeywordWhereUniqueInput
  }

  /**
   * WatchKeyword deleteMany
   */
  export type WatchKeywordDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which WatchKeywords to delete
     */
    where?: WatchKeywordWhereInput
    /**
     * Limit how many WatchKeywords to delete.
     */
    limit?: number
  }

  /**
   * WatchKeyword without action
   */
  export type WatchKeywordDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WatchKeyword
     */
    select?: WatchKeywordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WatchKeyword
     */
    omit?: WatchKeywordOmit<ExtArgs> | null
  }


  /**
   * Model Finding
   */

  export type AggregateFinding = {
    _count: FindingCountAggregateOutputType | null
    _avg: FindingAvgAggregateOutputType | null
    _sum: FindingSumAggregateOutputType | null
    _min: FindingMinAggregateOutputType | null
    _max: FindingMaxAggregateOutputType | null
  }

  export type FindingAvgAggregateOutputType = {
    importance: number | null
  }

  export type FindingSumAggregateOutputType = {
    importance: number | null
  }

  export type FindingMinAggregateOutputType = {
    id: string | null
    scanId: string | null
    url: string | null
    originalTitle: string | null
    originalSnippet: string | null
    trTitle: string | null
    trSummary: string | null
    language: string | null
    sourceName: string | null
    category: string | null
    importance: number | null
    isNewTech: boolean | null
    keywords: string | null
    publishedDate: string | null
    images: string | null
    deepAnalysis: string | null
    fullArticle: string | null
    bookmarked: boolean | null
    isRead: boolean | null
    notes: string | null
    createdAt: Date | null
  }

  export type FindingMaxAggregateOutputType = {
    id: string | null
    scanId: string | null
    url: string | null
    originalTitle: string | null
    originalSnippet: string | null
    trTitle: string | null
    trSummary: string | null
    language: string | null
    sourceName: string | null
    category: string | null
    importance: number | null
    isNewTech: boolean | null
    keywords: string | null
    publishedDate: string | null
    images: string | null
    deepAnalysis: string | null
    fullArticle: string | null
    bookmarked: boolean | null
    isRead: boolean | null
    notes: string | null
    createdAt: Date | null
  }

  export type FindingCountAggregateOutputType = {
    id: number
    scanId: number
    url: number
    originalTitle: number
    originalSnippet: number
    trTitle: number
    trSummary: number
    language: number
    sourceName: number
    category: number
    importance: number
    isNewTech: number
    keywords: number
    publishedDate: number
    images: number
    deepAnalysis: number
    fullArticle: number
    bookmarked: number
    isRead: number
    notes: number
    createdAt: number
    _all: number
  }


  export type FindingAvgAggregateInputType = {
    importance?: true
  }

  export type FindingSumAggregateInputType = {
    importance?: true
  }

  export type FindingMinAggregateInputType = {
    id?: true
    scanId?: true
    url?: true
    originalTitle?: true
    originalSnippet?: true
    trTitle?: true
    trSummary?: true
    language?: true
    sourceName?: true
    category?: true
    importance?: true
    isNewTech?: true
    keywords?: true
    publishedDate?: true
    images?: true
    deepAnalysis?: true
    fullArticle?: true
    bookmarked?: true
    isRead?: true
    notes?: true
    createdAt?: true
  }

  export type FindingMaxAggregateInputType = {
    id?: true
    scanId?: true
    url?: true
    originalTitle?: true
    originalSnippet?: true
    trTitle?: true
    trSummary?: true
    language?: true
    sourceName?: true
    category?: true
    importance?: true
    isNewTech?: true
    keywords?: true
    publishedDate?: true
    images?: true
    deepAnalysis?: true
    fullArticle?: true
    bookmarked?: true
    isRead?: true
    notes?: true
    createdAt?: true
  }

  export type FindingCountAggregateInputType = {
    id?: true
    scanId?: true
    url?: true
    originalTitle?: true
    originalSnippet?: true
    trTitle?: true
    trSummary?: true
    language?: true
    sourceName?: true
    category?: true
    importance?: true
    isNewTech?: true
    keywords?: true
    publishedDate?: true
    images?: true
    deepAnalysis?: true
    fullArticle?: true
    bookmarked?: true
    isRead?: true
    notes?: true
    createdAt?: true
    _all?: true
  }

  export type FindingAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Finding to aggregate.
     */
    where?: FindingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Findings to fetch.
     */
    orderBy?: FindingOrderByWithRelationInput | FindingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: FindingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Findings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Findings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Findings
    **/
    _count?: true | FindingCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: FindingAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: FindingSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: FindingMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: FindingMaxAggregateInputType
  }

  export type GetFindingAggregateType<T extends FindingAggregateArgs> = {
        [P in keyof T & keyof AggregateFinding]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateFinding[P]>
      : GetScalarType<T[P], AggregateFinding[P]>
  }




  export type FindingGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FindingWhereInput
    orderBy?: FindingOrderByWithAggregationInput | FindingOrderByWithAggregationInput[]
    by: FindingScalarFieldEnum[] | FindingScalarFieldEnum
    having?: FindingScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: FindingCountAggregateInputType | true
    _avg?: FindingAvgAggregateInputType
    _sum?: FindingSumAggregateInputType
    _min?: FindingMinAggregateInputType
    _max?: FindingMaxAggregateInputType
  }

  export type FindingGroupByOutputType = {
    id: string
    scanId: string | null
    url: string
    originalTitle: string
    originalSnippet: string
    trTitle: string
    trSummary: string
    language: string
    sourceName: string
    category: string
    importance: number
    isNewTech: boolean
    keywords: string
    publishedDate: string | null
    images: string
    deepAnalysis: string | null
    fullArticle: string | null
    bookmarked: boolean
    isRead: boolean
    notes: string | null
    createdAt: Date
    _count: FindingCountAggregateOutputType | null
    _avg: FindingAvgAggregateOutputType | null
    _sum: FindingSumAggregateOutputType | null
    _min: FindingMinAggregateOutputType | null
    _max: FindingMaxAggregateOutputType | null
  }

  type GetFindingGroupByPayload<T extends FindingGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<FindingGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof FindingGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], FindingGroupByOutputType[P]>
            : GetScalarType<T[P], FindingGroupByOutputType[P]>
        }
      >
    >


  export type FindingSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    scanId?: boolean
    url?: boolean
    originalTitle?: boolean
    originalSnippet?: boolean
    trTitle?: boolean
    trSummary?: boolean
    language?: boolean
    sourceName?: boolean
    category?: boolean
    importance?: boolean
    isNewTech?: boolean
    keywords?: boolean
    publishedDate?: boolean
    images?: boolean
    deepAnalysis?: boolean
    fullArticle?: boolean
    bookmarked?: boolean
    isRead?: boolean
    notes?: boolean
    createdAt?: boolean
    scan?: boolean | Finding$scanArgs<ExtArgs>
    comments?: boolean | Finding$commentsArgs<ExtArgs>
    _count?: boolean | FindingCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["finding"]>

  export type FindingSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    scanId?: boolean
    url?: boolean
    originalTitle?: boolean
    originalSnippet?: boolean
    trTitle?: boolean
    trSummary?: boolean
    language?: boolean
    sourceName?: boolean
    category?: boolean
    importance?: boolean
    isNewTech?: boolean
    keywords?: boolean
    publishedDate?: boolean
    images?: boolean
    deepAnalysis?: boolean
    fullArticle?: boolean
    bookmarked?: boolean
    isRead?: boolean
    notes?: boolean
    createdAt?: boolean
    scan?: boolean | Finding$scanArgs<ExtArgs>
  }, ExtArgs["result"]["finding"]>

  export type FindingSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    scanId?: boolean
    url?: boolean
    originalTitle?: boolean
    originalSnippet?: boolean
    trTitle?: boolean
    trSummary?: boolean
    language?: boolean
    sourceName?: boolean
    category?: boolean
    importance?: boolean
    isNewTech?: boolean
    keywords?: boolean
    publishedDate?: boolean
    images?: boolean
    deepAnalysis?: boolean
    fullArticle?: boolean
    bookmarked?: boolean
    isRead?: boolean
    notes?: boolean
    createdAt?: boolean
    scan?: boolean | Finding$scanArgs<ExtArgs>
  }, ExtArgs["result"]["finding"]>

  export type FindingSelectScalar = {
    id?: boolean
    scanId?: boolean
    url?: boolean
    originalTitle?: boolean
    originalSnippet?: boolean
    trTitle?: boolean
    trSummary?: boolean
    language?: boolean
    sourceName?: boolean
    category?: boolean
    importance?: boolean
    isNewTech?: boolean
    keywords?: boolean
    publishedDate?: boolean
    images?: boolean
    deepAnalysis?: boolean
    fullArticle?: boolean
    bookmarked?: boolean
    isRead?: boolean
    notes?: boolean
    createdAt?: boolean
  }

  export type FindingOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "scanId" | "url" | "originalTitle" | "originalSnippet" | "trTitle" | "trSummary" | "language" | "sourceName" | "category" | "importance" | "isNewTech" | "keywords" | "publishedDate" | "images" | "deepAnalysis" | "fullArticle" | "bookmarked" | "isRead" | "notes" | "createdAt", ExtArgs["result"]["finding"]>
  export type FindingInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    scan?: boolean | Finding$scanArgs<ExtArgs>
    comments?: boolean | Finding$commentsArgs<ExtArgs>
    _count?: boolean | FindingCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type FindingIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    scan?: boolean | Finding$scanArgs<ExtArgs>
  }
  export type FindingIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    scan?: boolean | Finding$scanArgs<ExtArgs>
  }

  export type $FindingPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Finding"
    objects: {
      scan: Prisma.$ScanRunPayload<ExtArgs> | null
      comments: Prisma.$CommentPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      scanId: string | null
      url: string
      originalTitle: string
      originalSnippet: string
      trTitle: string
      trSummary: string
      language: string
      sourceName: string
      category: string
      importance: number
      isNewTech: boolean
      keywords: string
      publishedDate: string | null
      images: string
      deepAnalysis: string | null
      fullArticle: string | null
      bookmarked: boolean
      isRead: boolean
      notes: string | null
      createdAt: Date
    }, ExtArgs["result"]["finding"]>
    composites: {}
  }

  type FindingGetPayload<S extends boolean | null | undefined | FindingDefaultArgs> = $Result.GetResult<Prisma.$FindingPayload, S>

  type FindingCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<FindingFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: FindingCountAggregateInputType | true
    }

  export interface FindingDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Finding'], meta: { name: 'Finding' } }
    /**
     * Find zero or one Finding that matches the filter.
     * @param {FindingFindUniqueArgs} args - Arguments to find a Finding
     * @example
     * // Get one Finding
     * const finding = await prisma.finding.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends FindingFindUniqueArgs>(args: SelectSubset<T, FindingFindUniqueArgs<ExtArgs>>): Prisma__FindingClient<$Result.GetResult<Prisma.$FindingPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Finding that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {FindingFindUniqueOrThrowArgs} args - Arguments to find a Finding
     * @example
     * // Get one Finding
     * const finding = await prisma.finding.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends FindingFindUniqueOrThrowArgs>(args: SelectSubset<T, FindingFindUniqueOrThrowArgs<ExtArgs>>): Prisma__FindingClient<$Result.GetResult<Prisma.$FindingPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Finding that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FindingFindFirstArgs} args - Arguments to find a Finding
     * @example
     * // Get one Finding
     * const finding = await prisma.finding.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends FindingFindFirstArgs>(args?: SelectSubset<T, FindingFindFirstArgs<ExtArgs>>): Prisma__FindingClient<$Result.GetResult<Prisma.$FindingPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Finding that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FindingFindFirstOrThrowArgs} args - Arguments to find a Finding
     * @example
     * // Get one Finding
     * const finding = await prisma.finding.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends FindingFindFirstOrThrowArgs>(args?: SelectSubset<T, FindingFindFirstOrThrowArgs<ExtArgs>>): Prisma__FindingClient<$Result.GetResult<Prisma.$FindingPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Findings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FindingFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Findings
     * const findings = await prisma.finding.findMany()
     * 
     * // Get first 10 Findings
     * const findings = await prisma.finding.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const findingWithIdOnly = await prisma.finding.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends FindingFindManyArgs>(args?: SelectSubset<T, FindingFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FindingPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Finding.
     * @param {FindingCreateArgs} args - Arguments to create a Finding.
     * @example
     * // Create one Finding
     * const Finding = await prisma.finding.create({
     *   data: {
     *     // ... data to create a Finding
     *   }
     * })
     * 
     */
    create<T extends FindingCreateArgs>(args: SelectSubset<T, FindingCreateArgs<ExtArgs>>): Prisma__FindingClient<$Result.GetResult<Prisma.$FindingPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Findings.
     * @param {FindingCreateManyArgs} args - Arguments to create many Findings.
     * @example
     * // Create many Findings
     * const finding = await prisma.finding.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends FindingCreateManyArgs>(args?: SelectSubset<T, FindingCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Findings and returns the data saved in the database.
     * @param {FindingCreateManyAndReturnArgs} args - Arguments to create many Findings.
     * @example
     * // Create many Findings
     * const finding = await prisma.finding.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Findings and only return the `id`
     * const findingWithIdOnly = await prisma.finding.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends FindingCreateManyAndReturnArgs>(args?: SelectSubset<T, FindingCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FindingPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Finding.
     * @param {FindingDeleteArgs} args - Arguments to delete one Finding.
     * @example
     * // Delete one Finding
     * const Finding = await prisma.finding.delete({
     *   where: {
     *     // ... filter to delete one Finding
     *   }
     * })
     * 
     */
    delete<T extends FindingDeleteArgs>(args: SelectSubset<T, FindingDeleteArgs<ExtArgs>>): Prisma__FindingClient<$Result.GetResult<Prisma.$FindingPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Finding.
     * @param {FindingUpdateArgs} args - Arguments to update one Finding.
     * @example
     * // Update one Finding
     * const finding = await prisma.finding.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends FindingUpdateArgs>(args: SelectSubset<T, FindingUpdateArgs<ExtArgs>>): Prisma__FindingClient<$Result.GetResult<Prisma.$FindingPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Findings.
     * @param {FindingDeleteManyArgs} args - Arguments to filter Findings to delete.
     * @example
     * // Delete a few Findings
     * const { count } = await prisma.finding.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends FindingDeleteManyArgs>(args?: SelectSubset<T, FindingDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Findings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FindingUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Findings
     * const finding = await prisma.finding.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends FindingUpdateManyArgs>(args: SelectSubset<T, FindingUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Findings and returns the data updated in the database.
     * @param {FindingUpdateManyAndReturnArgs} args - Arguments to update many Findings.
     * @example
     * // Update many Findings
     * const finding = await prisma.finding.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Findings and only return the `id`
     * const findingWithIdOnly = await prisma.finding.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends FindingUpdateManyAndReturnArgs>(args: SelectSubset<T, FindingUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FindingPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Finding.
     * @param {FindingUpsertArgs} args - Arguments to update or create a Finding.
     * @example
     * // Update or create a Finding
     * const finding = await prisma.finding.upsert({
     *   create: {
     *     // ... data to create a Finding
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Finding we want to update
     *   }
     * })
     */
    upsert<T extends FindingUpsertArgs>(args: SelectSubset<T, FindingUpsertArgs<ExtArgs>>): Prisma__FindingClient<$Result.GetResult<Prisma.$FindingPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Findings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FindingCountArgs} args - Arguments to filter Findings to count.
     * @example
     * // Count the number of Findings
     * const count = await prisma.finding.count({
     *   where: {
     *     // ... the filter for the Findings we want to count
     *   }
     * })
    **/
    count<T extends FindingCountArgs>(
      args?: Subset<T, FindingCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], FindingCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Finding.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FindingAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends FindingAggregateArgs>(args: Subset<T, FindingAggregateArgs>): Prisma.PrismaPromise<GetFindingAggregateType<T>>

    /**
     * Group by Finding.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FindingGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends FindingGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: FindingGroupByArgs['orderBy'] }
        : { orderBy?: FindingGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, FindingGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetFindingGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Finding model
   */
  readonly fields: FindingFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Finding.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__FindingClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    scan<T extends Finding$scanArgs<ExtArgs> = {}>(args?: Subset<T, Finding$scanArgs<ExtArgs>>): Prisma__ScanRunClient<$Result.GetResult<Prisma.$ScanRunPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    comments<T extends Finding$commentsArgs<ExtArgs> = {}>(args?: Subset<T, Finding$commentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Finding model
   */
  interface FindingFieldRefs {
    readonly id: FieldRef<"Finding", 'String'>
    readonly scanId: FieldRef<"Finding", 'String'>
    readonly url: FieldRef<"Finding", 'String'>
    readonly originalTitle: FieldRef<"Finding", 'String'>
    readonly originalSnippet: FieldRef<"Finding", 'String'>
    readonly trTitle: FieldRef<"Finding", 'String'>
    readonly trSummary: FieldRef<"Finding", 'String'>
    readonly language: FieldRef<"Finding", 'String'>
    readonly sourceName: FieldRef<"Finding", 'String'>
    readonly category: FieldRef<"Finding", 'String'>
    readonly importance: FieldRef<"Finding", 'Int'>
    readonly isNewTech: FieldRef<"Finding", 'Boolean'>
    readonly keywords: FieldRef<"Finding", 'String'>
    readonly publishedDate: FieldRef<"Finding", 'String'>
    readonly images: FieldRef<"Finding", 'String'>
    readonly deepAnalysis: FieldRef<"Finding", 'String'>
    readonly fullArticle: FieldRef<"Finding", 'String'>
    readonly bookmarked: FieldRef<"Finding", 'Boolean'>
    readonly isRead: FieldRef<"Finding", 'Boolean'>
    readonly notes: FieldRef<"Finding", 'String'>
    readonly createdAt: FieldRef<"Finding", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Finding findUnique
   */
  export type FindingFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Finding
     */
    select?: FindingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Finding
     */
    omit?: FindingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FindingInclude<ExtArgs> | null
    /**
     * Filter, which Finding to fetch.
     */
    where: FindingWhereUniqueInput
  }

  /**
   * Finding findUniqueOrThrow
   */
  export type FindingFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Finding
     */
    select?: FindingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Finding
     */
    omit?: FindingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FindingInclude<ExtArgs> | null
    /**
     * Filter, which Finding to fetch.
     */
    where: FindingWhereUniqueInput
  }

  /**
   * Finding findFirst
   */
  export type FindingFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Finding
     */
    select?: FindingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Finding
     */
    omit?: FindingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FindingInclude<ExtArgs> | null
    /**
     * Filter, which Finding to fetch.
     */
    where?: FindingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Findings to fetch.
     */
    orderBy?: FindingOrderByWithRelationInput | FindingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Findings.
     */
    cursor?: FindingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Findings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Findings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Findings.
     */
    distinct?: FindingScalarFieldEnum | FindingScalarFieldEnum[]
  }

  /**
   * Finding findFirstOrThrow
   */
  export type FindingFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Finding
     */
    select?: FindingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Finding
     */
    omit?: FindingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FindingInclude<ExtArgs> | null
    /**
     * Filter, which Finding to fetch.
     */
    where?: FindingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Findings to fetch.
     */
    orderBy?: FindingOrderByWithRelationInput | FindingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Findings.
     */
    cursor?: FindingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Findings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Findings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Findings.
     */
    distinct?: FindingScalarFieldEnum | FindingScalarFieldEnum[]
  }

  /**
   * Finding findMany
   */
  export type FindingFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Finding
     */
    select?: FindingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Finding
     */
    omit?: FindingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FindingInclude<ExtArgs> | null
    /**
     * Filter, which Findings to fetch.
     */
    where?: FindingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Findings to fetch.
     */
    orderBy?: FindingOrderByWithRelationInput | FindingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Findings.
     */
    cursor?: FindingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Findings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Findings.
     */
    skip?: number
    distinct?: FindingScalarFieldEnum | FindingScalarFieldEnum[]
  }

  /**
   * Finding create
   */
  export type FindingCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Finding
     */
    select?: FindingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Finding
     */
    omit?: FindingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FindingInclude<ExtArgs> | null
    /**
     * The data needed to create a Finding.
     */
    data: XOR<FindingCreateInput, FindingUncheckedCreateInput>
  }

  /**
   * Finding createMany
   */
  export type FindingCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Findings.
     */
    data: FindingCreateManyInput | FindingCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Finding createManyAndReturn
   */
  export type FindingCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Finding
     */
    select?: FindingSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Finding
     */
    omit?: FindingOmit<ExtArgs> | null
    /**
     * The data used to create many Findings.
     */
    data: FindingCreateManyInput | FindingCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FindingIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Finding update
   */
  export type FindingUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Finding
     */
    select?: FindingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Finding
     */
    omit?: FindingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FindingInclude<ExtArgs> | null
    /**
     * The data needed to update a Finding.
     */
    data: XOR<FindingUpdateInput, FindingUncheckedUpdateInput>
    /**
     * Choose, which Finding to update.
     */
    where: FindingWhereUniqueInput
  }

  /**
   * Finding updateMany
   */
  export type FindingUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Findings.
     */
    data: XOR<FindingUpdateManyMutationInput, FindingUncheckedUpdateManyInput>
    /**
     * Filter which Findings to update
     */
    where?: FindingWhereInput
    /**
     * Limit how many Findings to update.
     */
    limit?: number
  }

  /**
   * Finding updateManyAndReturn
   */
  export type FindingUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Finding
     */
    select?: FindingSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Finding
     */
    omit?: FindingOmit<ExtArgs> | null
    /**
     * The data used to update Findings.
     */
    data: XOR<FindingUpdateManyMutationInput, FindingUncheckedUpdateManyInput>
    /**
     * Filter which Findings to update
     */
    where?: FindingWhereInput
    /**
     * Limit how many Findings to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FindingIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Finding upsert
   */
  export type FindingUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Finding
     */
    select?: FindingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Finding
     */
    omit?: FindingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FindingInclude<ExtArgs> | null
    /**
     * The filter to search for the Finding to update in case it exists.
     */
    where: FindingWhereUniqueInput
    /**
     * In case the Finding found by the `where` argument doesn't exist, create a new Finding with this data.
     */
    create: XOR<FindingCreateInput, FindingUncheckedCreateInput>
    /**
     * In case the Finding was found with the provided `where` argument, update it with this data.
     */
    update: XOR<FindingUpdateInput, FindingUncheckedUpdateInput>
  }

  /**
   * Finding delete
   */
  export type FindingDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Finding
     */
    select?: FindingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Finding
     */
    omit?: FindingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FindingInclude<ExtArgs> | null
    /**
     * Filter which Finding to delete.
     */
    where: FindingWhereUniqueInput
  }

  /**
   * Finding deleteMany
   */
  export type FindingDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Findings to delete
     */
    where?: FindingWhereInput
    /**
     * Limit how many Findings to delete.
     */
    limit?: number
  }

  /**
   * Finding.scan
   */
  export type Finding$scanArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScanRun
     */
    select?: ScanRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ScanRun
     */
    omit?: ScanRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScanRunInclude<ExtArgs> | null
    where?: ScanRunWhereInput
  }

  /**
   * Finding.comments
   */
  export type Finding$commentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Comment
     */
    omit?: CommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentInclude<ExtArgs> | null
    where?: CommentWhereInput
    orderBy?: CommentOrderByWithRelationInput | CommentOrderByWithRelationInput[]
    cursor?: CommentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CommentScalarFieldEnum | CommentScalarFieldEnum[]
  }

  /**
   * Finding without action
   */
  export type FindingDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Finding
     */
    select?: FindingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Finding
     */
    omit?: FindingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FindingInclude<ExtArgs> | null
  }


  /**
   * Model Comment
   */

  export type AggregateComment = {
    _count: CommentCountAggregateOutputType | null
    _min: CommentMinAggregateOutputType | null
    _max: CommentMaxAggregateOutputType | null
  }

  export type CommentMinAggregateOutputType = {
    id: string | null
    findingId: string | null
    author: string | null
    body: string | null
    ip: string | null
    createdAt: Date | null
  }

  export type CommentMaxAggregateOutputType = {
    id: string | null
    findingId: string | null
    author: string | null
    body: string | null
    ip: string | null
    createdAt: Date | null
  }

  export type CommentCountAggregateOutputType = {
    id: number
    findingId: number
    author: number
    body: number
    ip: number
    createdAt: number
    _all: number
  }


  export type CommentMinAggregateInputType = {
    id?: true
    findingId?: true
    author?: true
    body?: true
    ip?: true
    createdAt?: true
  }

  export type CommentMaxAggregateInputType = {
    id?: true
    findingId?: true
    author?: true
    body?: true
    ip?: true
    createdAt?: true
  }

  export type CommentCountAggregateInputType = {
    id?: true
    findingId?: true
    author?: true
    body?: true
    ip?: true
    createdAt?: true
    _all?: true
  }

  export type CommentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Comment to aggregate.
     */
    where?: CommentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Comments to fetch.
     */
    orderBy?: CommentOrderByWithRelationInput | CommentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CommentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Comments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Comments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Comments
    **/
    _count?: true | CommentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CommentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CommentMaxAggregateInputType
  }

  export type GetCommentAggregateType<T extends CommentAggregateArgs> = {
        [P in keyof T & keyof AggregateComment]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateComment[P]>
      : GetScalarType<T[P], AggregateComment[P]>
  }




  export type CommentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CommentWhereInput
    orderBy?: CommentOrderByWithAggregationInput | CommentOrderByWithAggregationInput[]
    by: CommentScalarFieldEnum[] | CommentScalarFieldEnum
    having?: CommentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CommentCountAggregateInputType | true
    _min?: CommentMinAggregateInputType
    _max?: CommentMaxAggregateInputType
  }

  export type CommentGroupByOutputType = {
    id: string
    findingId: string
    author: string
    body: string
    ip: string
    createdAt: Date
    _count: CommentCountAggregateOutputType | null
    _min: CommentMinAggregateOutputType | null
    _max: CommentMaxAggregateOutputType | null
  }

  type GetCommentGroupByPayload<T extends CommentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CommentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CommentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CommentGroupByOutputType[P]>
            : GetScalarType<T[P], CommentGroupByOutputType[P]>
        }
      >
    >


  export type CommentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    findingId?: boolean
    author?: boolean
    body?: boolean
    ip?: boolean
    createdAt?: boolean
    finding?: boolean | FindingDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["comment"]>

  export type CommentSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    findingId?: boolean
    author?: boolean
    body?: boolean
    ip?: boolean
    createdAt?: boolean
    finding?: boolean | FindingDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["comment"]>

  export type CommentSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    findingId?: boolean
    author?: boolean
    body?: boolean
    ip?: boolean
    createdAt?: boolean
    finding?: boolean | FindingDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["comment"]>

  export type CommentSelectScalar = {
    id?: boolean
    findingId?: boolean
    author?: boolean
    body?: boolean
    ip?: boolean
    createdAt?: boolean
  }

  export type CommentOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "findingId" | "author" | "body" | "ip" | "createdAt", ExtArgs["result"]["comment"]>
  export type CommentInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    finding?: boolean | FindingDefaultArgs<ExtArgs>
  }
  export type CommentIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    finding?: boolean | FindingDefaultArgs<ExtArgs>
  }
  export type CommentIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    finding?: boolean | FindingDefaultArgs<ExtArgs>
  }

  export type $CommentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Comment"
    objects: {
      finding: Prisma.$FindingPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      findingId: string
      author: string
      body: string
      ip: string
      createdAt: Date
    }, ExtArgs["result"]["comment"]>
    composites: {}
  }

  type CommentGetPayload<S extends boolean | null | undefined | CommentDefaultArgs> = $Result.GetResult<Prisma.$CommentPayload, S>

  type CommentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CommentFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CommentCountAggregateInputType | true
    }

  export interface CommentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Comment'], meta: { name: 'Comment' } }
    /**
     * Find zero or one Comment that matches the filter.
     * @param {CommentFindUniqueArgs} args - Arguments to find a Comment
     * @example
     * // Get one Comment
     * const comment = await prisma.comment.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CommentFindUniqueArgs>(args: SelectSubset<T, CommentFindUniqueArgs<ExtArgs>>): Prisma__CommentClient<$Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Comment that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CommentFindUniqueOrThrowArgs} args - Arguments to find a Comment
     * @example
     * // Get one Comment
     * const comment = await prisma.comment.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CommentFindUniqueOrThrowArgs>(args: SelectSubset<T, CommentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CommentClient<$Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Comment that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommentFindFirstArgs} args - Arguments to find a Comment
     * @example
     * // Get one Comment
     * const comment = await prisma.comment.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CommentFindFirstArgs>(args?: SelectSubset<T, CommentFindFirstArgs<ExtArgs>>): Prisma__CommentClient<$Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Comment that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommentFindFirstOrThrowArgs} args - Arguments to find a Comment
     * @example
     * // Get one Comment
     * const comment = await prisma.comment.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CommentFindFirstOrThrowArgs>(args?: SelectSubset<T, CommentFindFirstOrThrowArgs<ExtArgs>>): Prisma__CommentClient<$Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Comments that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Comments
     * const comments = await prisma.comment.findMany()
     * 
     * // Get first 10 Comments
     * const comments = await prisma.comment.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const commentWithIdOnly = await prisma.comment.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CommentFindManyArgs>(args?: SelectSubset<T, CommentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Comment.
     * @param {CommentCreateArgs} args - Arguments to create a Comment.
     * @example
     * // Create one Comment
     * const Comment = await prisma.comment.create({
     *   data: {
     *     // ... data to create a Comment
     *   }
     * })
     * 
     */
    create<T extends CommentCreateArgs>(args: SelectSubset<T, CommentCreateArgs<ExtArgs>>): Prisma__CommentClient<$Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Comments.
     * @param {CommentCreateManyArgs} args - Arguments to create many Comments.
     * @example
     * // Create many Comments
     * const comment = await prisma.comment.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CommentCreateManyArgs>(args?: SelectSubset<T, CommentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Comments and returns the data saved in the database.
     * @param {CommentCreateManyAndReturnArgs} args - Arguments to create many Comments.
     * @example
     * // Create many Comments
     * const comment = await prisma.comment.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Comments and only return the `id`
     * const commentWithIdOnly = await prisma.comment.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CommentCreateManyAndReturnArgs>(args?: SelectSubset<T, CommentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Comment.
     * @param {CommentDeleteArgs} args - Arguments to delete one Comment.
     * @example
     * // Delete one Comment
     * const Comment = await prisma.comment.delete({
     *   where: {
     *     // ... filter to delete one Comment
     *   }
     * })
     * 
     */
    delete<T extends CommentDeleteArgs>(args: SelectSubset<T, CommentDeleteArgs<ExtArgs>>): Prisma__CommentClient<$Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Comment.
     * @param {CommentUpdateArgs} args - Arguments to update one Comment.
     * @example
     * // Update one Comment
     * const comment = await prisma.comment.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CommentUpdateArgs>(args: SelectSubset<T, CommentUpdateArgs<ExtArgs>>): Prisma__CommentClient<$Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Comments.
     * @param {CommentDeleteManyArgs} args - Arguments to filter Comments to delete.
     * @example
     * // Delete a few Comments
     * const { count } = await prisma.comment.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CommentDeleteManyArgs>(args?: SelectSubset<T, CommentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Comments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Comments
     * const comment = await prisma.comment.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CommentUpdateManyArgs>(args: SelectSubset<T, CommentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Comments and returns the data updated in the database.
     * @param {CommentUpdateManyAndReturnArgs} args - Arguments to update many Comments.
     * @example
     * // Update many Comments
     * const comment = await prisma.comment.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Comments and only return the `id`
     * const commentWithIdOnly = await prisma.comment.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends CommentUpdateManyAndReturnArgs>(args: SelectSubset<T, CommentUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Comment.
     * @param {CommentUpsertArgs} args - Arguments to update or create a Comment.
     * @example
     * // Update or create a Comment
     * const comment = await prisma.comment.upsert({
     *   create: {
     *     // ... data to create a Comment
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Comment we want to update
     *   }
     * })
     */
    upsert<T extends CommentUpsertArgs>(args: SelectSubset<T, CommentUpsertArgs<ExtArgs>>): Prisma__CommentClient<$Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Comments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommentCountArgs} args - Arguments to filter Comments to count.
     * @example
     * // Count the number of Comments
     * const count = await prisma.comment.count({
     *   where: {
     *     // ... the filter for the Comments we want to count
     *   }
     * })
    **/
    count<T extends CommentCountArgs>(
      args?: Subset<T, CommentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CommentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Comment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CommentAggregateArgs>(args: Subset<T, CommentAggregateArgs>): Prisma.PrismaPromise<GetCommentAggregateType<T>>

    /**
     * Group by Comment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommentGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CommentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CommentGroupByArgs['orderBy'] }
        : { orderBy?: CommentGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CommentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCommentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Comment model
   */
  readonly fields: CommentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Comment.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CommentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    finding<T extends FindingDefaultArgs<ExtArgs> = {}>(args?: Subset<T, FindingDefaultArgs<ExtArgs>>): Prisma__FindingClient<$Result.GetResult<Prisma.$FindingPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Comment model
   */
  interface CommentFieldRefs {
    readonly id: FieldRef<"Comment", 'String'>
    readonly findingId: FieldRef<"Comment", 'String'>
    readonly author: FieldRef<"Comment", 'String'>
    readonly body: FieldRef<"Comment", 'String'>
    readonly ip: FieldRef<"Comment", 'String'>
    readonly createdAt: FieldRef<"Comment", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Comment findUnique
   */
  export type CommentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Comment
     */
    omit?: CommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentInclude<ExtArgs> | null
    /**
     * Filter, which Comment to fetch.
     */
    where: CommentWhereUniqueInput
  }

  /**
   * Comment findUniqueOrThrow
   */
  export type CommentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Comment
     */
    omit?: CommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentInclude<ExtArgs> | null
    /**
     * Filter, which Comment to fetch.
     */
    where: CommentWhereUniqueInput
  }

  /**
   * Comment findFirst
   */
  export type CommentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Comment
     */
    omit?: CommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentInclude<ExtArgs> | null
    /**
     * Filter, which Comment to fetch.
     */
    where?: CommentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Comments to fetch.
     */
    orderBy?: CommentOrderByWithRelationInput | CommentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Comments.
     */
    cursor?: CommentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Comments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Comments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Comments.
     */
    distinct?: CommentScalarFieldEnum | CommentScalarFieldEnum[]
  }

  /**
   * Comment findFirstOrThrow
   */
  export type CommentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Comment
     */
    omit?: CommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentInclude<ExtArgs> | null
    /**
     * Filter, which Comment to fetch.
     */
    where?: CommentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Comments to fetch.
     */
    orderBy?: CommentOrderByWithRelationInput | CommentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Comments.
     */
    cursor?: CommentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Comments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Comments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Comments.
     */
    distinct?: CommentScalarFieldEnum | CommentScalarFieldEnum[]
  }

  /**
   * Comment findMany
   */
  export type CommentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Comment
     */
    omit?: CommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentInclude<ExtArgs> | null
    /**
     * Filter, which Comments to fetch.
     */
    where?: CommentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Comments to fetch.
     */
    orderBy?: CommentOrderByWithRelationInput | CommentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Comments.
     */
    cursor?: CommentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Comments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Comments.
     */
    skip?: number
    distinct?: CommentScalarFieldEnum | CommentScalarFieldEnum[]
  }

  /**
   * Comment create
   */
  export type CommentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Comment
     */
    omit?: CommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentInclude<ExtArgs> | null
    /**
     * The data needed to create a Comment.
     */
    data: XOR<CommentCreateInput, CommentUncheckedCreateInput>
  }

  /**
   * Comment createMany
   */
  export type CommentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Comments.
     */
    data: CommentCreateManyInput | CommentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Comment createManyAndReturn
   */
  export type CommentCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Comment
     */
    omit?: CommentOmit<ExtArgs> | null
    /**
     * The data used to create many Comments.
     */
    data: CommentCreateManyInput | CommentCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Comment update
   */
  export type CommentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Comment
     */
    omit?: CommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentInclude<ExtArgs> | null
    /**
     * The data needed to update a Comment.
     */
    data: XOR<CommentUpdateInput, CommentUncheckedUpdateInput>
    /**
     * Choose, which Comment to update.
     */
    where: CommentWhereUniqueInput
  }

  /**
   * Comment updateMany
   */
  export type CommentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Comments.
     */
    data: XOR<CommentUpdateManyMutationInput, CommentUncheckedUpdateManyInput>
    /**
     * Filter which Comments to update
     */
    where?: CommentWhereInput
    /**
     * Limit how many Comments to update.
     */
    limit?: number
  }

  /**
   * Comment updateManyAndReturn
   */
  export type CommentUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Comment
     */
    omit?: CommentOmit<ExtArgs> | null
    /**
     * The data used to update Comments.
     */
    data: XOR<CommentUpdateManyMutationInput, CommentUncheckedUpdateManyInput>
    /**
     * Filter which Comments to update
     */
    where?: CommentWhereInput
    /**
     * Limit how many Comments to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Comment upsert
   */
  export type CommentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Comment
     */
    omit?: CommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentInclude<ExtArgs> | null
    /**
     * The filter to search for the Comment to update in case it exists.
     */
    where: CommentWhereUniqueInput
    /**
     * In case the Comment found by the `where` argument doesn't exist, create a new Comment with this data.
     */
    create: XOR<CommentCreateInput, CommentUncheckedCreateInput>
    /**
     * In case the Comment was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CommentUpdateInput, CommentUncheckedUpdateInput>
  }

  /**
   * Comment delete
   */
  export type CommentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Comment
     */
    omit?: CommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentInclude<ExtArgs> | null
    /**
     * Filter which Comment to delete.
     */
    where: CommentWhereUniqueInput
  }

  /**
   * Comment deleteMany
   */
  export type CommentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Comments to delete
     */
    where?: CommentWhereInput
    /**
     * Limit how many Comments to delete.
     */
    limit?: number
  }

  /**
   * Comment without action
   */
  export type CommentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Comment
     */
    omit?: CommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentInclude<ExtArgs> | null
  }


  /**
   * Model Briefing
   */

  export type AggregateBriefing = {
    _count: BriefingCountAggregateOutputType | null
    _avg: BriefingAvgAggregateOutputType | null
    _sum: BriefingSumAggregateOutputType | null
    _min: BriefingMinAggregateOutputType | null
    _max: BriefingMaxAggregateOutputType | null
  }

  export type BriefingAvgAggregateOutputType = {
    itemCount: number | null
  }

  export type BriefingSumAggregateOutputType = {
    itemCount: number | null
  }

  export type BriefingMinAggregateOutputType = {
    id: string | null
    content: string | null
    itemCount: number | null
    createdAt: Date | null
  }

  export type BriefingMaxAggregateOutputType = {
    id: string | null
    content: string | null
    itemCount: number | null
    createdAt: Date | null
  }

  export type BriefingCountAggregateOutputType = {
    id: number
    content: number
    itemCount: number
    createdAt: number
    _all: number
  }


  export type BriefingAvgAggregateInputType = {
    itemCount?: true
  }

  export type BriefingSumAggregateInputType = {
    itemCount?: true
  }

  export type BriefingMinAggregateInputType = {
    id?: true
    content?: true
    itemCount?: true
    createdAt?: true
  }

  export type BriefingMaxAggregateInputType = {
    id?: true
    content?: true
    itemCount?: true
    createdAt?: true
  }

  export type BriefingCountAggregateInputType = {
    id?: true
    content?: true
    itemCount?: true
    createdAt?: true
    _all?: true
  }

  export type BriefingAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Briefing to aggregate.
     */
    where?: BriefingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Briefings to fetch.
     */
    orderBy?: BriefingOrderByWithRelationInput | BriefingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: BriefingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Briefings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Briefings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Briefings
    **/
    _count?: true | BriefingCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: BriefingAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: BriefingSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: BriefingMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: BriefingMaxAggregateInputType
  }

  export type GetBriefingAggregateType<T extends BriefingAggregateArgs> = {
        [P in keyof T & keyof AggregateBriefing]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateBriefing[P]>
      : GetScalarType<T[P], AggregateBriefing[P]>
  }




  export type BriefingGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BriefingWhereInput
    orderBy?: BriefingOrderByWithAggregationInput | BriefingOrderByWithAggregationInput[]
    by: BriefingScalarFieldEnum[] | BriefingScalarFieldEnum
    having?: BriefingScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: BriefingCountAggregateInputType | true
    _avg?: BriefingAvgAggregateInputType
    _sum?: BriefingSumAggregateInputType
    _min?: BriefingMinAggregateInputType
    _max?: BriefingMaxAggregateInputType
  }

  export type BriefingGroupByOutputType = {
    id: string
    content: string
    itemCount: number
    createdAt: Date
    _count: BriefingCountAggregateOutputType | null
    _avg: BriefingAvgAggregateOutputType | null
    _sum: BriefingSumAggregateOutputType | null
    _min: BriefingMinAggregateOutputType | null
    _max: BriefingMaxAggregateOutputType | null
  }

  type GetBriefingGroupByPayload<T extends BriefingGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<BriefingGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof BriefingGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], BriefingGroupByOutputType[P]>
            : GetScalarType<T[P], BriefingGroupByOutputType[P]>
        }
      >
    >


  export type BriefingSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    content?: boolean
    itemCount?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["briefing"]>

  export type BriefingSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    content?: boolean
    itemCount?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["briefing"]>

  export type BriefingSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    content?: boolean
    itemCount?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["briefing"]>

  export type BriefingSelectScalar = {
    id?: boolean
    content?: boolean
    itemCount?: boolean
    createdAt?: boolean
  }

  export type BriefingOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "content" | "itemCount" | "createdAt", ExtArgs["result"]["briefing"]>

  export type $BriefingPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Briefing"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      content: string
      itemCount: number
      createdAt: Date
    }, ExtArgs["result"]["briefing"]>
    composites: {}
  }

  type BriefingGetPayload<S extends boolean | null | undefined | BriefingDefaultArgs> = $Result.GetResult<Prisma.$BriefingPayload, S>

  type BriefingCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<BriefingFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: BriefingCountAggregateInputType | true
    }

  export interface BriefingDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Briefing'], meta: { name: 'Briefing' } }
    /**
     * Find zero or one Briefing that matches the filter.
     * @param {BriefingFindUniqueArgs} args - Arguments to find a Briefing
     * @example
     * // Get one Briefing
     * const briefing = await prisma.briefing.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends BriefingFindUniqueArgs>(args: SelectSubset<T, BriefingFindUniqueArgs<ExtArgs>>): Prisma__BriefingClient<$Result.GetResult<Prisma.$BriefingPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Briefing that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {BriefingFindUniqueOrThrowArgs} args - Arguments to find a Briefing
     * @example
     * // Get one Briefing
     * const briefing = await prisma.briefing.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends BriefingFindUniqueOrThrowArgs>(args: SelectSubset<T, BriefingFindUniqueOrThrowArgs<ExtArgs>>): Prisma__BriefingClient<$Result.GetResult<Prisma.$BriefingPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Briefing that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BriefingFindFirstArgs} args - Arguments to find a Briefing
     * @example
     * // Get one Briefing
     * const briefing = await prisma.briefing.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends BriefingFindFirstArgs>(args?: SelectSubset<T, BriefingFindFirstArgs<ExtArgs>>): Prisma__BriefingClient<$Result.GetResult<Prisma.$BriefingPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Briefing that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BriefingFindFirstOrThrowArgs} args - Arguments to find a Briefing
     * @example
     * // Get one Briefing
     * const briefing = await prisma.briefing.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends BriefingFindFirstOrThrowArgs>(args?: SelectSubset<T, BriefingFindFirstOrThrowArgs<ExtArgs>>): Prisma__BriefingClient<$Result.GetResult<Prisma.$BriefingPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Briefings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BriefingFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Briefings
     * const briefings = await prisma.briefing.findMany()
     * 
     * // Get first 10 Briefings
     * const briefings = await prisma.briefing.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const briefingWithIdOnly = await prisma.briefing.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends BriefingFindManyArgs>(args?: SelectSubset<T, BriefingFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BriefingPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Briefing.
     * @param {BriefingCreateArgs} args - Arguments to create a Briefing.
     * @example
     * // Create one Briefing
     * const Briefing = await prisma.briefing.create({
     *   data: {
     *     // ... data to create a Briefing
     *   }
     * })
     * 
     */
    create<T extends BriefingCreateArgs>(args: SelectSubset<T, BriefingCreateArgs<ExtArgs>>): Prisma__BriefingClient<$Result.GetResult<Prisma.$BriefingPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Briefings.
     * @param {BriefingCreateManyArgs} args - Arguments to create many Briefings.
     * @example
     * // Create many Briefings
     * const briefing = await prisma.briefing.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends BriefingCreateManyArgs>(args?: SelectSubset<T, BriefingCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Briefings and returns the data saved in the database.
     * @param {BriefingCreateManyAndReturnArgs} args - Arguments to create many Briefings.
     * @example
     * // Create many Briefings
     * const briefing = await prisma.briefing.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Briefings and only return the `id`
     * const briefingWithIdOnly = await prisma.briefing.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends BriefingCreateManyAndReturnArgs>(args?: SelectSubset<T, BriefingCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BriefingPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Briefing.
     * @param {BriefingDeleteArgs} args - Arguments to delete one Briefing.
     * @example
     * // Delete one Briefing
     * const Briefing = await prisma.briefing.delete({
     *   where: {
     *     // ... filter to delete one Briefing
     *   }
     * })
     * 
     */
    delete<T extends BriefingDeleteArgs>(args: SelectSubset<T, BriefingDeleteArgs<ExtArgs>>): Prisma__BriefingClient<$Result.GetResult<Prisma.$BriefingPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Briefing.
     * @param {BriefingUpdateArgs} args - Arguments to update one Briefing.
     * @example
     * // Update one Briefing
     * const briefing = await prisma.briefing.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends BriefingUpdateArgs>(args: SelectSubset<T, BriefingUpdateArgs<ExtArgs>>): Prisma__BriefingClient<$Result.GetResult<Prisma.$BriefingPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Briefings.
     * @param {BriefingDeleteManyArgs} args - Arguments to filter Briefings to delete.
     * @example
     * // Delete a few Briefings
     * const { count } = await prisma.briefing.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends BriefingDeleteManyArgs>(args?: SelectSubset<T, BriefingDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Briefings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BriefingUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Briefings
     * const briefing = await prisma.briefing.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends BriefingUpdateManyArgs>(args: SelectSubset<T, BriefingUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Briefings and returns the data updated in the database.
     * @param {BriefingUpdateManyAndReturnArgs} args - Arguments to update many Briefings.
     * @example
     * // Update many Briefings
     * const briefing = await prisma.briefing.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Briefings and only return the `id`
     * const briefingWithIdOnly = await prisma.briefing.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends BriefingUpdateManyAndReturnArgs>(args: SelectSubset<T, BriefingUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BriefingPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Briefing.
     * @param {BriefingUpsertArgs} args - Arguments to update or create a Briefing.
     * @example
     * // Update or create a Briefing
     * const briefing = await prisma.briefing.upsert({
     *   create: {
     *     // ... data to create a Briefing
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Briefing we want to update
     *   }
     * })
     */
    upsert<T extends BriefingUpsertArgs>(args: SelectSubset<T, BriefingUpsertArgs<ExtArgs>>): Prisma__BriefingClient<$Result.GetResult<Prisma.$BriefingPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Briefings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BriefingCountArgs} args - Arguments to filter Briefings to count.
     * @example
     * // Count the number of Briefings
     * const count = await prisma.briefing.count({
     *   where: {
     *     // ... the filter for the Briefings we want to count
     *   }
     * })
    **/
    count<T extends BriefingCountArgs>(
      args?: Subset<T, BriefingCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], BriefingCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Briefing.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BriefingAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends BriefingAggregateArgs>(args: Subset<T, BriefingAggregateArgs>): Prisma.PrismaPromise<GetBriefingAggregateType<T>>

    /**
     * Group by Briefing.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BriefingGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends BriefingGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: BriefingGroupByArgs['orderBy'] }
        : { orderBy?: BriefingGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, BriefingGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBriefingGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Briefing model
   */
  readonly fields: BriefingFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Briefing.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__BriefingClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Briefing model
   */
  interface BriefingFieldRefs {
    readonly id: FieldRef<"Briefing", 'String'>
    readonly content: FieldRef<"Briefing", 'String'>
    readonly itemCount: FieldRef<"Briefing", 'Int'>
    readonly createdAt: FieldRef<"Briefing", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Briefing findUnique
   */
  export type BriefingFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Briefing
     */
    select?: BriefingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Briefing
     */
    omit?: BriefingOmit<ExtArgs> | null
    /**
     * Filter, which Briefing to fetch.
     */
    where: BriefingWhereUniqueInput
  }

  /**
   * Briefing findUniqueOrThrow
   */
  export type BriefingFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Briefing
     */
    select?: BriefingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Briefing
     */
    omit?: BriefingOmit<ExtArgs> | null
    /**
     * Filter, which Briefing to fetch.
     */
    where: BriefingWhereUniqueInput
  }

  /**
   * Briefing findFirst
   */
  export type BriefingFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Briefing
     */
    select?: BriefingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Briefing
     */
    omit?: BriefingOmit<ExtArgs> | null
    /**
     * Filter, which Briefing to fetch.
     */
    where?: BriefingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Briefings to fetch.
     */
    orderBy?: BriefingOrderByWithRelationInput | BriefingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Briefings.
     */
    cursor?: BriefingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Briefings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Briefings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Briefings.
     */
    distinct?: BriefingScalarFieldEnum | BriefingScalarFieldEnum[]
  }

  /**
   * Briefing findFirstOrThrow
   */
  export type BriefingFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Briefing
     */
    select?: BriefingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Briefing
     */
    omit?: BriefingOmit<ExtArgs> | null
    /**
     * Filter, which Briefing to fetch.
     */
    where?: BriefingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Briefings to fetch.
     */
    orderBy?: BriefingOrderByWithRelationInput | BriefingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Briefings.
     */
    cursor?: BriefingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Briefings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Briefings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Briefings.
     */
    distinct?: BriefingScalarFieldEnum | BriefingScalarFieldEnum[]
  }

  /**
   * Briefing findMany
   */
  export type BriefingFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Briefing
     */
    select?: BriefingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Briefing
     */
    omit?: BriefingOmit<ExtArgs> | null
    /**
     * Filter, which Briefings to fetch.
     */
    where?: BriefingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Briefings to fetch.
     */
    orderBy?: BriefingOrderByWithRelationInput | BriefingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Briefings.
     */
    cursor?: BriefingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Briefings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Briefings.
     */
    skip?: number
    distinct?: BriefingScalarFieldEnum | BriefingScalarFieldEnum[]
  }

  /**
   * Briefing create
   */
  export type BriefingCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Briefing
     */
    select?: BriefingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Briefing
     */
    omit?: BriefingOmit<ExtArgs> | null
    /**
     * The data needed to create a Briefing.
     */
    data: XOR<BriefingCreateInput, BriefingUncheckedCreateInput>
  }

  /**
   * Briefing createMany
   */
  export type BriefingCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Briefings.
     */
    data: BriefingCreateManyInput | BriefingCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Briefing createManyAndReturn
   */
  export type BriefingCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Briefing
     */
    select?: BriefingSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Briefing
     */
    omit?: BriefingOmit<ExtArgs> | null
    /**
     * The data used to create many Briefings.
     */
    data: BriefingCreateManyInput | BriefingCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Briefing update
   */
  export type BriefingUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Briefing
     */
    select?: BriefingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Briefing
     */
    omit?: BriefingOmit<ExtArgs> | null
    /**
     * The data needed to update a Briefing.
     */
    data: XOR<BriefingUpdateInput, BriefingUncheckedUpdateInput>
    /**
     * Choose, which Briefing to update.
     */
    where: BriefingWhereUniqueInput
  }

  /**
   * Briefing updateMany
   */
  export type BriefingUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Briefings.
     */
    data: XOR<BriefingUpdateManyMutationInput, BriefingUncheckedUpdateManyInput>
    /**
     * Filter which Briefings to update
     */
    where?: BriefingWhereInput
    /**
     * Limit how many Briefings to update.
     */
    limit?: number
  }

  /**
   * Briefing updateManyAndReturn
   */
  export type BriefingUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Briefing
     */
    select?: BriefingSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Briefing
     */
    omit?: BriefingOmit<ExtArgs> | null
    /**
     * The data used to update Briefings.
     */
    data: XOR<BriefingUpdateManyMutationInput, BriefingUncheckedUpdateManyInput>
    /**
     * Filter which Briefings to update
     */
    where?: BriefingWhereInput
    /**
     * Limit how many Briefings to update.
     */
    limit?: number
  }

  /**
   * Briefing upsert
   */
  export type BriefingUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Briefing
     */
    select?: BriefingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Briefing
     */
    omit?: BriefingOmit<ExtArgs> | null
    /**
     * The filter to search for the Briefing to update in case it exists.
     */
    where: BriefingWhereUniqueInput
    /**
     * In case the Briefing found by the `where` argument doesn't exist, create a new Briefing with this data.
     */
    create: XOR<BriefingCreateInput, BriefingUncheckedCreateInput>
    /**
     * In case the Briefing was found with the provided `where` argument, update it with this data.
     */
    update: XOR<BriefingUpdateInput, BriefingUncheckedUpdateInput>
  }

  /**
   * Briefing delete
   */
  export type BriefingDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Briefing
     */
    select?: BriefingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Briefing
     */
    omit?: BriefingOmit<ExtArgs> | null
    /**
     * Filter which Briefing to delete.
     */
    where: BriefingWhereUniqueInput
  }

  /**
   * Briefing deleteMany
   */
  export type BriefingDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Briefings to delete
     */
    where?: BriefingWhereInput
    /**
     * Limit how many Briefings to delete.
     */
    limit?: number
  }

  /**
   * Briefing without action
   */
  export type BriefingDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Briefing
     */
    select?: BriefingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Briefing
     */
    omit?: BriefingOmit<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const ScanRunScalarFieldEnum: {
    id: 'id',
    scope: 'scope',
    focusCategory: 'focusCategory',
    status: 'status',
    totalFound: 'totalFound',
    newItems: 'newItems',
    languagesCovered: 'languagesCovered',
    startedAt: 'startedAt',
    completedAt: 'completedAt'
  };

  export type ScanRunScalarFieldEnum = (typeof ScanRunScalarFieldEnum)[keyof typeof ScanRunScalarFieldEnum]


  export const WatchKeywordScalarFieldEnum: {
    id: 'id',
    term: 'term',
    createdAt: 'createdAt'
  };

  export type WatchKeywordScalarFieldEnum = (typeof WatchKeywordScalarFieldEnum)[keyof typeof WatchKeywordScalarFieldEnum]


  export const FindingScalarFieldEnum: {
    id: 'id',
    scanId: 'scanId',
    url: 'url',
    originalTitle: 'originalTitle',
    originalSnippet: 'originalSnippet',
    trTitle: 'trTitle',
    trSummary: 'trSummary',
    language: 'language',
    sourceName: 'sourceName',
    category: 'category',
    importance: 'importance',
    isNewTech: 'isNewTech',
    keywords: 'keywords',
    publishedDate: 'publishedDate',
    images: 'images',
    deepAnalysis: 'deepAnalysis',
    fullArticle: 'fullArticle',
    bookmarked: 'bookmarked',
    isRead: 'isRead',
    notes: 'notes',
    createdAt: 'createdAt'
  };

  export type FindingScalarFieldEnum = (typeof FindingScalarFieldEnum)[keyof typeof FindingScalarFieldEnum]


  export const CommentScalarFieldEnum: {
    id: 'id',
    findingId: 'findingId',
    author: 'author',
    body: 'body',
    ip: 'ip',
    createdAt: 'createdAt'
  };

  export type CommentScalarFieldEnum = (typeof CommentScalarFieldEnum)[keyof typeof CommentScalarFieldEnum]


  export const BriefingScalarFieldEnum: {
    id: 'id',
    content: 'content',
    itemCount: 'itemCount',
    createdAt: 'createdAt'
  };

  export type BriefingScalarFieldEnum = (typeof BriefingScalarFieldEnum)[keyof typeof BriefingScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type ScanRunWhereInput = {
    AND?: ScanRunWhereInput | ScanRunWhereInput[]
    OR?: ScanRunWhereInput[]
    NOT?: ScanRunWhereInput | ScanRunWhereInput[]
    id?: StringFilter<"ScanRun"> | string
    scope?: StringFilter<"ScanRun"> | string
    focusCategory?: StringNullableFilter<"ScanRun"> | string | null
    status?: StringFilter<"ScanRun"> | string
    totalFound?: IntFilter<"ScanRun"> | number
    newItems?: IntFilter<"ScanRun"> | number
    languagesCovered?: IntFilter<"ScanRun"> | number
    startedAt?: DateTimeFilter<"ScanRun"> | Date | string
    completedAt?: DateTimeNullableFilter<"ScanRun"> | Date | string | null
    findings?: FindingListRelationFilter
  }

  export type ScanRunOrderByWithRelationInput = {
    id?: SortOrder
    scope?: SortOrder
    focusCategory?: SortOrderInput | SortOrder
    status?: SortOrder
    totalFound?: SortOrder
    newItems?: SortOrder
    languagesCovered?: SortOrder
    startedAt?: SortOrder
    completedAt?: SortOrderInput | SortOrder
    findings?: FindingOrderByRelationAggregateInput
  }

  export type ScanRunWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ScanRunWhereInput | ScanRunWhereInput[]
    OR?: ScanRunWhereInput[]
    NOT?: ScanRunWhereInput | ScanRunWhereInput[]
    scope?: StringFilter<"ScanRun"> | string
    focusCategory?: StringNullableFilter<"ScanRun"> | string | null
    status?: StringFilter<"ScanRun"> | string
    totalFound?: IntFilter<"ScanRun"> | number
    newItems?: IntFilter<"ScanRun"> | number
    languagesCovered?: IntFilter<"ScanRun"> | number
    startedAt?: DateTimeFilter<"ScanRun"> | Date | string
    completedAt?: DateTimeNullableFilter<"ScanRun"> | Date | string | null
    findings?: FindingListRelationFilter
  }, "id">

  export type ScanRunOrderByWithAggregationInput = {
    id?: SortOrder
    scope?: SortOrder
    focusCategory?: SortOrderInput | SortOrder
    status?: SortOrder
    totalFound?: SortOrder
    newItems?: SortOrder
    languagesCovered?: SortOrder
    startedAt?: SortOrder
    completedAt?: SortOrderInput | SortOrder
    _count?: ScanRunCountOrderByAggregateInput
    _avg?: ScanRunAvgOrderByAggregateInput
    _max?: ScanRunMaxOrderByAggregateInput
    _min?: ScanRunMinOrderByAggregateInput
    _sum?: ScanRunSumOrderByAggregateInput
  }

  export type ScanRunScalarWhereWithAggregatesInput = {
    AND?: ScanRunScalarWhereWithAggregatesInput | ScanRunScalarWhereWithAggregatesInput[]
    OR?: ScanRunScalarWhereWithAggregatesInput[]
    NOT?: ScanRunScalarWhereWithAggregatesInput | ScanRunScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ScanRun"> | string
    scope?: StringWithAggregatesFilter<"ScanRun"> | string
    focusCategory?: StringNullableWithAggregatesFilter<"ScanRun"> | string | null
    status?: StringWithAggregatesFilter<"ScanRun"> | string
    totalFound?: IntWithAggregatesFilter<"ScanRun"> | number
    newItems?: IntWithAggregatesFilter<"ScanRun"> | number
    languagesCovered?: IntWithAggregatesFilter<"ScanRun"> | number
    startedAt?: DateTimeWithAggregatesFilter<"ScanRun"> | Date | string
    completedAt?: DateTimeNullableWithAggregatesFilter<"ScanRun"> | Date | string | null
  }

  export type WatchKeywordWhereInput = {
    AND?: WatchKeywordWhereInput | WatchKeywordWhereInput[]
    OR?: WatchKeywordWhereInput[]
    NOT?: WatchKeywordWhereInput | WatchKeywordWhereInput[]
    id?: StringFilter<"WatchKeyword"> | string
    term?: StringFilter<"WatchKeyword"> | string
    createdAt?: DateTimeFilter<"WatchKeyword"> | Date | string
  }

  export type WatchKeywordOrderByWithRelationInput = {
    id?: SortOrder
    term?: SortOrder
    createdAt?: SortOrder
  }

  export type WatchKeywordWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    term?: string
    AND?: WatchKeywordWhereInput | WatchKeywordWhereInput[]
    OR?: WatchKeywordWhereInput[]
    NOT?: WatchKeywordWhereInput | WatchKeywordWhereInput[]
    createdAt?: DateTimeFilter<"WatchKeyword"> | Date | string
  }, "id" | "term">

  export type WatchKeywordOrderByWithAggregationInput = {
    id?: SortOrder
    term?: SortOrder
    createdAt?: SortOrder
    _count?: WatchKeywordCountOrderByAggregateInput
    _max?: WatchKeywordMaxOrderByAggregateInput
    _min?: WatchKeywordMinOrderByAggregateInput
  }

  export type WatchKeywordScalarWhereWithAggregatesInput = {
    AND?: WatchKeywordScalarWhereWithAggregatesInput | WatchKeywordScalarWhereWithAggregatesInput[]
    OR?: WatchKeywordScalarWhereWithAggregatesInput[]
    NOT?: WatchKeywordScalarWhereWithAggregatesInput | WatchKeywordScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"WatchKeyword"> | string
    term?: StringWithAggregatesFilter<"WatchKeyword"> | string
    createdAt?: DateTimeWithAggregatesFilter<"WatchKeyword"> | Date | string
  }

  export type FindingWhereInput = {
    AND?: FindingWhereInput | FindingWhereInput[]
    OR?: FindingWhereInput[]
    NOT?: FindingWhereInput | FindingWhereInput[]
    id?: StringFilter<"Finding"> | string
    scanId?: StringNullableFilter<"Finding"> | string | null
    url?: StringFilter<"Finding"> | string
    originalTitle?: StringFilter<"Finding"> | string
    originalSnippet?: StringFilter<"Finding"> | string
    trTitle?: StringFilter<"Finding"> | string
    trSummary?: StringFilter<"Finding"> | string
    language?: StringFilter<"Finding"> | string
    sourceName?: StringFilter<"Finding"> | string
    category?: StringFilter<"Finding"> | string
    importance?: IntFilter<"Finding"> | number
    isNewTech?: BoolFilter<"Finding"> | boolean
    keywords?: StringFilter<"Finding"> | string
    publishedDate?: StringNullableFilter<"Finding"> | string | null
    images?: StringFilter<"Finding"> | string
    deepAnalysis?: StringNullableFilter<"Finding"> | string | null
    fullArticle?: StringNullableFilter<"Finding"> | string | null
    bookmarked?: BoolFilter<"Finding"> | boolean
    isRead?: BoolFilter<"Finding"> | boolean
    notes?: StringNullableFilter<"Finding"> | string | null
    createdAt?: DateTimeFilter<"Finding"> | Date | string
    scan?: XOR<ScanRunNullableScalarRelationFilter, ScanRunWhereInput> | null
    comments?: CommentListRelationFilter
  }

  export type FindingOrderByWithRelationInput = {
    id?: SortOrder
    scanId?: SortOrderInput | SortOrder
    url?: SortOrder
    originalTitle?: SortOrder
    originalSnippet?: SortOrder
    trTitle?: SortOrder
    trSummary?: SortOrder
    language?: SortOrder
    sourceName?: SortOrder
    category?: SortOrder
    importance?: SortOrder
    isNewTech?: SortOrder
    keywords?: SortOrder
    publishedDate?: SortOrderInput | SortOrder
    images?: SortOrder
    deepAnalysis?: SortOrderInput | SortOrder
    fullArticle?: SortOrderInput | SortOrder
    bookmarked?: SortOrder
    isRead?: SortOrder
    notes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    scan?: ScanRunOrderByWithRelationInput
    comments?: CommentOrderByRelationAggregateInput
  }

  export type FindingWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    url?: string
    AND?: FindingWhereInput | FindingWhereInput[]
    OR?: FindingWhereInput[]
    NOT?: FindingWhereInput | FindingWhereInput[]
    scanId?: StringNullableFilter<"Finding"> | string | null
    originalTitle?: StringFilter<"Finding"> | string
    originalSnippet?: StringFilter<"Finding"> | string
    trTitle?: StringFilter<"Finding"> | string
    trSummary?: StringFilter<"Finding"> | string
    language?: StringFilter<"Finding"> | string
    sourceName?: StringFilter<"Finding"> | string
    category?: StringFilter<"Finding"> | string
    importance?: IntFilter<"Finding"> | number
    isNewTech?: BoolFilter<"Finding"> | boolean
    keywords?: StringFilter<"Finding"> | string
    publishedDate?: StringNullableFilter<"Finding"> | string | null
    images?: StringFilter<"Finding"> | string
    deepAnalysis?: StringNullableFilter<"Finding"> | string | null
    fullArticle?: StringNullableFilter<"Finding"> | string | null
    bookmarked?: BoolFilter<"Finding"> | boolean
    isRead?: BoolFilter<"Finding"> | boolean
    notes?: StringNullableFilter<"Finding"> | string | null
    createdAt?: DateTimeFilter<"Finding"> | Date | string
    scan?: XOR<ScanRunNullableScalarRelationFilter, ScanRunWhereInput> | null
    comments?: CommentListRelationFilter
  }, "id" | "url">

  export type FindingOrderByWithAggregationInput = {
    id?: SortOrder
    scanId?: SortOrderInput | SortOrder
    url?: SortOrder
    originalTitle?: SortOrder
    originalSnippet?: SortOrder
    trTitle?: SortOrder
    trSummary?: SortOrder
    language?: SortOrder
    sourceName?: SortOrder
    category?: SortOrder
    importance?: SortOrder
    isNewTech?: SortOrder
    keywords?: SortOrder
    publishedDate?: SortOrderInput | SortOrder
    images?: SortOrder
    deepAnalysis?: SortOrderInput | SortOrder
    fullArticle?: SortOrderInput | SortOrder
    bookmarked?: SortOrder
    isRead?: SortOrder
    notes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: FindingCountOrderByAggregateInput
    _avg?: FindingAvgOrderByAggregateInput
    _max?: FindingMaxOrderByAggregateInput
    _min?: FindingMinOrderByAggregateInput
    _sum?: FindingSumOrderByAggregateInput
  }

  export type FindingScalarWhereWithAggregatesInput = {
    AND?: FindingScalarWhereWithAggregatesInput | FindingScalarWhereWithAggregatesInput[]
    OR?: FindingScalarWhereWithAggregatesInput[]
    NOT?: FindingScalarWhereWithAggregatesInput | FindingScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Finding"> | string
    scanId?: StringNullableWithAggregatesFilter<"Finding"> | string | null
    url?: StringWithAggregatesFilter<"Finding"> | string
    originalTitle?: StringWithAggregatesFilter<"Finding"> | string
    originalSnippet?: StringWithAggregatesFilter<"Finding"> | string
    trTitle?: StringWithAggregatesFilter<"Finding"> | string
    trSummary?: StringWithAggregatesFilter<"Finding"> | string
    language?: StringWithAggregatesFilter<"Finding"> | string
    sourceName?: StringWithAggregatesFilter<"Finding"> | string
    category?: StringWithAggregatesFilter<"Finding"> | string
    importance?: IntWithAggregatesFilter<"Finding"> | number
    isNewTech?: BoolWithAggregatesFilter<"Finding"> | boolean
    keywords?: StringWithAggregatesFilter<"Finding"> | string
    publishedDate?: StringNullableWithAggregatesFilter<"Finding"> | string | null
    images?: StringWithAggregatesFilter<"Finding"> | string
    deepAnalysis?: StringNullableWithAggregatesFilter<"Finding"> | string | null
    fullArticle?: StringNullableWithAggregatesFilter<"Finding"> | string | null
    bookmarked?: BoolWithAggregatesFilter<"Finding"> | boolean
    isRead?: BoolWithAggregatesFilter<"Finding"> | boolean
    notes?: StringNullableWithAggregatesFilter<"Finding"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Finding"> | Date | string
  }

  export type CommentWhereInput = {
    AND?: CommentWhereInput | CommentWhereInput[]
    OR?: CommentWhereInput[]
    NOT?: CommentWhereInput | CommentWhereInput[]
    id?: StringFilter<"Comment"> | string
    findingId?: StringFilter<"Comment"> | string
    author?: StringFilter<"Comment"> | string
    body?: StringFilter<"Comment"> | string
    ip?: StringFilter<"Comment"> | string
    createdAt?: DateTimeFilter<"Comment"> | Date | string
    finding?: XOR<FindingScalarRelationFilter, FindingWhereInput>
  }

  export type CommentOrderByWithRelationInput = {
    id?: SortOrder
    findingId?: SortOrder
    author?: SortOrder
    body?: SortOrder
    ip?: SortOrder
    createdAt?: SortOrder
    finding?: FindingOrderByWithRelationInput
  }

  export type CommentWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: CommentWhereInput | CommentWhereInput[]
    OR?: CommentWhereInput[]
    NOT?: CommentWhereInput | CommentWhereInput[]
    findingId?: StringFilter<"Comment"> | string
    author?: StringFilter<"Comment"> | string
    body?: StringFilter<"Comment"> | string
    ip?: StringFilter<"Comment"> | string
    createdAt?: DateTimeFilter<"Comment"> | Date | string
    finding?: XOR<FindingScalarRelationFilter, FindingWhereInput>
  }, "id">

  export type CommentOrderByWithAggregationInput = {
    id?: SortOrder
    findingId?: SortOrder
    author?: SortOrder
    body?: SortOrder
    ip?: SortOrder
    createdAt?: SortOrder
    _count?: CommentCountOrderByAggregateInput
    _max?: CommentMaxOrderByAggregateInput
    _min?: CommentMinOrderByAggregateInput
  }

  export type CommentScalarWhereWithAggregatesInput = {
    AND?: CommentScalarWhereWithAggregatesInput | CommentScalarWhereWithAggregatesInput[]
    OR?: CommentScalarWhereWithAggregatesInput[]
    NOT?: CommentScalarWhereWithAggregatesInput | CommentScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Comment"> | string
    findingId?: StringWithAggregatesFilter<"Comment"> | string
    author?: StringWithAggregatesFilter<"Comment"> | string
    body?: StringWithAggregatesFilter<"Comment"> | string
    ip?: StringWithAggregatesFilter<"Comment"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Comment"> | Date | string
  }

  export type BriefingWhereInput = {
    AND?: BriefingWhereInput | BriefingWhereInput[]
    OR?: BriefingWhereInput[]
    NOT?: BriefingWhereInput | BriefingWhereInput[]
    id?: StringFilter<"Briefing"> | string
    content?: StringFilter<"Briefing"> | string
    itemCount?: IntFilter<"Briefing"> | number
    createdAt?: DateTimeFilter<"Briefing"> | Date | string
  }

  export type BriefingOrderByWithRelationInput = {
    id?: SortOrder
    content?: SortOrder
    itemCount?: SortOrder
    createdAt?: SortOrder
  }

  export type BriefingWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: BriefingWhereInput | BriefingWhereInput[]
    OR?: BriefingWhereInput[]
    NOT?: BriefingWhereInput | BriefingWhereInput[]
    content?: StringFilter<"Briefing"> | string
    itemCount?: IntFilter<"Briefing"> | number
    createdAt?: DateTimeFilter<"Briefing"> | Date | string
  }, "id">

  export type BriefingOrderByWithAggregationInput = {
    id?: SortOrder
    content?: SortOrder
    itemCount?: SortOrder
    createdAt?: SortOrder
    _count?: BriefingCountOrderByAggregateInput
    _avg?: BriefingAvgOrderByAggregateInput
    _max?: BriefingMaxOrderByAggregateInput
    _min?: BriefingMinOrderByAggregateInput
    _sum?: BriefingSumOrderByAggregateInput
  }

  export type BriefingScalarWhereWithAggregatesInput = {
    AND?: BriefingScalarWhereWithAggregatesInput | BriefingScalarWhereWithAggregatesInput[]
    OR?: BriefingScalarWhereWithAggregatesInput[]
    NOT?: BriefingScalarWhereWithAggregatesInput | BriefingScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Briefing"> | string
    content?: StringWithAggregatesFilter<"Briefing"> | string
    itemCount?: IntWithAggregatesFilter<"Briefing"> | number
    createdAt?: DateTimeWithAggregatesFilter<"Briefing"> | Date | string
  }

  export type ScanRunCreateInput = {
    id?: string
    scope?: string
    focusCategory?: string | null
    status?: string
    totalFound?: number
    newItems?: number
    languagesCovered?: number
    startedAt?: Date | string
    completedAt?: Date | string | null
    findings?: FindingCreateNestedManyWithoutScanInput
  }

  export type ScanRunUncheckedCreateInput = {
    id?: string
    scope?: string
    focusCategory?: string | null
    status?: string
    totalFound?: number
    newItems?: number
    languagesCovered?: number
    startedAt?: Date | string
    completedAt?: Date | string | null
    findings?: FindingUncheckedCreateNestedManyWithoutScanInput
  }

  export type ScanRunUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    scope?: StringFieldUpdateOperationsInput | string
    focusCategory?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    totalFound?: IntFieldUpdateOperationsInput | number
    newItems?: IntFieldUpdateOperationsInput | number
    languagesCovered?: IntFieldUpdateOperationsInput | number
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    findings?: FindingUpdateManyWithoutScanNestedInput
  }

  export type ScanRunUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    scope?: StringFieldUpdateOperationsInput | string
    focusCategory?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    totalFound?: IntFieldUpdateOperationsInput | number
    newItems?: IntFieldUpdateOperationsInput | number
    languagesCovered?: IntFieldUpdateOperationsInput | number
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    findings?: FindingUncheckedUpdateManyWithoutScanNestedInput
  }

  export type ScanRunCreateManyInput = {
    id?: string
    scope?: string
    focusCategory?: string | null
    status?: string
    totalFound?: number
    newItems?: number
    languagesCovered?: number
    startedAt?: Date | string
    completedAt?: Date | string | null
  }

  export type ScanRunUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    scope?: StringFieldUpdateOperationsInput | string
    focusCategory?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    totalFound?: IntFieldUpdateOperationsInput | number
    newItems?: IntFieldUpdateOperationsInput | number
    languagesCovered?: IntFieldUpdateOperationsInput | number
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ScanRunUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    scope?: StringFieldUpdateOperationsInput | string
    focusCategory?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    totalFound?: IntFieldUpdateOperationsInput | number
    newItems?: IntFieldUpdateOperationsInput | number
    languagesCovered?: IntFieldUpdateOperationsInput | number
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type WatchKeywordCreateInput = {
    id?: string
    term: string
    createdAt?: Date | string
  }

  export type WatchKeywordUncheckedCreateInput = {
    id?: string
    term: string
    createdAt?: Date | string
  }

  export type WatchKeywordUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    term?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WatchKeywordUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    term?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WatchKeywordCreateManyInput = {
    id?: string
    term: string
    createdAt?: Date | string
  }

  export type WatchKeywordUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    term?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WatchKeywordUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    term?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FindingCreateInput = {
    id?: string
    url: string
    originalTitle: string
    originalSnippet?: string
    trTitle: string
    trSummary?: string
    language: string
    sourceName?: string
    category?: string
    importance?: number
    isNewTech?: boolean
    keywords?: string
    publishedDate?: string | null
    images?: string
    deepAnalysis?: string | null
    fullArticle?: string | null
    bookmarked?: boolean
    isRead?: boolean
    notes?: string | null
    createdAt?: Date | string
    scan?: ScanRunCreateNestedOneWithoutFindingsInput
    comments?: CommentCreateNestedManyWithoutFindingInput
  }

  export type FindingUncheckedCreateInput = {
    id?: string
    scanId?: string | null
    url: string
    originalTitle: string
    originalSnippet?: string
    trTitle: string
    trSummary?: string
    language: string
    sourceName?: string
    category?: string
    importance?: number
    isNewTech?: boolean
    keywords?: string
    publishedDate?: string | null
    images?: string
    deepAnalysis?: string | null
    fullArticle?: string | null
    bookmarked?: boolean
    isRead?: boolean
    notes?: string | null
    createdAt?: Date | string
    comments?: CommentUncheckedCreateNestedManyWithoutFindingInput
  }

  export type FindingUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    originalTitle?: StringFieldUpdateOperationsInput | string
    originalSnippet?: StringFieldUpdateOperationsInput | string
    trTitle?: StringFieldUpdateOperationsInput | string
    trSummary?: StringFieldUpdateOperationsInput | string
    language?: StringFieldUpdateOperationsInput | string
    sourceName?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    importance?: IntFieldUpdateOperationsInput | number
    isNewTech?: BoolFieldUpdateOperationsInput | boolean
    keywords?: StringFieldUpdateOperationsInput | string
    publishedDate?: NullableStringFieldUpdateOperationsInput | string | null
    images?: StringFieldUpdateOperationsInput | string
    deepAnalysis?: NullableStringFieldUpdateOperationsInput | string | null
    fullArticle?: NullableStringFieldUpdateOperationsInput | string | null
    bookmarked?: BoolFieldUpdateOperationsInput | boolean
    isRead?: BoolFieldUpdateOperationsInput | boolean
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    scan?: ScanRunUpdateOneWithoutFindingsNestedInput
    comments?: CommentUpdateManyWithoutFindingNestedInput
  }

  export type FindingUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    scanId?: NullableStringFieldUpdateOperationsInput | string | null
    url?: StringFieldUpdateOperationsInput | string
    originalTitle?: StringFieldUpdateOperationsInput | string
    originalSnippet?: StringFieldUpdateOperationsInput | string
    trTitle?: StringFieldUpdateOperationsInput | string
    trSummary?: StringFieldUpdateOperationsInput | string
    language?: StringFieldUpdateOperationsInput | string
    sourceName?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    importance?: IntFieldUpdateOperationsInput | number
    isNewTech?: BoolFieldUpdateOperationsInput | boolean
    keywords?: StringFieldUpdateOperationsInput | string
    publishedDate?: NullableStringFieldUpdateOperationsInput | string | null
    images?: StringFieldUpdateOperationsInput | string
    deepAnalysis?: NullableStringFieldUpdateOperationsInput | string | null
    fullArticle?: NullableStringFieldUpdateOperationsInput | string | null
    bookmarked?: BoolFieldUpdateOperationsInput | boolean
    isRead?: BoolFieldUpdateOperationsInput | boolean
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    comments?: CommentUncheckedUpdateManyWithoutFindingNestedInput
  }

  export type FindingCreateManyInput = {
    id?: string
    scanId?: string | null
    url: string
    originalTitle: string
    originalSnippet?: string
    trTitle: string
    trSummary?: string
    language: string
    sourceName?: string
    category?: string
    importance?: number
    isNewTech?: boolean
    keywords?: string
    publishedDate?: string | null
    images?: string
    deepAnalysis?: string | null
    fullArticle?: string | null
    bookmarked?: boolean
    isRead?: boolean
    notes?: string | null
    createdAt?: Date | string
  }

  export type FindingUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    originalTitle?: StringFieldUpdateOperationsInput | string
    originalSnippet?: StringFieldUpdateOperationsInput | string
    trTitle?: StringFieldUpdateOperationsInput | string
    trSummary?: StringFieldUpdateOperationsInput | string
    language?: StringFieldUpdateOperationsInput | string
    sourceName?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    importance?: IntFieldUpdateOperationsInput | number
    isNewTech?: BoolFieldUpdateOperationsInput | boolean
    keywords?: StringFieldUpdateOperationsInput | string
    publishedDate?: NullableStringFieldUpdateOperationsInput | string | null
    images?: StringFieldUpdateOperationsInput | string
    deepAnalysis?: NullableStringFieldUpdateOperationsInput | string | null
    fullArticle?: NullableStringFieldUpdateOperationsInput | string | null
    bookmarked?: BoolFieldUpdateOperationsInput | boolean
    isRead?: BoolFieldUpdateOperationsInput | boolean
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FindingUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    scanId?: NullableStringFieldUpdateOperationsInput | string | null
    url?: StringFieldUpdateOperationsInput | string
    originalTitle?: StringFieldUpdateOperationsInput | string
    originalSnippet?: StringFieldUpdateOperationsInput | string
    trTitle?: StringFieldUpdateOperationsInput | string
    trSummary?: StringFieldUpdateOperationsInput | string
    language?: StringFieldUpdateOperationsInput | string
    sourceName?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    importance?: IntFieldUpdateOperationsInput | number
    isNewTech?: BoolFieldUpdateOperationsInput | boolean
    keywords?: StringFieldUpdateOperationsInput | string
    publishedDate?: NullableStringFieldUpdateOperationsInput | string | null
    images?: StringFieldUpdateOperationsInput | string
    deepAnalysis?: NullableStringFieldUpdateOperationsInput | string | null
    fullArticle?: NullableStringFieldUpdateOperationsInput | string | null
    bookmarked?: BoolFieldUpdateOperationsInput | boolean
    isRead?: BoolFieldUpdateOperationsInput | boolean
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CommentCreateInput = {
    id?: string
    author?: string
    body: string
    ip?: string
    createdAt?: Date | string
    finding: FindingCreateNestedOneWithoutCommentsInput
  }

  export type CommentUncheckedCreateInput = {
    id?: string
    findingId: string
    author?: string
    body: string
    ip?: string
    createdAt?: Date | string
  }

  export type CommentUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    author?: StringFieldUpdateOperationsInput | string
    body?: StringFieldUpdateOperationsInput | string
    ip?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    finding?: FindingUpdateOneRequiredWithoutCommentsNestedInput
  }

  export type CommentUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    findingId?: StringFieldUpdateOperationsInput | string
    author?: StringFieldUpdateOperationsInput | string
    body?: StringFieldUpdateOperationsInput | string
    ip?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CommentCreateManyInput = {
    id?: string
    findingId: string
    author?: string
    body: string
    ip?: string
    createdAt?: Date | string
  }

  export type CommentUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    author?: StringFieldUpdateOperationsInput | string
    body?: StringFieldUpdateOperationsInput | string
    ip?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CommentUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    findingId?: StringFieldUpdateOperationsInput | string
    author?: StringFieldUpdateOperationsInput | string
    body?: StringFieldUpdateOperationsInput | string
    ip?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BriefingCreateInput = {
    id?: string
    content: string
    itemCount?: number
    createdAt?: Date | string
  }

  export type BriefingUncheckedCreateInput = {
    id?: string
    content: string
    itemCount?: number
    createdAt?: Date | string
  }

  export type BriefingUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    itemCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BriefingUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    itemCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BriefingCreateManyInput = {
    id?: string
    content: string
    itemCount?: number
    createdAt?: Date | string
  }

  export type BriefingUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    itemCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BriefingUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    itemCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type FindingListRelationFilter = {
    every?: FindingWhereInput
    some?: FindingWhereInput
    none?: FindingWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type FindingOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ScanRunCountOrderByAggregateInput = {
    id?: SortOrder
    scope?: SortOrder
    focusCategory?: SortOrder
    status?: SortOrder
    totalFound?: SortOrder
    newItems?: SortOrder
    languagesCovered?: SortOrder
    startedAt?: SortOrder
    completedAt?: SortOrder
  }

  export type ScanRunAvgOrderByAggregateInput = {
    totalFound?: SortOrder
    newItems?: SortOrder
    languagesCovered?: SortOrder
  }

  export type ScanRunMaxOrderByAggregateInput = {
    id?: SortOrder
    scope?: SortOrder
    focusCategory?: SortOrder
    status?: SortOrder
    totalFound?: SortOrder
    newItems?: SortOrder
    languagesCovered?: SortOrder
    startedAt?: SortOrder
    completedAt?: SortOrder
  }

  export type ScanRunMinOrderByAggregateInput = {
    id?: SortOrder
    scope?: SortOrder
    focusCategory?: SortOrder
    status?: SortOrder
    totalFound?: SortOrder
    newItems?: SortOrder
    languagesCovered?: SortOrder
    startedAt?: SortOrder
    completedAt?: SortOrder
  }

  export type ScanRunSumOrderByAggregateInput = {
    totalFound?: SortOrder
    newItems?: SortOrder
    languagesCovered?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type WatchKeywordCountOrderByAggregateInput = {
    id?: SortOrder
    term?: SortOrder
    createdAt?: SortOrder
  }

  export type WatchKeywordMaxOrderByAggregateInput = {
    id?: SortOrder
    term?: SortOrder
    createdAt?: SortOrder
  }

  export type WatchKeywordMinOrderByAggregateInput = {
    id?: SortOrder
    term?: SortOrder
    createdAt?: SortOrder
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type ScanRunNullableScalarRelationFilter = {
    is?: ScanRunWhereInput | null
    isNot?: ScanRunWhereInput | null
  }

  export type CommentListRelationFilter = {
    every?: CommentWhereInput
    some?: CommentWhereInput
    none?: CommentWhereInput
  }

  export type CommentOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type FindingCountOrderByAggregateInput = {
    id?: SortOrder
    scanId?: SortOrder
    url?: SortOrder
    originalTitle?: SortOrder
    originalSnippet?: SortOrder
    trTitle?: SortOrder
    trSummary?: SortOrder
    language?: SortOrder
    sourceName?: SortOrder
    category?: SortOrder
    importance?: SortOrder
    isNewTech?: SortOrder
    keywords?: SortOrder
    publishedDate?: SortOrder
    images?: SortOrder
    deepAnalysis?: SortOrder
    fullArticle?: SortOrder
    bookmarked?: SortOrder
    isRead?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
  }

  export type FindingAvgOrderByAggregateInput = {
    importance?: SortOrder
  }

  export type FindingMaxOrderByAggregateInput = {
    id?: SortOrder
    scanId?: SortOrder
    url?: SortOrder
    originalTitle?: SortOrder
    originalSnippet?: SortOrder
    trTitle?: SortOrder
    trSummary?: SortOrder
    language?: SortOrder
    sourceName?: SortOrder
    category?: SortOrder
    importance?: SortOrder
    isNewTech?: SortOrder
    keywords?: SortOrder
    publishedDate?: SortOrder
    images?: SortOrder
    deepAnalysis?: SortOrder
    fullArticle?: SortOrder
    bookmarked?: SortOrder
    isRead?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
  }

  export type FindingMinOrderByAggregateInput = {
    id?: SortOrder
    scanId?: SortOrder
    url?: SortOrder
    originalTitle?: SortOrder
    originalSnippet?: SortOrder
    trTitle?: SortOrder
    trSummary?: SortOrder
    language?: SortOrder
    sourceName?: SortOrder
    category?: SortOrder
    importance?: SortOrder
    isNewTech?: SortOrder
    keywords?: SortOrder
    publishedDate?: SortOrder
    images?: SortOrder
    deepAnalysis?: SortOrder
    fullArticle?: SortOrder
    bookmarked?: SortOrder
    isRead?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
  }

  export type FindingSumOrderByAggregateInput = {
    importance?: SortOrder
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type FindingScalarRelationFilter = {
    is?: FindingWhereInput
    isNot?: FindingWhereInput
  }

  export type CommentCountOrderByAggregateInput = {
    id?: SortOrder
    findingId?: SortOrder
    author?: SortOrder
    body?: SortOrder
    ip?: SortOrder
    createdAt?: SortOrder
  }

  export type CommentMaxOrderByAggregateInput = {
    id?: SortOrder
    findingId?: SortOrder
    author?: SortOrder
    body?: SortOrder
    ip?: SortOrder
    createdAt?: SortOrder
  }

  export type CommentMinOrderByAggregateInput = {
    id?: SortOrder
    findingId?: SortOrder
    author?: SortOrder
    body?: SortOrder
    ip?: SortOrder
    createdAt?: SortOrder
  }

  export type BriefingCountOrderByAggregateInput = {
    id?: SortOrder
    content?: SortOrder
    itemCount?: SortOrder
    createdAt?: SortOrder
  }

  export type BriefingAvgOrderByAggregateInput = {
    itemCount?: SortOrder
  }

  export type BriefingMaxOrderByAggregateInput = {
    id?: SortOrder
    content?: SortOrder
    itemCount?: SortOrder
    createdAt?: SortOrder
  }

  export type BriefingMinOrderByAggregateInput = {
    id?: SortOrder
    content?: SortOrder
    itemCount?: SortOrder
    createdAt?: SortOrder
  }

  export type BriefingSumOrderByAggregateInput = {
    itemCount?: SortOrder
  }

  export type FindingCreateNestedManyWithoutScanInput = {
    create?: XOR<FindingCreateWithoutScanInput, FindingUncheckedCreateWithoutScanInput> | FindingCreateWithoutScanInput[] | FindingUncheckedCreateWithoutScanInput[]
    connectOrCreate?: FindingCreateOrConnectWithoutScanInput | FindingCreateOrConnectWithoutScanInput[]
    createMany?: FindingCreateManyScanInputEnvelope
    connect?: FindingWhereUniqueInput | FindingWhereUniqueInput[]
  }

  export type FindingUncheckedCreateNestedManyWithoutScanInput = {
    create?: XOR<FindingCreateWithoutScanInput, FindingUncheckedCreateWithoutScanInput> | FindingCreateWithoutScanInput[] | FindingUncheckedCreateWithoutScanInput[]
    connectOrCreate?: FindingCreateOrConnectWithoutScanInput | FindingCreateOrConnectWithoutScanInput[]
    createMany?: FindingCreateManyScanInputEnvelope
    connect?: FindingWhereUniqueInput | FindingWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type FindingUpdateManyWithoutScanNestedInput = {
    create?: XOR<FindingCreateWithoutScanInput, FindingUncheckedCreateWithoutScanInput> | FindingCreateWithoutScanInput[] | FindingUncheckedCreateWithoutScanInput[]
    connectOrCreate?: FindingCreateOrConnectWithoutScanInput | FindingCreateOrConnectWithoutScanInput[]
    upsert?: FindingUpsertWithWhereUniqueWithoutScanInput | FindingUpsertWithWhereUniqueWithoutScanInput[]
    createMany?: FindingCreateManyScanInputEnvelope
    set?: FindingWhereUniqueInput | FindingWhereUniqueInput[]
    disconnect?: FindingWhereUniqueInput | FindingWhereUniqueInput[]
    delete?: FindingWhereUniqueInput | FindingWhereUniqueInput[]
    connect?: FindingWhereUniqueInput | FindingWhereUniqueInput[]
    update?: FindingUpdateWithWhereUniqueWithoutScanInput | FindingUpdateWithWhereUniqueWithoutScanInput[]
    updateMany?: FindingUpdateManyWithWhereWithoutScanInput | FindingUpdateManyWithWhereWithoutScanInput[]
    deleteMany?: FindingScalarWhereInput | FindingScalarWhereInput[]
  }

  export type FindingUncheckedUpdateManyWithoutScanNestedInput = {
    create?: XOR<FindingCreateWithoutScanInput, FindingUncheckedCreateWithoutScanInput> | FindingCreateWithoutScanInput[] | FindingUncheckedCreateWithoutScanInput[]
    connectOrCreate?: FindingCreateOrConnectWithoutScanInput | FindingCreateOrConnectWithoutScanInput[]
    upsert?: FindingUpsertWithWhereUniqueWithoutScanInput | FindingUpsertWithWhereUniqueWithoutScanInput[]
    createMany?: FindingCreateManyScanInputEnvelope
    set?: FindingWhereUniqueInput | FindingWhereUniqueInput[]
    disconnect?: FindingWhereUniqueInput | FindingWhereUniqueInput[]
    delete?: FindingWhereUniqueInput | FindingWhereUniqueInput[]
    connect?: FindingWhereUniqueInput | FindingWhereUniqueInput[]
    update?: FindingUpdateWithWhereUniqueWithoutScanInput | FindingUpdateWithWhereUniqueWithoutScanInput[]
    updateMany?: FindingUpdateManyWithWhereWithoutScanInput | FindingUpdateManyWithWhereWithoutScanInput[]
    deleteMany?: FindingScalarWhereInput | FindingScalarWhereInput[]
  }

  export type ScanRunCreateNestedOneWithoutFindingsInput = {
    create?: XOR<ScanRunCreateWithoutFindingsInput, ScanRunUncheckedCreateWithoutFindingsInput>
    connectOrCreate?: ScanRunCreateOrConnectWithoutFindingsInput
    connect?: ScanRunWhereUniqueInput
  }

  export type CommentCreateNestedManyWithoutFindingInput = {
    create?: XOR<CommentCreateWithoutFindingInput, CommentUncheckedCreateWithoutFindingInput> | CommentCreateWithoutFindingInput[] | CommentUncheckedCreateWithoutFindingInput[]
    connectOrCreate?: CommentCreateOrConnectWithoutFindingInput | CommentCreateOrConnectWithoutFindingInput[]
    createMany?: CommentCreateManyFindingInputEnvelope
    connect?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
  }

  export type CommentUncheckedCreateNestedManyWithoutFindingInput = {
    create?: XOR<CommentCreateWithoutFindingInput, CommentUncheckedCreateWithoutFindingInput> | CommentCreateWithoutFindingInput[] | CommentUncheckedCreateWithoutFindingInput[]
    connectOrCreate?: CommentCreateOrConnectWithoutFindingInput | CommentCreateOrConnectWithoutFindingInput[]
    createMany?: CommentCreateManyFindingInputEnvelope
    connect?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type ScanRunUpdateOneWithoutFindingsNestedInput = {
    create?: XOR<ScanRunCreateWithoutFindingsInput, ScanRunUncheckedCreateWithoutFindingsInput>
    connectOrCreate?: ScanRunCreateOrConnectWithoutFindingsInput
    upsert?: ScanRunUpsertWithoutFindingsInput
    disconnect?: ScanRunWhereInput | boolean
    delete?: ScanRunWhereInput | boolean
    connect?: ScanRunWhereUniqueInput
    update?: XOR<XOR<ScanRunUpdateToOneWithWhereWithoutFindingsInput, ScanRunUpdateWithoutFindingsInput>, ScanRunUncheckedUpdateWithoutFindingsInput>
  }

  export type CommentUpdateManyWithoutFindingNestedInput = {
    create?: XOR<CommentCreateWithoutFindingInput, CommentUncheckedCreateWithoutFindingInput> | CommentCreateWithoutFindingInput[] | CommentUncheckedCreateWithoutFindingInput[]
    connectOrCreate?: CommentCreateOrConnectWithoutFindingInput | CommentCreateOrConnectWithoutFindingInput[]
    upsert?: CommentUpsertWithWhereUniqueWithoutFindingInput | CommentUpsertWithWhereUniqueWithoutFindingInput[]
    createMany?: CommentCreateManyFindingInputEnvelope
    set?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    disconnect?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    delete?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    connect?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    update?: CommentUpdateWithWhereUniqueWithoutFindingInput | CommentUpdateWithWhereUniqueWithoutFindingInput[]
    updateMany?: CommentUpdateManyWithWhereWithoutFindingInput | CommentUpdateManyWithWhereWithoutFindingInput[]
    deleteMany?: CommentScalarWhereInput | CommentScalarWhereInput[]
  }

  export type CommentUncheckedUpdateManyWithoutFindingNestedInput = {
    create?: XOR<CommentCreateWithoutFindingInput, CommentUncheckedCreateWithoutFindingInput> | CommentCreateWithoutFindingInput[] | CommentUncheckedCreateWithoutFindingInput[]
    connectOrCreate?: CommentCreateOrConnectWithoutFindingInput | CommentCreateOrConnectWithoutFindingInput[]
    upsert?: CommentUpsertWithWhereUniqueWithoutFindingInput | CommentUpsertWithWhereUniqueWithoutFindingInput[]
    createMany?: CommentCreateManyFindingInputEnvelope
    set?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    disconnect?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    delete?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    connect?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    update?: CommentUpdateWithWhereUniqueWithoutFindingInput | CommentUpdateWithWhereUniqueWithoutFindingInput[]
    updateMany?: CommentUpdateManyWithWhereWithoutFindingInput | CommentUpdateManyWithWhereWithoutFindingInput[]
    deleteMany?: CommentScalarWhereInput | CommentScalarWhereInput[]
  }

  export type FindingCreateNestedOneWithoutCommentsInput = {
    create?: XOR<FindingCreateWithoutCommentsInput, FindingUncheckedCreateWithoutCommentsInput>
    connectOrCreate?: FindingCreateOrConnectWithoutCommentsInput
    connect?: FindingWhereUniqueInput
  }

  export type FindingUpdateOneRequiredWithoutCommentsNestedInput = {
    create?: XOR<FindingCreateWithoutCommentsInput, FindingUncheckedCreateWithoutCommentsInput>
    connectOrCreate?: FindingCreateOrConnectWithoutCommentsInput
    upsert?: FindingUpsertWithoutCommentsInput
    connect?: FindingWhereUniqueInput
    update?: XOR<XOR<FindingUpdateToOneWithWhereWithoutCommentsInput, FindingUpdateWithoutCommentsInput>, FindingUncheckedUpdateWithoutCommentsInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type FindingCreateWithoutScanInput = {
    id?: string
    url: string
    originalTitle: string
    originalSnippet?: string
    trTitle: string
    trSummary?: string
    language: string
    sourceName?: string
    category?: string
    importance?: number
    isNewTech?: boolean
    keywords?: string
    publishedDate?: string | null
    images?: string
    deepAnalysis?: string | null
    fullArticle?: string | null
    bookmarked?: boolean
    isRead?: boolean
    notes?: string | null
    createdAt?: Date | string
    comments?: CommentCreateNestedManyWithoutFindingInput
  }

  export type FindingUncheckedCreateWithoutScanInput = {
    id?: string
    url: string
    originalTitle: string
    originalSnippet?: string
    trTitle: string
    trSummary?: string
    language: string
    sourceName?: string
    category?: string
    importance?: number
    isNewTech?: boolean
    keywords?: string
    publishedDate?: string | null
    images?: string
    deepAnalysis?: string | null
    fullArticle?: string | null
    bookmarked?: boolean
    isRead?: boolean
    notes?: string | null
    createdAt?: Date | string
    comments?: CommentUncheckedCreateNestedManyWithoutFindingInput
  }

  export type FindingCreateOrConnectWithoutScanInput = {
    where: FindingWhereUniqueInput
    create: XOR<FindingCreateWithoutScanInput, FindingUncheckedCreateWithoutScanInput>
  }

  export type FindingCreateManyScanInputEnvelope = {
    data: FindingCreateManyScanInput | FindingCreateManyScanInput[]
    skipDuplicates?: boolean
  }

  export type FindingUpsertWithWhereUniqueWithoutScanInput = {
    where: FindingWhereUniqueInput
    update: XOR<FindingUpdateWithoutScanInput, FindingUncheckedUpdateWithoutScanInput>
    create: XOR<FindingCreateWithoutScanInput, FindingUncheckedCreateWithoutScanInput>
  }

  export type FindingUpdateWithWhereUniqueWithoutScanInput = {
    where: FindingWhereUniqueInput
    data: XOR<FindingUpdateWithoutScanInput, FindingUncheckedUpdateWithoutScanInput>
  }

  export type FindingUpdateManyWithWhereWithoutScanInput = {
    where: FindingScalarWhereInput
    data: XOR<FindingUpdateManyMutationInput, FindingUncheckedUpdateManyWithoutScanInput>
  }

  export type FindingScalarWhereInput = {
    AND?: FindingScalarWhereInput | FindingScalarWhereInput[]
    OR?: FindingScalarWhereInput[]
    NOT?: FindingScalarWhereInput | FindingScalarWhereInput[]
    id?: StringFilter<"Finding"> | string
    scanId?: StringNullableFilter<"Finding"> | string | null
    url?: StringFilter<"Finding"> | string
    originalTitle?: StringFilter<"Finding"> | string
    originalSnippet?: StringFilter<"Finding"> | string
    trTitle?: StringFilter<"Finding"> | string
    trSummary?: StringFilter<"Finding"> | string
    language?: StringFilter<"Finding"> | string
    sourceName?: StringFilter<"Finding"> | string
    category?: StringFilter<"Finding"> | string
    importance?: IntFilter<"Finding"> | number
    isNewTech?: BoolFilter<"Finding"> | boolean
    keywords?: StringFilter<"Finding"> | string
    publishedDate?: StringNullableFilter<"Finding"> | string | null
    images?: StringFilter<"Finding"> | string
    deepAnalysis?: StringNullableFilter<"Finding"> | string | null
    fullArticle?: StringNullableFilter<"Finding"> | string | null
    bookmarked?: BoolFilter<"Finding"> | boolean
    isRead?: BoolFilter<"Finding"> | boolean
    notes?: StringNullableFilter<"Finding"> | string | null
    createdAt?: DateTimeFilter<"Finding"> | Date | string
  }

  export type ScanRunCreateWithoutFindingsInput = {
    id?: string
    scope?: string
    focusCategory?: string | null
    status?: string
    totalFound?: number
    newItems?: number
    languagesCovered?: number
    startedAt?: Date | string
    completedAt?: Date | string | null
  }

  export type ScanRunUncheckedCreateWithoutFindingsInput = {
    id?: string
    scope?: string
    focusCategory?: string | null
    status?: string
    totalFound?: number
    newItems?: number
    languagesCovered?: number
    startedAt?: Date | string
    completedAt?: Date | string | null
  }

  export type ScanRunCreateOrConnectWithoutFindingsInput = {
    where: ScanRunWhereUniqueInput
    create: XOR<ScanRunCreateWithoutFindingsInput, ScanRunUncheckedCreateWithoutFindingsInput>
  }

  export type CommentCreateWithoutFindingInput = {
    id?: string
    author?: string
    body: string
    ip?: string
    createdAt?: Date | string
  }

  export type CommentUncheckedCreateWithoutFindingInput = {
    id?: string
    author?: string
    body: string
    ip?: string
    createdAt?: Date | string
  }

  export type CommentCreateOrConnectWithoutFindingInput = {
    where: CommentWhereUniqueInput
    create: XOR<CommentCreateWithoutFindingInput, CommentUncheckedCreateWithoutFindingInput>
  }

  export type CommentCreateManyFindingInputEnvelope = {
    data: CommentCreateManyFindingInput | CommentCreateManyFindingInput[]
    skipDuplicates?: boolean
  }

  export type ScanRunUpsertWithoutFindingsInput = {
    update: XOR<ScanRunUpdateWithoutFindingsInput, ScanRunUncheckedUpdateWithoutFindingsInput>
    create: XOR<ScanRunCreateWithoutFindingsInput, ScanRunUncheckedCreateWithoutFindingsInput>
    where?: ScanRunWhereInput
  }

  export type ScanRunUpdateToOneWithWhereWithoutFindingsInput = {
    where?: ScanRunWhereInput
    data: XOR<ScanRunUpdateWithoutFindingsInput, ScanRunUncheckedUpdateWithoutFindingsInput>
  }

  export type ScanRunUpdateWithoutFindingsInput = {
    id?: StringFieldUpdateOperationsInput | string
    scope?: StringFieldUpdateOperationsInput | string
    focusCategory?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    totalFound?: IntFieldUpdateOperationsInput | number
    newItems?: IntFieldUpdateOperationsInput | number
    languagesCovered?: IntFieldUpdateOperationsInput | number
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ScanRunUncheckedUpdateWithoutFindingsInput = {
    id?: StringFieldUpdateOperationsInput | string
    scope?: StringFieldUpdateOperationsInput | string
    focusCategory?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    totalFound?: IntFieldUpdateOperationsInput | number
    newItems?: IntFieldUpdateOperationsInput | number
    languagesCovered?: IntFieldUpdateOperationsInput | number
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type CommentUpsertWithWhereUniqueWithoutFindingInput = {
    where: CommentWhereUniqueInput
    update: XOR<CommentUpdateWithoutFindingInput, CommentUncheckedUpdateWithoutFindingInput>
    create: XOR<CommentCreateWithoutFindingInput, CommentUncheckedCreateWithoutFindingInput>
  }

  export type CommentUpdateWithWhereUniqueWithoutFindingInput = {
    where: CommentWhereUniqueInput
    data: XOR<CommentUpdateWithoutFindingInput, CommentUncheckedUpdateWithoutFindingInput>
  }

  export type CommentUpdateManyWithWhereWithoutFindingInput = {
    where: CommentScalarWhereInput
    data: XOR<CommentUpdateManyMutationInput, CommentUncheckedUpdateManyWithoutFindingInput>
  }

  export type CommentScalarWhereInput = {
    AND?: CommentScalarWhereInput | CommentScalarWhereInput[]
    OR?: CommentScalarWhereInput[]
    NOT?: CommentScalarWhereInput | CommentScalarWhereInput[]
    id?: StringFilter<"Comment"> | string
    findingId?: StringFilter<"Comment"> | string
    author?: StringFilter<"Comment"> | string
    body?: StringFilter<"Comment"> | string
    ip?: StringFilter<"Comment"> | string
    createdAt?: DateTimeFilter<"Comment"> | Date | string
  }

  export type FindingCreateWithoutCommentsInput = {
    id?: string
    url: string
    originalTitle: string
    originalSnippet?: string
    trTitle: string
    trSummary?: string
    language: string
    sourceName?: string
    category?: string
    importance?: number
    isNewTech?: boolean
    keywords?: string
    publishedDate?: string | null
    images?: string
    deepAnalysis?: string | null
    fullArticle?: string | null
    bookmarked?: boolean
    isRead?: boolean
    notes?: string | null
    createdAt?: Date | string
    scan?: ScanRunCreateNestedOneWithoutFindingsInput
  }

  export type FindingUncheckedCreateWithoutCommentsInput = {
    id?: string
    scanId?: string | null
    url: string
    originalTitle: string
    originalSnippet?: string
    trTitle: string
    trSummary?: string
    language: string
    sourceName?: string
    category?: string
    importance?: number
    isNewTech?: boolean
    keywords?: string
    publishedDate?: string | null
    images?: string
    deepAnalysis?: string | null
    fullArticle?: string | null
    bookmarked?: boolean
    isRead?: boolean
    notes?: string | null
    createdAt?: Date | string
  }

  export type FindingCreateOrConnectWithoutCommentsInput = {
    where: FindingWhereUniqueInput
    create: XOR<FindingCreateWithoutCommentsInput, FindingUncheckedCreateWithoutCommentsInput>
  }

  export type FindingUpsertWithoutCommentsInput = {
    update: XOR<FindingUpdateWithoutCommentsInput, FindingUncheckedUpdateWithoutCommentsInput>
    create: XOR<FindingCreateWithoutCommentsInput, FindingUncheckedCreateWithoutCommentsInput>
    where?: FindingWhereInput
  }

  export type FindingUpdateToOneWithWhereWithoutCommentsInput = {
    where?: FindingWhereInput
    data: XOR<FindingUpdateWithoutCommentsInput, FindingUncheckedUpdateWithoutCommentsInput>
  }

  export type FindingUpdateWithoutCommentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    originalTitle?: StringFieldUpdateOperationsInput | string
    originalSnippet?: StringFieldUpdateOperationsInput | string
    trTitle?: StringFieldUpdateOperationsInput | string
    trSummary?: StringFieldUpdateOperationsInput | string
    language?: StringFieldUpdateOperationsInput | string
    sourceName?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    importance?: IntFieldUpdateOperationsInput | number
    isNewTech?: BoolFieldUpdateOperationsInput | boolean
    keywords?: StringFieldUpdateOperationsInput | string
    publishedDate?: NullableStringFieldUpdateOperationsInput | string | null
    images?: StringFieldUpdateOperationsInput | string
    deepAnalysis?: NullableStringFieldUpdateOperationsInput | string | null
    fullArticle?: NullableStringFieldUpdateOperationsInput | string | null
    bookmarked?: BoolFieldUpdateOperationsInput | boolean
    isRead?: BoolFieldUpdateOperationsInput | boolean
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    scan?: ScanRunUpdateOneWithoutFindingsNestedInput
  }

  export type FindingUncheckedUpdateWithoutCommentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    scanId?: NullableStringFieldUpdateOperationsInput | string | null
    url?: StringFieldUpdateOperationsInput | string
    originalTitle?: StringFieldUpdateOperationsInput | string
    originalSnippet?: StringFieldUpdateOperationsInput | string
    trTitle?: StringFieldUpdateOperationsInput | string
    trSummary?: StringFieldUpdateOperationsInput | string
    language?: StringFieldUpdateOperationsInput | string
    sourceName?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    importance?: IntFieldUpdateOperationsInput | number
    isNewTech?: BoolFieldUpdateOperationsInput | boolean
    keywords?: StringFieldUpdateOperationsInput | string
    publishedDate?: NullableStringFieldUpdateOperationsInput | string | null
    images?: StringFieldUpdateOperationsInput | string
    deepAnalysis?: NullableStringFieldUpdateOperationsInput | string | null
    fullArticle?: NullableStringFieldUpdateOperationsInput | string | null
    bookmarked?: BoolFieldUpdateOperationsInput | boolean
    isRead?: BoolFieldUpdateOperationsInput | boolean
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FindingCreateManyScanInput = {
    id?: string
    url: string
    originalTitle: string
    originalSnippet?: string
    trTitle: string
    trSummary?: string
    language: string
    sourceName?: string
    category?: string
    importance?: number
    isNewTech?: boolean
    keywords?: string
    publishedDate?: string | null
    images?: string
    deepAnalysis?: string | null
    fullArticle?: string | null
    bookmarked?: boolean
    isRead?: boolean
    notes?: string | null
    createdAt?: Date | string
  }

  export type FindingUpdateWithoutScanInput = {
    id?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    originalTitle?: StringFieldUpdateOperationsInput | string
    originalSnippet?: StringFieldUpdateOperationsInput | string
    trTitle?: StringFieldUpdateOperationsInput | string
    trSummary?: StringFieldUpdateOperationsInput | string
    language?: StringFieldUpdateOperationsInput | string
    sourceName?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    importance?: IntFieldUpdateOperationsInput | number
    isNewTech?: BoolFieldUpdateOperationsInput | boolean
    keywords?: StringFieldUpdateOperationsInput | string
    publishedDate?: NullableStringFieldUpdateOperationsInput | string | null
    images?: StringFieldUpdateOperationsInput | string
    deepAnalysis?: NullableStringFieldUpdateOperationsInput | string | null
    fullArticle?: NullableStringFieldUpdateOperationsInput | string | null
    bookmarked?: BoolFieldUpdateOperationsInput | boolean
    isRead?: BoolFieldUpdateOperationsInput | boolean
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    comments?: CommentUpdateManyWithoutFindingNestedInput
  }

  export type FindingUncheckedUpdateWithoutScanInput = {
    id?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    originalTitle?: StringFieldUpdateOperationsInput | string
    originalSnippet?: StringFieldUpdateOperationsInput | string
    trTitle?: StringFieldUpdateOperationsInput | string
    trSummary?: StringFieldUpdateOperationsInput | string
    language?: StringFieldUpdateOperationsInput | string
    sourceName?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    importance?: IntFieldUpdateOperationsInput | number
    isNewTech?: BoolFieldUpdateOperationsInput | boolean
    keywords?: StringFieldUpdateOperationsInput | string
    publishedDate?: NullableStringFieldUpdateOperationsInput | string | null
    images?: StringFieldUpdateOperationsInput | string
    deepAnalysis?: NullableStringFieldUpdateOperationsInput | string | null
    fullArticle?: NullableStringFieldUpdateOperationsInput | string | null
    bookmarked?: BoolFieldUpdateOperationsInput | boolean
    isRead?: BoolFieldUpdateOperationsInput | boolean
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    comments?: CommentUncheckedUpdateManyWithoutFindingNestedInput
  }

  export type FindingUncheckedUpdateManyWithoutScanInput = {
    id?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    originalTitle?: StringFieldUpdateOperationsInput | string
    originalSnippet?: StringFieldUpdateOperationsInput | string
    trTitle?: StringFieldUpdateOperationsInput | string
    trSummary?: StringFieldUpdateOperationsInput | string
    language?: StringFieldUpdateOperationsInput | string
    sourceName?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    importance?: IntFieldUpdateOperationsInput | number
    isNewTech?: BoolFieldUpdateOperationsInput | boolean
    keywords?: StringFieldUpdateOperationsInput | string
    publishedDate?: NullableStringFieldUpdateOperationsInput | string | null
    images?: StringFieldUpdateOperationsInput | string
    deepAnalysis?: NullableStringFieldUpdateOperationsInput | string | null
    fullArticle?: NullableStringFieldUpdateOperationsInput | string | null
    bookmarked?: BoolFieldUpdateOperationsInput | boolean
    isRead?: BoolFieldUpdateOperationsInput | boolean
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CommentCreateManyFindingInput = {
    id?: string
    author?: string
    body: string
    ip?: string
    createdAt?: Date | string
  }

  export type CommentUpdateWithoutFindingInput = {
    id?: StringFieldUpdateOperationsInput | string
    author?: StringFieldUpdateOperationsInput | string
    body?: StringFieldUpdateOperationsInput | string
    ip?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CommentUncheckedUpdateWithoutFindingInput = {
    id?: StringFieldUpdateOperationsInput | string
    author?: StringFieldUpdateOperationsInput | string
    body?: StringFieldUpdateOperationsInput | string
    ip?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CommentUncheckedUpdateManyWithoutFindingInput = {
    id?: StringFieldUpdateOperationsInput | string
    author?: StringFieldUpdateOperationsInput | string
    body?: StringFieldUpdateOperationsInput | string
    ip?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}