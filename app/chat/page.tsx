"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { onAuthStateChanged, User } from "firebase/auth"
import { auth, db } from "@/lib/firebase"
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  limit,
  onSnapshot,
  addDoc,
  serverTimestamp,
  updateDoc,
  doc,
  getDocs
} from "firebase/firestore"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { GlassFilter } from "@/components/ui/liquid-radio"
import { Send, X, Loader2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface Message {
  id: string
  chatId: string
  userId: string
  message: string
  country: string
  createdAt: any
  read: boolean
}

export default function ChatPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [lang, setLang] = useState<"ko" | "jp">("ko")
  const [user, setUser] = useState<User | null>(null)
  const [country, setCountry] = useState<string | null>(null)
  const [isDetectingCountry, setIsDetectingCountry] = useState(true)
  const [isMatching, setIsMatching] = useState(false)
  const [chatId, setChatId] = useState<string | null>(null)
  const [matchedUserId, setMatchedUserId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [messageInput, setMessageInput] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [estimatedWaitTime, setEstimatedWaitTime] = useState<number | null>(null)
  const [currentWaitTime, setCurrentWaitTime] = useState<number | null>(null)
  const [waitingPosition, setWaitingPosition] = useState<number | null>(null)
  const [oppositeQueueCount, setOppositeQueueCount] = useState<number>(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const unsubscribeRef = useRef<(() => void) | null>(null)
  const waitTimeIntervalRef = useRef<number | null>(null)
  const countdownIntervalRef = useRef<number | null>(null)

  const content = {
    ko: {
      title: "랜덤 채팅",
      description: "다른 국가의 친구와 대화를 시작하세요",
      detecting: "국적 확인 중...",
      matching: "상대방을 찾는 중...",
      matched: "매칭 완료! 대화를 시작하세요",
      noMatch: "상대방을 찾을 수 없습니다. 잠시 후 다시 시도해주세요.",
      countryError: "한국 또는 일본에서만 접속 가능합니다.",
      loginRequired: "로그인이 필요합니다.",
      sendMessage: "메시지 보내기",
      messagePlaceholder: "메시지를 입력하세요...",
      leaveChat: "채팅 나가기",
      waiting: "상대방을 기다리는 중...",
      estimatedWaitTime: "예상 대기 시간",
      waitingPosition: "대기 순서",
      oppositeQueueCount: "대기 중인 상대방",
      seconds: "초",
      minutes: "분",
      soon: "곧 매칭될 수 있습니다",
    },
    jp: {
      title: "ランダムチャット",
      description: "他の国の友達と会話を始めましょう",
      detecting: "国籍を確認中...",
      matching: "相手を探しています...",
      matched: "マッチング完了！会話を始めましょう",
      noMatch: "相手を見つけることができませんでした。しばらくしてからもう一度お試しください。",
      countryError: "韓国または日本からのみアクセス可能です。",
      loginRequired: "ログインが必要です。",
      sendMessage: "メッセージを送信",
      messagePlaceholder: "メッセージを入力してください...",
      leaveChat: "チャットを退出",
      waiting: "相手を待っています...",
      estimatedWaitTime: "予想待機時間",
      waitingPosition: "待機順序",
      oppositeQueueCount: "待機中の相手",
      seconds: "秒",
      minutes: "分",
      soon: "すぐにマッチングできる可能性があります",
    },
  }

  const t = content[lang]

  useEffect(() => {
    const langParam = searchParams.get("lang")
    if (langParam === "ko" || langParam === "jp") {
      setLang(langParam)
    }
  }, [searchParams])

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        toast.error(t.loginRequired)
        router.push(`/login?lang=${lang}&redirect=chat`)
        return
      }
      setUser(currentUser)
    })
    return () => unsubscribe()
  }, [lang, router, t.loginRequired])

  // 국적 확인
  useEffect(() => {
    if (!user) return

    const detectCountry = async () => {
      try {
        setIsDetectingCountry(true)
        const response = await fetch("/api/detect-country")
        const data = await response.json()

        if (!data.success) {
          toast.error(data.error || t.countryError)
          router.push("/")
          return
        }

        if (data.country !== "KR" && data.country !== "JP") {
          toast.error(t.countryError)
          router.push("/")
          return
        }

        setCountry(data.country)
        setIsDetectingCountry(false)

        // 자동으로 매칭 시작
        startMatching(data.country)
      } catch (error) {
        console.error("Country detection error:", error)
        toast.error(t.countryError)
        router.push("/")
      }
    }

    detectCountry()
  }, [user, lang, router, t.countryError])

  // 매칭 시작
  const startMatching = async (userCountry: string) => {
    if (!user) return

    try {
      setIsMatching(true)
      const response = await fetch("/api/match", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.uid,
          country: userCountry,
        }),
      })

      const data = await response.json()

      if (!data.success) {
        toast.error(data.error || t.noMatch)
        setIsMatching(false)
        return
      }

      if (data.matched) {
        setChatId(data.chatId)
        setMatchedUserId(data.matchedUserId)
        setIsMatching(false)
        setEstimatedWaitTime(null)
        setCurrentWaitTime(null)
        setWaitingPosition(null)
        setOppositeQueueCount(0)
        if (waitTimeIntervalRef.current) {
          clearInterval(waitTimeIntervalRef.current)
        }
        if (countdownIntervalRef.current) {
          clearInterval(countdownIntervalRef.current)
        }
        toast.success(t.matched)
        // 메시지 리스너 시작
        startMessageListener(data.chatId)
      } else {
        // 대기 중 - 주기적으로 매칭 확인
        setWaitingPosition(data.waitingPosition || null)
        setOppositeQueueCount(data.oppositeQueueCount || 0)
        updateWaitTime(userCountry)
        checkMatchStatus(user.uid, userCountry)
      }
    } catch (error) {
      console.error("Match error:", error)
      toast.error(t.noMatch)
      setIsMatching(false)
    }
  }

  // 예상 대기 시간 업데이트
  const updateWaitTime = async (userCountry: string) => {
    try {
      const response = await fetch(`/api/waiting-stats?country=${userCountry}`)
      const data = await response.json()

      if (data.success) {
        setEstimatedWaitTime(data.estimatedWaitTime)
        setCurrentWaitTime(data.estimatedWaitTime)
        setOppositeQueueCount(data.oppositeQueueCount)
        setWaitingPosition(data.sameCountryQueueCount + 1) // 현재 사용자 포함

        // 카운트다운 시작
        if (countdownIntervalRef.current) {
          clearInterval(countdownIntervalRef.current)
        }
        
        if (data.estimatedWaitTime > 0) {
          countdownIntervalRef.current = setInterval(() => {
            setCurrentWaitTime((prev) => {
              if (prev === null || prev <= 0) {
                if (countdownIntervalRef.current) {
                  clearInterval(countdownIntervalRef.current)
                }
                return 0
              }
              return prev - 1
            })
          }, 1000) // 1초마다 감소
        }
      }
    } catch (error) {
      console.error("Update wait time error:", error)
    }
  }

  // 매칭 상태 확인 (폴링)
  const checkMatchStatus = async (userId: string, userCountry: string) => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch("/api/match", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            country: userCountry,
          }),
        })

        const data = await response.json()

        if (data.success && data.matched) {
          clearInterval(interval)
          if (waitTimeIntervalRef.current) {
            clearInterval(waitTimeIntervalRef.current)
          }
          setChatId(data.chatId)
          setMatchedUserId(data.matchedUserId)
          setIsMatching(false)
          setEstimatedWaitTime(null)
          setCurrentWaitTime(null)
          setWaitingPosition(null)
          setOppositeQueueCount(0)
          if (countdownIntervalRef.current) {
            clearInterval(countdownIntervalRef.current)
          }
          toast.success(t.matched)
          startMessageListener(data.chatId)
        } else if (data.success && !data.matched) {
          // 대기 중일 때 통계 업데이트
          setWaitingPosition(data.waitingPosition || null)
          setOppositeQueueCount(data.oppositeQueueCount || 0)
          updateWaitTime(userCountry)
        }
      } catch (error) {
        console.error("Check match error:", error)
      }
    }, 3000) // 3초마다 확인

    // 대기 시간 업데이트 (5초마다)
    waitTimeIntervalRef.current = setInterval(() => {
      updateWaitTime(userCountry)
    }, 5000)

    // 5분 후 타임아웃
    setTimeout(() => {
      clearInterval(interval)
      if (waitTimeIntervalRef.current) {
        clearInterval(waitTimeIntervalRef.current)
      }
      if (!chatId) {
        setIsMatching(false)
        toast.error(t.noMatch)
      }
    }, 300000) // 5분
  }

  // 메시지 리스너 시작
  const startMessageListener = (currentChatId: string) => {
    // 기존 리스너 정리
    if (unsubscribeRef.current) {
      unsubscribeRef.current()
    }

    const messagesRef = collection(db, "chat_messages")
    const messagesQuery = query(
      messagesRef,
      where("chatId", "==", currentChatId),
      orderBy("createdAt", "asc"),
      limit(100)
    )

    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const newMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() || new Date(),
      })) as Message[]

      setMessages(newMessages)
      // 스크롤을 맨 아래로
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
      }, 100)
    })

    unsubscribeRef.current = unsubscribe
  }

  // 메시지 전송
  const sendMessage = async () => {
    if (!messageInput.trim() || !chatId || !user || !country || isSending) return

    try {
      setIsSending(true)
      const messagesRef = collection(db, "chat_messages")
      await addDoc(messagesRef, {
        chatId,
        userId: user.uid,
        message: messageInput.trim(),
        country,
        createdAt: serverTimestamp(),
        read: false,
      })

      // 채팅방의 lastMessageAt 업데이트
      const chatRef = doc(db, "active_chats", chatId)
      await updateDoc(chatRef, {
        lastMessageAt: serverTimestamp(),
      })

      setMessageInput("")
    } catch (error) {
      console.error("Send message error:", error)
      toast.error(lang === "ko" ? "메시지 전송에 실패했습니다." : "メッセージの送信に失敗しました。")
    } finally {
      setIsSending(false)
    }
  }

  // 채팅 나가기
  const leaveChat = async () => {
    if (unsubscribeRef.current) {
      unsubscribeRef.current()
      unsubscribeRef.current = null
    }

    // 대기 큐에서 제거
    if (user && !chatId) {
      try {
        await fetch(`/api/match?userId=${user.uid}`, {
          method: "DELETE",
        })
      } catch (error) {
        console.error("Leave chat error:", error)
      }
    }

    // 인터벌 정리
    if (waitTimeIntervalRef.current) {
      clearInterval(waitTimeIntervalRef.current)
    }
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current)
    }

    router.push("/")
  }

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current()
      }
      if (waitTimeIntervalRef.current) {
        clearInterval(waitTimeIntervalRef.current)
      }
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current)
      }
    }
  }, [])

  // 예상 대기 시간 포맷팅
  const formatWaitTime = (seconds: number | null): string => {
    if (seconds === null || seconds <= 0) return t.soon
    if (seconds < 60) {
      return `${seconds}${t.seconds}`
    }
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    if (remainingSeconds === 0) {
      return `${minutes}${t.minutes}`
    }
    return `${minutes}${t.minutes} ${remainingSeconds}${t.seconds}`
  }

  if (!user || isDetectingCountry) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#C97D60]/10 via-[#D4A574]/10 to-[#FF9DB5]/10">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground">{t.detecting}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isMatching) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#C97D60]/10 via-[#D4A574]/10 to-[#FF9DB5]/10">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center gap-6">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <div className="text-center space-y-2">
                <p className="text-lg font-semibold">{t.matching}</p>
                {estimatedWaitTime !== null && (
                  <div className="space-y-3 pt-4">
                    <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">{t.estimatedWaitTime}:</span>
                        <span className="text-lg font-bold text-primary">
                          {formatWaitTime(currentWaitTime)}
                        </span>
                      </div>
                      {waitingPosition !== null && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">{t.waitingPosition}:</span>
                          <span className="text-sm font-medium">
                            {lang === "ko" ? `${waitingPosition}번째` : `${waitingPosition}番目`}
                          </span>
                        </div>
                      )}
                      {oppositeQueueCount > 0 && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">{t.oppositeQueueCount}:</span>
                          <span className="text-sm font-medium text-green-600">
                            {lang === "ko" ? `${oppositeQueueCount}명` : `${oppositeQueueCount}人`}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <Button variant="outline" onClick={leaveChat}>
                <X className="h-4 w-4 mr-2" />
                {t.leaveChat}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#C97D60]/10 via-[#D4A574]/10 to-[#FF9DB5]/10">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-sm border-b shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Image
                src="/미소찌개_로고_v1.png"
                alt="미소♡찌개 로고"
                width={120}
                height={60}
                className="h-auto"
              />
            </Link>
            <div>
              <h1 className="text-xl font-bold">{t.title}</h1>
              <p className="text-sm text-muted-foreground">{t.description}</p>
            </div>
          </div>

          {/* Language Toggle */}
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

          <Button variant="outline" onClick={leaveChat}>
            <X className="h-4 w-4 mr-2" />
            {t.leaveChat}
          </Button>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 container mx-auto px-4 py-6 max-w-4xl">
        <Card className="h-[calc(100vh-200px)] flex flex-col">
          <CardHeader className="border-b">
            <CardTitle>
              {chatId
                ? lang === "ko"
                  ? "대화 중"
                  : "会話中"
                : t.waiting}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col p-0">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground text-center">
                    {chatId
                      ? lang === "ko"
                        ? "메시지를 입력하여 대화를 시작하세요."
                        : "メッセージを入力して会話を始めましょう。"
                      : t.waiting}
                  </p>
                </div>
              ) : (
                messages.map((msg) => {
                  const isOwnMessage = msg.userId === user.uid
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg px-4 py-2 ${
                          isOwnMessage
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap break-words">
                          {msg.message}
                        </p>
                        <p
                          className={`text-xs mt-1 ${
                            isOwnMessage
                              ? "text-primary-foreground/70"
                              : "text-muted-foreground"
                          }`}
                        >
                          {msg.createdAt instanceof Date
                            ? msg.createdAt.toLocaleTimeString("ko-KR", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : new Date(msg.createdAt).toLocaleTimeString("ko-KR", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                        </p>
                      </div>
                    </div>
                  )
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            {chatId && (
              <div className="border-t p-4">
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    sendMessage()
                  }}
                  className="flex gap-2"
                >
                  <Input
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder={t.messagePlaceholder}
                    disabled={isSending}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        sendMessage()
                      }
                    }}
                    className="flex-1"
                  />
                  <Button
                    type="submit"
                    disabled={!messageInput.trim() || isSending}
                  >
                    {isSending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </form>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

