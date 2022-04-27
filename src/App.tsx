import dayjs from 'dayjs';
import blockies from 'blockies';
import { Wallet, utils } from 'ethers';
import { getColonyNetworkClient, Network, getLogs, ColonyRole, getBlockTime } from '@colony/colony-js';
import { InfuraProvider } from 'ethers/providers';

// Set up the network address constants that you'll be using
// The two below represent the current ones on mainnet
// Don't worry too much about them, just use them as-is
const MAINNET_NETWORK_ADDRESS = `0x5346D0f80e2816FaD329F2c140c870ffc3c3E2Ef`;
const MAINNET_BETACOLONY_ADDRESS = `0x869814034d96544f3C62DE2aC22448ed79Ac8e70`;

const start = async () => {
  // #1
  // Get a new Infura provider (don't worry too much about this)
  const provider = new InfuraProvider();
  // Get a random wallet
  // You don't really need control over it, since you won't be firing any trasactions out of it
  const wallet = Wallet.createRandom();
  // Connect your wallet to the provider
  const connectedWallet = wallet.connect(provider);
  
  // Get a network client instance
  const networkClient = await getColonyNetworkClient(
    Network.Mainnet,
    connectedWallet,
    { networkAddress: MAINNET_NETWORK_ADDRESS },
  );
  
  // Get the colony client instance for the betacolony
  const colonyClient = await networkClient.getColonyClient(MAINNET_BETACOLONY_ADDRESS);
  
  // Get the filter
  // There's a corresponding filter method for all event types
  const eventFilter = colonyClient.filters.PayoutClaimed(null, null, null);
  
  // Get the raw logs array
  const eventLogs = await getLogs(colonyClient, eventFilter);

  // #2
  const parsedLogs = eventLogs.map(event => colonyClient.interface.parseLog(event));

  // const mappedData = parsedLogs.map((singleLog) => )

  // #3
  const [singleLog] = parsedLogs;

  const humanReadableFundingPotId = new utils.BigNumber(
    singleLog.values.fundingPotId
  ).toString();

  const { associatedTypeId } = await colonyClient.getFundingPot(humanReadableFundingPotId);

  const { recipient: userAddress } = await colonyClient.getPayment(associatedTypeId);

  // #4 Getting the date

  // @ts-ignore
  const logTime = await getBlockTime(provider, singleLog.blockHash);

  // #5 Handling Avatars

  // @ts-ignore
  var icon = blockies({ seed: singleLog.address });

  document.body.appendChild(icon);

  console.log('networkClient', {
    networkClient,
    eventLogs,
    eventFilter,
    parsedLogs,
    userAddress,
    ColonyRole,
    logTime: dayjs(logTime).format('D MMM'),
  });
};

start();


const App: React.FC = () => {
  return (
    <div className="App">
      Test
    </div>
  );
}

export default App;
