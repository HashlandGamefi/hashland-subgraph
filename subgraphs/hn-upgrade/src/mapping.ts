import { BigInt } from "@graphprotocol/graph-ts"
import {
  HNUpgrade,
  UpgradeHns
} from "../generated/HNUpgrade/HNUpgrade"
import { UserInfo } from "../generated/schema"

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
}
