"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = "";

  const movs = sort
    ? movements.slice().sort((a, b) => {
        return a - b;
      })
    : movements;

  movs.forEach((mov, i) => {
    const type = mov > 0 ? "deposit" : "withdrawal";

    const html = `
    <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    }: ${type}</div>
          <div class="movements__value">${mov}€</div>
        </div>
    `;
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

const calcDiplayBalance = (acc) => {
  acc.balance = acc.movements.reduce((acc, mov) => {
    return acc + mov;
  }, 0);

  labelBalance.textContent = `${acc.balance}€`;
};

const calcDisplaySummary = (acc) => {
  const incomes = acc.movements
    .filter((mov) => {
      return mov > 0;
    })
    .reduce((acc, mov) => {
      return acc + mov;
    }, 0);
  labelSumIn.textContent = `${incomes}€`;

  const out = acc.movements
    .filter((mov) => {
      return mov < 0;
    })
    .reduce((acc, mov) => {
      return acc + mov;
    }, 0);
  labelSumOut.textContent = `${Math.abs(out)}€`;

  const interest = acc.movements
    .filter((mov) => {
      return mov > 0;
    })
    .map((deposit) => {
      return (deposit * acc.interestRate) / 100;
    })
    .filter((int, i, arr) => {
      return int >= 1;
    })
    .reduce((acc, int) => {
      return acc + int;
    }, 0);
  labelSumInterest.textContent = `${interest}€`;
};

const createUsernames = (accts) => {
  accts.forEach((acc) => {
    acc.username = acc.owner
      .toLowerCase()
      .split(" ")
      .map((name) => {
        return name[0];
      })
      .join("");
  });
};
createUsernames(accounts);

const updateUI = (acc) => {
  //Display Movments
  displayMovements(currentAccount.movements);
  //Display balance
  calcDiplayBalance(currentAccount);
  //Display summary
  calcDisplaySummary(currentAccount);
};

//Event Handles
let currentAccount;

btnLogin.addEventListener("click", function (e) {
  //prevent form from submitting
  e.preventDefault();
  currentAccount = accounts.find((acc) => {
    return acc.username === inputLoginUsername.value;
  });
  console.log(currentAccount);
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //Display UI and welcome message
    labelWelcome.textContent = `Welcome back ${
      currentAccount.owner.split(" ")[0]
    }`;

    //Clear input fields
    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur();
    containerApp.style.opacity = 100;

    //update UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiveAcc = accounts.find((acc) => {
    return acc.username === inputTransferTo.value;
  });
  inputTransferAmount.value = inputTransferTo.value = "";
  if (
    amount > 0 &&
    receiveAcc &&
    currentAccount.balance >= amount &&
    receiveAcc?.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    receiveAcc.movements.push(amount);
    console.log(receiveAcc);
    updateUI(currentAccount);
  } else {
    console.log("Invalid transfer");
  }
});

btnLoan.addEventListener("click", function (e) {
  e.preventDefault();
  console.log(`Loan`);
  const amount = Number(inputLoanAmount.value);
  if (
    amount > 0 &&
    currentAccount.movements.some((mov) => {
      return mov >= amount * 0.1;
    })
  ) {
    //Add movement
    currentAccount.movements.push(amount);

    //Update UI
    updateUI(currentAccount);
  }
  inputLoanAmount.value = "";
});

btnClose.addEventListener("click", function (e) {
  e.preventDefault();
  const inputUser = inputCloseUsername.value;
  const inputPin = Number(inputClosePin.value);
  if (
    inputUser === currentAccount.username &&
    inputPin === currentAccount.pin
  ) {
    const index = accounts.findIndex((acc) => {
      acc.username === currentAccount.username;
    });
    //Delete account
    accounts.splice(index, 1);

    //Hide UI
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = "";
});

let sorted = false;
btnSort.addEventListener("click", function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});
///////////////////////////////////////
// Coding Challenge #1

