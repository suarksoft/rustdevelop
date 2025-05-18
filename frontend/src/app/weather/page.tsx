"use client"

import { useState, useEffect } from "react"
import Navbar from "@/components/navbar"
import WeatherPanel from "@/components/weather-panel"
import InfoBox from "@/components/info-box"
import RewardCenter from "@/components/reward-center"
import UserGuide from "@/components/user-guide"
import RewardHistory from "@/components/reward-history"
import { fetchWeatherData, checkRewardEligibility } from "@/lib/weather-service"
import type { WeatherData, FarmingAction } from "@/lib/types"

// Token bakiyesini backend'den getir
async function fetchTokenBalance(wallet: string | null): Promise<number> {
  if (!wallet) return 0
  try {
    const res = await fetch(`http://localhost:4000/api/balance/${wallet}`)
    const data = await res.json()
    return data.success ? data.balance : 0
  } catch {
    return 0
  }
}

// Backend'e mint isteği at
async function sendMintReward(wallet: string, amount: number) {
  const res = await fetch("http://localhost:4000/api/mint-reward", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ wallet, amount }),
  })
  return res.json()
}

export default function WeatherPage() {
  const [wallet, setWallet] = useState<string | null>(null)
  const [tokenBalance, setTokenBalance] = useState(0)
  const [selectedCity, setSelectedCity] = useState("Ankara")
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)
  const [actions, setActions] = useState<FarmingAction[]>([])

  // Cüzdan değişince bakiye çek
  useEffect(() => {
    if (!wallet) return
    fetchTokenBalance(wallet).then(setTokenBalance)
  }, [wallet])

  // Hava durumu yükle
  useEffect(() => {
    setLoading(true)
    fetchWeatherData(selectedCity)
      .then(d => setWeatherData(d))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [selectedCity])

  // Mint veya aksiyon sonrası bakiyeyi otomatik çek
  const refreshBalance = () => {
    if (!wallet) return
    fetchTokenBalance(wallet).then(setTokenBalance)
  }

  const handleActionSubmit = async (actionType: string) => {
    if (!wallet) { alert("Önce cüzdan bağlayın"); return }
    if (!weatherData) return

    const isEligible = checkRewardEligibility(actionType, weatherData)
    const reward = isEligible ? 15 : 0

    const newAction: FarmingAction = {
      id: actions.length + 1,
      date: new Date().toLocaleDateString("tr-TR"),
      actionType,
      weatherCondition: weatherData.condition,
      temperature: weatherData.temperature,
      rewarded: isEligible,
      rewardAmount: reward,
      wallet,
    }
    setActions([newAction, ...actions])

    if (isEligible) {
      const resp = await sendMintReward(wallet, reward)
      refreshBalance()  // Mint işlemi sonrası bakiyeyi güncelle
      if (!resp.success) alert("Mint hatası: " + resp.error)
      else alert("Ödül cüzdana gönderildi!")
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50">
      <Navbar wallet={wallet} onWalletConnect={setWallet} />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-green-700 mb-6 text-center">
          Hava Durumu ve Akıllı Tarım Ödül Sistemi
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <WeatherPanel
              selectedCity={selectedCity}
              onCityChange={setSelectedCity}
              weatherData={weatherData}
              loading={loading}
              onRefresh={() => {
                setLoading(true)
                fetchWeatherData(selectedCity)
                  .then(d => setWeatherData(d))
                  .catch(console.error)
                  .finally(() => setLoading(false))
              }}
            />
            <InfoBox />
            <RewardCenter
              weatherData={weatherData}
              wallet={wallet}
              onActionSubmit={handleActionSubmit}
            />
            <UserGuide />
          </div>
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-green-700 mb-4">Token Bakiyeniz</h2>
              <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg p-6 text-center">
                <div className="text-4xl font-bold">{tokenBalance}</div>
                <div className="text-green-100 mt-1">AquaRunnel Token</div>
              </div>
              {wallet && (
                <div className="text-xs text-gray-400 mt-2">
                  Cüzdan: {wallet.slice(0,8)}…
                </div>
              )}
            </div>
            <RewardHistory actions={actions} />
          </div>
        </div>
      </div>
    </main>
  )
}