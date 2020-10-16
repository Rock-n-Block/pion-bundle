const UFragments = artifacts.require("UFragments");
const UFragmentsPolicy = artifacts.require("UFragmentsPolicy");
const Orchestrator = artifacts.require("Orchestrator");

const BN = require("bn.js");
const BASE_CPI = (new BN(258723)).mul(new BN(10 ** 15));

module.exports = async function (deployer) {
    let UFragmentsInst;
    let UFragmentsPolicyInst;
    let OrchestratorInst;

    await deployer.deploy(UFragments);
    UFragmentsInst = await UFragments.deployed();

    await deployer.deploy(UFragmentsPolicy, UFragmentsInst.address, BASE_CPI);
    UFragmentsPolicyInst = await UFragmentsPolicy.deployed();
    await UFragmentsInst.setMonetaryPolicy(UFragmentsPolicyInst.address);

    await deployer.deploy(Orchestrator, UFragmentsPolicyInst.address);
    OrchestratorInst = await Orchestrator.deployed();

    await UFragmentsPolicyInst.setOrchestrator(OrchestratorInst.address);
};
