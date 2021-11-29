import { Deposit, Withdraw } from "../../hclp-pool/generated/HCLPPool/HCLPPool"
import { UserInfo } from "../../hclp-pool/generated/schema"

export function handleDeposit(event: Deposit): void {
  let entity = UserInfo.load(event.params.user.toHex());
  if (!entity) {
    entity = new UserInfo(event.params.user.toHex());
    entity.user = event.params.user;
  }

  entity.stake = entity.stake.plus(event.params.amount);

  entity.save();
}

export function handleWithdraw(event: Withdraw): void {
  let entity = UserInfo.load(event.params.user.toHex());
  if (!entity) {
    entity = new UserInfo(event.params.user.toHex());
    entity.user = event.params.user;
  }

  entity.stake = entity.stake.minus(event.params.amount);

  entity.save();
}
