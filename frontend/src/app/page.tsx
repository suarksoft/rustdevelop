"use client"

import { useState, useEffect } from "react"
import Header from "@/components/header"
import PlantingForm from "@/components/planting-form"
import RecommendationPanel from "@/components/recommendation-panel"
import PlantingsTable from "@/components/plantings-table"
import TokenPanel from "@/components/token-panel"
import Navbar from "@/components/navbar"
import type { Planting } from "@/lib/types"
import SupportFarmerPanel from "@/components/supportToFatrmer"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Wallet } from "lucide-react"

export default function Home() {
  const [plantings, setPlantings] = useState<Planting[]>([])
  const [tokens, setTokens] = useState(0)
  const [selectedCity, setSelectedCity] = useState<string>("")
  const [selectedCrop, setSelectedCrop] = useState<string>("")
  const [wallet, setWallet] = useState<string | null>(null)
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null)

  // Token bakiyesi backend'den güncel olarak çekilir
  const fetchTokenBalance = async (wallet: string | null) => {
    if (!wallet) return 0
    try {
      const res = await fetch(`http://localhost:4000/api/balance/${wallet}`)
      const data = await res.json()
      return data.success ? data.balance : 0
    } catch {
      return 0
    }
  }

  // Cüzdan değiştiğinde bakiyeyi çek
  useEffect(() => {
    if (!wallet) return
    fetchTokenBalance(wallet).then(setTokens)
  }, [wallet])

  // Bildirim gösterme fonksiyonu
  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 5000) // 5 saniye sonra bildirim kaybolur
  }

  // Ekim formu submit edildiğinde:
  const handlePlantingSubmit = async (city: string, crop: string) => {
    const date = new Date().toLocaleDateString("tr-TR")
    const recommendation = getRecommendation(city, crop)
    const earnsReward = !recommendation.includes("risklidir") && !recommendation.includes("önerilmez")

    // Wallet bağlı mı?
    if (!wallet) {
      showNotification("error", "Cüzdan bağlı değil! Lütfen önce cüzdanınızı bağlayın.")
      return
    }

    const newPlanting: Planting = {
      id: plantings.length + 1,
      city,
      crop,
      earnsReward,
      date,
      wallet,
    }

    // Listede göster
    setPlantings([...plantings, newPlanting])

    // Ödül varsa backend'e mint isteği at ve ardından bakiyeyi güncelle
    if (earnsReward) {
      try {
        const mintRes = await fetch("http://localhost:4000/api/mint-reward", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ wallet, amount: 10 }),
        })
        const mintJson = await mintRes.json()
        if (!mintJson.success) {
          showNotification("error", "Mint hatası: " + mintJson.error)
        } else {
          showNotification("success", "Tebrikler! 10 AquaToken cüzdanınıza gönderildi.")
        }
      } catch (err) {
        showNotification("error", "Mint sırasında hata oluştu.")
      }
      // Mintten sonra bakiyeyi tekrar çek
      fetchTokenBalance(wallet).then(setTokens)
    }

    // (Opsiyonel) API'ye ekimi kaydet
    try {
      await fetch("/api/planting", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPlanting),
      })
    } catch (error) {
      console.error("API error:", error)
    }
  }

  const handleSelectionChange = (city: string, crop: string) => {
    setSelectedCity(city)
    setSelectedCrop(crop)
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50">
      <Navbar wallet={wallet} onWalletConnect={setWallet} />
      <div className="container mx-auto px-4 py-8">
        <Header />

        {/* Bildirim alanı */}
        {notification && (
          <div className="mb-6">
            <Alert variant={notification.type === "success" ? "default" : "destructive"}>
              <AlertDescription>{notification.message}</AlertDescription>
            </Alert>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-8">
          {/* Sol sütun - Ana içerik */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <PlantingForm onSubmit={handlePlantingSubmit} onSelectionChange={handleSelectionChange} />
              {selectedCity && selectedCrop && <RecommendationPanel city={selectedCity} crop={selectedCrop} />}
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <PlantingsTable plantings={plantings} />
            </div>
          </div>

          {/* Sağ sütun - Token ve Destek */}
          <div className="lg:col-span-4 space-y-6">
            {/* Cüzdan bilgisi */}
            {wallet ? (
              <div className="bg-white rounded-lg shadow-md p-4 flex items-center space-x-3">
                <div className="bg-green-100 p-2 rounded-full">
                  <Wallet className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">Bağlı Cüzdan</div>
                  <div className="font-medium">
                    {wallet.slice(0, 8)}...{wallet.slice(-6)}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                <p className="text-yellow-700 text-sm">
                  Ekim bildirimi yapmak ve ödül kazanmak için cüzdanınızı bağlayın.
                </p>
              </div>
            )}

            {/* Token paneli */}
            <TokenPanel tokens={tokens} />

            {/* Çiftçiye destek paneli */}
            {wallet && <SupportFarmerPanel wallet={wallet} onNotification={showNotification} />}
          </div>
        </div>
      </div>
    </main>
  )
}

// Recommendation fonksiyonu aynı kalabilir
function getRecommendation(city: string, crop: string): string {
  const recommendations: Record<string, Record<string, string>> = {
    Konya: {
      Mısır: "Konya'da bu yıl mısır ekmek risklidir, su yetersiz. Nohut önerilir.",
      Nohut: "Konya'da nohut ekimi için ideal koşullar mevcut. İyi bir tercih!",
      Mercimek: "Konya'da mercimek ekimi orta düzeyde verimli olabilir.",
      Arpa: "Konya'da arpa ekimi için uygun koşullar var.",
      Buğday: "Konya'da buğday ekimi için uygun koşullar var, ancak su tasarrufu önemli.",
      Pamuk: "Konya'da pamuk ekimi önerilmez, su tüketimi çok yüksek.",
    },
    Ankara: {
      Mısır: "Ankara'da mısır ekimi için orta düzeyde uygun koşullar var.",
      Nohut: "Ankara'da nohut ekimi için ideal koşullar mevcut.",
      Mercimek: "Ankara'da mercimek ekimi verimli olabilir.",
      Arpa: "Ankara'da arpa ekimi için çok uygun koşullar var.",
      Buğday: "Ankara'da buğday ekimi için uygun koşullar var.",
      Pamuk: "Ankara'da pamuk ekimi önerilmez, iklim uygun değil.",
    },
    Yozgat: {
      Mısır: "Yozgat'ta mısır ekimi için orta düzeyde uygun koşullar var.",
      Nohut: "Yozgat'ta nohut ekimi için uygun koşullar var.",
      Mercimek: "Yozgat'ta mercimek ekimi verimli olabilir.",
      Arpa: "Yozgat'ta arpa ekimi için uygundur, buğday da tercih edilebilir.",
      Buğday: "Yozgat'ta buğday ekimi için çok uygun koşullar var.",
      Pamuk: "Yozgat'ta pamuk ekimi önerilmez, iklim uygun değil.",
    },
    Adana: {
      Mısır: "Adana'da mısır ekimi için ideal koşullar mevcut.",
      Nohut: "Adana'da nohut ekimi için uygun koşullar var.",
      Mercimek: "Adana'da mercimek ekimi orta düzeyde verimli olabilir.",
      Arpa: "Adana'da arpa ekimi için uygun koşullar var.",
      Buğday: "Adana'da buğday ekimi için uygun koşullar var.",
      Pamuk: "Adana'da pamuk ekimi için ideal koşullar mevcut. Çok iyi bir tercih!",
    },
    Manisa: {
      Mısır: "Manisa'da mısır ekimi için uygun koşullar var.",
      Nohut: "Manisa'da nohut ekimi için orta düzeyde uygun koşullar var.",
      Mercimek: "Manisa'da mercimek ekimi orta düzeyde verimli olabilir.",
      Arpa: "Manisa'da arpa ekimi için uygun koşullar var.",
      Buğday: "Manisa'da buğday ekimi için uygun koşullar var.",
      Pamuk: "Manisa'da pamuk ekimi için uygun koşullar var, ancak su yönetimi önemli.",
    },
  }

  return recommendations[city]?.[crop] || `${city} için ${crop} ekimi hakkında bilgi bulunmamaktadır.`
}
