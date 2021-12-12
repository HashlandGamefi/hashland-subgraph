import { BigInt } from "@graphprotocol/graph-ts"
import {
  HNUpgrade,
  UpgradeHns
} from "../generated/HNUpgrade/HNUpgrade"
import { UserInfo, UpgradeInfo } from "../generated/schema"

export function handleUpgradeHns(event: UpgradeHns): void {
  let userInfo = UserInfo.load(event.params.user.toHex());
  if (!userInfo) {
    userInfo = new UserInfo(event.params.user.toHex());
    userInfo.user = event.params.user;
  }
  const hnUpgrade = HNUpgrade.bind(event.address);

  userInfo.totalAmount = hnUpgrade.userUpgradeAmount(event.params.user);
  for (let i = 0; i < event.params.hnIds.length; i++) {
    userInfo.total = userInfo.total.plus(BigInt.fromI32(1));
    if (event.params.level.equals(BigInt.fromI32(2))) {
      userInfo.l2 = userInfo.l2.plus(BigInt.fromI32(1));
    } else if (event.params.level.equals(BigInt.fromI32(3))) {
      userInfo.l3 = userInfo.l3.plus(BigInt.fromI32(1));
    } else if (event.params.level.equals(BigInt.fromI32(4))) {
      userInfo.l4 = userInfo.l4.plus(BigInt.fromI32(1));
    } else {
      userInfo.l5 = userInfo.l5.plus(BigInt.fromI32(1));
    }
  }

  userInfo.save();

  let upgradeInfo = UpgradeInfo.load(BigInt.fromI32(0).toHex());
  if (!upgradeInfo) {
    upgradeInfo = new UpgradeInfo(BigInt.fromI32(0).toHex());
  }

  upgradeInfo.totalAmount = hnUpgrade.totalUpgradeAmount();
  for (let i = 0; i < event.params.hnIds.length; i++) {
    upgradeInfo.total = upgradeInfo.total.plus(BigInt.fromI32(1));
    if (event.params.level.equals(BigInt.fromI32(2))) {
      upgradeInfo.l2 = upgradeInfo.l2.plus(BigInt.fromI32(1));
    } else if (event.params.level.equals(BigInt.fromI32(3))) {
      upgradeInfo.l3 = upgradeInfo.l3.plus(BigInt.fromI32(1));
    } else if (event.params.level.equals(BigInt.fromI32(4))) {
      upgradeInfo.l4 = upgradeInfo.l4.plus(BigInt.fromI32(1));
    } else {
      upgradeInfo.l5 = upgradeInfo.l5.plus(BigInt.fromI32(1));
    }
  }

  upgradeInfo.save();
}
