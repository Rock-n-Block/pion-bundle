const BN = require("bn.js");
const chai = require("chai");
const { expect } = require("chai");
const helper = require("./utils/utils.js");
const expectRevert = require("./utils/expectRevert.js");
chai.use(require("chai-bn")(BN));

const  ERC20Mock = artifacts.require('ERC20Mock');
const MesonContract = artifacts.require('MesonContract');
const MesonPool = artifacts.require('MesonPool');

const MAX_UNLOCK_SCHEDULES = 10;
const START_BONUS = 33;
const BONUS_PERIOD_SEC = 86400;
const INITIAL_SHARE_PER_TOKEN = 100000000;

const TOKEN_AMOUNT = new BN((10 ** 18).toString());
const ETH_ZERO_ADDERSS = '0x0000000000000000000000000000000000000000'

contract(
    'Meson',
    ([
        deployer,
        account1,
        account2
    ]) => {
        let mesonContract;
        let mesonPoolStaking;
        let mesonPoolUnlocked;
        let stakingToken;
        let distributionToken;

        beforeEach(async () => {
            // deploy and init

            stakingToken = await ERC20Mock.new(
                'Staking Token',
                'UNI-V2',
                new BN("18"),
                web3.utils.toWei('1000'),
                { from: deployer }
            )

            distributionToken = await ERC20Mock.new(
                'PION Token',
                'PION',
                new BN("18"),
                web3.utils.toWei('1000'),
                { from: deployer }
            )

            mesonContract = await MesonContract.new(
                stakingToken.address,
                distributionToken.address,
                new BN(MAX_UNLOCK_SCHEDULES.toString()),
                new BN(START_BONUS.toString()),
                new BN(BONUS_PERIOD_SEC.toString()),
                new BN(INITIAL_SHARE_PER_TOKEN.toString()),
                { from: deployer}
            )

            mesonPoolUnlocked = await MesonPool.at(await mesonContract.getUnlockedPool())
            
        })

        const getBlockchainTimestamp = async () => {
            const latestBlock = await web3.eth.getBlock('latest');
            return latestBlock.timestamp;
        };

        it ('#0 reward getter validation', async () => {
            console.log(mesonContract.address)
            console.log(mesonPoolUnlocked.address)

            const pionAmount = TOKEN_AMOUNT.mul(new BN((10 ** 6).toString()))

            await distributionToken.mint(mesonPoolUnlocked.address, pionAmount, {from: deployer})

            expect(await distributionToken.balanceOf(mesonPoolUnlocked.address)).to.be.bignumber.that.equals(pionAmount)

            await stakingToken.mint(account1, TOKEN_AMOUNT, {from: deployer})
            await stakingToken.mint(account2, TOKEN_AMOUNT, {from: deployer})

            expect(await stakingToken.balanceOf(account1)).to.be.bignumber.that.equals(TOKEN_AMOUNT)

            const beforeStakeTime = await getBlockchainTimestamp();
            console.log(beforeStakeTime)

            console.log('reward before stake')
            const rewardBefore = await  mesonContract.calculateRewardFor(account1,pionAmount )
            console.log(rewardBefore.toString())

            await stakingToken.approve(mesonContract.address, TOKEN_AMOUNT, {from: account1})
            await mesonContract.stake(TOKEN_AMOUNT, ETH_ZERO_ADDERSS, {from: account1})

            /* const halfPeriodTime = BONUS_PERIOD_SEC / 2;
            await helper.advanceTimeAndBlock(halfPeriodTime); */

            const periodTimeHalf = (new BN(BONUS_PERIOD_SEC.toString())).div(new BN("2")).toNumber();
            await helper.advanceTimeAndBlock(periodTimeHalf);

            console.log('reward after stake and no invokation');
            const totalStakedNo = await mesonContract.totalStaked();
            const totalStakedSharesNo = await mesonContract.totalStakingShares();
            // const totalStakedSharesNo_ = await mesonContract._totalStakingShareSeconds();
            console.log(totalStakedNo.toString());
            console.log(totalStakedSharesNo.toString());
            // console.log(totalStakedSharesNo_.toString());
            const rewardAfter = await  mesonContract.calculateRewardFor(account1,pionAmount )
            console.log(rewardAfter.toString())


            await stakingToken.approve(mesonContract.address, TOKEN_AMOUNT, {from: account2})
            await mesonContract.stake(TOKEN_AMOUNT, ETH_ZERO_ADDERSS, {from: account2})

            console.log('reward after stake and invokation')
            const rewardAfter2 = await  mesonContract.calculateRewardFor(account1,pionAmount )
            console.log(rewardAfter2.toString())

            await helper.advanceTimeAndBlock(periodTimeHalf);

            const afterStakeTime = await getBlockchainTimestamp();
            console.log(afterStakeTime)

            console.log('reward before unstake')
            const rewardBefore2 = await  mesonContract.calculateRewardFor(account1,pionAmount )
            console.log(rewardBefore2.toString())

            console.log('shares')
            const totalStakingShares = await mesonContract.totalStakingShares();
            console.log(totalStakingShares.toString())
            const totalStaked = await mesonContract.totalStaked();
            console.log(totalStaked.toString());
            console.log(TOKEN_AMOUNT.toString())
            const totalStakedFor = await mesonContract.totalStakedFor(account1);
            console.log(totalStakedFor.toString())
            const reward = await mesonContract.calculateRewardFor(account1,pionAmount )
            console.log(reward.toString())

            await mesonContract.unstake(TOKEN_AMOUNT, ETH_ZERO_ADDERSS, {from: account1})
            const distTokenBalance = await distributionToken.balanceOf(account1)
            console.log(distTokenBalance.toString())

            const totalRew = await mesonContract.totalRewardsClaimed(account1);
            console.log(totalRew.toString())
        })

        it ('#0 max reward getter validation', async () => {
            console.log(mesonContract.address)
            console.log(mesonPoolUnlocked.address)

            const pionAmount = TOKEN_AMOUNT.mul(new BN((10 ** 6).toString()))

            await distributionToken.mint(mesonPoolUnlocked.address, pionAmount, {from: deployer})

            expect(await distributionToken.balanceOf(mesonPoolUnlocked.address)).to.be.bignumber.that.equals(pionAmount)

            await stakingToken.mint(account1, TOKEN_AMOUNT, {from: deployer})
            await stakingToken.mint(account2, TOKEN_AMOUNT, {from: deployer})

            expect(await stakingToken.balanceOf(account1)).to.be.bignumber.that.equals(TOKEN_AMOUNT)

            const estimatedReward = await mesonContract.estimateMaxReward(TOKEN_AMOUNT);
            console.log(estimatedReward.toString());

            // const beforeStakeTime = await getBlockchainTimestamp();
            // console.log(beforeStakeTime)

            // console.log('reward before stake')
            // const rewardBefore = await  mesonContract.calculateRewardFor(account1,pionAmount )
            // console.log(rewardBefore.toString())

            // await stakingToken.approve(mesonContract.address, TOKEN_AMOUNT, {from: account1})
            // await mesonContract.stake(TOKEN_AMOUNT, ETH_ZERO_ADDERSS, {from: account1})

            // /* const halfPeriodTime = BONUS_PERIOD_SEC / 2;
            // await helper.advanceTimeAndBlock(halfPeriodTime); */

            // const periodTime = BONUS_PERIOD_SEC;
            // await helper.advanceTimeAndBlock(periodTime);

            // console.log('reward after stake and no invokation');
            // const totalStakedNo = await mesonContract.totalStaked();
            // const totalStakedSharesNo = await mesonContract.totalStakingShares();
            // // const totalStakedSharesNo_ = await mesonContract._totalStakingShareSeconds();
            // console.log(totalStakedNo.toString());
            // console.log(totalStakedSharesNo.toString());
            // // console.log(totalStakedSharesNo_.toString());
            // const rewardAfter = await  mesonContract.calculateRewardFor(account1,pionAmount )
            // console.log(rewardAfter.toString())


            // await stakingToken.approve(mesonContract.address, TOKEN_AMOUNT, {from: account2})
            // await mesonContract.stake(TOKEN_AMOUNT, ETH_ZERO_ADDERSS, {from: account2})

            // console.log('reward after stake and invokation')
            // const rewardAfter2 = await  mesonContract.calculateRewardFor(account1,pionAmount )
            // console.log(rewardAfter2.toString())

            // await helper.advanceTimeAndBlock(periodTimeHalf);

            // const afterStakeTime = await getBlockchainTimestamp();
            // console.log(afterStakeTime)

            // console.log('reward before unstake')
            // const rewardBefore2 = await  mesonContract.calculateRewardFor(account1,pionAmount )
            // console.log(rewardBefore2.toString())

            // console.log('shares')
            // const totalStakingShares = await mesonContract.totalStakingShares();
            // console.log(totalStakingShares.toString())
            // const totalStaked = await mesonContract.totalStaked();
            // console.log(totalStaked.toString());
            // console.log(TOKEN_AMOUNT.toString())
            // const totalStakedFor = await mesonContract.totalStakedFor(account1);
            // console.log(totalStakedFor.toString())
            // const reward = await mesonContract.calculateRewardFor(account1,pionAmount )
            // console.log(reward.toString())

            // await mesonContract.unstake(TOKEN_AMOUNT, ETH_ZERO_ADDERSS, {from: account1})
            // const distTokenBalance = await distributionToken.balanceOf(account1)
            // console.log(distTokenBalance.toString())

            // const totalRew = await mesonContract.totalRewardsClaimed(account1);
            // console.log(totalRew.toString())
        })

    }
)
