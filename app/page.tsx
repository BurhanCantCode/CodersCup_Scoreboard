"use client"
import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Code, Server, Layers, Cloud } from 'lucide-react'

type ScoreData = [string, string, string]

interface ScoreTableProps {
  fields?: string[]
  data?: ScoreData[]
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

const hardcodedData: ScoreData[] = [
  ["React Rebels", "875", "Frontend"],
  ["Node Ninjas", "762", "Backend"],
  ["MERN Mavericks", "888", "FullStack"],
  ["Team meow", "954", "DevOps"],
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
  ["Team PssPss", "932", "DevOps"],
  ["Svelte Sorcerers", "812", "Frontend"],
  ["Ruby Wranglers", "776", "Backend"],
  ["Stack Overflow Stars", "891", "FullStack"],
  ["Team woof", "945", "DevOps"],
]

export default function Component({
  fields = ["Team Name", "Score", "House"],
  data = hardcodedData,
}: ScoreTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedHouse, setSelectedHouse] = useState<string | null>(null)
  const [sortConfig, setSortConfig] = useState<{ key: number; direction: 'asc' | 'desc' } | null>(null)

  const houses = Object.keys(houseColors)

  data = [...data].sort((a, b) => parseInt(b[1]) - parseInt(a[1]));

  const filteredAndSortedData = useMemo(() => {
    let filteredData = data.filter(row =>
      row.some(cell => cell.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (!selectedHouse || row[2] === selectedHouse)
    )

    if (sortConfig !== null) {
      filteredData.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1
        }
        return 0
      })
    }
    return filteredData
  }, [data, searchTerm, selectedHouse, sortConfig])

  const requestSort = (key: number) => {
    let direction: 'asc' | 'desc' = 'asc'
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
  }

  const topTeams = useMemo(() => {
    return [...data].sort((a, b) => parseInt(b[1]) - parseInt(a[1])).slice(0, 3)
  }, [data])

  return (
    <div className="px-4 py-8 space-y-8 bg-gradient-to-br from-purple-50 to-indigo-100 min-h-screen">

      {/* Main Heading */}
      <motion.div
        className="text-center space-y-4"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-5xl font-bold text-indigo-800">Coders Cup Standings</h1>
        <p className="text-xl text-indigo-600">Celebrating coding excellence across all specializations</p>
      </motion.div>

      {/* Cards */}
      <motion.div
        className="grid gap-6 md:grid-cols-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {topTeams.map((team, index) => (
          <Card key={team[0]} className={`${houseColors[team[2] as keyof typeof houseColors]} shadow-lg`}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>{team[0]}</span>
                {houseIcons[team[2] as keyof typeof houseIcons]}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold mb-2">{team[1]} points</p>
              <p className="text-sm">{team[2]}</p>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Search Box */}
      <motion.div
        className="flex flex-col space-y-4 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="flex justify-between items-center">
          <Input
            placeholder="Search teams..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          <Link href="/leaderboard" passHref>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
              View Full Leaderboard
            </Button>
          </Link>
        </div>
        <div className="flex flex-wrap gap-2">
          {houses.map((house) => (
            <Button
              key={house}
              variant={selectedHouse === house ? "default" : "outline"}
              onClick={() => setSelectedHouse(selectedHouse === house ? null : house)}
              className={`${houseColors[house as keyof typeof houseColors]}`}
            >
              {house}
            </Button>
          ))}
        </div>
      </motion.div>


      {/* Results Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="bg-white rounded-lg shadow-xl p-6"
      >
        <h2 className="text-2xl font-semibold mb-4 text-indigo-800">Detailed Team Scores</h2>
        <ScrollArea className="h-[600px] rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-left w-1/2">Team Name</TableHead>
                <TableHead className="text-center w-1/4">Score</TableHead>
                <TableHead className="text-right w-1/4">House</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence>
                {filteredAndSortedData.map((row, rowIndex) => (
                  <motion.tr
                    key={rowIndex}
                    className={`hover:bg-gray-100 transition-colors ${houseColors[row[2] as keyof typeof houseColors]}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: rowIndex * 0.05 }}
                  >
                    <TableCell className="text-left">{row[0]}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary" className="font-bold">
                        {row[1]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge className={`${houseColors[row[2] as keyof typeof houseColors]}`}>
                        {row[2]}
                      </Badge>
                    </TableCell>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </TableBody>
          </Table>
        </ScrollArea>
      </motion.div>
    </div>
  )
}