import {defineConfig} from '@playwright/test';
import {existsSync} from 'node:fs';
import path from 'node:path';
const chrome=process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE||(process.platform==='win32'?path.join(process.env.PROGRAMFILES||'C:/Program Files','Google/Chrome/Application/chrome.exe'):'');
export default defineConfig({
 testDir:'./tests/browser',timeout:45000,expect:{timeout:7000},workers:2,fullyParallel:true,
 outputDir:'test-results/browser',
 reporter:[['list'],['json',{outputFile:'test-results/browser-summary.json'}]],
 use:{baseURL:'http://127.0.0.1:4173',browserName:'chromium',launchOptions:chrome&&existsSync(chrome)?{executablePath:chrome}:{},screenshot:'only-on-failure',trace:'retain-on-failure'},
 webServer:{command:'node node_modules/next/dist/bin/next start --hostname 127.0.0.1 --port 4173',url:'http://127.0.0.1:4173',reuseExistingServer:!process.env.CI,timeout:30000}
});
