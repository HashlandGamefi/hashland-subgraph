import { BigInt } from "@graphprotocol/graph-ts"
import {
  HNPool,
  AirdropTokens,
  BuySlot,
  Deposit,
  HNMarketWithdraw,
  HarvestTokens,
  Withdraw
} from "../generated/HNPool/HNPool"
import { HnInfo, HnCountByOwner } from "../generated/schema"

export function handleAirdropTokens(event: AirdropTokens): void { }

export function handleBuySlot(event: BuySlot): void { }

export function handleDeposit(event: Deposit): void { }

export function handleHNMarketWithdraw(event: HNMarketWithdraw): void { }

export function handleHarvestTokens(event: HarvestTokens): void { }

export function handleWithdraw(event: Withdraw): void { }
