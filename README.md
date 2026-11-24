# Log Up — Front End: A Command-Line Sign-Up / Log-In App

[![Tests](https://github.com/RickRieger/log-up-front-end/actions/workflows/tests.yml/badge.svg)](https://github.com/RickRieger/log-up-front-end/actions/workflows/tests.yml)

A Node.js exercise from the **Code Immersives** web development bootcamp in New York City (February 2021). It's the "front end" half of the Log Up project: a command-line app you run with an email and password, and it tells you whether you're **logged in**, **signed up**, or what's wrong. It uses the four functions from the back end ([log-up-back-end](https://github.com/RickRieger/log-up-back-end)) to make each decision. This repo is my fork of the assignment. My code is in [`log-up.js`](log-up.js).

**Skills practiced:** reading command-line input, `require` to reuse another file's functions, nested `if` / `else` decision trees, and testing every path through the logic.

**Built with:** JavaScript (Node.js). Tests use Jest 26; the badge above shows whether they pass on GitHub.

---

## Contents

- [Try it](#try-it)
- [The five cases](#the-five-cases)
- [My solution](#my-solution)
- [How the files fit together](#how-the-files-fit-together)
- [Run the tests](#run-the-tests)
- [Cleanup log (November 2026)](#cleanup-log-november-2026)
- [The assignment](#the-assignment)

---

## Try it

You need [Node.js](https://nodejs.org/).

```bash
git clone https://github.com/RickRieger/log-up-front-end.git
cd log-up-front-end
node log-up.js colin.jaffe@codeimmersives.com Hotforhimself
```

The three "registered users" are the instructor's practice accounts in [`main.js`](main.js):

| Email | Password |
|---|---|
| `colin.jaffe@codeimmersives.com` | `Hotforhimself` |
| `mesuara@codeimmersives.com` | `Console.logger` |
| `anthony@codeimmersives.com` | `like a BOSS` *(type it in quotes: `"like a BOSS"`)* |

## The five cases

| # | You type | App says |
|---|---|---|
| 1 | A registered email + its correct password | `Logged In` |
| 2 | A registered email + the wrong password | `Password Incorrect` |
| 3 | A new email and password, both valid | `Signed Up` |
| 4 | A new email that isn't valid | `Invalid Email: it must end with @codeimmersives.com and have a name before the @.` |
| 5 | A new password that isn't valid | `Invalid Password: it needs at least 8 characters, including an uppercase and a lowercase letter.` |

If both the email and password are invalid, both messages print. If you leave the input off, the app explains what to type:

```
$ node log-up.js
Please type your email and password after the file name, like: node log-up.js you@codeimmersives.com YourPassword1
```

## My solution

Written on **2021-02-25** (commit *"Thanks for the heads up"*). My 2021 version gave the right answer for all five cases. *(Shown as it is after the 2026 cleanup, which made the logic easier to follow and the messages more helpful; see the log below.)*

```js
const userEmail = getInput(1);
const userPassword = getInput(2);

if (userEmail === undefined || userPassword === undefined) {
  console.log("Please type your email and password after the file name, like: node log-up.js you@codeimmersives.com YourPassword1");
} else if (isRegisteredUser(userEmail)) {
  // Existing user: log in or reject the password
  if (passwordMatches(userEmail, userPassword)) {
    console.log("Logged In"); // case 1
  } else {
    console.log("Password Incorrect"); // case 2
  }
} else {
  // New user: sign up if both are valid, otherwise say what's wrong
  // (and what a valid one looks like). If both are wrong, report both.
  if (isValidEmail(userEmail) && isValidPassword(userPassword)) {
    console.log("Signed Up"); // case 3
  } else {
    if (!isValidEmail(userEmail)) {
      // case 4
      console.log("Invalid Email: it must end with @codeimmersives.com and have a name before the @.");
    }
    if (!isValidPassword(userPassword)) {
      // case 5
      console.log("Invalid Password: it needs at least 8 characters, including an uppercase and a lowercase letter.");
    }
  }
}
```

**The first question is "is this a registered user?"** Everything else depends on the answer, so the code is a tree:

```
registered?
├── yes → password matches?  yes: Logged In   no: Password Incorrect
└── no  → email AND password valid?  yes: Signed Up
                                     no:  say which one(s) are invalid, and why
```

## How the files fit together

```
log-up.js      my front end: reads the input, decides which message to print
main.js        the back end (instructor's solution to log-up-back-end): the four checks + 3 users
get-input.js   instructor's helper: getInput(1) is the 1st thing typed after the file name
main.test.js   instructor's tests for the back-end functions
log-up.test.js tests for the front end, added in the 2026 cleanup
```

`log-up.js` pulls in the back end with `require("./main.js")`, which is how one Node file reuses functions from another.

## Run the tests

```bash
npm ci
npm run test:ci   # runs all tests once and exits
npm test          # watch mode: re-runs on every save
```

Expected result: `Tests: 14 passed, 14 total`. That's the 7 original back-end tests plus 7 front-end tests that run `node log-up.js` for each case. [`.github/workflows/tests.yml`](.github/workflows/tests.yml) runs them on GitHub after every push, and the badge at the top shows the result.

---

## Cleanup log (November 2026)

All changes below were made on **2026-11-24** on the branch `cleanup-and-tests`, checked by running every case and the tests, and merged into `master`. Each is its own commit. The instructor's `main.js`, `get-input.js`, `main.test.js` and the direction comments at the top of `log-up.js` are unchanged.

### 1. Restructured the login logic into one clear `if` / `else` tree

**Why:** the original gave the right answers, but it was hard to follow. "Logged In" was its own `if`, then a second `if (isRegisteredUser…)` checked `!passwordMatches` again, and the indentation jumped around. The new version mirrors the instructions as a single tree, with each branch labeled by case number. The output was identical for all five cases.

```js
// Before
if (passwordMatches(userEmail, userPassword)) {
  console.log("Logged In");
  }

        if (isRegisteredUser(userEmail)) {

          if (!passwordMatches(userEmail, userPassword)) {
            console.log("Password Incorrect");
          }

  } 

else {
          if (isValidEmail(userEmail) && isValidPassword(userPassword)) {
            console.log("Signed Up");
          } 
          else if (!isValidEmail(userEmail)) {
            console.log("Invalid Email");
          } 
          else if (!isValidPassword(userPassword)) {
            console.log("Invalid Password");
          }
}

// After (before items 2 and 3)
if (isRegisteredUser(userEmail)) {
  if (passwordMatches(userEmail, userPassword)) {
    console.log("Logged In"); // case 1
  } else {
    console.log("Password Incorrect"); // case 2
  }
} else {
  if (isValidEmail(userEmail) && isValidPassword(userPassword)) {
    console.log("Signed Up"); // case 3
  } else if (!isValidEmail(userEmail)) {
    console.log("Invalid Email"); // case 4
  } else {
    console.log("Invalid Password"); // case 5
  }
}
```

### 2. Messages now say what's wrong, and both problems are reported

**Why:** the instructions say to *"preferably also tell them what makes a valid email"* (and the same for passwords), but the messages were just `Invalid Email` and `Invalid Password`. When *both* were wrong, only the email problem was shown, so you'd fix it, run again, and only then learn the password was also bad.

| Input | Before | After |
|---|---|---|
| Bad email | `Invalid Email` | `Invalid Email: it must end with @codeimmersives.com and have a name before the @.` |
| Bad password | `Invalid Password` | `Invalid Password: it needs at least 8 characters, including an uppercase and a lowercase letter.` |
| Both bad | `Invalid Email` | Both messages, one per line |

### 3. A helpful message instead of a crash when input is missing

**Why:** `node log-up.js` with no email or password **crashed** inside `main.js` (`TypeError: Cannot read properties of undefined (reading 'endsWith')`). Both inputs are now checked first.

```js
// After
if (userEmail === undefined || userPassword === undefined) {
  console.log("Please type your email and password after the file name, like: node log-up.js you@codeimmersives.com YourPassword1");
} else if (isRegisteredUser(userEmail)) {
  // ...
```

### 4. Added front-end tests and automatic test runs on GitHub

**Why:** the assignment's tests only checked the back-end functions, and the front end itself, the actual assignment, was tested by hand. [`log-up.test.js`](log-up.test.js) runs `node log-up.js` for all five cases, both-invalid input and missing input. Against the original 2021 front end, the three core cases pass (log in, wrong password, sign up), and the four improvements above fail as expected. I also added a run-once `npm run test:ci` command (`npm test` is watch mode and never exits) and a GitHub Actions workflow.

### 5. Added this README

The repo had none; the assignment's directions were only comments inside `log-up.js`.

---

## The assignment

The instructor's directions are the comments at the top of [`log-up.js`](log-up.js). In short: read an email and password from the command line, use the four back-end functions (`isValidEmail`, `isValidPassword`, `isRegisteredUser`, `passwordMatches`), and print the right message for each of the five cases listed above, explaining what makes a valid email or password where possible.
