require('dotenv').config({ path: '../.env' })

const MesonContract = artifacts.require('./MesonContract.sol');

module.exports = async function (deployer, network, accounts) {
	return deployer.then(async () => {

		const { 
            STAKING_TOKEN,
            DISTRIBUTION_TOKEN,
            MAX_UNLOCK_SCHEDULES,
            START_BONUS,
            BONUS_PERIOD_SEC,
            INITIAL_SHARES_PER_TOKEN,
        } = process.env

        console.log('Staking token: ', STAKING_TOKEN);
        console.log('Distribution token: ', DISTRIBUTION_TOKEN)
        console.log('Max unlock schedules: ', MAX_UNLOCK_SCHEDULES)
        console.log('Start bonus:  ', START_BONUS)
        console.log('Bonus period sec: ', BONUS_PERIOD_SEC)
        console.log('Initial shares per token: ', INITIAL_SHARES_PER_TOKEN)
        

		// DEPLOY SWAP
        const mesonContract = await deployer.deploy(
            MesonContract, 
            STAKING_TOKEN,
            DISTRIBUTION_TOKEN,
            MAX_UNLOCK_SCHEDULES,
            START_BONUS,
            BONUS_PERIOD_SEC,
            INITIAL_SHARES_PER_TOKEN
        );

        console.log("");
        console.log('Token swap address: ', mesonContract.address);
	})
}