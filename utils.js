const rchainToolkit = require('rchain-toolkit');

module.exports.validAfterBlockNumber = async (httpUrlReadOnly) => {
  let validAfterBlockNumberResponse;
  try {
    validAfterBlockNumberResponse = JSON.parse(
      await rchainToolkit.http.blocks(httpUrlReadOnly, {
        position: 1,
      })
    )[0].blockNumber;
  } catch (err) {
    log('Unable to get last finalized block', 'error');
    console.log(err);
    throw new Error();
  }
  return validAfterBlockNumberResponse;
};


module.exports.waitForUnforgeable = (name, readOnlyHost) => {
  try {
    return new Promise((resolve, reject) => {
      const interval = setInterval(() => {
        try {
          let resp = undefined;
          rchainToolkit.http
            .dataAtName(readOnlyHost, {
              name: {
                UnforgPrivate: { data: name },
              },
              depth: 3,
            })
            .then((dataAtNameResponse) => {
              resp = dataAtNameResponse;
              if (
                resp &&
                JSON.parse(resp) &&
                JSON.parse(resp).exprs &&
                JSON.parse(resp).exprs.length
              ) {
                resolve(resp);
                clearInterval(interval);
              } else {
                console.log('  .');
              }
            })
            .catch((err) => {
              console.log(resp);
              console.log(err);
              throw new Error('wait for unforgeable name');
            });
        } catch (err) {
          console.log(err);
          throw new Error('wait for unforgeable name');
        }
      }, 4000);
    });
  } catch (err) {
    console.log(err);
    throw new Error('wait for unforgeable name');
  }
};
