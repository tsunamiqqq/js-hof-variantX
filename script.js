function myMap(fn, array) {
  const result = [];

  for (let i = 0; i < array.length; i++) {
    result.push(fn(array[i], i, array));
  }

  return result;
}

function myFilter(fn, array) {
  const result = [];

  for (let i = 0; i < array.length; i++) {
    if (fn(array[i], i, array)) {
      result.push(array[i]);
    }
  }

  return result;
}

function myReduce(fn, initialValue, array) {
  let accumulator = initialValue;
  let startIndex = 0;

  if (accumulator === undefined) {
    accumulator = array[0];
    startIndex = 1;
  }

  for (let i = startIndex; i < array.length; i++) {
    accumulator = fn(accumulator, array[i], i, array);
  }

  return accumulator;
}

function compose(...fns) {
  return function (value) {
    return myReduceRight((acc, fn) => fn(acc), value, fns);
  };
}

function myReduceRight(fn, initialValue, array) {
  let accumulator = initialValue;

  for (let i = array.length - 1; i >= 0; i--) {
    accumulator = fn(accumulator, array[i], i, array);
  }

  return accumulator;
}

function pipe(...fns) {
  return function (value) {
    return myReduce((acc, fn) => fn(acc), value, fns);
  };
}

function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn(...args);
    }

    return function (...nextArgs) {
      return curried(...args, ...nextArgs);
    };
  };
}

function partial(fn, ...fixedArgs) {
  return function (...restArgs) {
    return fn(...fixedArgs, ...restArgs);
  };
}

function memoize(fn) {
  const cache = new Map();

  return function (...args) {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key);
    }

    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}

const map = curry(function (fn, array) {
  return myMap(fn, array);
});

const filter = curry(function (fn, array) {
  return myFilter(fn, array);
});

const reduce = curry(function (fn, initialValue, array) {
  return myReduce(fn, initialValue, array);
});

function chain(data) {
  return {
    value: data,

    map(fn) {
      return chain(myMap(fn, this.value));
    },

    filter(fn) {
      return chain(myFilter(fn, this.value));
    },

    reduce(fn, initialValue) {
      return chain(myReduce(fn, initialValue, this.value));
    },

    result() {
      return this.value;
    }
  };
}

const numbers = [1, 2, 3, 4, 5, 6];
const users = [
  { id: 1, name: "Макс", age: 18, active: true },
  { id: 2, name: "Оля", age: 21, active: false },
  { id: 3, name: "Іван", age: 19, active: true }
];

console.log("myMap\n");
const squares = myMap(x => x * x, numbers);
console.log(squares, "\n");

console.log("myFilter\n");
const evenNumbers = myFilter(x => x % 2 === 0, numbers);
console.log(evenNumbers, "\n");

console.log("myReduce\n");
const sum = myReduce((acc, x) => acc + x, 0, numbers);
console.log(sum, "\n");

console.log("compose\n");
const add1 = x => x + 1;
const multiply2 = x => x * 2;
const minus3 = x => x - 3;

const composed = compose(add1, multiply2, minus3);
console.log(composed(10), "\n");

console.log("pipe\n");
const piped = pipe(minus3, multiply2, add1);
console.log(piped(10), "\n");

console.log("curry\n");
function sum3(a, b, c) {
  return a + b + c;
}
const curriedSum3 = curry(sum3);
console.log(curriedSum3(1)(2)(3));
console.log(curriedSum3(1, 2)(3));
console.log(curriedSum3(1)(2, 3), "\n");

console.log("partial\n");
function multiply(a, b, c) {
  return a * b * c;
}
const multiplyBy2 = partial(multiply, 2);
console.log(multiplyBy2(3, 4), "\n");

console.log("memoize\n");
const slowSquare = memoize(function (n) {
  console.log("Обчислюється:");
  return n * n;
});
console.log(slowSquare(5));
console.log(slowSquare(5), "\n");

console.log("Curried functions\n");
const doubleAll = map(x => x * 2);
console.log(doubleAll(numbers));

const onlyAdults = filter(user => user.age >= 18);
console.log(onlyAdults(users));

const total = reduce((acc, x) => acc + x, 0);
console.log(total(numbers), "\n");

console.log("Chainable API\n");
const chainResult = chain(numbers)
  .map(x => x * 2)
  .filter(x => x > 5)
  .reduce((acc, x) => acc + x, 0)
  .result();

console.log(chainResult, "\n");

console.log("Робота з різними типами даних\n");
const names = myMap(user => user.name, users);
console.log(names);

const activeUsers = myFilter(user => user.active, users);
console.log(activeUsers);

const allNames = myReduce((acc, user) => acc + user.name + ", ", "", users);
console.log(allNames.slice(0, -2));