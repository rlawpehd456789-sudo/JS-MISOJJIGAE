"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth"
import { doc, setDoc } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { GlassFilter } from "@/components/ui/liquid-radio"

export default function SignupPage() {
  const searchParams = useSearchParams()
  const [lang, setLang] = useState<"ko" | "jp">("ko")

  useEffect(() => {
    const langParam = searchParams.get("lang")
    if (langParam === "ko" || langParam === "jp") {
      setLang(langParam)
    }
  }, [searchParams])
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const content = {
    ko: {
      title: "회원가입",
      description: "새 계정을 만들어 특별한 인연을 시작하세요",
      name: "이름",
      namePlaceholder: "이름을 입력하세요",
      email: "이메일",
      emailPlaceholder: "이메일을 입력하세요",
      password: "비밀번호",
      passwordPlaceholder: "비밀번호를 입력하세요",
      confirmPassword: "비밀번호 확인",
      confirmPasswordPlaceholder: "비밀번호를 다시 입력하세요",
      signupButton: "회원가입",
      hasAccount: "이미 계정이 있으신가요?",
      login: "로그인",
      backToHome: "← 홈으로 돌아가기",
      passwordMismatch: "비밀번호가 일치하지 않습니다.",
    },
    jp: {
      title: "会員登録",
      description: "新しいアカウントを作成して特別な出会いを始めましょう",
      name: "お名前",
      namePlaceholder: "お名前を入力してください",
      email: "メールアドレス",
      emailPlaceholder: "メールアドレスを入力してください",
      password: "パスワード",
      passwordPlaceholder: "パスワードを入力してください",
      confirmPassword: "パスワード確認",
      confirmPasswordPlaceholder: "パスワードを再度入力してください",
      signupButton: "会員登録",
      hasAccount: "既にアカウントをお持ちですか？",
      login: "ログイン",
      backToHome: "← ホームに戻る",
      passwordMismatch: "パスワードが一致しません。",
    },
  }

  const t = content[lang]
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (password !== confirmPassword) {
      toast.error(t.passwordMismatch)
      return
    }

    if (password.length < 6) {
      toast.error(lang === "ko" ? "비밀번호는 최소 6자 이상이어야 합니다." : "パスワードは6文字以上である必要があります。")
      return
    }
    
    setIsLoading(true)

    try {
      // Firebase Authentication으로 사용자 생성
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      // 사용자 프로필에 이름 업데이트
      await updateProfile(user, {
        displayName: name,
      })

      // Firestore에 사용자 정보 저장
      await setDoc(doc(db, "users", user.uid), {
        name: name,
        email: email,
        createdAt: new Date().toISOString(),
        lang: lang,
      })

      // 회원가입 완료 후 즉시 메인페이지로 이동
      setIsLoading(false)
      router.push("/")
    } catch (error: any) {
      setIsLoading(false)
      let errorMessage = ""
      if (lang === "ko") {
        switch (error.code) {
          case "auth/email-already-in-use":
            errorMessage = "이미 사용 중인 이메일입니다."
            break
          case "auth/invalid-email":
            errorMessage = "유효하지 않은 이메일입니다."
            break
          case "auth/operation-not-allowed":
            errorMessage = "이메일/비밀번호 계정이 비활성화되어 있습니다."
            break
          case "auth/weak-password":
            errorMessage = "비밀번호가 너무 약합니다."
            break
          default:
            errorMessage = "회원가입에 실패했습니다. 다시 시도해주세요."
        }
      } else {
        switch (error.code) {
          case "auth/email-already-in-use":
            errorMessage = "既に使用されているメールアドレスです。"
            break
          case "auth/invalid-email":
            errorMessage = "無効なメールアドレスです。"
            break
          case "auth/operation-not-allowed":
            errorMessage = "メール/パスワードアカウントが無効になっています。"
            break
          case "auth/weak-password":
            errorMessage = "パスワードが弱すぎます。"
            break
          default:
            errorMessage = "会員登録に失敗しました。もう一度お試しください。"
        }
      }
      toast.error(errorMessage)
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
                <Label htmlFor="name">{t.name}</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder={t.namePlaceholder}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
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
                  minLength={6}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">{t.confirmPassword}</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder={t.confirmPasswordPlaceholder}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
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
                {isLoading ? (lang === "ko" ? "회원가입 중..." : "会員登録中...") : t.signupButton}
              </Button>
              <div className="text-center text-sm text-muted-foreground">
                {t.hasAccount}{" "}
                <Link
                  href={`/login?lang=${lang}`}
                  className="text-primary font-medium hover:underline"
                >
                  {t.login}
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

