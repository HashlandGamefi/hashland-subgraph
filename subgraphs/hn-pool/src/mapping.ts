import { store, BigInt, Address } from "@graphprotocol/graph-ts"
import {
  BuySlot,
  Deposit,
  HNMarketWithdraw,
  HarvestTokens,
  Withdraw
} from "../generated/HNPool/HNPool"
import { HN } from "../../hashland-nft/generated/HN/HN"
import { HnInfo, UserInfo, SlotCount } from "../generated/schema"

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

  let slotCount = SlotCount.load(BigInt.fromI32(0).toHex());
  if (!slotCount) {
    slotCount = new SlotCount(BigInt.fromI32(0).toHex());
  }

  slotCount.purchasedSlots = slotCount.purchasedSlots.plus(BigInt.fromI32(1));
  slotCount.purchasedSlotsAmount = slotCount.purchasedSlotsAmount.plus(event.params.amount);
  if (event.params.amount.toI32() / 1e18 == 4) {
    slotCount.s1 = slotCount.s1.plus(BigInt.fromI32(1));
  } else if (event.params.amount.toI32() / 1e18 == 16) {
    slotCount.s2 = slotCount.s2.plus(BigInt.fromI32(1));
  } else if (event.params.amount.toI32() / 1e18 == 64) {
    slotCount.s3 = slotCount.s3.plus(BigInt.fromI32(1));
  } else {
    slotCount.s4 = slotCount.s4.plus(BigInt.fromI32(1));
  }

  slotCount.save();
}

export function handleDeposit(event: Deposit): void {
  let userInfo = UserInfo.load(event.params.user.toHex());
  if (!userInfo) {
    userInfo = new UserInfo(event.params.user.toHex());
    userInfo.user = event.params.user;
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

    userInfo.total = userInfo.total.plus(BigInt.fromI32(1));
    if (hnInfo.level.equals(BigInt.fromI32(1))) {
      userInfo.l1 = userInfo.l1.plus(BigInt.fromI32(1));
    } else if (hnInfo.level.equals(BigInt.fromI32(2))) {
      userInfo.l2 = userInfo.l2.plus(BigInt.fromI32(1));
    } else if (hnInfo.level.equals(BigInt.fromI32(3))) {
      userInfo.l3 = userInfo.l3.plus(BigInt.fromI32(1));
    } else if (hnInfo.level.equals(BigInt.fromI32(4))) {
      userInfo.l4 = userInfo.l4.plus(BigInt.fromI32(1));
    } else {
      userInfo.l5 = userInfo.l5.plus(BigInt.fromI32(1));
    }
  }

  userInfo.save();
}

export function handleHNMarketWithdraw(event: HNMarketWithdraw): void {
  let userInfo = UserInfo.load(event.params.seller.toHex());
  if (!userInfo) {
    userInfo = new UserInfo(event.params.seller.toHex());
    userInfo.user = event.params.seller;
  }

  let hnInfo = HnInfo.load(event.params.hnId.toHex());
  if (!hnInfo) {
    hnInfo = new HnInfo(event.params.hnId.toHex());
    hnInfo.hnId = event.params.hnId;
  }

  userInfo.total = userInfo.total.minus(BigInt.fromI32(1));
  if (hnInfo.level.equals(BigInt.fromI32(1))) {
    userInfo.l1 = userInfo.l1.minus(BigInt.fromI32(1));
  } else if (hnInfo.level.equals(BigInt.fromI32(2))) {
    userInfo.l2 = userInfo.l2.minus(BigInt.fromI32(1));
  } else if (hnInfo.level.equals(BigInt.fromI32(3))) {
    userInfo.l3 = userInfo.l3.minus(BigInt.fromI32(1));
  } else if (hnInfo.level.equals(BigInt.fromI32(4))) {
    userInfo.l4 = userInfo.l4.minus(BigInt.fromI32(1));
  } else {
    userInfo.l5 = userInfo.l5.minus(BigInt.fromI32(1));
  }

  store.remove('HnInfo', event.params.hnId.toHex());

  userInfo.save();
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
  let userInfo = UserInfo.load(event.params.user.toHex());
  if (!userInfo) {
    userInfo = new UserInfo(event.params.user.toHex());
    userInfo.user = event.params.user;
  }

  for (let i = 0; i < event.params.hnIds.length; i++) {
    let hnInfo = HnInfo.load(event.params.hnIds[i].toHex());
    if (!hnInfo) {
      hnInfo = new HnInfo(event.params.hnIds[i].toHex());
      hnInfo.hnId = event.params.hnIds[i];
    }

    userInfo.total = userInfo.total.minus(BigInt.fromI32(1));
    if (hnInfo.level.equals(BigInt.fromI32(1))) {
      userInfo.l1 = userInfo.l1.minus(BigInt.fromI32(1));
    } else if (hnInfo.level.equals(BigInt.fromI32(2))) {
      userInfo.l2 = userInfo.l2.minus(BigInt.fromI32(1));
    } else if (hnInfo.level.equals(BigInt.fromI32(3))) {
      userInfo.l3 = userInfo.l3.minus(BigInt.fromI32(1));
    } else if (hnInfo.level.equals(BigInt.fromI32(4))) {
      userInfo.l4 = userInfo.l4.minus(BigInt.fromI32(1));
    } else {
      userInfo.l5 = userInfo.l5.minus(BigInt.fromI32(1));
    }

    store.remove('HnInfo', event.params.hnIds[i].toHex());
  }

  userInfo.save();
}
