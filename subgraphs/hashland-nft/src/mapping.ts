import { BigInt } from "@graphprotocol/graph-ts"
import {
  HN,
  SetHashrates,
  SetLevel,
  SpawnHn,
  Transfer
} from "../../hashland-nft/generated/HN/HN"
import { HnInfo } from "../../hashland-nft/generated/schema"

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
}

export function handleSpawnHn(event: SpawnHn): void {
  let entity = HnInfo.load(event.params.hnId.toHex());
  if (!entity) {
    entity = new HnInfo(event.params.hnId.toHex());
    entity.hnId = event.params.hnId;
  }
  const hn = HN.bind(event.address);

  entity.owner = hn.ownerOf(event.params.hnId);
  entity.ip = hn.ip(event.params.hnId);
  entity.series = hn.series(event.params.hnId);
  entity.level = hn.level(event.params.hnId);
  entity.spawntime = hn.spawntime(event.params.hnId);
  entity.hcHashrate = hn.hashrates(event.params.hnId, BigInt.fromI32(0));
  entity.btcHashrate = hn.hashrates(event.params.hnId, BigInt.fromI32(1));

  entity.save();
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