/* 
Julia and Kate are doing a study on dogs. So each of them asked 5 dog owners about their dog's age, and stored the data into an array (one array for each). For now, they are just interested in knowing whether a dog is an adult or a puppy. A dog is an adult if it is at least 3 years old, and it's a puppy if it's less than 3 years old.
Create a function 'checkDogs', which accepts 2 arrays of dog's ages ('dogsJulia' and 'dogsKate'), and does the following things:
1. Julia found out that the owners of the FIRST and the LAST TWO dogs actually have cats, not dogs! So create a shallow copy of Julia's array, and remove the cat ages from that copied array (because it's a bad practice to mutate function parameters)
2. Create an array with both Julia's (corrected) and Kate's data
3. For each remaining dog, log to the console whether it's an adult ("Dog number 1 is an adult, and is 5 years old") or a puppy ("Dog number 2 is still a puppy 🐶")
4. Run the function for both test datasets
HINT: Use tools from all lectures in this section so far 😉
TEST DATA 1: Julia's data [3, 5, 2, 12, 7], Kate's data [4, 1, 15, 8, 3]
TEST DATA 2: Julia's data [9, 16, 6, 8, 3], Kate's data [10, 5, 6, 1, 4]
GOOD LUCK 😀
*/
/*
const checkDogs = (dogsJulia, dogsKate) => {
  const newDogsJulia = dogsJulia.slice(1, dogsJulia.length - 2);
  console.log(newDogsJulia);
  const dogsJuliaAndKate = [...newDogsJulia, ...dogsKate];
  console.log(dogsJuliaAndKate);
  dogsJuliaAndKate.forEach(function (dog, i, arr) {
    if (dog < 3) {
      console.log(`Dog number ${i + 1} is a 🐶puppy`);
    } else {
      console.log(`Dog number ${i + 1} is a adult`);
    }
  });
};

const dogsJulia = [9, 16, 6, 8, 3];
const dogsKate = [10, 5, 6, 1, 4];

checkDogs(dogsJulia, dogsKate);
*/
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// const currencies = new Map([
//   ["USD", "United States dollar"],
//   ["EUR", "Euro"],
//   ["GBP", "Pound sterling"],
// ]);

//const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

//let arr = ["a", "b", "c", "d", "e"];

//Slice method
/*
console.log(arr.slice(2));
console.log(arr.slice(2, 4));
console.log(arr.slice(-2));
console.log(arr.slice(1, -2));

console.log(arr.slice());

//Splice method
//console.log(arr.splice(2));
arr.splice(-1);
arr.splice(1, 2);
console.log(arr);

//Reverse
arr = ["a", "b", "c", "d", "e"];
const arr2 = ["f", "g", "h", "i", "j"];
console.log(arr2.reverse());

//Concat
const letters = arr.concat(arr2);
console.log(letters);
console.log([...arr, ...arr2]);

//Join
console.log(letters.join("-"));
*/
///////////////////////////////////////
/*
//At method
const arr = [23, 11, 34];
console.log(arr[0]);
console.log(arr.at(0));

console.log(
  `Getting the last element through bracket notation: ${arr[arr.length - 1]}`
);
console.log(
  `Getting the last elemeht through the slice method: ${arr.slice(-1)[0]}`
);
console.log(`Getting the last element through the at method: ${arr.at(-1)}`);
*/
//////////////////////////////////////

