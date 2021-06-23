### Rholler coaster

Fun tutorial on RChain + nodeJS. Learn to: deploy on rnode, predict unforgeable names, retreive data on names, convert data to javascript readable variables, execute explore-deploy (free read-only deploy), use the registry to have data easily retreivable.

Guide to first deploy and interact with rholang/RChain.


- step 01: deploy on rnode
- step 02: prepare deploy before deploying, and then get data onchain
- step 03: decoding the data with rchain-toolkit
- step 04: using the registry instead of unforgeable name
- step 05: using explore-deploy to read from registry

##### Setup

Setup your environment following [https://rchain.coop/developer.html](https://rchain.coop/developer.html) this easy setup guide.

Launch rnode in one terminal window

```
rnode run -s --validator-private-key 28a5c9ac133b4449ca38e9bdf7cacdce31079ef6b3ac2f0a080af83ecff98b36 --dev-mode
```

Propose automatically every 3 seconds in another

```
watch -n 3 "rnode --grpc-port 40402 propose"
```