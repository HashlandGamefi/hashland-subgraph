## Subgraphs

**[Hashland NFT](https://thegraph.com/explorer/subgraph/hashlandgamefi/hashland-nft)**: Tracks all Hashland NFT.

**[HN Market](https://thegraph.com/explorer/subgraph/hashlandgamefi/hn-market)**: Tracks all HN in market.

**[HN Market V2](https://thegraph.com/explorer/subgraph/hashlandgamefi/hn-market-v2)**: Tracks all HN in market v2.

**[HN Pool](https://thegraph.com/explorer/subgraph/hashlandgamefi/hn-pool)**: Tracks all HN in pool.

**[HN Upgrade](https://thegraph.com/explorer/subgraph/hashlandgamefi/hn-upgrade)**: Tracks the upgrade of all HN.

**[HN Upgrade V2](https://thegraph.com/explorer/subgraph/hashlandgamefi/hn-upgrade-v2)**: Tracks the upgrade v2 of all HN.

**[Invite Pool](https://thegraph.com/explorer/subgraph/hashlandgamefi/invite-pool)**: Tracks all inviters in pool.

**[HCLP Pool](https://thegraph.com/explorer/subgraph/hashlandgamefi/hclp-pool)**: Tracks all HCLP in pool.

**[HW Deposit](https://thegraph.com/explorer/subgraph/hashlandgamefi/hw-deposit)**: Tracks all Hash Warfare deposit.

**[HN Blind Box](https://thegraph.com/explorer/subgraph/hashlandgamefi/hn-blind-box)**: Tracks all HN in blind box.

**[HN Blind Box S2](https://thegraph.com/explorer/subgraph/hashlandgamefi/hn-blind-box-s2)**: Tracks all HN in blind box s2.

## Dependencies

- [Graph CLI](https://github.com/graphprotocol/graph-cli)
    - Required to generate and build local GraphQL dependencies.

```shell
npm install -g @graphprotocol/graph-cli
```

## Deployment

1. Run `graph auth` to authenticate with your deploy key.

2. Type `cd subgraphs/[subgraph]` to enter the subgraph.

3. Run the `graph codegen` command to prepare the TypeScript sources for the GraphQL (generated/*).

4. Run the `graph build` command to build the subgraph, and check compilation errors before deploying.

5. Run `graph deploy --node https://api.thegraph.com/deploy/ hashlandgamefi/[subgraph]` to deploy the subgraph.