//ForEach method
/*
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

for (const [i, movement] of movements.entries()) {
  if (movement > 0) {
    console.log(`Movement ${i + 1}: You deposited ${movement}`);
  } else {
    console.log(`Movement ${i + 1}: You withdrew ${movement}`);
  }
}
console.log("======forEach method=========");
movements.forEach(function (mov, i, arr) {
  if (mov > 0) {
    console.log(`Movement ${i + 1}: You deposited ${mov}`);
  } else {
    console.log(`Movement ${i + 1}: You withdrew ${mov}`);
  }
});
*/
///////////////////////
/*
//forEach with Maps and Sets
const currencies = new Map([
  ["USD", "United States dollar"],
  ["EUR", "Euro"],
  ["GBP", "Pound sterling"],
]);

currencies.forEach(function (value, key, map) {
  console.log(`${key}: ${value}`);
});

//Set
const currenciesUnique = new Set(["USD", "GBP", "USD", "EUR", "EUR"]);
currenciesUnique.forEach(function (value, _, map) {
  console.log(`${value}, ${value}`);
});
*/
///////////////////////////////////////////
//the map method
/*
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
const eurotoUsd = 1.1;

// const movementUsd = movements.map( function (mov)  {
//   return mov * eurotoUsd;
// });

const movementUsd = movements.map((mov) => {
  return mov * eurotoUsd;
});

console.log(movements);
console.log(movementUsd);

const movementsUsdfor = [];
for (const mov of movements) {
  movementsUsdfor.push(mov * eurotoUsd);
}

console.log(movementsUsdfor);

const movementDescriptons = movements.map((mov, i) => {
  return `Movement ${i + 1}: You ${
    mov > 0 ? `deposited ` : `withdrew`
  } ${Math.abs(mov)}`;
});

console.log(movementDescriptons);
*/
/////////////////////////////////////
//filter method
/*
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
const deposits = movements.filter((mov) => {
  return mov > 0;
});

console.log(deposits);

const depositsfor = [];
for (const mov of movements) {
  if (mov > 0) {
    depositsfor.push(mov);
  }
}
console.log(depositsfor);

const withdrawals = movements.filter((mov) => {
  return mov < 0;
});
console.log(withdrawals);
*/
////////////////////////////////////////
//reduce method
/*
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
//accumulator -> snowball
const balance = movements.reduce((acc, cur) => {
  return acc + cur;
}, 0);
console.log(balance);

console.log(`==========FOR LOOP=========`);
let balance2 = 0;
for (const mov of movements) {
  balance2 += mov;
}
console.log(balance2);

//Maxium value
const max = movements.reduce((acc, mov) => {
  if (acc > mov) {
    return acc;
  } else {
    return mov;
  }
}, movements[0]);
console.log(max);
*/
///////////////////////////////////////
// Coding Challenge #2

/* 
Let's go back to Julia and Kate's study about dogs. This time, they want to convert dog ages to human ages and calculate the average age of the dogs in their study.
Create a function 'calcAverageHumanAge', which accepts an arrays of dog's ages ('ages'), and does the following things in order:
1. Calculate the dog age in human years using the following formula: if the dog is <= 2 years old, humanAge = 2 * dogAge. If the dog is > 2 years old, humanAge = 16 + dogAge * 4.
2. Exclude all dogs that are less than 18 human years old (which is the same as keeping dogs that are at least 18 years old)
3. Calculate the average human age of all adult dogs (you should already know from other challenges how we calculate averages 😉)
4. Run the function for both test datasets
TEST DATA 1: [5, 2, 4, 1, 15, 8, 3]
TEST DATA 2: [16, 6, 10, 5, 6, 1, 4]
GOOD LUCK 😀
*/
/*
const juliasDogs = [5, 2, 4, 1, 15, 8, 3];
const katesDogs = [16, 6, 10, 5, 6, 1, 4];
const calcAverageHumanAge = (ages) => {
  let calcHumanAge = ages
    .map((age) => {
      return age <= 2 ? 2 * age : 16 + age * 4;
    })
    .filter((age) => {
      return age >= 18;
    })
    .reduce((sum, age, i, arr) => {
      return sum + age / arr.length;
    }, 0);

  console.log(calcHumanAge);
};

calcAverageHumanAge(juliasDogs);
console.log(`===========Kate's dogs=======`);
calcAverageHumanAge(katesDogs);
*/

