"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { GlassFilter } from "@/components/ui/liquid-radio"
import { Loader2 } from "lucide-react"

function LoginPageContent() {
  const searchParams = useSearchParams()
  const [lang, setLang] = useState<"ko" | "jp">("ko")

  useEffect(() => {
    const langParam = searchParams.get("lang")
    if (langParam === "ko" || langParam === "jp") {
      setLang(langParam)
    }
  }, [searchParams])
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const content = {
    ko: {
      title: "로그인",
      description: "계정에 로그인하여 계속하세요",
      email: "이메일",
      emailPlaceholder: "이메일을 입력하세요",
      password: "비밀번호",
      passwordPlaceholder: "비밀번호를 입력하세요",
      forgotPassword: "비밀번호를 잊으셨나요?",
      loginButton: "로그인",
      noAccount: "계정이 없으신가요?",
      signup: "회원가입",
      backToHome: "← 홈으로 돌아가기",
    },
    jp: {
      title: "ログイン",
      description: "アカウントにログインして続ける",
      email: "メールアドレス",
      emailPlaceholder: "メールアドレスを入力してください",
      password: "パスワード",
      passwordPlaceholder: "パスワードを入力してください",
      forgotPassword: "パスワードをお忘れですか？",
      loginButton: "ログイン",
      noAccount: "アカウントをお持ちでないですか？",
      signup: "会員登録",
      backToHome: "← ホームに戻る",
    },
  }

  const t = content[lang]
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await signInWithEmailAndPassword(auth, email, password)
      toast.success(lang === "ko" ? "로그인 성공!" : "ログイン成功！")
      router.push("/")
    } catch (error: any) {
      let errorMessage = ""
      if (lang === "ko") {
        switch (error.code) {
          case "auth/invalid-email":
            errorMessage = "유효하지 않은 이메일입니다."
            break
          case "auth/user-disabled":
            errorMessage = "비활성화된 계정입니다."
            break
          case "auth/user-not-found":
            errorMessage = "등록되지 않은 이메일입니다."
            break
          case "auth/wrong-password":
            errorMessage = "비밀번호가 올바르지 않습니다."
            break
          case "auth/too-many-requests":
            errorMessage = "너무 많은 시도가 있었습니다. 나중에 다시 시도해주세요."
            break
          default:
            errorMessage = "로그인에 실패했습니다. 다시 시도해주세요."
        }
      } else {
        switch (error.code) {
          case "auth/invalid-email":
            errorMessage = "無効なメールアドレスです。"
            break
          case "auth/user-disabled":
            errorMessage = "無効化されたアカウントです。"
            break
          case "auth/user-not-found":
            errorMessage = "登録されていないメールアドレスです。"
            break
          case "auth/wrong-password":
            errorMessage = "パスワードが正しくありません。"
            break
          case "auth/too-many-requests":
            errorMessage = "試行回数が多すぎます。後でもう一度お試しください。"
            break
          default:
            errorMessage = "ログインに失敗しました。もう一度お試しください。"
        }
      }
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
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
        <div className="flex justify-center mb-8">
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
        </div>

        <Card className="shadow-lg">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">{t.title}</CardTitle>
            <CardDescription>
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
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">{t.password}</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder={t.passwordPlaceholder}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="flex items-center justify-end">
                <Link
                  href="/forgot-password"
                  className="text-sm text-primary hover:underline"
                >
                  {t.forgotPassword}
                </Link>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                className="w-full gradient-button text-white font-semibold"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? (lang === "ko" ? "로그인 중..." : "ログイン中...") : t.loginButton}
              </Button>
              <div className="text-center text-sm text-muted-foreground">
                {t.noAccount}{" "}
                <Link
                  href={`/signup?lang=${lang}`}
                  className="text-primary font-medium hover:underline"
                >
                  {t.signup}
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>

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

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#C97D60]/10 via-[#D4A574]/10 to-[#FF9DB5]/10">
          <Card className="w-full max-w-md">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-muted-foreground">로딩 중...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      }
    >
      <LoginPageContent />
    </Suspense>
  )
}

