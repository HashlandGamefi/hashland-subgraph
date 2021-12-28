import {
  Deposit,
  Withdraw,
  HarvestToken
} from "../generated/HCLPPool/HCLPPool"
import { UserInfo } from "../generated/schema"

export function handleDeposit(event: Deposit): void {
  let userInfo = UserInfo.load(event.params.user.toHex());
  if (!userInfo) {
    userInfo = new UserInfo(event.params.user.toHex());
    userInfo.user = event.params.user;
  }

  userInfo.stake = userInfo.stake.plus(event.params.amount);

  userInfo.save();
}

export function handleWithdraw(event: Withdraw): void {
  let userInfo = UserInfo.load(event.params.user.toHex());
  if (!userInfo) {
    userInfo = new UserInfo(event.params.user.toHex());
    userInfo.user = event.params.user;
  }

  userInfo.stake = userInfo.stake.minus(event.params.amount);

  userInfo.save();
}

export function handleHarvestToken(event: HarvestToken): void {
  let userInfo = UserInfo.load(event.params.user.toHex());
  if (!userInfo) {
    userInfo = new UserInfo(event.params.user.toHex());
    userInfo.user = event.params.user;
  }

  userInfo.harvested = userInfo.harvested.plus(event.params.amount);

  userInfo.save();
}