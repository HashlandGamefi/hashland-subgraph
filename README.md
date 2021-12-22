## Subgraphs

1. **[Hashland NFT](https://thegraph.com/explorer/subgraph/hashlandgamefi/hashland-nft)**: Tracks all Hashland NFT.

2. **[HN Market](https://thegraph.com/explorer/subgraph/hashlandgamefi/hn-market)**: Tracks all HN in market.

3. **[HN Pool](https://thegraph.com/explorer/subgraph/hashlandgamefi/hn-pool)**: Tracks all HN in pool.

4. **[HN Upgrade](https://thegraph.com/explorer/subgraph/hashlandgamefi/hn-upgrade)**: Tracks the upgrade of all HN.

5. **[Invite Pool](https://thegraph.com/explorer/subgraph/hashlandgamefi/invite-pool)**: Tracks all inviters in pool.

6. **[HCLP Pool](https://thegraph.com/explorer/subgraph/hashlandgamefi/hclp-pool)**: Tracks all HCLP in pool.

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