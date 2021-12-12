import { store, BigInt, Address } from "@graphprotocol/graph-ts"
import {
  BuySlot,
  Deposit,
  HNMarketWithdraw,
  HarvestTokens,
  Withdraw
} from "../generated/HNPool/HNPool"
import { HN } from "../../hashland-nft/generated/HN/HN"
import { HnInfo, HnCountByOwner, UserInfo } from "../generated/schema"

const hnAddr = Address.fromString('0xEEa8bD31DA9A2169C38968958B6DF216381B0f08');

export function handleBuySlot(event: BuySlot): void {
  let userInfo = UserInfo.load(event.params.user.toHex());
  if (!userInfo) {
    userInfo = new UserInfo(event.params.user.toHex());
    userInfo.user = event.params.user;
  }

  userInfo.purchasedSlots = userInfo.purchasedSlots.plus(BigInt.fromI32(1));
  userInfo.purchasedSlotsAmount = userInfo.purchasedSlotsAmount.plus(event.params.amount);

  userInfo.save();
}

export function handleDeposit(event: Deposit): void {
  let hnCountByOwner = HnCountByOwner.load(event.params.user.toHex());
  if (!hnCountByOwner) {
    hnCountByOwner = new HnCountByOwner(event.params.user.toHex());
    hnCountByOwner.owner = event.params.user;
  }

  for (let i = 0; i < event.params.hnIds.length; i++) {
    let hnInfo = HnInfo.load(event.params.hnIds[i].toHex());
    if (!hnInfo) {
      hnInfo = new HnInfo(event.params.hnIds[i].toHex());
      hnInfo.hnId = event.params.hnIds[i];
    }
    const hn = HN.bind(hnAddr);

    hnInfo.owner = event.params.user;
    hnInfo.ip = hn.ip(event.params.hnIds[i]);
    hnInfo.series = hn.series(event.params.hnIds[i]);
    hnInfo.level = hn.level(event.params.hnIds[i]);
    hnInfo.hnClass = hn.getRandomNumber(event.params.hnIds[i], 'class', BigInt.fromI32(1), BigInt.fromI32(4));
    hnInfo.spawntime = hn.spawntime(event.params.hnIds[i]);
    hnInfo.hcHashrate = hn.hashrates(event.params.hnIds[i], BigInt.fromI32(0));
    hnInfo.btcHashrate = hn.hashrates(event.params.hnIds[i], BigInt.fromI32(1));

    hnInfo.save();

    hnCountByOwner.total = hnCountByOwner.total.plus(BigInt.fromI32(1));
    if (hnInfo.level.equals(BigInt.fromI32(1))) {
      hnCountByOwner.l1 = hnCountByOwner.l1.plus(BigInt.fromI32(1));
    } else if (hnInfo.level.equals(BigInt.fromI32(2))) {
      hnCountByOwner.l2 = hnCountByOwner.l2.plus(BigInt.fromI32(1));
    } else if (hnInfo.level.equals(BigInt.fromI32(3))) {
      hnCountByOwner.l3 = hnCountByOwner.l3.plus(BigInt.fromI32(1));
    } else if (hnInfo.level.equals(BigInt.fromI32(4))) {
      hnCountByOwner.l4 = hnCountByOwner.l4.plus(BigInt.fromI32(1));
    } else {
      hnCountByOwner.l5 = hnCountByOwner.l5.plus(BigInt.fromI32(1));
    }
  }

  hnCountByOwner.save();
}

export function handleHNMarketWithdraw(event: HNMarketWithdraw): void {
  let hnCountByOwner = HnCountByOwner.load(event.params.seller.toHex());
  if (!hnCountByOwner) {
    hnCountByOwner = new HnCountByOwner(event.params.seller.toHex());
    hnCountByOwner.owner = event.params.seller;
  }

  let hnInfo = HnInfo.load(event.params.hnId.toHex());
  if (!hnInfo) {
    hnInfo = new HnInfo(event.params.hnId.toHex());
    hnInfo.hnId = event.params.hnId;
  }

  hnCountByOwner.total = hnCountByOwner.total.minus(BigInt.fromI32(1));
  if (hnInfo.level.equals(BigInt.fromI32(1))) {
    hnCountByOwner.l1 = hnCountByOwner.l1.minus(BigInt.fromI32(1));
  } else if (hnInfo.level.equals(BigInt.fromI32(2))) {
    hnCountByOwner.l2 = hnCountByOwner.l2.minus(BigInt.fromI32(1));
  } else if (hnInfo.level.equals(BigInt.fromI32(3))) {
    hnCountByOwner.l3 = hnCountByOwner.l3.minus(BigInt.fromI32(1));
  } else if (hnInfo.level.equals(BigInt.fromI32(4))) {
    hnCountByOwner.l4 = hnCountByOwner.l4.minus(BigInt.fromI32(1));
  } else {
    hnCountByOwner.l5 = hnCountByOwner.l5.minus(BigInt.fromI32(1));
  }

  store.remove('HnInfo', event.params.hnId.toHex());

  hnCountByOwner.save();
}

export function handleHarvestTokens(event: HarvestTokens): void {
  let userInfo = UserInfo.load(event.params.user.toHex());
  if (!userInfo) {
    userInfo = new UserInfo(event.params.user.toHex());
    userInfo.user = event.params.user;
  }

  for (let i = 0; i < event.params.tokenIds.length; i++) {
    if (event.params.tokenIds[i].equals(BigInt.fromI32(0))) {
      userInfo.harvestedHC = userInfo.harvestedHC.plus(event.params.amounts[i]);
    } else if (event.params.tokenIds[i].equals(BigInt.fromI32(1))) {
      userInfo.harvestedBTC = userInfo.harvestedBTC.plus(event.params.amounts[i]);
    }
  }

  userInfo.save();
}

export function handleWithdraw(event: Withdraw): void {
  let hnCountByOwner = HnCountByOwner.load(event.params.user.toHex());
  if (!hnCountByOwner) {
    hnCountByOwner = new HnCountByOwner(event.params.user.toHex());
    hnCountByOwner.owner = event.params.user;
  }

  for (let i = 0; i < event.params.hnIds.length; i++) {
    let hnInfo = HnInfo.load(event.params.hnIds[i].toHex());
    if (!hnInfo) {
      hnInfo = new HnInfo(event.params.hnIds[i].toHex());
      hnInfo.hnId = event.params.hnIds[i];
    }

    hnCountByOwner.total = hnCountByOwner.total.minus(BigInt.fromI32(1));
    if (hnInfo.level.equals(BigInt.fromI32(1))) {
      hnCountByOwner.l1 = hnCountByOwner.l1.minus(BigInt.fromI32(1));
    } else if (hnInfo.level.equals(BigInt.fromI32(2))) {
      hnCountByOwner.l2 = hnCountByOwner.l2.minus(BigInt.fromI32(1));
    } else if (hnInfo.level.equals(BigInt.fromI32(3))) {
      hnCountByOwner.l3 = hnCountByOwner.l3.minus(BigInt.fromI32(1));
    } else if (hnInfo.level.equals(BigInt.fromI32(4))) {
      hnCountByOwner.l4 = hnCountByOwner.l4.minus(BigInt.fromI32(1));
    } else {
      hnCountByOwner.l5 = hnCountByOwner.l5.minus(BigInt.fromI32(1));
    }

    store.remove('HnInfo', event.params.hnIds[i].toHex());
  }

  hnCountByOwner.save();
}
