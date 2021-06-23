const rchainToolkit = require('rchain-toolkit');

const { createPursesTerm } = require('../src/createPursesTerm');
const { validAfterBlockNumber, prepareDeploy } = require('./utils');
const waitForUnforgeable = require('../cli/waitForUnforgeable').main;

const PRIVATE_KEY = '28a5c9ac133b4449ca38e9bdf7cacdce31079ef6b3ac2f0a080af83ecff98b36';
const PUBLIC_KEY = rc.utils.publicKeyFromPrivateKey(PRIVATE_KEY);
const READ_ONLY_HOST = 'http://localhost:40403';
const VALIDATOR_HOST = 'http://localhost:40403';

module.exports.main = async () => {

  const timestamp = new Date().getTime();
  const pd = await rchainToolkit.http.prepareDeploy(
    READ_ONLY_HOST,
    {
      deployer: PUBLIC_KEY,
      timestamp: timestamp,
      nameQty: 1,
    }
  );
  console.log(pd);

  const term = `new a in {}`;

  const validAfterBlock = JSON.parse(
    await rchainToolkit.http.blocks(READ_ONLY_HOST, {
      position: 1,
    })
  )[0].blockNumber;

  const deployOptions = await rc.utils.getDeployOptions(
    'secp256k1',
    timestamp,
    term,
    PRIVATE_KEY,
    PUBLIC_KEY,
    1,
    1000000000,
    validAfterBlock
  );

  const deployResponse = await rc.http.deploy(
    VALIDATOR_HOST,
    deployOptions
  );
  console.log(deployResponse);


  let dataAtNameResponse;
  try {
    dataAtNameResponse = await waitForUnforgeable(JSON.parse(pd).names[0]);
  } catch (err) {
    console.log(err);
    throw new Error('03_createTokens 05');
  }
  const data = rc.utils.rhoValToJs(
    JSON.parse(dataAtNameResponse).exprs[0].expr
  );

  return data;
};