/////////////////////////////////
//Array method chaining
/*
const euroToUsd = 1.1;
const totalDepositsUSD = movements
  .filter((mov) => {
    return mov > 0;
  })
  .map((mov) => {
    return mov * euroToUsd;
  })
  .reduce((acc, mov) => {
    return acc + mov;
  }, 0);
console.log(totalDepositsUSD);
*/
///////////////////////////////////////
//Find method
/*
const firstWithdrawal = movements.find((mov) => {
  return mov < 0;
});

console.log(movements);
console.log(firstWithdrawal);

console.log(accounts);

const account = accounts.find((acc) => {
  return acc.owner === `Jessica Davis`;
});
console.log(account);

for (const account of accounts) {
  if (account.owner === `Jessica Davis`) {
    console.log(account);
  }
}
*/
/*
console.log(movements);

//Equality
console.log(movements.includes(-130));

//Some: Condition
const anyDeposit = movements.some((mov) => {
  return mov > 29000;
});
console.log(anyDeposit);

//Every: Condition
console.log(
  movements.every((mov) => {
    return mov > 0;
  })
);

//Seperate callback
const deposit = (mov)=> {return mov > 0};
*/
/*
const Arr = [[1, 2, 3], [4, 4, 5], 9, 7];
console.log(Arr.flat());
const ArrDeep = [[[1, 2, 3, 2], 3, [3, 3, 3]]];
console.log(ArrDeep.flat(2));

//flat
const overallBalance = accounts
  .map((acc) => acc.movements)
  .flat()
  .reduce((acc, mov) => {
    return acc + mov;
  }, 0);
console.log(overallBalance);

//flatMap
const overallBalance2 = accounts
  .flatMap((acc) => acc.movements)
  .reduce((acc, mov) => {
    return acc + mov;
  }, 0);
console.log(overallBalance);
*/
/*
//Sort

//Strings
const owners = ["Jonas", "Zack", "Adam", "Martha"];
console.log(owners.sort());
console.log(owners);

//Numbers
console.log(movements);

//return < 0: A, B (keep order)
//return > 0: B, A (switch order)
//Ascending
movements.sort((a, b) => {
  // if (a > b) {
  //   return 1;
  // }
  // if (b > a) {
  //   return -1;
  // }
  return a - b;
});
console.log(movements);

//Descending
movements.sort((a, b) => {
  // if (a < b) {
  //   return 1;
  // }
  // if (b < a) {
  //   return -1;
  // }
  return b - a;
});

console.log(movements);
*/
/*
//Array.fill method
const arr2 = [1, 2, 4, 3, 2, 4, 2];
const x = new Array(7);
console.log(x);

//x.fill(3);
x.fill(1, 2, 3);
arr2.fill(23, 2, 5);
console.log(x);
console.log(arr2);

//Array.from
const y = Array.from({ length: 7 }, () => {
  return 1;
});
console.log(y);

const z = Array.from({ length: 7 }, (_, i) => {
  return i + 1;
});
console.log(z);
const randDice = Array.from({ length: 100 }, () => {
  return Math.floor(Math.random() * 100);
});
console.log(randDice);

labelBalance.addEventListener(`click`, function () {
  const movementsUI = Array.from(
    document.querySelectorAll(".movements__value")
  );

  console.log(movementsUI);
});
*/
/*
const bankDepsoitSum = accounts
  .flatMap((acc) => {
    return acc.movements;
  })
  .filter((mov) => {
    return mov > 0;
  })
  .reduce((sum, curr) => {
    return sum + curr;
  }, 0);
console.log(bankDepsoitSum);

// const numDeposits1000 = accounts
//   .flatMap((acc) => {
//     return acc.movements;
//   })
//   .filter((mov) => {
//     return mov >= 1000;
//   }).length;

const numDeposits1000 = accounts
  .flatMap((acc) => {
    return acc.movements;
  })
  .reduce((count, curr) => {
    return curr >= 1000 ? ++count : count;
  }, 0);

console.log(numDeposits1000);

//Prefixed ++ operator
let a = 10;
console.log(++a);
console.log(a);

const { deposits, withdrawals } = accounts
  .flatMap((acc) => {
    return acc.movements;
  })
  .reduce(
    (sums, curr) => {
      //curr > 0 ? (sums.deposits += curr) : (sums.withdrawals += curr);
      sums[curr > 0 ? "deposits" : "withdrawals"] += curr;
      return sums;
    },
    { deposits: 0, withdrawals: 0 }
  );

console.log(deposits, withdrawals);

const convertTitleCase = function (title) {
  const expections = ["a", "and", "an", "the", "but", "or", "on", "in", "with"];

  const capitzalize = (str) => str[0].toUpperCase() + str.slice(1);
  const titleCase = title
    .toLowerCase()
    .split(" ")
    .map((word) => {
      return expections.includes(word)
        ? word
        : word[0].toUpperCase() + word.slice(1);
    })
    .join(" ");
  return capitzalize(titleCase);
};
console.log(convertTitleCase("this is a nice title"));
console.log(convertTitleCase("this is a LONG title but not too long"));
console.log(convertTitleCase("and here is another title with a EXAMPLE"));
*/
///////////////////////////////////////
// Coding Challenge #4

