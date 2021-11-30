import { BigInt } from "@graphprotocol/graph-ts"
import {
  HN,
  SetHashrates,
  SetLevel,
  SpawnHn,
  Transfer
} from "../../hashland-nft/generated/HN/HN"
import { HnInfo, HnCount } from "../../hashland-nft/generated/schema"

export function handleSetHashrates(event: SetHashrates): void {
  let entity = HnInfo.load(event.params.hnId.toHex());
  if (!entity) {
    entity = new HnInfo(event.params.hnId.toHex());
    entity.hnId = event.params.hnId;
  }

  entity.hcHashrate = event.params.hashrates[0];
  entity.btcHashrate = event.params.hashrates[1];

  entity.save();
}

export function handleSetLevel(event: SetLevel): void {
  let entity = HnInfo.load(event.params.hnId.toHex());
  if (!entity) {
    entity = new HnInfo(event.params.hnId.toHex());
    entity.hnId = event.params.hnId;
  }

  entity.level = event.params.level;

  entity.save();

  let ent = HnCount.load(BigInt.fromI32(0).toHex());
  if (!ent) {
    ent = new HnCount(BigInt.fromI32(0).toHex());
  }

  if (entity.level.equals(BigInt.fromI32(1))) {
    ent.l5 = ent.l5.minus(BigInt.fromI32(1));
    ent.l1 = ent.l1.plus(BigInt.fromI32(1));
  } else if (entity.level.equals(BigInt.fromI32(2))) {
    ent.l1 = ent.l1.minus(BigInt.fromI32(1));
    ent.l2 = ent.l2.plus(BigInt.fromI32(1));
  } else if (entity.level.equals(BigInt.fromI32(3))) {
    ent.l2 = ent.l2.minus(BigInt.fromI32(1));
    ent.l3 = ent.l3.plus(BigInt.fromI32(1));
  } else if (entity.level.equals(BigInt.fromI32(4))) {
    ent.l3 = ent.l3.minus(BigInt.fromI32(1));
    ent.l4 = ent.l4.plus(BigInt.fromI32(1));
  } else {
    ent.l4 = ent.l4.minus(BigInt.fromI32(1));
    ent.l5 = ent.l5.plus(BigInt.fromI32(1));
  }

  ent.save();
}

export function handleSpawnHn(event: SpawnHn): void {
  let entity = HnInfo.load(event.params.hnId.toHex());
  if (!entity) {
    entity = new HnInfo(event.params.hnId.toHex());
    entity.hnId = event.params.hnId;
  }
  const hn = HN.bind(event.address);

  entity.owner = event.params.to;
  entity.ip = hn.ip(event.params.hnId);
  entity.series = hn.series(event.params.hnId);
  entity.level = hn.level(event.params.hnId);
  entity.spawntime = hn.spawntime(event.params.hnId);
  entity.hcHashrate = hn.hashrates(event.params.hnId, BigInt.fromI32(0));
  entity.btcHashrate = hn.hashrates(event.params.hnId, BigInt.fromI32(1));

  entity.save();

  let ent = HnCount.load(BigInt.fromI32(0).toHex());
  if (!ent) {
    ent = new HnCount(BigInt.fromI32(0).toHex());
  }

  if (entity.level.equals(BigInt.fromI32(1))) {
    ent.l1 = ent.l1.plus(BigInt.fromI32(1));
  } else if (entity.level.equals(BigInt.fromI32(2))) {
    ent.l2 = ent.l2.plus(BigInt.fromI32(1));
  } else if (entity.level.equals(BigInt.fromI32(3))) {
    ent.l3 = ent.l3.plus(BigInt.fromI32(1));
  } else if (entity.level.equals(BigInt.fromI32(4))) {
    ent.l4 = ent.l4.plus(BigInt.fromI32(1));
  } else {
    ent.l5 = ent.l5.plus(BigInt.fromI32(1));
  }

  ent.save();
}

export function handleTransfer(event: Transfer): void {
  let entity = HnInfo.load(event.params.tokenId.toHex());
  if (!entity) {
    entity = new HnInfo(event.params.tokenId.toHex());
    entity.hnId = event.params.tokenId;
  }

  entity.owner = event.params.to;

  entity.save();
}