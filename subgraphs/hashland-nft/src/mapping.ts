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

  let hnCount = HnCount.load(BigInt.fromI32(0).toHex());
  if (!hnCount) {
    hnCount = new HnCount(BigInt.fromI32(0).toHex());
  }

  if (event.params.level.equals(BigInt.fromI32(1))) {
    hnCount.l5 = hnCount.l5.minus(BigInt.fromI32(1));
    hnCount.l1 = hnCount.l1.plus(BigInt.fromI32(1));
  } else if (event.params.level.equals(BigInt.fromI32(2))) {
    hnCount.l1 = hnCount.l1.minus(BigInt.fromI32(1));
    hnCount.l2 = hnCount.l2.plus(BigInt.fromI32(1));
  } else if (event.params.level.equals(BigInt.fromI32(3))) {
    hnCount.l2 = hnCount.l2.minus(BigInt.fromI32(1));
    hnCount.l3 = hnCount.l3.plus(BigInt.fromI32(1));
  } else if (event.params.level.equals(BigInt.fromI32(4))) {
    hnCount.l3 = hnCount.l3.minus(BigInt.fromI32(1));
    hnCount.l4 = hnCount.l4.plus(BigInt.fromI32(1));
  } else {
    hnCount.l4 = hnCount.l4.minus(BigInt.fromI32(1));
    hnCount.l5 = hnCount.l5.plus(BigInt.fromI32(1));
  }

  hnCount.save();

  let hnCountByOwner = HnCountByOwner.load(hnInfo.owner.toHex());
  if (!hnCountByOwner) {
    hnCountByOwner = new HnCountByOwner(hnInfo.owner.toHex());
    hnCountByOwner.owner = hnInfo.owner;
  }

  if (event.params.level.equals(BigInt.fromI32(1))) {
    hnCountByOwner.l5 = hnCountByOwner.l5.minus(BigInt.fromI32(1));
    hnCountByOwner.l1 = hnCountByOwner.l1.plus(BigInt.fromI32(1));
  } else if (event.params.level.equals(BigInt.fromI32(2))) {
    hnCountByOwner.l1 = hnCountByOwner.l1.minus(BigInt.fromI32(1));
    hnCountByOwner.l2 = hnCountByOwner.l2.plus(BigInt.fromI32(1));
  } else if (event.params.level.equals(BigInt.fromI32(3))) {
    hnCountByOwner.l2 = hnCountByOwner.l2.minus(BigInt.fromI32(1));
    hnCountByOwner.l3 = hnCountByOwner.l3.plus(BigInt.fromI32(1));
  } else if (event.params.level.equals(BigInt.fromI32(4))) {
    hnCountByOwner.l3 = hnCountByOwner.l3.minus(BigInt.fromI32(1));
    hnCountByOwner.l4 = hnCountByOwner.l4.plus(BigInt.fromI32(1));
  } else {
    hnCountByOwner.l4 = hnCountByOwner.l4.minus(BigInt.fromI32(1));
    hnCountByOwner.l5 = hnCountByOwner.l5.plus(BigInt.fromI32(1));
  }

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
  hnInfo.spawntime = hn.spawntime(event.params.hnId);
  hnInfo.hcHashrate = hn.hashrates(event.params.hnId, BigInt.fromI32(0));
  hnInfo.btcHashrate = hn.hashrates(event.params.hnId, BigInt.fromI32(1));

  hnInfo.save();

  let hnCount = HnCount.load(BigInt.fromI32(0).toHex());
  if (!hnCount) {
    hnCount = new HnCount(BigInt.fromI32(0).toHex());
  }

  hnCount.total = hnCount.total.plus(BigInt.fromI32(1));
  if (hnInfo.level.equals(BigInt.fromI32(1))) {
    hnCount.l1 = hnCount.l1.plus(BigInt.fromI32(1));
  } else if (hnInfo.level.equals(BigInt.fromI32(2))) {
    hnCount.l2 = hnCount.l2.plus(BigInt.fromI32(1));
  } else if (hnInfo.level.equals(BigInt.fromI32(3))) {
    hnCount.l3 = hnCount.l3.plus(BigInt.fromI32(1));
  } else if (hnInfo.level.equals(BigInt.fromI32(4))) {
    hnCount.l4 = hnCount.l4.plus(BigInt.fromI32(1));
  } else {
    hnCount.l5 = hnCount.l5.plus(BigInt.fromI32(1));
  }

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

  if (event.params.from.notEqual(Address.zero())) {
    let hnCountByOwner = HnCountByOwner.load(event.params.from.toHex());
    if (!hnCountByOwner) {
      hnCountByOwner = new HnCountByOwner(event.params.from.toHex());
      hnCountByOwner.owner = event.params.from;
    }

    hnCountByOwner.total = hnCountByOwner.total.minus(BigInt.fromI32(1));
    if (hnInfo.level.equals(BigInt.fromI32(1))) {
      hnCountByOwner.l1 = hnCountByOwner.l1.minus(BigInt.fromI32(1));
    } else if (hnInfo.level.equals(BigInt.fromI32(2))) {
      hnCountByOwner.l2 = hnCountByOwner.l2.minus(BigInt.fromI32(1));
    } else if (hnInfo.level.equals(BigInt.fromI32(3))) {
      hnCountByOwner.l3 = hnCountByOwner.l3.minus(BigInt.fromI32(1));
    } else if (hnInfo.level.equals(BigInt.fromI32(4))) {
      hnCountByOwner.l4 = hnCountByOwner.l4.minus(BigInt.fromI32(1));
    } else {
      hnCountByOwner.l5 = hnCountByOwner.l5.minus(BigInt.fromI32(1));
    }

    hnCountByOwner.save();
  }

  let hnCountByOwner = HnCountByOwner.load(event.params.to.toHex());
  if (!hnCountByOwner) {
    hnCountByOwner = new HnCountByOwner(event.params.to.toHex());
    hnCountByOwner.owner = event.params.to;
  }

  hnCountByOwner.total = hnCountByOwner.total.plus(BigInt.fromI32(1));
  if (hnInfo.level.equals(BigInt.fromI32(1))) {
    hnCountByOwner.l1 = hnCountByOwner.l1.plus(BigInt.fromI32(1));
  } else if (hnInfo.level.equals(BigInt.fromI32(2))) {
    hnCountByOwner.l2 = hnCountByOwner.l2.plus(BigInt.fromI32(1));
  } else if (hnInfo.level.equals(BigInt.fromI32(3))) {
    hnCountByOwner.l3 = hnCountByOwner.l3.plus(BigInt.fromI32(1));
  } else if (hnInfo.level.equals(BigInt.fromI32(4))) {
    hnCountByOwner.l4 = hnCountByOwner.l4.plus(BigInt.fromI32(1));
  } else {
    hnCountByOwner.l5 = hnCountByOwner.l5.plus(BigInt.fromI32(1));
  }

  hnCountByOwner.save();
}
