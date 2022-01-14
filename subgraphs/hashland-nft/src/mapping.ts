import { BigInt, Address } from "@graphprotocol/graph-ts"
import {
  HN,
  SetHashrates,
  SetData,
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

export function handleSetData(event: SetData): void {
  if (event.params.slot == 'ultra') {
    let hnInfo = HnInfo.load(event.params.hnId.toHex());
    if (!hnInfo) {
      hnInfo = new HnInfo(event.params.hnId.toHex());
      hnInfo.hnId = event.params.hnId;
    }

    if (hnInfo.ultra == false) {
      hnInfo.ultra = event.params.data.equals(BigInt.fromI32(1)) ? true : false;

      hnInfo.save();

      let hnCount = HnCount.load(BigInt.fromI32(0).toHex());
      if (!hnCount) {
        hnCount = new HnCount(BigInt.fromI32(0).toHex());
      }

      if (hnInfo.ultra == true) {
        hnCount.ultra = hnCount.ultra.plus(BigInt.fromI32(1));
      }

      hnCount.save();

      let hnCountByOwner = HnCountByOwner.load(hnInfo.owner.toHex());
      if (!hnCountByOwner) {
        hnCountByOwner = new HnCountByOwner(hnInfo.owner.toHex());
        hnCountByOwner.owner = hnInfo.owner;
      }

      if (hnInfo.ultra == true) {
        hnCountByOwner.ultra = hnCountByOwner.ultra.plus(BigInt.fromI32(1));
      }

      hnCountByOwner.save();
    }
  }
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

  hnInfo.owner = event.params.to;
  hnInfo.ip = hn.ip(event.params.hnId);
  hnInfo.series = hn.series(event.params.hnId);
  hnInfo.level = hn.level(event.params.hnId);
  hnInfo.hnClass = hn.getRandomNumber(event.params.hnId, 'class', BigInt.fromI32(1), BigInt.fromI32(4));
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

export function handleTransfer(event: Transfer): void {
  if (event.params.from.notEqual(Address.zero())) {
    let hnInfo = HnInfo.load(event.params.tokenId.toHex());
    if (!hnInfo) {
      hnInfo = new HnInfo(event.params.tokenId.toHex());
      hnInfo.hnId = event.params.tokenId;
    }

    hnInfo.owner = event.params.to;

    hnInfo.save();

    let hnCountByOwnerFrom = HnCountByOwner.load(event.params.from.toHex());
    if (!hnCountByOwnerFrom) {
      hnCountByOwnerFrom = new HnCountByOwner(event.params.from.toHex());
      hnCountByOwnerFrom.owner = event.params.from;
    }

    hnCountByOwnerFrom.total = hnCountByOwnerFrom.total.minus(BigInt.fromI32(1));
    if (hnInfo.level.equals(BigInt.fromI32(1))) {
      hnCountByOwnerFrom.l1 = hnCountByOwnerFrom.l1.minus(BigInt.fromI32(1));
    } else if (hnInfo.level.equals(BigInt.fromI32(2))) {
      hnCountByOwnerFrom.l2 = hnCountByOwnerFrom.l2.minus(BigInt.fromI32(1));
    } else if (hnInfo.level.equals(BigInt.fromI32(3))) {
      hnCountByOwnerFrom.l3 = hnCountByOwnerFrom.l3.minus(BigInt.fromI32(1));
    } else if (hnInfo.level.equals(BigInt.fromI32(4))) {
      hnCountByOwnerFrom.l4 = hnCountByOwnerFrom.l4.minus(BigInt.fromI32(1));
    } else {
      hnCountByOwnerFrom.l5 = hnCountByOwnerFrom.l5.minus(BigInt.fromI32(1));
    }
    if (hnInfo.ultra == true) {
      hnCountByOwnerFrom.ultra = hnCountByOwnerFrom.ultra.minus(BigInt.fromI32(1));
    }

    hnCountByOwnerFrom.save();

    let hnCountByOwnerTo = HnCountByOwner.load(event.params.to.toHex());
    if (!hnCountByOwnerTo) {
      hnCountByOwnerTo = new HnCountByOwner(event.params.to.toHex());
      hnCountByOwnerTo.owner = event.params.to;
    }

    hnCountByOwnerTo.total = hnCountByOwnerTo.total.plus(BigInt.fromI32(1));
    if (hnInfo.level.equals(BigInt.fromI32(1))) {
      hnCountByOwnerTo.l1 = hnCountByOwnerTo.l1.plus(BigInt.fromI32(1));
    } else if (hnInfo.level.equals(BigInt.fromI32(2))) {
      hnCountByOwnerTo.l2 = hnCountByOwnerTo.l2.plus(BigInt.fromI32(1));
    } else if (hnInfo.level.equals(BigInt.fromI32(3))) {
      hnCountByOwnerTo.l3 = hnCountByOwnerTo.l3.plus(BigInt.fromI32(1));
    } else if (hnInfo.level.equals(BigInt.fromI32(4))) {
      hnCountByOwnerTo.l4 = hnCountByOwnerTo.l4.plus(BigInt.fromI32(1));
    } else {
      hnCountByOwnerTo.l5 = hnCountByOwnerTo.l5.plus(BigInt.fromI32(1));
    }
    if (hnInfo.ultra == true) {
      hnCountByOwnerTo.ultra = hnCountByOwnerTo.ultra.plus(BigInt.fromI32(1));
    }

    hnCountByOwnerTo.save();
  }
}
