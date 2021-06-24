const rchainToolkit = require('rchain-toolkit');
const fs = require('fs');

const PRIVATE_KEY = '28a5c9ac133b4449ca38e9bdf7cacdce31079ef6b3ac2f0a080af83ecff98b36';
const PUBLIC_KEY = rchainToolkit.utils.publicKeyFromPrivateKey(PRIVATE_KEY);
const READ_ONLY_HOST = 'http://localhost:40403';
const VALIDATOR_HOST = 'http://localhost:40403';

const REGISTRY_URI = "rho:id:ukbysmqhu9c58ebccj1zspcxfr8sfbjijfbthnmksew8jammdn43tk";

const main = async () => {

  const exploreDeployResult = await rchainToolkit.http.exploreDeploy(READ_ONLY_HOST, {
    term: `new basket, entryCh, lookup(\`rho:registry:lookup\`) in {
      lookup!(\`${REGISTRY_URI}\`, *entryCh) |
      for (switchCh <- entryCh) {
        switchCh!(("get", *basket))
      }
    }`,
  });

  console.log('explore deploy result:');
  const data = rchainToolkit.utils.rhoValToJs(
    JSON.parse(exploreDeployResult).expr[0]
  );
  console.log(data)
}

main();
