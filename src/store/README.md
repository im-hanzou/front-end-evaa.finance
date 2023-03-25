# Init logic & update logic
1. tokens.initTokens() -> balance.initBalance() -> balance.updateData()
2. then user connected/restore connection, connector.onStatusChange(userAddress) -> tokens.initTokens(userAddress) -> balance.initBalance(userAddress) -> balance.updateData();
3. each UPDATE_INTERVAL balance.updateData() call himself

# posible states
used in App.tsx for prevent rendering before first time data is ready

- wallet.isLoading: tonwallet is inited
- tokens.isLoading: tokenAddress loaded
- balance.isLoading: updateData first time is calculated

block myBorrows and mySupplies loading
- balance.isInitedUser: getAggregatedBalances called without error

# adding new token
1. add icon to assets/pictures/
2. add ticker to enum Token in tokens.ts
3. add fields coresponding TokenMapValue to TokenMap in tokens.ts
