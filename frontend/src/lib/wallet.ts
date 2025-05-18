import { isConnected, getAddress, requestAccess } from "@stellar/freighter-api"

export async function connectWallet(): Promise<string> {
  if (typeof window === "undefined") throw new Error("Tarayıcıda çalışır")
  const { isConnected: ok } = await isConnected().catch(() => ({ isConnected: false }))
  if (!ok) throw new Error("Freighter eklentisi yüklü değil veya bağlı değil")
  let addrObj = await getAddress()
  if (!addrObj.address) {
    addrObj = await requestAccess()
  }
  if (addrObj.error || !addrObj.address) {
    throw new Error("Cüzdan adresi alınamadı")
  }
  return addrObj.address
}