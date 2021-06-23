const rchainToolkit = require('rchain-toolkit');

const PRIVATE_KEY = '28a5c9ac133b4449ca38e9bdf7cacdce31079ef6b3ac2f0a080af83ecff98b36';
const PUBLIC_KEY = rchainToolkit.utils.publicKeyFromPrivateKey(PRIVATE_KEY);
const READ_ONLY_HOST = 'http://localhost:40403';
const VALIDATOR_HOST = 'http://localhost:40403';


/*
  STEP 1 : deploy with minimal requirements: last block
*/
const main = async () => {

  const timestamp = new Date().getTime();

  const term = `new a in {}`;

  const validAfterBlock = JSON.parse(
    await rchainToolkit.http.blocks(READ_ONLY_HOST, {
      position: 1,
    })
  )[0].blockNumber;

  const deployOptions = await rchainToolkit.utils.getDeployOptions(
    'secp256k1',
    timestamp,
    term,
    PRIVATE_KEY,
    PUBLIC_KEY,
    1,
    1000000000,
    validAfterBlock
  );

  const deployResponse = await rchainToolkit.http.deploy(
    VALIDATOR_HOST,
    deployOptions
  );
  console.log('deploy response:');
  console.log(deployResponse);
};

main();
