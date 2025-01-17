require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { TronWeb } = require('tronweb'); // 确保导入方式正确
const cors = require('cors');


const app = express();
app.use(cors());
app.use(bodyParser.json());

const privateKey = process.env.PRIVATE_KEY;
console.log('Loaded PRIVATE_KEY:', privateKey);

// 使用私钥生成钱包地址
const originWalletAddress = TronWeb.address.fromPrivateKey(privateKey);
console.log('Generated Wallet Address:', originWalletAddress);

// 初始化 TronWeb
const tronWeb = new TronWeb({
  fullNode: 'https://api.trongrid.io',
  solidityNode: 'https://api.trongrid.io',
  eventServer: 'https://api.trongrid.io',
  privateKey: process.env.PRIVATE_KEY,
});

tronWeb.setAddress(originWalletAddress);

const ENERGY_PER_TRANSACTION = 65000; // 每次代理的能量数量

async function getTRXToFreezeForEnergy(desiredEnergy) {
  try {
      // Replace with a valid TRON address
      const address = originWalletAddress;
      const resources = await tronWeb.trx.getAccountResources(address);

      const totalEnergyLimit = resources.TotalEnergyLimit;
      const totalEnergyWeight = resources.TotalEnergyWeight;

      if (totalEnergyLimit && totalEnergyWeight) {
          const trxToFreeze = (desiredEnergy * totalEnergyWeight) / totalEnergyLimit;
          return trxToFreeze;
      } else {
          throw new Error('Unable to retrieve network resource parameters.');
      }
  } catch (error) {
      console.error('Error calculating TRX to freeze:', error);
      throw error;
  }
}

// Example usage
getTRXToFreezeForEnergy(ENERGY_PER_TRANSACTION)
  .then(trx => {
      console.log(`To obtain 65,000 Energy, you need to freeze approximately ${trx} TRX.`);
  })
  .catch(error => {
      console.error('Calculation failed:', error);
  });


// 能量代理 API
app.post('/delegate', async (req, res) => {
  const { walletAddress } = req.body;
  console.log('Receiver Wallet Address:', walletAddress);
  if (!walletAddress || !tronWeb.isAddress(walletAddress)) {
    return res.status(400).json({ success: false, message: 'Invalid receiver address.' });
  }

  try {
    const trxToFreeze = Math.round(await getTRXToFreezeForEnergy(ENERGY_PER_TRANSACTION));
    const amountInSun = tronWeb.toSun(trxToFreeze); // 将 TRX 转换为 SUN
    const transaction = await tronWeb.transactionBuilder.delegateResource(
      amountInSun, 
      walletAddress,
      'ENERGY', // 代理能量
      originWalletAddress,
      false // 不锁定代理的资源
    );
    
    const signedTxn = await tronWeb.trx.sign(transaction);
    const result = await tronWeb.trx.sendRawTransaction(signedTxn);

    if (result.result) {
      res.json({ success: true });
    } else {
      res.status(500).json({ success: false, message: 'Failed to delegate energy.' });
    }
  } catch (error) {
    console.error('Error delegating energy:', error);
    res.status(500).json({ success: false, message: 'An error occurred while delegating energy.' });
  }
});

// 启动服务器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  const LIVE_URL = process.env.LIVE_URL || `http://localhost:${PORT}`;
  if (process.env.LIVE_URL) {
    console.log(`Server is live at: ${LIVE_URL}`);
    console.log(`Running on port: ${PORT}`);
  } else {
    console.log(`Server running locally at: ${LIVE_URL}`);
    console.log(`Running on port: ${PORT}`);
  }
});