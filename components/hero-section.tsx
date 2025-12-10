"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { onAuthStateChanged, signOut, User } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button"
import { GlassFilter } from "@/components/ui/liquid-radio"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { HandWrittenTitle } from "@/components/ui/hand-writing-text"
import { ChevronDown } from "lucide-react"

interface HeroSectionProps {
  lang: "ko" | "jp"
  onLangChange: (lang: "ko" | "jp") => void
}

export function HeroSection({ lang, onLangChange }: HeroSectionProps) {
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
    })

    return () => unsubscribe()
  }, [])

  const handleLogout = async () => {
    try {
      await signOut(auth)
      toast.success(lang === "ko" ? "로그아웃되었습니다." : "ログアウトしました。")
      router.push("/")
    } catch (error) {
      toast.error(lang === "ko" ? "로그아웃에 실패했습니다." : "ログアウトに失敗しました。")
    }
  }

  const content = {
    ko: {
      brandName: "미소",
      brandSuffix: "찌개",
      title: "한국과 일본을 잇는",
      subtitle: "특별한 인연",
      description: "문화의 경계를 넘어 진정한 연결을 만드는 프리미엄 한일 커플 매칭 플랫폼",
      cta: "시작하기",
      login: "로그인",
      logout: "로그아웃",
      menu: {
        guideline: "가이드라인",
        diagnosis: "연애진단",
        subscription: "구독플랜",
        matching: "매칭",
        chat: "대화",
        login: "로그인",
        logout: "로그아웃",
      },
      trustBadges: {
        verified: "본인 인증 완료",
        monitoring: "24시간 안전 모니터링",
        translation: "실시간 번역 지원",
      },
    },
    jp: {
      brandName: "ミソ",
      brandSuffix: "チゲ",
      title: "韓国と日本をつなぐ",
      subtitle: "特別な出会い",
      description: "文化の境界を越えて真のつながりを作るプレミアム韓日カップルマッチングプラットフォーム",
      cta: "始める",
      login: "ログイン",
      logout: "ログアウト",
      menu: {
        guideline: "ガイドライン",
        diagnosis: "恋愛診断",
        subscription: "プラン",
        matching: "マッチング",
        chat: "チャット",
        login: "ログイン",
        logout: "ログアウト",
      },
      trustBadges: {
        verified: "本人認証完了",
        monitoring: "24時間安全監視",
        translation: "リアルタイム翻訳サポート",
      },
    },
  }

  const t = content[lang]

  return (
    <section className="relative min-h-screen flex flex-col items-start justify-end overflow-hidden px-4 pb-16 lg:pb-24">
      {/* Background Image with Film Filter */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-gradient-to-br from-[#C97D60]/20 via-[#D4A574]/15 to-[#FF9DB5]/10">
        <Image
          src="/hero섹션_한일커플_이미지2.png"
          alt="한일 커플 배경"
          fill
          className="object-contain"
          priority
          quality={90}
          style={{
            filter: 'sepia(15%) saturate(110%) contrast(110%) brightness(92%)',
            objectPosition: 'center center',
          }}
        />
        {/* Film Camera Filter Overlay - Warm tones */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#C97D60]/35 via-[#D4A574]/25 to-[#FF9DB5]/15 mix-blend-overlay" />
        {/* Dark gradient for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40" />
        {/* Film grain texture effect */}
        <div 
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            mixBlendMode: 'overlay',
          }}
        />
      </div>

      {/* Logo - 좌측 상단 */}
      <motion.div
        className="absolute top-6 left-16 z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <Image
          src="/미소찌개_로고_v1.png"
          alt="미소♡찌개 로고"
          width={280}
          height={140}
          className="h-auto w-auto max-w-[280px] md:max-w-[320px] drop-shadow-lg"
          priority
        />
      </motion.div>

      {/* Top Navigation */}
      <div className="absolute top-6 right-6 z-10 flex items-center gap-3 flex-wrap justify-end max-w-full">
        {/* Menu Buttons */}
        <InteractiveHoverButton
          text={t.menu.guideline}
          className="border-white/20 bg-white/10 backdrop-blur-sm text-white"
        />
        <InteractiveHoverButton
          text={t.menu.diagnosis}
          className="border-white/20 bg-white/10 backdrop-blur-sm text-white"
        />
        <InteractiveHoverButton
          text={t.menu.subscription}
          className="border-white/20 bg-white/10 backdrop-blur-sm text-white"
        />
        <InteractiveHoverButton
          text={t.menu.matching}
          className="border-white/20 bg-white/10 backdrop-blur-sm text-white"
        />
        <InteractiveHoverButton
          text={t.menu.chat}
          onClick={() => {
            if (!user) {
              router.push(`/login?lang=${lang}&redirect=chat`)
              return
            }
            router.push(`/chat?lang=${lang}`)
          }}
          className="border-white/20 bg-white/10 backdrop-blur-sm text-white cursor-pointer"
        />
        {user ? (
          <InteractiveHoverButton
            text={t.menu.logout}
            onClick={handleLogout}
            className="border-white/20 bg-white/10 backdrop-blur-sm text-white cursor-pointer"
          />
        ) : (
          <Link href={`/login?lang=${lang}`}>
            <InteractiveHoverButton
              text={t.menu.login}
              className="border-white/20 bg-white/10 backdrop-blur-sm text-white"
            />
          </Link>
        )}

        {/* Language Toggle */}
        <div className="inline-flex h-9 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 p-0.5">
          <RadioGroup
            value={lang}
            onValueChange={(value) => onLangChange(value as "ko" | "jp")}
            className="group relative inline-grid grid-cols-[1fr_1fr] items-center gap-0 text-sm font-medium after:absolute after:inset-y-0 after:w-1/2 after:rounded-md after:bg-gradient-to-br after:from-accent/40 after:to-accent/60 after:shadow-[0_0_6px_rgba(255,107,157,0.1),0_2px_6px_rgba(255,107,157,0.15),inset_3px_3px_0.5px_-3px_rgba(255,107,157,0.4),inset_-3px_-3px_0.5px_-3px_rgba(255,107,157,0.5),inset_1px_1px_1px_-0.5px_rgba(255,107,157,0.3),inset_-1px_-1px_1px_-0.5px_rgba(255,107,157,0.3),inset_0_0_6px_6px_rgba(255,107,157,0.2),inset_0_0_2px_2px_rgba(255,107,157,0.15),0_0_12px_rgba(255,107,157,0.25)] after:transition-transform after:duration-300 after:[transition-timing-function:cubic-bezier(0.16,1,0.3,1)] has-[:focus-visible]:after:outline has-[:focus-visible]:after:outline-2 has-[:focus-visible]:after:outline-ring/70 data-[state=ko]:after:translate-x-0 data-[state=jp]:after:translate-x-full"
            data-state={lang}
          >
            <div
              className="absolute top-0 left-0 isolate -z-10 h-full w-full overflow-hidden rounded-md"
              style={{ filter: 'url("#radio-glass")' }}
            />
            <label className="relative z-10 inline-flex h-full min-w-8 cursor-pointer select-none items-center justify-center whitespace-nowrap px-4 transition-colors text-white/70 group-data-[state=jp]:text-white/70 group-data-[state=ko]:text-white">
              한국어
              <RadioGroupItem id="lang-ko" value="ko" className="sr-only" />
            </label>
            <label className="relative z-10 inline-flex h-full min-w-8 cursor-pointer select-none items-center justify-center whitespace-nowrap px-4 transition-colors text-white/70 group-data-[state=ko]:text-white/70 group-data-[state=jp]:text-white">
              日本語
              <RadioGroupItem id="lang-jp" value="jp" className="sr-only" />
            </label>
            <GlassFilter />
          </RadioGroup>
        </div>
      </div>

      <div className="max-w-6xl w-full z-10 px-4 lg:px-8 ml-auto">
        {/* Left Content */}
        <div className="text-left space-y-8 max-w-2xl">
          {/* Hand Written Title */}
          <div className="relative w-full max-w-3xl -my-8">
            <HandWrittenTitle
              className="py-8 max-w-full"
              svgClassName="[&_path]:text-white [&_path]:opacity-20"
              titleClassName="text-white text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-left flex-col drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]"
              title={
                <>
                  {t.title}
                  <br />
                  <span className="bg-gradient-to-r from-[#FF6B9D] via-[#FF8FA3] to-[#C97D60] bg-clip-text text-transparent font-extrabold [text-shadow:_-1px_-1px_0_rgba(255,157,181,0.5),1px_1px_0_rgba(201,125,96,0.5),0_0_20px_rgba(255,157,181,0.6),0_2px_10px_rgba(201,125,96,0.5),0_4px_16px_rgba(0,0,0,0.4)]">
                    {t.subtitle}
                  </span>
                </>
              }
            />
          </div>

          {/* Description */}
          <motion.p
            className="text-lg md:text-xl text-white/95 text-pretty drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] whitespace-nowrap"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            {t.description}
          </motion.p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-start">
            {!user && (
              <Link href={`/signup?lang=${lang}`}>
                <Button
                  size="lg"
                  className="gradient-button text-white font-semibold px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105"
                >
                  {t.cta}
                </Button>
              </Link>
            )}
            {!user && (
              <Link href={`/login?lang=${lang}`}>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-white/10 backdrop-blur-sm text-white border-2 border-white hover:bg-white hover:text-primary font-semibold px-8 py-6 text-lg rounded-full transition-all"
                >
                  {t.login}
                </Button>
              </Link>
            )}
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap items-center justify-start gap-6 text-white/90 text-sm drop-shadow-[0_2px_6px_rgba(0,0,0,0.5)]">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-accent rounded-full shadow-lg"></div>
              <span>{t.trustBadges.verified}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-accent rounded-full shadow-lg"></div>
              <span>{t.trustBadges.monitoring}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-accent rounded-full shadow-lg"></div>
              <span>{t.trustBadges.translation}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce z-10">
        <ChevronDown className="w-8 h-8 text-white/80 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]" />
      </div>
    </section>
  )
}
