const { TronWeb } = require('tronweb');

const tronWeb = new TronWeb({
  fullHost: 'https://api.trongrid.io',
  headers: { "TRON-PRO-API-KEY": process.env.TRONGRID_API_KEY || "" }
});

const PERMISSION_ID = parseInt(process.env.PERMISSION_ID || '2');
const ADDRESS_A = process.env.WALLET_A_ADDRESS;
const ADDRESS_B = process.env.DESTINATION_ADDRESS;
const PK1 = process.env.PRIVATE_KEY_1;
const PK2 = process.env.PRIVATE_KEY_2;

async function sweep() {
  try {
    if (!ADDRESS_A || !ADDRESS_B || !PK1 || !PK2) {
      console.log('Missing required environment variables.');
      return;
    }

    const balance = await tronWeb.trx.getBalance(ADDRESS_A);
    
    // Reserve ~2 TRX (2,000,000 sun) for transaction network fees
    if (balance > 2000000) { 
      const amountToSend = balance - 2000000;
      console.log(`Found balance: ${balance / 1e6} TRX. Initiating 2-of-2 multi-sig sweep...`);
      
      // Build unsigned transaction specifying Permission ID 2
      let unsignedTx = await tronWeb.transactionBuilder.sendTrx(
        ADDRESS_B, 
        amountToSend, 
        ADDRESS_A, 
        { permissionId: PERMISSION_ID }
      );

      // Apply Signer Key 1 signature
      let signedTx = await tronWeb.trx.sign(unsignedTx, PK1);

      // Apply Signer Key 2 signature
      signedTx = await tronWeb.trx.sign(signedTx, PK2);

      // Broadcast multi-sig transaction on TRON network
      const broadcast = await tronWeb.trx.sendRawTransaction(signedTx);
      console.log('Sweep executed successfully! TxID:', broadcast.txid);
    }
  } catch (err) {
    console.error('Sweep error:', err.message || err);
  }
}

// Run sweep check every 3 seconds
setInterval(sweep, 3000);
console.log('Sweeper bot started successfully monitoring Address A...');
