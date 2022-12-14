require('@nomiclabs/hardhat-waffle');

module.exports = {
  solidity: '0.8.0',
  networks: {
    goerli: {
      url: 'https://eth-goerli.g.alchemy.com/v2/4TgZvGxCUlAURYIyYon6JoExAGelaGER',
      accounts: ['4f8ea792a1af784ec46f3412890fd7f1f42e220eee41f9fce822dd6d83454a79'],
    },
  },
};
