"use client"

import React, { useMemo } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Code, Server, Layers, Cloud } from 'lucide-react'
import { Bar } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

type ScoreData = [string, string, string]

interface HouseLeaderboardProps {
  data: ScoreData[]
}

const houseColors = {
  "Frontend": "bg-red-200 text-red-800",
  "Backend": "bg-yellow-200 text-yellow-800",
  "FullStack": "bg-green-200 text-green-800",
  "DevOps": "bg-blue-200 text-blue-800",
}

const houseIcons = {
  "Frontend": <Code className="w-6 h-6" />,
  "Backend": <Server className="w-6 h-6" />,
  "FullStack": <Layers className="w-6 h-6" />,
  "DevOps": <Cloud className="w-6 h-6" />,
}

function HouseLeaderboard({ data }: HouseLeaderboardProps) {
  const houseStats = useMemo(() => {
    const stats = Object.keys(houseColors).reduce((acc, house) => {
      acc[house] = { totalScore: 0, teams: [] }
      return acc
    }, {} as Record<string, { totalScore: number, teams: { name: string, score: number }[] }>)

    data.forEach(([teamName, score, house]) => {
      const numScore = parseInt(score, 10)
      if (stats[house]) {
        stats[house].totalScore += numScore
        stats[house].teams.push({ name: teamName, score: numScore })
      }
    })

    return Object.entries(stats)
      .map(([house, { totalScore, teams }]) => ({
        house,
        totalScore,
        mvp: teams.reduce((max, team) => team.score > max.score ? team : max, { name: '', score: 0 })
      }))
      .sort((a, b) => b.totalScore - a.totalScore)
  }, [data])

  const maxScore = Math.max(...houseStats.map(stat => stat.totalScore))

  const chartData = {
    labels: houseStats.map(stat => stat.house),
    datasets: [
      {
        label: 'Total Score',
        data: houseStats.map(stat => stat.totalScore),
        backgroundColor: Object.values(houseColors).map(color => color.split(' ')[0]),
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'House Scores Comparison',
      },
    },
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-gradient-to-br from-purple-50 to-indigo-100 min-h-screen">
      <motion.h1 
        className="text-4xl font-bold text-center mb-6 text-indigo-800"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Coders Cup Leaderboard
      </motion.h1>
      <motion.div 
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {houseStats.map(({ house, totalScore, mvp }, index) => (
          <Card key={house} className={`${houseColors[house as keyof typeof houseColors]} shadow-lg`}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>{house}</span>
                {houseIcons[house as keyof typeof houseIcons]}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold mb-2">{totalScore} points</p>
              <Progress value={(totalScore / maxScore) * 100} className="mb-2" />
              <p className="text-sm">
                MVP: {mvp.name} ({mvp.score} points)
              </p>
            </CardContent>
          </Card>
        ))}
      </motion.div>
      <motion.div 
        className="mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Bar options={chartOptions} data={chartData} />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Detailed House Standings</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rank</TableHead>
                    <TableHead>House</TableHead>
                    <TableHead>Total Score</TableHead>
                    <TableHead>MVP</TableHead>
                    <TableHead>MVP Score</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {houseStats.map(({ house, totalScore, mvp }, index) => (
                    <TableRow key={house} className={houseColors[house as keyof typeof houseColors]}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell>{house}</TableCell>
                      <TableCell>{totalScore}</TableCell>
                      <TableCell>{mvp.name}</TableCell>
                      <TableCell>{mvp.score}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

// Updated hardcoded data (same as in app/page.tsx)
const hardcodedData: ScoreData[] = [
  ["React Rebels", "875", "Frontend"],
  ["Node Ninjas", "762", "Backend"],
  ["MERN Mavericks", "888", "FullStack"],
  ["Docker Dynamos", "954", "DevOps"],
  ["Vue Virtuosos", "654", "Frontend"],
  ["Python Pythons", "721", "Backend"],
  ["JavaScript Jedis", "801", "FullStack"],
  ["Kubernetes Knights", "899", "DevOps"],
  ["Angular Avengers", "732", "Frontend"],
  ["Java Juggernauts", "698", "Backend"],
  ["GraphQL Gladiators", "845", "FullStack"],
  ["AWS Wizards", "921", "DevOps"],
  ["TypeScript Titans", "789", "Frontend"],
  ["Django Djangoes", "743", "Backend"],
  ["MEAN Machines", "867", "FullStack"],
  ["Jenkins Geniuses", "932", "DevOps"],
  ["Svelte Sorcerers", "812", "Frontend"],
  ["Ruby Wranglers", "776", "Backend"],
  ["Stack Overflow Stars", "891", "FullStack"],
  ["GitLab Gurus", "945", "DevOps"],
]

export default function LeaderboardPage() {
  return (
    <div>
      <Link href="/" passHref>
        <Button className="m-4">Back to Scores</Button>
      </Link>
      <HouseLeaderboard data={hardcodedData} />
    </div>
  )
}