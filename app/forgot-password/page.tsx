"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { sendPasswordResetEmail } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { GlassFilter } from "@/components/ui/liquid-radio"
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react"
import { motion } from "framer-motion"

export default function ForgotPasswordPage() {
  const searchParams = useSearchParams()
  const [lang, setLang] = useState<"ko" | "jp">("ko")
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isEmailSent, setIsEmailSent] = useState(false)

  useEffect(() => {
    const langParam = searchParams.get("lang")
    if (langParam === "ko" || langParam === "jp") {
      setLang(langParam)
    }
  }, [searchParams])

  const router = useRouter()

  const content = {
    ko: {
      title: "비밀번호 찾기",
      description: "등록하신 이메일 주소를 입력하시면 비밀번호 재설정 링크를 보내드립니다",
      email: "이메일",
      emailPlaceholder: "이메일을 입력하세요",
      sendButton: "재설정 링크 보내기",
      sending: "전송 중...",
      backToLogin: "로그인으로 돌아가기",
      backToHome: "← 홈으로 돌아가기",
      successTitle: "이메일을 확인해주세요",
      successMessage: "비밀번호 재설정 링크를 이메일로 보내드렸습니다. 이메일을 확인하여 비밀번호를 재설정해주세요.",
      resendButton: "다시 보내기",
    },
    jp: {
      title: "パスワードを忘れた場合",
      description: "登録されたメールアドレスを入力すると、パスワードリセットリンクをお送りします",
      email: "メールアドレス",
      emailPlaceholder: "メールアドレスを入力してください",
      sendButton: "リセットリンクを送信",
      sending: "送信中...",
      backToLogin: "ログインに戻る",
      backToHome: "← ホームに戻る",
      successTitle: "メールを確認してください",
      successMessage: "パスワードリセットリンクをメールでお送りしました。メールを確認してパスワードをリセットしてください。",
      resendButton: "再送信",
    },
  }

  const t = content[lang]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await sendPasswordResetEmail(auth, email)
      setIsEmailSent(true)
      toast.success(
        lang === "ko" 
          ? "비밀번호 재설정 이메일을 보냈습니다. 이메일을 확인해주세요." 
          : "パスワードリセットメールを送信しました。メールを確認してください。"
      )
    } catch (error: any) {
      let errorMessage = ""
      if (lang === "ko") {
        switch (error.code) {
          case "auth/invalid-email":
            errorMessage = "유효하지 않은 이메일입니다."
            break
          case "auth/user-not-found":
            errorMessage = "등록되지 않은 이메일입니다."
            break
          case "auth/too-many-requests":
            errorMessage = "너무 많은 요청이 있었습니다. 잠시 후 다시 시도해주세요."
            break
          default:
            errorMessage = "이메일 전송에 실패했습니다. 다시 시도해주세요."
        }
      } else {
        switch (error.code) {
          case "auth/invalid-email":
            errorMessage = "無効なメールアドレスです。"
            break
          case "auth/user-not-found":
            errorMessage = "登録されていないメールアドレスです。"
            break
          case "auth/too-many-requests":
            errorMessage = "リクエストが多すぎます。しばらくしてからもう一度お試しください。"
            break
          default:
            errorMessage = "メール送信に失敗しました。もう一度お試しください。"
        }
      }
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleResend = () => {
    setIsEmailSent(false)
    setEmail("")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#C97D60]/10 via-[#D4A574]/10 to-[#FF9DB5]/10 px-4 py-12 relative">
      {/* Language Toggle - Top Right */}
      <div className="absolute top-6 right-6 z-10">
        <div className="inline-flex h-9 rounded-lg bg-white/90 backdrop-blur-sm border border-border shadow-sm p-0.5">
          <RadioGroup
            value={lang}
            onValueChange={(value) => setLang(value as "ko" | "jp")}
            className="group relative inline-grid grid-cols-[1fr_1fr] items-center gap-0 text-sm font-medium after:absolute after:inset-y-0 after:w-1/2 after:rounded-md after:bg-gradient-to-br after:from-accent/40 after:to-accent/60 after:shadow-[0_0_6px_rgba(255,107,157,0.1),0_2px_6px_rgba(255,107,157,0.15),inset_3px_3px_0.5px_-3px_rgba(255,107,157,0.4),inset_-3px_-3px_0.5px_-3px_rgba(255,107,157,0.5),inset_1px_1px_1px_-0.5px_rgba(255,107,157,0.3),inset_-1px_-1px_1px_-0.5px_rgba(255,107,157,0.3),inset_0_0_6px_6px_rgba(255,107,157,0.2),inset_0_0_2px_2px_rgba(255,107,157,0.15),0_0_12px_rgba(255,107,157,0.25)] after:transition-transform after:duration-300 after:[transition-timing-function:cubic-bezier(0.16,1,0.3,1)] has-[:focus-visible]:after:outline has-[:focus-visible]:after:outline-2 has-[:focus-visible]:after:outline-ring/70 data-[state=ko]:after:translate-x-0 data-[state=jp]:after:translate-x-full"
            data-state={lang}
          >
            <div
              className="absolute top-0 left-0 isolate -z-10 h-full w-full overflow-hidden rounded-md"
              style={{ filter: 'url("#radio-glass")' }}
            />
            <label className="relative z-10 inline-flex h-full min-w-8 cursor-pointer select-none items-center justify-center whitespace-nowrap px-4 transition-colors text-foreground/70 group-data-[state=jp]:text-foreground/70 group-data-[state=ko]:text-foreground">
              한국어
              <RadioGroupItem id="lang-ko" value="ko" className="sr-only" />
            </label>
            <label className="relative z-10 inline-flex h-full min-w-8 cursor-pointer select-none items-center justify-center whitespace-nowrap px-4 transition-colors text-foreground/70 group-data-[state=ko]:text-foreground/70 group-data-[state=jp]:text-foreground">
              日本語
              <RadioGroupItem id="lang-jp" value="jp" className="sr-only" />
            </label>
            <GlassFilter />
          </RadioGroup>
        </div>
      </div>

      <div className="w-full max-w-md">
        {/* Logo */}
        <motion.div
          className="flex justify-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link href="/">
            <Image
              src="/미소찌개_로고_v1.png"
              alt="미소♡찌개 로고"
              width={200}
              height={100}
              className="h-auto w-auto"
              priority
            />
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="shadow-lg">
            {!isEmailSent ? (
              <>
                <CardHeader className="space-y-1 text-center">
                  <div className="flex justify-center mb-4">
                    <div className="rounded-full bg-gradient-to-br from-accent/20 to-accent/10 p-4">
                      <Mail className="w-8 h-8 text-accent" />
                    </div>
                  </div>
                  <CardTitle className="text-2xl font-bold">{t.title}</CardTitle>
                  <CardDescription className="text-center">
                    {t.description}
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">{t.email}</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder={t.emailPlaceholder}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full"
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col space-y-4">
                    <Button
                      type="submit"
                      className="w-full gradient-button text-white font-semibold"
                      size="lg"
                      disabled={isLoading}
                    >
                      {isLoading ? t.sending : t.sendButton}
                    </Button>
                    <div className="text-center text-sm">
                      <Link
                        href={`/login?lang=${lang}`}
                        className="text-primary font-medium hover:underline flex items-center justify-center gap-2"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        {t.backToLogin}
                      </Link>
                    </div>
                  </CardFooter>
                </form>
              </>
            ) : (
              <CardContent className="py-8">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="text-center space-y-6"
                >
                  <div className="flex justify-center">
                    <div className="rounded-full bg-gradient-to-br from-accent/20 to-accent/10 p-4">
                      <CheckCircle2 className="w-12 h-12 text-accent" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold">{t.successTitle}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {t.successMessage}
                    </p>
                  </div>
                  <div className="pt-4 space-y-3">
                    <Button
                      onClick={handleResend}
                      variant="outline"
                      className="w-full"
                    >
                      {t.resendButton}
                    </Button>
                    <Link
                      href={`/login?lang=${lang}`}
                      className="block text-center text-sm text-primary font-medium hover:underline"
                    >
                      {t.backToLogin}
                    </Link>
                  </div>
                </motion.div>
              </CardContent>
            )}
          </Card>
        </motion.div>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {t.backToHome}
          </Link>
        </div>
      </div>
    </div>
  )
}


