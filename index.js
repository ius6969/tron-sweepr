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

      // 1. Build unsigned transfer
      const tx = await tronWeb.transactionBuilder.sendTrx(
        ADDRESS_B,
        amountToSend,
        ADDRESS_A
      );

      // 2. Inject Permission ID 2 & sign with Key 1
      let signedTx = await tronWeb.trx.multiSign(tx, PK1, PERMISSION_ID);

      // 3. Sign with Key 2 (DO NOT pass PERMISSION_ID again)
      signedTx = await tronWeb.trx.multiSign(signedTx, PK2);

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

setInterval(sweep, 3000);      );

      let signedTx = await tronWeb.trx.multiSign(tx, PK1, PERMISSION_ID);
      signedTx = await tronWeb.trx.multiSign(signedTx, PK2, PERMISSION_ID);

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

setInterval(sweep, 3000);        ADDRESS_A
      );

      // 2. Co-sign with Key 1 for Permission ID 2
      let signedTx = await tronWeb.trx.multiSign(tx, PK1, PERMISSION_ID);

      // 3. Co-sign with Key 2 for Permission ID 2
      signedTx = await tronWeb.trx.multiSign(signedTx, PK2, PERMISSION_ID);

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

setInterval(sweep, 3000);      );

      tx = await tronWeb.trx.multiSign(tx, PK1, PERMISSION_ID);
      tx = await tronWeb.trx.multiSign(tx, PK2, PERMISSION_ID);

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
};

setInterval(sweep, 3000);        { permissionId: PERMISSION_ID }
      );

      tx = await tronWeb.trx.sign(tx, PK1);
      tx = await tronWeb.trx.sign(tx, PK2);

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
};

setInterval(sweep, 3000);        { permissionId: PERMISSION_ID }
      );

      tx = await tronWeb.trx.multiSign(tx, PK1);
      tx = await tronWeb.trx.multiSign(tx, PK2);

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
};

setInterval(sweep, 3000);        amountToSend,
        ADDRESS_A,
        { permissionId: PERMISSION_ID }
      );

      tx = await tronWeb.trx.multiSign(tx, PK1);
      tx = await tronWeb.trx.multiSign(tx, PK2);

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
};

setInterval(sweep, 3000);      console.log(`[+] Balance Found: ${balance / 1e6} TRX. Building multi-sig TX...`);

      // Build unsigned transaction with permission ID 2 attached
      let tx = await tronWeb.transactionBuilder.sendTrx(
        ADDRESS_B,
        amountToSend,
        ADDRESS_A,
        { permissionId: PERMISSION_ID }
      );

      // Sign with Key 1
      tx = await tronWeb.trx.multiSign(tx, PK1);

      // Sign with Key 2
      tx = await tronWeb.trx.multiSign(tx, PK2);

      // Broadcast
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
};

// 4. Polling loop
setInterval(sweep, 3000);console.log(`[+] Balance Found: ${balance / 1e6} TRX. Building 2-of-2 multi-sig TX...`);

        // Build transaction with permissionId 2 attached
        let tx = await tronWeb.transactionBuilder.sendTrx(
          ADDRESS_B,
          amountToSend,
          ADDRESS_A,
          { permissionId: PERMISSION_ID }
        );

        // Sign with Key 1
        tx = await tronWeb.trx.multiSign(tx, PK1);

        // Sign with Key 2
        tx = await tronWeb.trx.multiSign(tx, PK2);

        // Broadcast to TRON node
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

  executeSweep();
}

// Poll every 3 seconds
setInterval(runSweeper, 3000);      if (balance > 3000000) {
        const amountToSend = balance - 3000000;
        console.log(`[+] Balance Found: ${balance / 1e6} TRX. Building multi-sig TX...`);

        // Step 1: Unsigned TX
        let tx = await tronWeb.transactionBuilder.sendTrx(
          ADDRESS_B,
          amountToSend,
          ADDRESS_A
        );

        // Step 2: Multi-sign key 1
        tx = await tronWeb.trx.multiSign(tx, PK1, PERMISSION_ID);

        // Step 3: Multi-sign key 2
        tx = await tronWeb.trx.multiSign(tx, PK2, PERMISSION_ID);

        // Step 4: Broadcast
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

  executeSweep();
}

// 4. Poll every 3 seconds safely
setInterval(runSweeper, 3000);
