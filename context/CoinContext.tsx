import React, { createContext, useContext, useMemo, useState, type ReactNode } from "react";

type CoinData = {
  days: number;
  color: string;
  displayName: string;
};

type CoinContextValue = {
  coinData: CoinData;
  updateCoinData: (updates: Partial<CoinData>) => void;
};

const CoinContext = createContext<CoinContextValue | null>(null);

export function CoinProvider({ children }: { children: ReactNode }) {
  const [coinData, setCoinData] = useState<CoinData>({ days: 0, color: "#E0E0E0", displayName: "" });
  const value = useMemo(
    () => ({
      coinData,
      updateCoinData: (updates: Partial<CoinData>) => setCoinData((prev) => ({ ...prev, ...updates })),
    }),
    [coinData]
  );
  return <CoinContext.Provider value={value}>{children}</CoinContext.Provider>;
}

export function useCoinContext() {
  const context = useContext(CoinContext);
  if (!context) throw new Error("useCoinContext must be used within CoinProvider");
  return context;
}
