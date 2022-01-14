import { BigInt } from "@graphprotocol/graph-ts"
import {
  HNUpgradeV2,
  UpgradeHns
} from "../generated/HNUpgradeV2/HNUpgradeV2"
import { UserInfo, UpgradeInfo } from "../generated/schema"

export function handleUpgradeHns(event: UpgradeHns): void {
  let userInfo = UserInfo.load(event.params.user.toHex());
  if (!userInfo) {
    userInfo = new UserInfo(event.params.user.toHex());
    userInfo.user = event.params.user;
  }
  const hnUpgradeV2 = HNUpgradeV2.bind(event.address);

  userInfo.totalAmount = hnUpgradeV2.userUpgradeAmount(event.params.user);
  for (let i = 0; i < event.params.hnIds.length; i++) {
    userInfo.total = userInfo.total.plus(BigInt.fromI32(1));
    if (event.params.levels[i].equals(BigInt.fromI32(2))) {
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

  let upgradeInfo = UpgradeInfo.load(BigInt.fromI32(0).toHex());
  if (!upgradeInfo) {
    upgradeInfo = new UpgradeInfo(BigInt.fromI32(0).toHex());
  }

  upgradeInfo.totalAmount = hnUpgradeV2.totalUpgradeAmount();
  for (let i = 0; i < event.params.hnIds.length; i++) {
    upgradeInfo.total = upgradeInfo.total.plus(BigInt.fromI32(1));
    if (event.params.levels[i].equals(BigInt.fromI32(2))) {
      upgradeInfo.l2 = upgradeInfo.l2.plus(BigInt.fromI32(1));
    } else if (event.params.levels[i].equals(BigInt.fromI32(3))) {
      upgradeInfo.l3 = upgradeInfo.l3.plus(BigInt.fromI32(1));
    } else if (event.params.levels[i].equals(BigInt.fromI32(4))) {
      upgradeInfo.l4 = upgradeInfo.l4.plus(BigInt.fromI32(1));
    } else {
      upgradeInfo.l5 = upgradeInfo.l5.plus(BigInt.fromI32(1));
    }
    if (event.params.ultras[i] == true) {
      upgradeInfo.ultra = upgradeInfo.ultra.plus(BigInt.fromI32(1));
    }
  }

  upgradeInfo.save();
}
