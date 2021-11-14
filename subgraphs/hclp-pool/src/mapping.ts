import { HCLPPool, Deposit, Withdraw } from "../../hclp-pool/generated/HCLPPool/HCLPPool"
import { UserInfo } from "../../hclp-pool/generated/schema"

export function handleDeposit(event: Deposit): void {
  let entity = UserInfo.load(event.params.user.toHex());

  if (!entity) {
    entity = new UserInfo(event.params.user.toHex());
  }

  const contract = HCLPPool.bind(event.address);

  entity.user = event.params.user;
  entity.stake = contract.userStake(event.params.user);

  entity.save();
}

export function handleWithdraw(event: Withdraw): void {
  let entity = UserInfo.load(event.params.user.toHex());

  if (!entity) {
    entity = new UserInfo(event.params.user.toHex());
  }

  const contract = HCLPPool.bind(event.address);

  entity.user = event.params.user;
  entity.stake = contract.userStake(event.params.user);

  entity.save();
}
