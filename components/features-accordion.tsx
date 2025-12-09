"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Heart, Shield, Globe, MessageCircle, Users, Sparkles } from "lucide-react"

interface FeaturesAccordionProps {
  lang: "ko" | "jp"
  onLangChange: (lang: "ko" | "jp") => void
}

export function FeaturesAccordion({ lang, onLangChange }: FeaturesAccordionProps) {
  const features = [
    {
      id: "about",
      icon: Heart,
      title: {
        ko: "미소♡찌개 소개",
        jp: "ミソ♡チゲ紹介",
      },
      content: {
        ko: (
          <div className="space-y-6 py-4">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Heart className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">문화적 매칭</h3>
                <p className="text-muted-foreground text-sm">
                  한일 문화에 대한 이해도와 관심사를 기반으로 한 과학적 매칭 시스템
                </p>
              </div>
              <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                  <Globe className="w-6 h-6 text-secondary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">실시간 번역</h3>
                <p className="text-muted-foreground text-sm">AI 기반 한일 번역으로 언어 장벽 없는 자연스러운 대화</p>
              </div>
              <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-semibold text-lg mb-2">안전한 만남</h3>
                <p className="text-muted-foreground text-sm">
                  본인 인증과 24/7 모니터링으로 안전하고 신뢰할 수 있는 환경
                </p>
              </div>
            </div>
            <div className="bg-gradient-to-r from-primary/5 to-secondary/5 p-6 rounded-xl">
              <h3 className="font-semibold text-lg mb-3">성공 스토리</h3>
              <p className="text-muted-foreground mb-4">
                "미소♡찌개를 통해 운명의 상대를 만났어요. 처음엔 언어가 걱정됐지만, 자연스럽게 서로의 문화를 배우며 더욱
                가까워질 수 있었습니다."
              </p>
              <p className="text-sm text-primary font-medium">- 서울 거주 유미님, 도쿄 거주 타카시님</p>
            </div>
          </div>
        ),
        jp: (
          <div className="space-y-6 py-4">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Heart className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">文化的マッチング</h3>
                <p className="text-muted-foreground text-sm">
                  韓日文化への理解度と関心事に基づいた科学的マッチングシステム
                </p>
              </div>
              <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                  <Globe className="w-6 h-6 text-secondary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">リアルタイム翻訳</h3>
                <p className="text-muted-foreground text-sm">AI翻訳で言語の壁なく自然な会話</p>
              </div>
              <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-semibold text-lg mb-2">安全な出会い</h3>
                <p className="text-muted-foreground text-sm">本人認証と24時間監視で安全で信頼できる環境</p>
              </div>
            </div>
            <div className="bg-gradient-to-r from-primary/5 to-secondary/5 p-6 rounded-xl">
              <h3 className="font-semibold text-lg mb-3">成功ストーリー</h3>
              <p className="text-muted-foreground mb-4">
                "ミソ♡チゲを通じて運命の人に出会えました。最初は言葉が心配でしたが、自然にお互いの文化を学びながらより親密になれました。"
              </p>
              <p className="text-sm text-primary font-medium">- ソウル在住ユミさん、東京在住タカシさん</p>
            </div>
          </div>
        ),
      },
    },
    {
      id: "features",
      icon: Sparkles,
      title: {
        ko: "주요 기능",
        jp: "主な機能",
      },
      content: {
        ko: (
          <div className="space-y-4 py-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold mb-1">과학적 매칭 테스트</h4>
                <p className="text-muted-foreground text-sm">
                  문화 호환성, 연애 스타일, 라이프스타일 진단을 통한 정확한 매칭
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <MessageCircle className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <h4 className="font-semibold mb-1">스마트 메시징</h4>
                <p className="text-muted-foreground text-sm">실시간 번역, 대화 주제 추천, 문화적 오해 방지 팁 제공</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Globe className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h4 className="font-semibold mb-1">문화 학습 콘텐츠</h4>
                <p className="text-muted-foreground text-sm">언어 학습 카드, 데이트 에티켓, 한일 커플 성공 스토리</p>
              </div>
            </div>
          </div>
        ),
        jp: (
          <div className="space-y-4 py-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold mb-1">科学的マッチングテスト</h4>
                <p className="text-muted-foreground text-sm">
                  文化的相性、恋愛スタイル、ライフスタイル診断による正確なマッチング
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <MessageCircle className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <h4 className="font-semibold mb-1">スマートメッセージング</h4>
                <p className="text-muted-foreground text-sm">
                  リアルタイム翻訳、会話トピック提案、文化的誤解防止のヒント
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Globe className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h4 className="font-semibold mb-1">文化学習コンテンツ</h4>
                <p className="text-muted-foreground text-sm">言語学習カード、デートエチケット、韓日カップル成功ストーリー</p>
              </div>
            </div>
          </div>
        ),
      },
    },
    {
      id: "faq",
      icon: MessageCircle,
      title: {
        ko: "자주 묻는 질문",
        jp: "よくある質問",
      },
      content: {
        ko: (
          <div className="space-y-6 py-4">
            <div>
              <h4 className="font-semibold mb-2">Q. 가입 비용이 있나요?</h4>
              <p className="text-muted-foreground text-sm">
                기본 가입과 프로필 작성은 무료입니다. 프리미엄 기능(무제한 좋아요, 영상 통화 등)은 유료 멤버십이
                필요합니다.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Q. 언어를 못해도 괜찮나요?</h4>
              <p className="text-muted-foreground text-sm">
                네! 실시간 AI 번역 기능이 있어 한국어나 일본어를 잘 못해도 자연스럽게 대화할 수 있습니다. 또한 기본 회화
                학습 콘텐츠도 제공합니다.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Q. 안전한가요?</h4>
              <p className="text-muted-foreground text-sm">
                본인 인증 필수, 24시간 AI 모니터링, 신고 시스템 등으로 안전한 환경을 제공합니다. 개인정보는 철저히
                보호됩니다.
              </p>
            </div>
          </div>
        ),
        jp: (
          <div className="space-y-6 py-4">
            <div>
              <h4 className="font-semibold mb-2">Q. 登録費用はかかりますか？</h4>
              <p className="text-muted-foreground text-sm">
                基本登録とプロフィール作成は無料です。プレミアム機能は有料メンバーシップが必要です。
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Q. 言語ができなくても大丈夫？</h4>
              <p className="text-muted-foreground text-sm">
                はい！リアルタイムAI翻訳機能があるので、韓国語や日本語が苦手でも自然に会話できます。基本的な会話学習コンテンツも提供しています。
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Q. 安全ですか？</h4>
              <p className="text-muted-foreground text-sm">
                本人認証必須、24時間AI監視、通報システムなどで安全な環境を提供しています。個人情報は厳重に保護されます。
              </p>
            </div>
          </div>
        ),
      },
    },
  ]

  return (
    <section className="py-20 px-4 bg-muted/30">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{lang === "ko" ? "더 알아보기" : "もっと知る"}</h2>
          <p className="text-muted-foreground">
            {lang === "ko" ? "미소♡찌개가 제공하는 특별한 경험" : "ミソ♡チゲが提供する特別な体験"}
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <AccordionItem
                key={feature.id}
                value={feature.id}
                className="bg-card rounded-xl shadow-sm border border-border overflow-hidden"
              >
                <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <span className="font-semibold text-left">{feature.title[lang]}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6">{feature.content[lang]}</AccordionContent>
              </AccordionItem>
            )
          })}
        </Accordion>
      </div>
    </section>
  )
}
