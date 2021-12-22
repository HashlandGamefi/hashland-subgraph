import { BigInt, Address } from "@graphprotocol/graph-ts"
import {
  BindInviter,
  DepositInviter,
  HarvestToken,
  WithdrawInviter
} from "../generated/InvitePool/InvitePool"
import { InviterInfo } from "../generated/schema"

export function handleBindInviter(event: BindInviter): void {
  let inviterInfo = InviterInfo.load(event.params.inviter.toHex());
  if (!inviterInfo) {
    inviterInfo = new InviterInfo(event.params.inviter.toHex());
    inviterInfo.inviter = event.params.inviter;
  }

  inviterInfo.stakedHC = inviterInfo.stakedHC.plus(event.params.hashrate);
  inviterInfo.usersLength = inviterInfo.usersLength.plus(BigInt.fromI32(1));

  inviterInfo.save();
}

export function handleDepositInviter(event: DepositInviter): void {
  if (event.params.inviter.notEqual(Address.zero())) {
    let inviterInfo = InviterInfo.load(event.params.inviter.toHex());
    if (!inviterInfo) {
      inviterInfo = new InviterInfo(event.params.inviter.toHex());
      inviterInfo.inviter = event.params.inviter;
    }

    inviterInfo.stakedHC = inviterInfo.stakedHC.plus(event.params.hashrate);

    inviterInfo.save();
  }
}

export function handleHarvestToken(event: HarvestToken): void {
  let inviterInfo = InviterInfo.load(event.params.inviter.toHex());
  if (!inviterInfo) {
    inviterInfo = new InviterInfo(event.params.inviter.toHex());
    inviterInfo.inviter = event.params.inviter;
  }

  inviterInfo.harvestedHC = inviterInfo.harvestedHC.plus(event.params.amount);

  inviterInfo.save();
}

export function handleWithdrawInviter(event: WithdrawInviter): void {
  if (event.params.inviter.notEqual(Address.zero())) {
    let inviterInfo = InviterInfo.load(event.params.inviter.toHex());
    if (!inviterInfo) {
      inviterInfo = new InviterInfo(event.params.inviter.toHex());
      inviterInfo.inviter = event.params.inviter;
    }

    inviterInfo.stakedHC = inviterInfo.stakedHC.minus(event.params.hashrate);

    inviterInfo.save();
  }
}
