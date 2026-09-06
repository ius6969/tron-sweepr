import http from 'http';
import { TronWeb } from 'tronweb';

const PORT = process.env.PORT || 10000;
http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('TRON Multi-Sig Sweeper Active');
}).listen(PORT, () => {
  console.log(`HTTP Web Server listening on port ${PORT}`);
});

const tronWeb = new TronWeb({
  fullHost: 'https://api.trongrid.io',
  headers: { "TRON-PRO-API-KEY": process.env.TRONGRID_API_KEY || "" }
});

const PERMISSION_ID = parseInt(process.env.PERMISSION_ID || '2', 10);
const ADDRESS_A = process.env.WALLET_A_ADDRESS;
const ADDRESS_B = process.env.DESTINATION_ADDRESS;
const PK1 = process.env.PRIVATE_KEY_1;
const PK2 = process.env.PRIVATE_KEY_2;

const sweep = async () => {
  try {
    if (!ADDRESS_A || !ADDRESS_B || !PK1 || !PK2) return;

    const balance = await tronWeb.trx.getBalance(ADDRESS_A);

    if (balance > 3000000) {
      const amountToSend = balance - 3000000;
      console.log(`[+] Balance Found: ${balance / 1e6} TRX. Building multi-sig TX...`);

      // 1. Build base transaction
      const tx = await tronWeb.transactionBuilder.sendTrx(
        ADDRESS_B,
        amountToSend,
        ADDRESS_A
      );

      // 2. Add signature from Key 1 under Permission ID 2
      let signedTx = await tronWeb.trx.multiSign(tx, PK1, PERMISSION_ID);

      // 3. Add signature from Key 2 (omitting permissionId so it appends key 2 to the same signature array)
      signedTx = await tronWeb.trx.multiSign(signedTx, PK2, null);

      // 4. Broadcast
      const broadcast = await tronWeb.trx.sendRawTransaction(signedTx);

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
};

setInterval(sweep, 3000);