/* 
Julia and Kate are still studying dogs, and this time they are studying if dogs are eating too much or too little.
Eating too much means the dog's current food portion is larger than the recommended portion, and eating too little is the opposite.
Eating an okay amount means the dog's current food portion is within a range 10% above and 10% below the recommended portion (see hint).
1. Loop over the array containing dog objects, and for each dog, calculate the recommended food portion and add it to the object as a new property. Do NOT create a new array, simply loop over the array. Forumla: recommendedFood = weight ** 0.75 * 28. (The result is in grams of food, and the weight needs to be in kg)
2. Find Sarah's dog and log to the console whether it's eating too much or too little. HINT: Some dogs have multiple owners, so you first need to find Sarah in the owners array, and so this one is a bit tricky (on purpose) 🤓
3. Create an array containing all owners of dogs who eat too much ('ownersEatTooMuch') and an array with all owners of dogs who eat too little ('ownersEatTooLittle').
4. Log a string to the console for each array created in 3., like this: "Matilda and Alice and Bob's dogs eat too much!" and "Sarah and John and Michael's dogs eat too little!"
5. Log to the console whether there is any dog eating EXACTLY the amount of food that is recommended (just true or false)
6. Log to the console whether there is any dog eating an OKAY amount of food (just true or false)
7. Create an array containing the dogs that are eating an OKAY amount of food (try to reuse the condition used in 6.)
8. Create a shallow copy of the dogs array and sort it by recommended food portion in an ascending order (keep in mind that the portions are inside the array's objects)
HINT 1: Use many different tools to solve these challenges, you can use the summary lecture to choose between them 😉
HINT 2: Being within a range 10% above and below the recommended portion means: current > (recommended * 0.90) && current < (recommended * 1.10). Basically, the current portion should be between 90% and 110% of the recommended portion.
TEST DATA:
const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] }
];
GOOD LUCK 😀
*/

const dogs = [
  { weight: 22, curFood: 250, owners: ["Alice", "Bob"] },
  { weight: 8, curFood: 200, owners: ["Matilda"] },
  { weight: 13, curFood: 275, owners: ["Sarah", "John"] },
  { weight: 32, curFood: 340, owners: ["Michael"] },
];

//1.
const calcRecommendedFood = (dog) => {
  dog.forEach((rec) => {
    rec.recommendedFood = Math.round(rec.weight ** 0.75 * 28);
  });
};

calcRecommendedFood(dogs);
console.log(dogs);

//2.
console.log(
  dogs
    .filter((dog) => {
      return dog.owners.includes("Sarah");
    })
    .map((value) => {
      return `Dog is eating too ${
        value.curFood > value.recommendedFood ? `much` : `little`
      }`;
    })
);

//3.
const ownersEatTooLittle = dogs
  .filter((dog) => {
    return dog.curFood < dog.recommendedFood;
  })
  .flatMap((owner) => {
    return owner.owners;
  })
  .join(" and ");

console.log(ownersEatTooLittle);

const ownersEatTooMuch = dogs
  .filter((dog) => {
    return dog.curFood > dog.recommendedFood;
  })
  .flatMap((owner) => {
    return owner.owners;
  })
  .join(" and ");

//4.
console.log(`${ownersEatTooMuch} feed their dogs too much`);
console.log(`${ownersEatTooLittle} feed their dogs too little`);

//5.

console.log(
  dogs.every((dog) => {
    return dog.curFood === dog.recommendedFood;
  })
);

//6.
console.log(
  dogs.some((value) => {
    return (
      value.curFood > value.recommendedFood * 0.9 &&
      value.curFood < value.recommendedFood * 1.1
    );
  })
);

//7.
const feedOkay = dogs.filter((dog) => {
  return (
    dog.curFood > dog.recommendedFood * 0.9 &&
    dog.curFood < dog.recommendedFood * 1.1
  );
});

console.log(feedOkay);

//8.
const dogsCopy = [...dogs];
dogsCopy.sort((a, b) => {
  return a.recommendedFood - b.recommendedFood;
});
console.log(dogsCopy);
