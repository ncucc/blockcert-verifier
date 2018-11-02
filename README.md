# blockcert-verifier
An open source "Blockchain Certificate" verification program.

前言
---
中央大學於 2018 年 10/24 - 10/26 舉辦的 [TANET 2018 研討會](https://cis.ncu.edu.tw/SeminarSys/activity/TANET2018/) 使用 Blockchain 技術來發給得獎者證書,
雖然我們提供一個網站 ( https://ncu.edu.tw/blockcerts/ ) , 但我們仍需要一個 Open Source 能驗證
[區塊鏈證書系統](https://ncu.edu.tw/blockcerts/)  核發的證書.

安裝與執行
--------
我們在設計這個驗證程式時, 希望程式碼越少越好, 所以我們選用 Nodejs, 在我們撰寫時, 使用的 Node 版本是 v10.13.0, 雖然我們用比較老式的 Javascript 標準, 另外, 因為區塊鏈證書有使用 SHA256withECDSA 做數位簽章, 而儲存在 Block Chain 上
的 Public Key 採 DER (DER is a binary format for data structures described by ASN.1.) 格式, 
我們沒有找到可以讀這格式的 Javascript 程式碼, 因此, 在數位簽章的檢查部份, 採用外部呼叫一個 Java 程式來完成, 因此, 要執行此驗證
程式除了需要安裝 Nodejs 之外, 另外需要安裝 JDK

首先, 先由 github 上將程式取回
```bash
git clone https://github.com/ncucc/blockcert-verifier.git
```
進程式目錄後, 編譯 java 程式
```bash
javac ECDSA_Verifier.java
```
接下來, 要用 npm 將需要的模組載入
```bash
npm install
```
我們的區塊鏈憑證寫在 IOTA 貨幣上, 所以要找到一個活著的 IOTA 節點, 程式預設使用 https://node04.iotatoken.nl:443 這個點,
這個節點, 其實, 我們最近使用的經驗上不很穩定, 因此, 如果連線有困難的話, 可以到 https://iota.dance 網站可以查到這些節點,
找一個存活的點, 用編輯器去修改 app.js 這個程式其中的這行
```javascript
const IOTA_HOST = 'https://node04.iotatoken.nl:443'
```
接下來, 執行這程式, 後面加上區塊鏈 Bundle ID 即可, 如
```bash
node app.js RQPBZCECSSQVCZEAGJJDTLJZSIAPZAYIKATVWABIYCZORSCAGXBGEISRMJJJLDOPAKCVEFQXKDZSVXYCY
```
其中, RQPBZCECSSQVCZEAGJJDTLJZSIAPZAYIKATVWABIYCZORSCAGXBGEISRMJJJLDOPAKCVEFQXKDZSVXYCY 是我們 Blockcerts 系統的
Genesis Block, 任何合法 Blockcerts 的 Data 最後都會 link 到這個 block, 而且直接或間接經過個 block 上的 public key 驗證

我們第一批核發的證書可以到 [TANET 2018](https://cis.ncu.edu.tw/SeminarSys/activity/TANET2018/news/32) 網站找到,
找一個區塊鏈證書的 ID 當參數可以測試結果


後記
---
其它關於本區塊鏈證書的說明請參見 https://drive.google.com/open?id=1ikt8zgmqZK6ohFRESlVE_TkS-FaGf2zRFeY7ZlVKIBw

