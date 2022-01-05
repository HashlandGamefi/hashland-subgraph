import { store, BigInt, Address } from "@graphprotocol/graph-ts"
import { HNMarket, Buy, Cancel, Sell } from "../generated/HNMarket/HNMarket"
import { HN } from "../../hashland-nft/generated/HN/HN"
import { BuyInfo, SellInfo } from "../generated/schema"

const hnAddr = Address.fromString('0xEEa8bD31DA9A2169C38968958B6DF216381B0f08');

export function handleBuy(event: Buy): void {
  for (let i = 0; i < event.params.hnIds.length; i++) {
    let buyInfo = BuyInfo.load(event.transaction.hash.toHex() + "-" + event.logIndex.toString() + "-" + event.params.hnIds[i].toHex());
    if (!buyInfo) {
      buyInfo = new BuyInfo(event.transaction.hash.toHex() + "-" + event.logIndex.toString() + "-" + event.params.hnIds[i].toHex());
      buyInfo.hnId = event.params.hnIds[i];
    }
    const hnMarket = HNMarket.bind(event.address);
    const hn = HN.bind(hnAddr);

    buyInfo.buyer = event.params.buyer;
    buyInfo.seller = event.params.sellers[i];
    buyInfo.price = event.params.prices[i];
    buyInfo.feeRatio = hnMarket.feeRatio();
    buyInfo.feeAmount = buyInfo.price.times(buyInfo.feeRatio).div(BigInt.fromI32(10000));
    buyInfo.sellAmount = buyInfo.price.minus(buyInfo.feeAmount);
    buyInfo.isInPool = event.params.isInPools[i];
    buyInfo.buyTime = event.block.timestamp;
    buyInfo.ip = hn.ip(event.params.hnIds[i]);
    buyInfo.series = hn.series(event.params.hnIds[i]);
    buyInfo.level = hn.level(event.params.hnIds[i]);
    buyInfo.hnClass = hn.getRandomNumber(event.params.hnIds[i], 'class', BigInt.fromI32(1), BigInt.fromI32(4));
    buyInfo.spawntime = hn.spawntime(event.params.hnIds[i]);
    buyInfo.hcHashrate = hn.hashrates(event.params.hnIds[i], BigInt.fromI32(0));
    buyInfo.btcHashrate = hn.hashrates(event.params.hnIds[i], BigInt.fromI32(1));
    buyInfo.ultra = hn.data(event.params.hnIds[i], 'ultra').equals(BigInt.fromI32(1)) ? true : false;

    buyInfo.save();

    store.remove('SellInfo', event.params.hnIds[i].toHex());
  }
}

export function handleCancel(event: Cancel): void {
  for (let i = 0; i < event.params.hnIds.length; i++) {
    store.remove('SellInfo', event.params.hnIds[i].toHex());
  }
}

export function handleSell(event: Sell): void {
  for (let i = 0; i < event.params.hnIds.length; i++) {
    let sellInfo = SellInfo.load(event.params.hnIds[i].toHex());
    if (!sellInfo) {
      sellInfo = new SellInfo(event.params.hnIds[i].toHex());
      sellInfo.hnId = event.params.hnIds[i];
    }
    const hn = HN.bind(hnAddr);

    sellInfo.seller = event.params.seller;
    sellInfo.price = event.params.prices[i];
    sellInfo.isInPool = event.params.isInPools[i];
    sellInfo.sellTime = event.block.timestamp;
    sellInfo.ip = hn.ip(event.params.hnIds[i]);
    sellInfo.series = hn.series(event.params.hnIds[i]);
    sellInfo.level = hn.level(event.params.hnIds[i]);
    sellInfo.hnClass = hn.getRandomNumber(event.params.hnIds[i], 'class', BigInt.fromI32(1), BigInt.fromI32(4));
    sellInfo.spawntime = hn.spawntime(event.params.hnIds[i]);
    sellInfo.hcHashrate = hn.hashrates(event.params.hnIds[i], BigInt.fromI32(0));
    sellInfo.btcHashrate = hn.hashrates(event.params.hnIds[i], BigInt.fromI32(1));
    sellInfo.ultra = hn.data(event.params.hnIds[i], 'ultra').equals(BigInt.fromI32(1)) ? true : false;

    sellInfo.save();
  }
}