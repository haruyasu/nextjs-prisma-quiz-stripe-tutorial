"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Question } from "@prisma/client"

type QuestionTableProps = {
  questions: Question[]
}

// 問題一覧
const QuestionTable: React.FC<QuestionTableProps> = ({ questions }) => {
  return (
    <Table className="mt-4">
      <TableHeader>
        <TableRow>
          <TableHead className="font-bold text-center">No.</TableHead>
          <TableHead className="font-bold text-center">問題</TableHead>
          <TableHead className="font-bold text-center">正解</TableHead>
          <TableHead className="font-bold text-center">回答</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        <>
          {questions.map((question, index) => {
            return (
              <TableRow key={question.id}>
                <TableCell className="text-center">{index + 1}</TableCell>
                <TableCell>{question.question}</TableCell>
                <TableCell>{question.answer} </TableCell>
                <TableCell
                  className={`${
                    question.isCorrect ? "text-green-600" : "text-red-600"
                  } font-semibold`}
                >
                  {question.userAnswer}
                </TableCell>
              </TableRow>
            )
          })}
        </>
      </TableBody>
    </Table>
  )
}

export default QuestionTable
