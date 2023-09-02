"use client"

import { Question, Quiz, User } from "@prisma/client"
import { formatDistance } from "date-fns"
import { Card, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import UserAvatar from "@/components/auth/UserAvatar"
import Link from "next/link"

type QuizItemProps = {
  quiz: Quiz & {
    user: Pick<User, "name" | "image">
    questions: Question[]
  }
}

// クイズ一覧のアイテム
const QuizItem: React.FC<QuizItemProps> = ({ quiz }) => {
  // 日付
  const createdAt = new Date(quiz.finishedAt ?? 0)
  const now = new Date()
  const date = formatDistance(createdAt, now, { addSuffix: true })

  return (
    <Card key={quiz.id} className="shadow-none hover:bg-gray-50">
      <Link href={`/quiz/${quiz.id}`}>
        <CardHeader className="p-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-bold mb-2">{quiz.topic}</div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline">{quiz.level}</Badge>
                <Badge variant="outline">{quiz.language}</Badge>
                <Badge variant="outline">{quiz.questions.length}問</Badge>
              </div>
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <UserAvatar
                  className="w-7 h-7"
                  user={{
                    name: quiz.user.name ?? null,
                    image: quiz.user.image ?? null,
                  }}
                />
                <div className="text-sm">{quiz.user.name ?? ""}</div>
              </div>
              <div className="text-sm text-gray-500 text-right">{date}</div>
            </div>
          </div>
        </CardHeader>
      </Link>
    </Card>
  )
}

export default QuizItem
