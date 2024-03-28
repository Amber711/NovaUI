/**
 * 1.定义primitives原始数据类型的 type
 * boolean, undefined, null, number, string
 */
let num: number = 2;

let numberOrSting: string | number = 1;
numberOrSting = 'abc'

let arrOfNums: Array<number> = [];
let arrOfNums2: number[] = [];
arrOfNums2.push(2);

//tuple
let user: [number, string] = [2, 'a'];


/**
 * 2.定义引用类型(object)的type
 * Interface
 * 对对象(包括函数)的形状(Shape)进行描述
 * 对类（class）进行抽象
 * Duck Typing (鸭子类型:
 * The term "duck typing" comes from the saying, "If it looks like a duck, swims like a duck, and quacks like a duck, 
 * then it probably is a duck." In programming terms, this means that an object is considered to be of a certain type
 *  if it has the necessary methods or properties required for it to behave like that type, 
 * regardless of its explicit type declaration.
 */

interface IPerson {
    name: string;
    age: number,
    hobbies?: string[],
    readonly id: number
}

let viking: IPerson = {
    name: 'viking',
    age: 20,
    id: 123
}

/**
 * 3.Generics范型
 * 在定义function，interface，or class，先不指定具体的类型，而是在该function/interface/class被使用的时候才把具体类型传入。
 * 
 * 可以把generics暂时看作是占位符。只有在使用的时候再传入具体的类型。
 */
/**
 * 
 * 3.1 Use generics in funciton parameters and function return value
 * 
 */

function echo<T>(arg: T): T {
    return arg;
}

const result = echo('str'); //result: string
const result2 = echo(false); //result2: false;
const result3 = echo(false as boolean); //result3: boolean

function swap<T, U>(tuple: [T, U]):[T, U]  { // :(T | U)[]
    return [tuple[0], tuple[1]]
}

const result4 = swap(['string', 123]);

/**
 * 3.2 约束范型 => constraint generics by extends, e.g. T extends XXX
 */

function echoWithArr1<T>(arg: T): T {
    //console.log(arg.length)  //此处会报错。因为T不一定是数组
    return arg
}

function echoWithArr<T>(arg: T[]): T[] {
    console.log(arg.length); // ok
    return arg
}

const arrs = echoWithArr([1, 2, 3]) // 此时必须传入一个array类型
//const arrs2 = echoWithArr('abc') //string也有.length方法。如果我们的初衷是想要任何含有.length的数据类型呢？



function echoWithArr3<T>(arg: T): T {
    //console.log(arg.length);  //此处会报错。因为T不一定是数组
    return arg
}
//解决办法：
interface IWithLength {
    length: number
}

function echoWithLength<T extends IWithLength>(arg: T): T { //传入的T只要包含.length方法即符合要求
    console.log(arg.length);
    return arg
}

const str = echoWithLength('acd');
const obj = echoWithLength({length: 0, width: 10}); // obj: {length: number; width: number;}
const arr2 = echoWithLength([1]); //number[]

/**
 * 3.3 范型在其他方法的使用。 case 1: 应用在class方面
 */

class Queue<T> {
    private data: T[] = [];
    push(item:T) {
        return this.data.push(item);
    }
    pop(): T | undefined {
        return this.data.shift();
    }
}

let queue = new Queue<number>(); //需要在new class的时候传入具体类型
queue.push(1)


/**
 * 3.4 case 2: 应用在interface
 */

interface KeyPairs<T, U> {
    key: T,
    value: U
}

let kp1: KeyPairs<string, number> = {key: 'age', value: 15};

let arr: number[] = [1, 2];
let arr3: Array<number> = [1, 2]; //Array也是一个使用了范型的interface 

/**
 * 使用interface来描述一个函数类型
 */

interface IPlus<T> {
    (a:T, b:T): T // a, b表示函数的参数，使用冒号来连接后面的函数返回值类型
}

function plus(a: number, b: number): number {
    return a + b;
}

const a: IPlus<number> = plus;

function connect(a: string, b: string): string {
    return a + b;
}

const b: IPlus<string> = connect;

/**
 * 4. type alias
 */

function sum(x: number, y: number) {
    return x + y;
}


const sum2: (x: number, y: number) => number = sum;//很麻烦

type PlusType = (x: number, y: number) => number; //定义1个函数类型 方法一
const sum3: PlusType = sum;

interface IPlus2 {  //定义1个函数类型 方法二
    (x: number, y: number): number
}

const sum4: IPlus2 = sum;

// 实现一个函数，该函数接收的参数 either 可以为stirng 类型 or 函数类型。
// 方法一：
function getName(n: string | (() => string)): string {
    if (typeof n === 'string') {
        return n;
    } else {
        return n();
    }

}
// 方法二：
type NameResolver = () => string;
type nameOrResolver = string | NameResolver;
function getName2(n: nameOrResolver): string {
    if (typeof n === 'string') {
        return n;
    } else {
        return n();
    }
}

/**
 * type assertion
 */

function getLength(input: string | number): number {
    if ((input as string).length) {
        return (input as string).length;
    } else {
        return input.toString().length
    }
}

function getLength2(input: string | number): number {
    if ((<string>input).length) {
        return (<string>input).length;
    } else {
        return input.toString().length
    }
}

/**
 * 5.类型声明文件 .d.ts
 * 例如我们在项目中使用了一些第三方库，但是typescript compiler 也会检查它的类型。 此时我们就需要写一些类型声明文件来通过typescript 编译器的检查。
 * 
 * 我们目前没有对 对应类型声明的作用域做配置。 因此此时的作用域默认为编辑器打开的所有文件。也就是说只有当axios的类型声明文件和该文件同时打开，tsc 才不会报错。 
 * 之后我们对声明文件都放在特定的文件夹中，来解决这个问题。
 * 
 * 一般项目中使用的3rd party package，社区中都会有其相应的声明文件的package可供下载。或者该第三方库本身就已经包含了类型文件。
 * The npm and Yarn package registries now include type information for packages.
 * 判断是否需要下载 正在使用的3rd party pkg对应的typings文件
 * https://www.typescriptlang.org/docs/handbook/declaration-files/publishing.html
 */

