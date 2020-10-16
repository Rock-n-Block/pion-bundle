// SPDX-License-Identifier: MIT

pragma solidity ^0.5.0;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20Detailed.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Mintable.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Burnable.sol";

contract ERC20Mock is ERC20Mintable, ERC20Burnable,ERC20Detailed {
    constructor(
        string memory name,
        string memory symbol,
        uint8 decimals,
        uint256 amountToMint
    ) public ERC20Detailed(name, symbol, decimals) {
        _mint(msg.sender, amountToMint);
    }
}
