const http = require('http');
const { TronWeb } = require('tronweb');

// 1. Port binding for Render Web Service
const PORT = process.env.PORT || 10000;
http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('TRON Multi-Sig Sweeper Active');
}).listen(PORT, () => {
  console.log(`HTTP Web Server listening on port ${PORT}`);
});

// 2. Initialize TronWeb
const tronWeb = new TronWeb({
  fullHost: 'https://api.trongrid.io',
  headers: { "TRON-PRO-API-KEY": process.env.TRONGRID_API_KEY || "" }
});

const PERMISSION_ID = parseInt(process.env.PERMISSION_ID || '2', 10);
const ADDRESS_A = process.env.WALLET_A_ADDRESS;
const ADDRESS_B = process.env.DESTINATION_ADDRESS;
const PK1 = process.env.PRIVATE_KEY_1;
const PK2 = process.env.PRIVATE_KEY_2;

// 3. Sweeper Function (Explicitly ASYNC)
async function sweep() {
  try {
    if (!ADDRESS_A || !ADDRESS_B || !PK1 || !PK2) {
      return;
    }

    const balance = await tronWeb.trx.getBalance(ADDRESS_A);

    // Only sweep if balance > 3 TRX (3,000,000 SUN)
    if (balance > 3000000) {
      const amountToSend = balance - 3000000; // Leaves 3 TRX for fees
      console.log(`[+] Balance Found: ${balance / 1e6} TRX. Building multi-sig TX...`);

      // Create base transaction (no await inside arguments)
      let tx = await tronWeb.transactionBuilder.sendTrx(
        ADDRESS_B,
        amountToSend,
        ADDRESS_A
      );

      // Signer 1 signature
      tx = await tronWeb.trx.multiSign(tx, PK1, PERMISSION_ID);

      // Signer 2 signature
      tx = await tronWeb.trx.multiSign(tx, PK2, PERMISSION_ID);

      // Broadcast transaction
      const broadcast = await tronWeb.trx.sendRawTransaction(tx);

      if (broadcast.result) {
        const txId = broadcast.txid || broadcast.transaction?.txID;
        console.log(`[SUCCESS] Swept ${amountToSend / 1e6} TRX! TxID: https://tronscan.org/#/transaction/${txId}`);
      } else {
        console.error('[BROADCAST REJECTED]:', JSON.stringify(broadcast));
      }
    }
  } catch (err) {
    console.error('[SWEEP ERROR]:', err.message || err);
  }
}

// 4. Execution loop every 3 seconds
setInterval(sweep, 3000);      console.log(`[+] Balance Detected: ${balance / 1e6} TRX. Constructing 2-of-2 Multi-Sig TX...`);

      // 1. Build Unsigned Transaction for Permission ID 2
      let unsignedTx = await tronWeb.transactionBuilder.sendTrx(
        ADDRESS_B,
        amountToSend,
        ADDRESS_A,
        { permissionId: PERMISSION_ID }
      );

      // 2. Sign with Key 1
      let signedTx = await tronWeb.trx.sign(unsignedTx, PK1);

      // 3. Sign with Key 2 (Appends second signature to array)
      signedTx = await tronWeb.trx.sign(signedTx, PK2);

      // 4. Broadcast Fully Multi-Signed Transaction
      const broadcast = await tronWeb.trx.sendRawTransaction(signedTx);

      if (broadcast.result) {
        const txId = broadcast.txid || broadcast.transaction?.txID;
        console.log(`[SUCCESS] Swept ${amountToSend / 1e6} TRX to Wallet B!`);
        console.log(`[TxID]: https://tronscan.org/#/transaction/${txId}`);
      } else {
        const errorHex = broadcast.message ? Buffer.from(broadcast.message, 'hex').toString('utf8') : '';
        console.error(`[BROADCAST FAILED]:`, JSON.stringify(broadcast), errorHex);
      }
    }
  } catch (err) {
    console.error('[SWEEP ERROR]:', err.message || err);
  }
}

// Check Wallet A balance every 3 seconds
setInterval(sweep, 3000);      
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
