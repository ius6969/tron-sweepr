const http = require('http');
const { TronWeb } = require('tronweb');

// 1. Port binding for Render Web Service
const PORT = process.env.PORT || 10000;
http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('TRON Multi-Sig Sweeper Bot Active');
}).listen(PORT, () => {
  console.log(`HTTP Web Server listening on port ${PORT}`);
});

// 2. Initialize TronWeb
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
      return;
    }

    const balance = await tronWeb.trx.getBalance(ADDRESS_A);
    
    // Sweep if balance > 2 TRX (2,000,000 SUN)
    if (balance > 2000000) { 
      const amountToSend = balance - 2000000; // Leave ~2 TRX for network fees
      console.log(`Found balance: ${balance / 1e6} TRX. Initiating 2-of-2 multi-sig sweep...`);
      
      // Build unsigned transaction for Permission ID 2
      let unsignedTx = await tronWeb.transactionBuilder.sendTrx(
        ADDRESS_B, 
        amountToSend, 
        ADDRESS_A, 
        { permissionId: PERMISSION_ID }
      );

      // Signer 1 Multi-Sig Signature
      let signedTx = await tronWeb.trx.multiSign(unsignedTx, PK1, PERMISSION_ID);

      // Signer 2 Multi-Sig Signature
      signedTx = await tronWeb.trx.multiSign(signedTx, PK2, PERMISSION_ID);

      // Broadcast transaction
      const broadcast = await tronWeb.trx.sendRawTransaction(signedTx);
      
      if (broadcast.result || broadcast.txid) {
        console.log('Sweep successful! TxID:', broadcast.txid);
      } else {
        console.error('Broadcast response:', broadcast);
      }
    }
  } catch (err) {
    console.error('Sweep error:', err.message || err);
  }
}

// Poll every 3 seconds
setInterval(sweep, 3000);      let signedTx = await tronWeb.trx.sign(unsignedTx, PK1);

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
