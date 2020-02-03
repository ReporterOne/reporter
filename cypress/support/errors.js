const stacktraces = [];

const _ = Cypress._;

before(() => {

  stacktraces.length = 0;
});

// monkey patch all cy commands to cache stack trace on each call
Cypress.Commands.each(({name}) => {

  const fn = cy[name];
  cy[name] = (...args) => {

    const ret = fn.call(cy, ...args);

    stacktraces.push({
      stack: new Error().stack,
      chainerId: ret.chainerId
    });

    return ret;
  };
});

// on failure, log the stack trace if one is found
Cypress.on('fail', (err, runnable) => {

  const commands = runnable.commands;

  const cmdIdx = _.findLastIndex(commands, cmd => {
    // "pending" probably means it failed (at the time of this callback,
    // the failures are still not resolved, unless synchronoues)
    return (cmd.state === 'pending' || cmd.state === 'failed') && cmd.chainerId;
  });

  const cmd = commands && commands[cmdIdx];
  if (cmd) {
    const data = _.find(stacktraces, {chainerId: cmd.chainerId});
    if (data && data.stack) {
      console.log(data.stack, data.chainerId);
    }
  }

  throw err;
});

Cypress.on('uncaught:exception', (err, runnable) => {
  console.error(err)
  // returning false here prevents Cypress from
  // failing the test
  return true
})
