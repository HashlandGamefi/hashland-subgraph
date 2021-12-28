import { BigInt } from "@graphprotocol/graph-ts"
import {
  Deposit,
} from "../generated/HWDeposit/HWDeposit"
import { UserInfo } from "../generated/schema"

export function handleDeposit(event: Deposit): void {
  let userInfo = UserInfo.load(event.params.user.toHex());
  if (!userInfo) {
    userInfo = new UserInfo(event.params.user.toHex());
    userInfo.user = event.params.user;
  }

  userInfo.amount = userInfo.amount.plus(event.params.amount);
  userInfo.count = userInfo.count.plus(BigInt.fromI32(1));

  userInfo.save();
}
