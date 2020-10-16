# Pion

Pion (code name uFragments) is a decentralized elastic supply protocol. It maintains a stable unit price by adjusting supply directly to and from wallet holders.

This repository is a collection of smart contracts that implement the Pion protocol on the Ethereum blockchain.

The official mainnet addresses are:
- ERC-20 Token: -
- Supply Policy: -
- Orchestrator: -
- Market Oracle: -
- CPI Oracle: -

## Table of Contents

- [Install](#install)
- [Testing](#testing)
- [Testnets](#testnets)
- [Contribute](#contribute)
- [License](#license)


## Install

```bash
# Install project dependencies
npm install

# Install ethereum local blockchain(s) and associated dependencies
npx setup-local-chains
```

## Testing

``` bash
# You can use the following command to start a local blockchain instance
npx start-chain [ganacheUnitTest|gethUnitTest]

# Run all unit tests
npm test

# Run unit tests in isolation
npx truffle --network ganacheUnitTest test test/unit/uFragments.js
```

## Testnets
There is a testnet deployment on Rinkeby. It rebases hourly using real market data.
- ERC-20 Token: -
- Supply Policy: -
- Orchestrator: -
- Market Oracle: -
- CPI Oracle: -

## Contribute

To report bugs within this package, create an issue in this repository.
When submitting code ensure that it is free of lint errors and has 100% test coverage.

``` bash
# Lint code
npm run lint

# View code coverage
npm run coverage
```

## License

[GNU General Public License v3.0 (c) 2020 Rock\`n`Block.io](./LICENSE)
