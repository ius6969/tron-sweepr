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
    
    // Sweep if balance > 3 TRX (3,000,000 SUN to cover multi-sig bandwidth/fees safely)
    if (balance > 3000000) { 
      const amountToSend = balance - 3000000; // Leaves 3 TRX for multi-sig fees
      console.log(`Found balance: ${balance / 1e6} TRX. Building multi-sig tx...`);
      
      // Build unsigned tx with permissionId set directly in the builder
      let tx = await tronWeb.transactionBuilder.sendTrx(
        ADDRESS_B, 
        amountToSend, 
        ADDRESS_A,
        { permissionId: PERMISSION_ID }
      );

      // Sign with Key 1
      tx = await tronWeb.trx.multiSign(tx, PK1, PERMISSION_ID);

      // Sign with Key 2
      tx = await tronWeb.trx.multiSign(tx, PK2, PERMISSION_ID);

      // Broadcast transaction
      const broadcast = await tronWeb.trx.sendRawTransaction(tx);
      
      if (broadcast.result) {
        console.log('SWEEP SUCCESSFUL! TxID:', broadcast.txid || broadcast.transaction?.txID);
      } else {
        // Output exact reason why TRON node rejected the broadcast
        console.error('Broadcast Failed:', JSON.stringify(broadcast));
      }
    }
  } catch (err) {
    console.error('Sweep error:', err.message || err);
  }
}

// Poll every 3 seconds
setInterval(sweep, 3000);      
      // Build plain unsigned transaction WITHOUT permissionId in builder
      let unsignedTx = await tronWeb.transactionBuilder.sendTrx(
        ADDRESS_B, 
        amountToSend, 
        ADDRESS_A
      );

      // Signer 1 applies signature with Permission ID
      let signedTx = await tronWeb.trx.multiSign(unsignedTx, PK1, PERMISSION_ID);

      // Signer 2 applies signature to the partially-signed transaction
      signedTx = await tronWeb.trx.multiSign(signedTx, PK2, PERMISSION_ID);

      // Broadcast the fully multi-signed transaction
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
setInterval(sweep, 3000);
