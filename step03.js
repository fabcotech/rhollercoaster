const rchainToolkit = require('rchain-toolkit');

const PRIVATE_KEY = '28a5c9ac133b4449ca38e9bdf7cacdce31079ef6b3ac2f0a080af83ecff98b36';
const PUBLIC_KEY = rchainToolkit.utils.publicKeyFromPrivateKey(PRIVATE_KEY);
const READ_ONLY_HOST = 'http://localhost:40403';
const VALIDATOR_HOST = 'http://localhost:40403';

/*
  STEP 3 :
  - predict unforgeable name
  - deploy
  - read data on unforgeable name
  - decode data
*/
const main = async () => {

  const timestamp = new Date().getTime();
  const pd = await rchainToolkit.http.prepareDeploy(
    READ_ONLY_HOST,
    {
      deployer: PUBLIC_KEY,
      timestamp: timestamp,
      nameQty: 1,
    }
  );
  console.log('prepare deploy response:')
  console.log(pd + '\n');

  const term = `new a in { a!("hello") }`;

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
  console.log(deployResponse + '\n');


  // wait 14 seconds for propose
  await new Promise((resolve) => {
    setTimeout(resolve, 14000)
  });

  const dataOnUnforgeableName = await rchainToolkit.http
    .dataAtName(READ_ONLY_HOST, {
      name: {
        UnforgPrivate: { data: JSON.parse(pd).names[0] },
      },
      depth: 3,
    });
  console.log('data at name response:');
  console.log(dataOnUnforgeableName + '\n');

  const data = rchainToolkit.utils.rhoValToJs(
    JSON.parse(dataOnUnforgeableName).exprs[0].expr
  );
  console.log('decoded data:');
  console.log(data);
};

main();