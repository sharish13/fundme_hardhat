const { getNamedAccounts, deployments, network, ethers } = require("hardhat")
const { networkConfig, developmentChains } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const abi = new ethers.utils.AbiCoder()

    log("----------------------------------------------------")
    log("Deploying FunWithStorage and waiting for confirmations...")
    const funWithStorage = await deploy("FunWithStorage", {
        from: deployer,
        args: [],
        log: true,
        // we need to wait if on a live network so we can verify properly
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    log("Logging storage...")
    for (let i = 0; i < 10; i++) {
        log(
            `Location ${i}: ${await ethers.provider.getStorageAt(
                funWithStorage.address,
                i
            )}`
        )
    }
    for (let j = 0; j < 2; j++) {
        var loc = ethers.utils.keccak256(
            "0x0000000000000000000000000000000000000000000000000000000000000002"
        )
        var x = ethers.BigNumber.from(j)
        var hex = ethers.utils.hexValue(j)
        var bigadd = x.add(loc)
        // log(`xxxx  ${x}`)
        // log(`add  ${x.add(loc)}`)
        // log(`hexvalue  ${hex}`)
        // log(`add hex value ${hex + loc}`)
        // log(`hexvalue bigadd ${ethers.utils.hexValue(bigadd)}`)

        loc = ethers.utils.hexValue(bigadd)
        log(
            `Location array[${j}]: ${await ethers.provider.getStorageAt(
                funWithStorage.address,
                loc
            )}`
        )
    }
    //TODO
    // for (let i = 0; i < 2; i++) {
    //     loc = ethers.utils.keccak256(
    //         abi.encode(ethers.utils.hexValue(3), ethers.utils.hexValue(i))
    //     )
    //     log(
    //         `Location map[${i}]: ${await ethers.provider.getStorageAt(
    //             funWithStorage.address,
    //             loc
    //         )}`
    //     )
    // }
    // You can use this to trace!
    // const trace = await network.provider.send("debug_traceTransaction", [
    //     funWithStorage.transactionHash,
    // ])
    // for (structLog in trace.structLogs) {
    //     if (trace.structLogs[structLog].op == "SSTORE") {
    //         console.log(trace.structLogs[structLog])
    //     }
    // }
    const firstelementLocation = ethers.utils.keccak256(
        "0x0000000000000000000000000000000000000000000000000000000000000002"
    )
    const arrayElement = await ethers.provider.getStorageAt(
        funWithStorage.address,
        firstelementLocation
    )
    log(`Location ${firstelementLocation}: ${arrayElement}`)

    // Can you write a function that finds the storage slot of the arrays and mappings?
    // And then find the data in those slots?
}

module.exports.tags = ["storage"]
