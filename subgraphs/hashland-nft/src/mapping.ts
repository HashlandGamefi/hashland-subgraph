import { BigInt, Address } from "@graphprotocol/graph-ts"
import {
  HN,
  SetHashrates,
  SetLevel,
  SpawnHn,
  Transfer
} from "../../hashland-nft/generated/HN/HN"
import { HnInfo, HnCount, HnCountByOwner } from "../../hashland-nft/generated/schema"

export function handleSetHashrates(event: SetHashrates): void {
  let hnInfo = HnInfo.load(event.params.hnId.toHex());
  if (!hnInfo) {
    hnInfo = new HnInfo(event.params.hnId.toHex());
    hnInfo.hnId = event.params.hnId;
  }

  hnInfo.hcHashrate = event.params.hashrates[0];
  hnInfo.btcHashrate = event.params.hashrates[1];

  hnInfo.save();
}

export function handleSetLevel(event: SetLevel): void {
  let hnInfo = HnInfo.load(event.params.hnId.toHex());
  if (!hnInfo) {
    hnInfo = new HnInfo(event.params.hnId.toHex());
    hnInfo.hnId = event.params.hnId;
  }

  hnInfo.level = event.params.level;

  hnInfo.save();

  const level = Number(event.params.level.toString());

  let hnCount = HnCount.load(BigInt.fromI32(0).toHex());
  if (!hnCount) {
    hnCount = new HnCount(BigInt.fromI32(0).toHex());
    hnCount.level = [];
  }

  const hnCountLevel = hnCount.level;
  hnCountLevel[level > 1 ? level - 2 : 4] = hnCountLevel[level > 1 ? level - 2 : 4].minus(BigInt.fromI32(1));
  hnCountLevel[level - 1] = hnCountLevel[level - 1].plus(BigInt.fromI32(1));
  hnCount.level = hnCountLevel;

  hnCount.save();

  let hnCountByOwner = HnCountByOwner.load(hnInfo.owner.toHex());
  if (!hnCountByOwner) {
    hnCountByOwner = new HnCountByOwner(hnInfo.owner.toHex());
    hnCountByOwner.owner = hnInfo.owner;
    hnCountByOwner.level = [];
  }

  const hnCountByOwnerLevel = hnCountByOwner.level;
  hnCountByOwnerLevel[level > 1 ? level - 2 : 4] = hnCountByOwnerLevel[level > 1 ? level - 2 : 4].minus(BigInt.fromI32(1));
  hnCountByOwnerLevel[level - 1] = hnCountByOwnerLevel[level - 1].plus(BigInt.fromI32(1));
  hnCountByOwner.level = hnCountByOwnerLevel;

  hnCountByOwner.save();
}

export function handleSpawnHn(event: SpawnHn): void {
  let hnInfo = HnInfo.load(event.params.hnId.toHex());
  if (!hnInfo) {
    hnInfo = new HnInfo(event.params.hnId.toHex());
    hnInfo.hnId = event.params.hnId;
  }
  const hn = HN.bind(event.address);

  hnInfo.ip = hn.ip(event.params.hnId);
  hnInfo.series = hn.series(event.params.hnId);
  hnInfo.level = hn.level(event.params.hnId);
  hnInfo.hnClass = hn.getRandomNumber(event.params.hnId, 'class', BigInt.fromI32(1), BigInt.fromI32(4));
  hnInfo.spawntime = hn.spawntime(event.params.hnId);
  hnInfo.hcHashrate = hn.hashrates(event.params.hnId, BigInt.fromI32(0));
  hnInfo.btcHashrate = hn.hashrates(event.params.hnId, BigInt.fromI32(1));

  hnInfo.save();

  const level = Number(hnInfo.level.toString());

  let hnCount = HnCount.load(BigInt.fromI32(0).toHex());
  if (!hnCount) {
    hnCount = new HnCount(BigInt.fromI32(0).toHex());
    hnCount.level = [];
  }

  hnCount.total = hnCount.total.plus(BigInt.fromI32(1));
  const hnCountLevel = hnCount.level;
  hnCountLevel[level - 1] = hnCountLevel[level - 1].plus(BigInt.fromI32(1));
  hnCount.level = hnCountLevel;

  hnCount.save();
}

export function handleTransfer(event: Transfer): void {
  let hnInfo = HnInfo.load(event.params.tokenId.toHex());
  if (!hnInfo) {
    hnInfo = new HnInfo(event.params.tokenId.toHex());
    hnInfo.hnId = event.params.tokenId;
  }

  hnInfo.owner = event.params.to;

  hnInfo.save();

  const level = Number(hnInfo.level.toString());

  if (event.params.from.notEqual(Address.zero())) {
    let hnCountByOwner = HnCountByOwner.load(event.params.from.toHex());
    if (!hnCountByOwner) {
      hnCountByOwner = new HnCountByOwner(event.params.from.toHex());
      hnCountByOwner.owner = event.params.from;
      hnCountByOwner.level = [];
    }

    hnCountByOwner.total = hnCountByOwner.total.minus(BigInt.fromI32(1));
    const hnCountByOwnerLevel = hnCountByOwner.level;
    hnCountByOwnerLevel[level - 1] = hnCountByOwnerLevel[level - 1].minus(BigInt.fromI32(1));
    hnCountByOwner.level = hnCountByOwnerLevel;

    hnCountByOwner.save();
  }

  let hnCountByOwner = HnCountByOwner.load(event.params.to.toHex());
  if (!hnCountByOwner) {
    hnCountByOwner = new HnCountByOwner(event.params.to.toHex());
    hnCountByOwner.owner = event.params.to;
    hnCountByOwner.level = [];
  }

  hnCountByOwner.total = hnCountByOwner.total.plus(BigInt.fromI32(1));
  const hnCountByOwnerLevel = hnCountByOwner.level;
  hnCountByOwnerLevel[level - 1] = hnCountByOwnerLevel[level - 1].plus(BigInt.fromI32(1));
  hnCountByOwner.level = hnCountByOwnerLevel;

  hnCountByOwner.save();
}
