// Tests added during the 2026 cleanup. The assignment's main.test.js only tests
// the back-end functions in main.js; these run the front end (log-up.js) the way
// a user would, e.g. `node log-up.js email password`, for each of the five cases.
const { execFileSync } = require('child_process');
const path = require('path');
const { user1, password1 } = require('./main.js');

const run = (...args) =>
  execFileSync(process.execPath, [path.join(__dirname, 'log-up.js'), ...args], { encoding: 'utf8' })
    .trim()
    .split(/\r?\n/);

describe('log-up.js', () => {
  it('1. logs in a registered user with the right password', () => {
    expect(run(user1, password1)).toEqual(['Logged In']);
  });

  it('2. rejects a registered user with the wrong password', () => {
    expect(run(user1, 'WrongPass1')).toEqual(['Password Incorrect']);
  });

  it('3. signs up a new user when email and password are both valid', () => {
    expect(run('new.person@codeimmersives.com', 'GoodPass1')).toEqual(['Signed Up']);
  });

  it('4. explains an invalid email', () => {
    const out = run('new.person@gmail.com', 'GoodPass1');
    expect(out).toHaveLength(1);
    expect(out[0]).toMatch(/^Invalid Email: .*@codeimmersives\.com/);
  });

  it('5. explains an invalid password', () => {
    const out = run('new.person@codeimmersives.com', 'short');
    expect(out).toHaveLength(1);
    expect(out[0]).toMatch(/^Invalid Password: .*8 characters/);
  });

  it('reports both problems when email and password are both invalid', () => {
    const out = run('new.person@gmail.com', 'short');
    expect(out).toHaveLength(2);
    expect(out[0]).toMatch(/^Invalid Email/);
    expect(out[1]).toMatch(/^Invalid Password/);
  });

  it('explains what to type instead of crashing when input is missing', () => {
    expect(run()[0]).toMatch(/Please type your email and password/);
    expect(run('new.person@codeimmersives.com')[0]).toMatch(/Please type your email and password/);
  });
});
