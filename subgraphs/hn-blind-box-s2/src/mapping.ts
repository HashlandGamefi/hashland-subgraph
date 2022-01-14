import { BigInt } from "@graphprotocol/graph-ts"
import {
  BuyBoxes,
  SpawnHns
} from "../generated/HNBlindBoxS2/HNBlindBoxS2"
import { UserInfo } from "../generated/schema"

export function handleBuyBoxes(event: BuyBoxes): void {
  let userInfo = UserInfo.load(event.params.user.toHex());
  if (!userInfo) {
    userInfo = new UserInfo(event.params.user.toHex());
    userInfo.user = event.params.user;
  }

  if (event.params.tokenId == BigInt.fromI32(1)) {
    userInfo.hcAmount = userInfo.hcAmount.plus(event.params.price);
  } else if (event.params.tokenId == BigInt.fromI32(2)) {
    userInfo.hclpAmount = userInfo.hclpAmount.plus(event.params.price);
  } else if (event.params.tokenId == BigInt.fromI32(3)) {
    userInfo.busdAmount = userInfo.busdAmount.plus(event.params.price);
  }

  userInfo.save();
}

export function handleSpawnHns(event: SpawnHns): void {
  let userInfo = UserInfo.load(event.params.user.toHex());
  if (!userInfo) {
    userInfo = new UserInfo(event.params.user.toHex());
    userInfo.user = event.params.user;
  }

  userInfo.total = userInfo.total.plus(event.params.boxesLength);
  for (let i = 0; i < event.params.levels.length; i++) {
    if (event.params.levels[i].equals(BigInt.fromI32(1))) {
      userInfo.l1 = userInfo.l1.plus(BigInt.fromI32(1));
    } else if (event.params.levels[i].equals(BigInt.fromI32(2))) {
      userInfo.l2 = userInfo.l2.plus(BigInt.fromI32(1));
    } else if (event.params.levels[i].equals(BigInt.fromI32(3))) {
      userInfo.l3 = userInfo.l3.plus(BigInt.fromI32(1));
    } else if (event.params.levels[i].equals(BigInt.fromI32(4))) {
      userInfo.l4 = userInfo.l4.plus(BigInt.fromI32(1));
    } else {
      userInfo.l5 = userInfo.l5.plus(BigInt.fromI32(1));
    }
    if (event.params.ultras[i] == true) {
      userInfo.ultra = userInfo.ultra.plus(BigInt.fromI32(1));
    }
  }

  userInfo.save();
}
