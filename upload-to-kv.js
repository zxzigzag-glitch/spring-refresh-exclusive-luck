import fs from 'fs';
import path from 'path';
import axios from 'axios';


/**
 * Upload the modified HTML file to Cloudflare, placing the script in the same-level directory as each language. 
 * Be sure to strictly name the folders according to the corresponding language codes: `en`, `vi`, `lo`, `th`, `zh-tw`, `ms`. 
 * After the upload is complete, you can use the preview URL below to check whether it is correct.
 * 
 * preview        https://fisgweb.fisg.workers.dev/en/landing/fxleader
 * production     https://www.fisg.com/en/landing/fxleader
 */



// ===== config =====
const KV_KEY = 'spring-refresh-exclusive-luck';
const API_TOKEN = 'ed98v51JXGBi4WXPichDqB7swfLeMYEhFT1xtAD4';
const ACCOUNT_ID = 'b06769c6ffefd86d4cdf94834dc0fc1a';
const NAMESPACE_ID = 'bf020a62a0c949999abbfbc58d533fcb';
// ===================

async function uploadFileToKV(key, content) {
    key = key == "en" ? KV_KEY : `${KV_KEY}:${key}`
    const url = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/storage/kv/namespaces/${NAMESPACE_ID}/values/${encodeURIComponent(key)}`;

    try {
        const res = await axios.put(url, content, {
            headers: {
                'Authorization': `Bearer ${API_TOKEN}`,
                'Content-Type': 'text/plain'
            }
        });

        if (res.data.success) {
            console.log(`Successed: ${key}`);
        } else {
            console.error(`Failed: ${key}`, res.data.errors);
        }
    } catch (err) {
        console.error(`Warn: ${key}`, err.message);
    }
}

async function main() {
    const currentDir = process.cwd();
    const items = fs.readdirSync(currentDir, { withFileTypes: true });    

    for (const item of items) {
        if (item.isDirectory()) {
            const htmlPath = path.join(currentDir, item.name, 'index.html');
            if (fs.existsSync(htmlPath)) {
                const content = fs.readFileSync(htmlPath, 'utf-8');
                await uploadFileToKV(item.name, content);
            } else {
                console.warn(`${item.name} not found index.html`);
            }
        }
    }
}

main();
