"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Mail, Github, MapPin, Calendar, Star, GitFork, 
  Code, Database, Palette, Coffee, Gamepad2,
  Clock, Users, Eye, Heart,
  Zap, Rocket, Target, Shield, Cpu, Globe, ExternalLink,
  FileText, Activity,
  Bot, Building2, Award, MessageSquare,
  Sparkles, Lock, Terminal
} from "lucide-react"
import { useState, useEffect } from "react"

// Types pour les données GitHub
interface GitHubUser {
  login: string
  name: string
  bio: string
  avatar_url: string
  location: string
  company: string
  public_repos: number
  followers: number
  following: number
  created_at: string
}

interface GitHubRepo {
  id: number
  name: string
  description: string
  language: string
  stargazers_count: number
  forks_count: number
  watchers_count: number
  html_url: string
  updated_at: string
}

interface GitHubCommitActivity {
  week: number
  days: number[]
}

// Component pour le heatmap GitHub avec vraies données
const GitHubHeatmap = ({ username, token }: { username: string, token: string }) => {
  const [commitData, setCommitData] = useState<number[]>([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const fetchCommitData = async () => {
      try {
        setLoading(true)
        
        // Récupérer les statistiques de commits des 52 dernières semaines
        const response = await fetch(
          `https://api.github.com/repos/${username}/${username}/stats/commit_activity`,
          {
            headers: {
              'Authorization': `token ${token}`,
              'Accept': 'application/vnd.github.v3+json'
            }
          }
        )
        
        if (response.ok) {
          const data: GitHubCommitActivity[] = await response.json()
          
          // Convertir les données en format pour le heatmap (365 jours)
          const dailyCommits: number[] = []
          data.forEach(week => {
            week.days.forEach(dayCommits => {
              dailyCommits.push(Math.min(dayCommits, 4)) // Cap à 4 pour les couleurs
            })
          })
          
          // Compléter avec des zéros si nécessaire pour avoir 365 jours
          while (dailyCommits.length < 365) {
            dailyCommits.unshift(0)
          }
          
          setCommitData(dailyCommits.slice(-365)) // Garder seulement les 365 derniers jours
        } else {
          // Fallback vers des données simulées si l'API échoue
          generateMockData()
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données de commits:', error)
        generateMockData()
      } finally {
        setLoading(false)
      }
    }

    const generateMockData = () => {
      const data: number[] = []
      for (let i = 0; i < 365; i++) {
        data.push(Math.floor(Math.random() * 5)) // 0-4 commits par jour
      }
      setCommitData(data)
    }
    
    if (username && token) {
      fetchCommitData()
    } else {
      generateMockData()
      setLoading(false)
    }
  }, [username, token])

  const getIntensityColor = (commits: number) => {
    if (commits === 0) return 'bg-neutral-800/30'
    if (commits === 1) return 'bg-green-900/50'
    if (commits === 2) return 'bg-green-700/70'
    if (commits === 3) return 'bg-green-500/80'
    return 'bg-green-400'
  }

  const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc']

  if (loading) {
    return (
      <div className="space-y-3">
        <div className="text-neutral-400 text-sm">Chargement de l&apos;activité...</div>
        <div className="grid grid-cols-53 gap-1">
          {Array.from({ length: 365 }).map((_, index) => (
            <div
              key={index}
              className="w-2 h-2 rounded-sm bg-neutral-800/30 animate-pulse"
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {/* Mois */}
      <div className="flex justify-between text-xs text-neutral-500 px-2">
        {months.map((month, index) => (
          <span key={index}>{month}</span>
        ))}
      </div>
      
      {/* Grille de commits */}
      <div className="grid grid-cols-53 gap-1">
        {commitData.map((commits, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-sm ${getIntensityColor(commits)} transition-all hover:scale-125`}
            title={`${commits} commits`}
          />
        ))}
      </div>
      
      {/* Légende */}
      <div className="flex justify-between text-xs text-neutral-500">
        <span>Moins</span>
        <div className="flex gap-1 items-center">
          <div className="w-2 h-2 rounded-sm bg-neutral-800/30"></div>
          <div className="w-2 h-2 rounded-sm bg-green-900/50"></div>
          <div className="w-2 h-2 rounded-sm bg-green-700/70"></div>
          <div className="w-2 h-2 rounded-sm bg-green-500/80"></div>
          <div className="w-2 h-2 rounded-sm bg-green-400"></div>
        </div>
        <span>Plus</span>
      </div>
    </div>
  )
}

export default function Home() {
  // States pour GitHub
  const [githubUser, setGithubUser] = useState<GitHubUser | null>(null)
  const [githubRepos, setGithubRepos] = useState<GitHubRepo[]>([])
  const [loading, setLoading] = useState(true)

  // States pour le jeu
  const [score, setScore] = useState(0)
  const [clicks, setClicks] = useState(0)
  const [timeLeft, setTimeLeft] = useState(10)
  const [gameActive, setGameActive] = useState(false)

  // Configuration GitHub
  const GITHUB_TOKEN = process.env.NEXT_PUBLIC_GITHUB_TOKEN

  const GITHUB_USERNAME = 'wiltark'

  // Fonction pour récupérer les données GitHub avec authentification
  const fetchGitHubData = async () => {
    try {
      setLoading(true)
      
      const headers = {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json'
      }
      
      // Récupérer les infos utilisateur
      const userResponse = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}`, {
        headers
      })
      
      if (!userResponse.ok) {
        throw new Error(`HTTP error! status: ${userResponse.status}`)
      }
      
      const userData = await userResponse.json()
      setGithubUser(userData)

      // Récupérer les repos (avec plus de détails grâce au token)
      const reposResponse = await fetch(
        `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=10&type=all`,
        { headers }
      )
      
      if (!reposResponse.ok) {
        throw new Error(`HTTP error! status: ${reposResponse.status}`)
      }
      
      const reposData = await reposResponse.json()
      setGithubRepos(reposData)
      
    } catch (error) {
      console.error('Erreur lors de la récupération des données GitHub:', error)
      // Fallback sans authentification si le token échoue
      try {
        const userResponse = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}`)
        const userData = await userResponse.json()
        setGithubUser(userData)

        const reposResponse = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=6`)
        const reposData = await reposResponse.json()
        setGithubRepos(reposData)
      } catch (fallbackError) {
        console.error('Erreur lors du fallback:', fallbackError)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchGitHubData()
  }, [])

  const startGame = () => {
    setScore(0)
    setClicks(0)
    setTimeLeft(10)
    setGameActive(true)
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          setGameActive(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const handleClick = () => {
    if (gameActive) {
      setClicks(prev => prev + 1)
      setScore(prev => prev + 10)
    }
  }

  // Fonction pour obtenir l'icône de langage
  const getLanguageIcon = (language: string) => {
    switch (language?.toLowerCase()) {
      case 'javascript': return <Code className="w-3 h-3" />
      case 'typescript': return <FileText className="w-3 h-3" />
      case 'python': return <Cpu className="w-3 h-3" />
      case 'java': return <Coffee className="w-3 h-3" />
      case 'html': return <Globe className="w-3 h-3" />
      case 'css': return <Palette className="w-3 h-3" />
      case 'c++': return <Shield className="w-3 h-3" />
      case 'c#': return <Database className="w-3 h-3" />
      case 'php': return <Globe className="w-3 h-3" />
      case 'ruby': return <Heart className="w-3 h-3" />
      case 'go': return <Zap className="w-3 h-3" />
      case 'rust': return <Shield className="w-3 h-3" />
      case 'sql': return <Database className="w-3 h-3" />
      case 'ejs': return <FileText className="w-3 h-3" />
      default: return <Code className="w-3 h-3" />
    }
  }

  // Obtenir les langages uniques des repos avec les compétences principales
  const getUniqueLanguages = () => {
    const mainSkills = ['TypeScript', 'React', 'Node.js', 'SQL', 'JavaScript', 'Express', 'EJS']
    const repoLanguages = githubRepos
      .filter(repo => repo.language)
      .map(repo => repo.language)
      .filter((lang, index, array) => array.indexOf(lang) === index)
    
    // Combine les compétences principales avec les langages des repos
    const allLanguages = [...new Set([...mainSkills, ...repoLanguages])]
    return allLanguages.slice(0, 8) // Limiter à 8 langages
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 p-4 md:p-6">
      {/* Background decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-800/10 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-purple-800/10 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-green-800/10 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Card className="bg-neutral-900/80 border-neutral-800 backdrop-blur-lg">
            <CardHeader>
              <CardTitle className="text-4xl md:text-6xl font-bold text-white bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 bg-clip-text text-transparent">
                Karl H. Portfolio
              </CardTitle>
              <CardDescription className="text-xl text-neutral-400">
                Développeur Web & Bot Discord • Président & Trésorier AlfyCore • 17 ans
              </CardDescription>
              <div className="flex flex-wrap gap-2 mt-4">
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                  <Zap className="w-3 h-3 mr-1" />
                  Disponible pour nouveaux projets
                </Badge>
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                  <Terminal className="w-3 h-3 mr-1" />
                  Créateur de Veko.js
                </Badge>
                <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                  <MessageSquare className="w-3 h-3 mr-1" />
                  CosmoChat en développement
                </Badge>
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-6">
          
          {/* Profile Card */}
          <Card className="md:col-span-2 lg:col-span-2 bg-neutral-900/80 border-neutral-800 backdrop-blur-lg hover:bg-neutral-900/90 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <Avatar className="w-20 h-20 ring-2 ring-blue-500/50">
                  <AvatarImage 
                    src={githubUser?.avatar_url || "/api/placeholder/80/80"} 
                    alt="Karl H." 
                  />
                  <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xl font-bold">
                    KH
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-bold text-white">Karl H.</h3>
                  <p className="text-neutral-400 text-sm mt-1">@{githubUser?.login || 'wiltark'}</p>
                  <div className="flex items-center justify-center gap-1 mt-2 text-neutral-500">
                    <MapPin className="w-3 h-3" />
                    <span className="text-xs">Paris, France</span>
                  </div>
                  <div className="flex items-center justify-center gap-1 mt-1 text-neutral-500">
                    <Building2 className="w-3 h-3" />
                    <span className="text-xs">AlfyCore • Association loi 1901</span>
                  </div>
                  <div className="flex items-center justify-center gap-1 mt-1 text-neutral-500">
                    <Clock className="w-3 h-3" />
                    <span className="text-xs">4+ ans d&apos;expérience • 17 ans</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bio Card */}
          <Card className="md:col-span-4 lg:col-span-4 bg-neutral-900/80 border-neutral-800 backdrop-blur-lg hover:bg-neutral-900/90 transition-all duration-300">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-white" />
                <CardTitle className="text-white">À propos</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-neutral-300 leading-relaxed">
                Passionné par le développement et l&apos;innovation technologique depuis l&apos;âge de 13 ans. 
                Créateur de <span className="text-blue-400 font-semibold">Veko.js</span>, un framework ultra-moderne pour Node.js avec Express et EJS.
                Actuellement en développement de <span className="text-purple-400 font-semibold">CosmoChat</span>, une alternative self-hosted à Discord.
                Président & Trésorier de <span className="text-green-400 font-semibold">AlfyCore</span>, 
                une agence tech créative basée à Paris qui transforme les idées en expériences digitales exceptionnelles.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Badge variant="outline" className="border-blue-500/30 text-blue-400">
                  <Terminal className="w-3 h-3 mr-1" />
                  Framework Veko.js
                </Badge>
                <Badge variant="outline" className="border-purple-500/30 text-purple-400">
                  <MessageSquare className="w-3 h-3 mr-1" />
                  CosmoChat 2026
                </Badge>
                <Badge variant="outline" className="border-green-500/30 text-green-400">
                  <Bot className="w-3 h-3 mr-1" />
                  Bot GLaDOS
                </Badge>
                <Badge variant="outline" className="border-orange-500/30 text-orange-400">
                  <Building2 className="w-3 h-3 mr-1" />
                  AlfyCore Président
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Mes Projets Card */}
          <Card className="md:col-span-6 lg:col-span-6 bg-neutral-900/80 border-neutral-800 backdrop-blur-lg hover:bg-neutral-900/90 transition-all duration-300">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Rocket className="w-5 h-5 text-white" />
                <CardTitle className="text-white">Mes Projets Principaux</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Veko.js */}
                <div className="border border-blue-500/30 p-4 rounded-lg bg-gradient-to-br from-blue-600/5 to-blue-800/5">
                  <div className="flex items-center gap-2 mb-3">
                    <Terminal className="w-5 h-5 text-blue-400" />
                    <h3 className="text-lg font-bold text-white">Veko.js</h3>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                      Actif
                    </Badge>
                  </div>
                  <p className="text-neutral-300 text-sm mb-3">
                    Framework ultra-moderne pour Node.js avec Express et EJS. Rechargement intelligent, auto-updater révolutionnaire et système de plugins.
                  </p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    <Badge variant="outline" className="border-neutral-700 text-neutral-300 text-xs">Node.js</Badge>
                    <Badge variant="outline" className="border-neutral-700 text-neutral-300 text-xs">Express</Badge>
                    <Badge variant="outline" className="border-neutral-700 text-neutral-300 text-xs">EJS</Badge>
                  </div>
                  <div className="text-xs text-neutral-400">
                    Lancement prévu 2026 • En développement actif
                  </div>
                </div>

                {/* CosmoChat */}
                <div className="border border-purple-500/30 p-4 rounded-lg bg-gradient-to-br from-purple-600/5 to-purple-800/5">
                  <div className="flex items-center gap-2 mb-3">
                    <MessageSquare className="w-5 h-5 text-purple-400" />
                    <h3 className="text-lg font-bold text-white">CosmoChat</h3>
                    <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-xs">
                      Alpha 2025
                    </Badge>
                  </div>
                  <p className="text-neutral-300 text-sm mb-3">
                    Alternative self-hosted à Discord. Open-source, auto-hébergeable avec contrôle total sur vos données et communautés privées.
                  </p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    <Badge variant="outline" className="border-neutral-700 text-neutral-300 text-xs">TypeScript</Badge>
                    <Badge variant="outline" className="border-neutral-700 text-neutral-300 text-xs">Docker</Badge>
                    <Badge variant="outline" className="border-neutral-700 text-neutral-300 text-xs">WebRTC</Badge>
                  </div>
                  <div className="text-xs text-neutral-400">
                    Alpha Q3 2025 • Bêta publique Q4 2025
                  </div>
                </div>

                {/* GLaDOS */}
                <div className="border border-green-500/30 p-4 rounded-lg bg-gradient-to-br from-green-600/5 to-green-800/5">
                  <div className="flex items-center gap-2 mb-3">
                    <Bot className="w-5 h-5 text-green-400" />
                    <h3 className="text-lg font-bold text-white">GLaDOS</h3>
                    <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">
                      IA Intégrée
                    </Badge>
                  </div>
                  <p className="text-neutral-300 text-sm mb-3">
                    Bot Discord de gestion de serveur avec IA intégrée. Comprend le langage naturel, aucune configuration, 100% gratuit et conforme RGPD.
                  </p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    <Badge variant="outline" className="border-neutral-700 text-neutral-300 text-xs">Discord.js</Badge>
                    <Badge variant="outline" className="border-neutral-700 text-neutral-300 text-xs">IA</Badge>
                    <Badge variant="outline" className="border-neutral-700 text-neutral-300 text-xs">Node.js</Badge>
                  </div>
                  <div className="text-xs text-neutral-400">
                    Disponible maintenant • Zéro base de données
                  </div>
                </div>

              </div>
            </CardContent>
          </Card>

          {/* Skills Card basé sur les compétences réelles */}
          <Card className="md:col-span-3 lg:col-span-3 bg-neutral-900/80 border-neutral-800 backdrop-blur-lg hover:bg-neutral-900/90 transition-all duration-300">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Code className="w-5 h-5 text-white" />
                <CardTitle className="text-white">Compétences Techniques</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {getUniqueLanguages().map((language, index) => (
                  <Badge key={`${language}-${index}`} variant="secondary" className="bg-neutral-800 text-neutral-200 hover:bg-neutral-700 justify-center">
                    <span className="mr-1">{getLanguageIcon(language)}</span>
                    {language}
                  </Badge>
                ))}
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-400">Node.js / Express</span>
                  <span className="text-green-400">95%</span>
                </div>
                <div className="w-full bg-neutral-800 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '95%' }}></div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-400">TypeScript</span>
                  <span className="text-blue-400">90%</span>
                </div>
                <div className="w-full bg-neutral-800 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '90%' }}></div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-400">Discord.js / Bots</span>
                  <span className="text-purple-400">92%</span>
                </div>
                <div className="w-full bg-neutral-800 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Card */}
          <Card className="md:col-span-3 lg:col-span-3 bg-neutral-900/80 border-neutral-800 backdrop-blur-lg hover:bg-neutral-900/90 transition-all duration-300">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-white" />
                <CardTitle className="text-white">Contact & Réseaux</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-neutral-800 rounded-lg">
                  <Mail className="w-4 h-4 text-neutral-300" />
                </div>
                <span className="text-neutral-300 text-sm">contact@alfycore.org</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-neutral-800 rounded-lg">
                  <Building2 className="w-4 h-4 text-neutral-300" />
                </div>
                <span className="text-neutral-300 text-sm">AlfyCore - Paris, France</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-neutral-800 rounded-lg">
                  <Github className="w-4 h-4 text-neutral-300" />
                </div>
                <span className="text-neutral-300 text-sm">github.com/{githubUser?.login || 'wiltark'}</span>
              </div>
              <div className="mt-4 text-center">
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                  ✨ Créons le futur digital ensemble
                </Badge>
              </div>
            </CardContent>
          </Card>


          {/* AlfyCore Stats Card */}
          <Card className="md:col-span-2 lg:col-span-2 bg-gradient-to-r from-blue-600/10 to-purple-600/10 border-blue-500/30 backdrop-blur-lg hover:from-blue-600/20 hover:to-purple-600/20 transition-all duration-300">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-400" />
                <CardTitle className="text-white">AlfyCore Stats</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">15+</div>
                  <div className="text-neutral-400 text-sm">Projets Web</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">8</div>
                  <div className="text-neutral-400 text-sm">Clients</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">7</div>
                  <div className="text-neutral-400 text-sm">Experts</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400">4.9/5</div>
                  <div className="text-neutral-400 text-sm">Note client</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Game Card */}
          <Card className="md:col-span-2 lg:col-span-2 bg-neutral-900/80 border-neutral-800 backdrop-blur-lg hover:bg-neutral-900/90 transition-all duration-300">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Gamepad2 className="w-5 h-5 text-white" />
                <CardTitle className="text-white">Mini Jeu - Click Challenge</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{score}</div>
                  <div className="text-neutral-400 text-xs">Score</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{clicks}</div>
                  <div className="text-neutral-400 text-xs">Clicks</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{timeLeft}</div>
                  <div className="text-neutral-400 text-xs">Temps</div>
                </div>
              </div>
              
              {!gameActive ? (
                <Button 
                  onClick={startGame} 
                  className="w-full bg-neutral-700 hover:bg-neutral-600 text-white"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Commencer
                </Button>
              ) : (
                <Button 
                  onClick={handleClick}
                  className="w-full h-16 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-lg font-bold"
                >
                  <Target className="w-6 h-6 mr-2" />
                  CLICK !
                </Button>
              )}
            </CardContent>
          </Card>

          {/* GitHub Repos Card */}
          <Card className="md:col-span-2 lg:col-span-2 bg-neutral-900/80 border-neutral-800 backdrop-blur-lg hover:bg-neutral-900/90 transition-all duration-300">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Github className="w-5 h-5 text-white" />
                <CardTitle className="text-white">Repos GitHub</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {loading ? (
                <div className="text-neutral-400">Chargement...</div>
              ) : (
                githubRepos.slice(0, 2).map((repo) => (
                  <div key={repo.id} className="border-l-2 border-blue-500 pl-4">
                    <h4 className="font-semibold text-white flex items-center gap-2">
                      <Code className="w-4 h-4" />
                      {repo.name}
                      <a 
                        href={repo.html_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="ml-auto"
                      >
                        <ExternalLink className="w-3 h-3 text-neutral-400 hover:text-white" />
                      </a>
                    </h4>
                    <p className="text-neutral-400 text-sm">{repo.description || 'Projet en développement'}</p>
                    <div className="flex gap-2 mt-2">
                      {repo.language && (
                        <Badge variant="outline" className="border-neutral-700 text-neutral-300">
                          {getLanguageIcon(repo.language)}
                          <span className="ml-1">{repo.language}</span>
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-neutral-400 text-xs mt-2">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        <span>{repo.stargazers_count}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <GitFork className="w-3 h-3" />
                        <span>{repo.forks_count}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        <span>{repo.watchers_count}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* GitHub Stats Card */}
          <Card className="md:col-span-3 bg-neutral-900/80 border-neutral-800 backdrop-blur-lg hover:bg-neutral-900/90 transition-all duration-300">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-white" />
                <CardTitle className="text-white">Statistiques GitHub</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400 flex items-center justify-center gap-1">
                    <Rocket className="w-5 h-5" />
                    {githubUser?.public_repos || 0}
                  </div>
                  <div className="text-neutral-400 text-sm">Repositories</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400 flex items-center justify-center gap-1">
                    <Users className="w-5 h-5" />
                    {githubUser?.followers || 0}
                  </div>
                  <div className="text-neutral-400 text-sm">Followers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400 flex items-center justify-center gap-1">
                    <Heart className="w-5 h-5" />
                    {githubUser?.following || 0}
                  </div>
                  <div className="text-neutral-400 text-sm">Following</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400 flex items-center justify-center gap-1">
                    <Calendar className="w-5 h-5" />
                    4+
                  </div>
                  <div className="text-neutral-400 text-sm">Années</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Interests Card */}
          <Card className="md:col-span-3 bg-neutral-900/80 border-neutral-800 backdrop-blur-lg hover:bg-neutral-900/90 transition-all duration-300">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-white" />
                <CardTitle className="text-white">Centres d&apos;intérêt & Innovation</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2 p-2 bg-neutral-800/50 rounded-lg">
                  <Terminal className="w-4 h-4 text-blue-400" />
                  <span className="text-neutral-300 text-sm">Frameworks</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-neutral-800/50 rounded-lg">
                  <Bot className="w-4 h-4 text-green-400" />
                  <span className="text-neutral-300 text-sm">Bots Discord</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-neutral-800/50 rounded-lg">
                  <MessageSquare className="w-4 h-4 text-purple-400" />
                  <span className="text-neutral-300 text-sm">Chat Apps</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-neutral-800/50 rounded-lg">
                  <Sparkles className="w-4 h-4 text-yellow-400" />
                  <span className="text-neutral-300 text-sm">IA & ML</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-neutral-800/50 rounded-lg">
                  <Lock className="w-4 h-4 text-red-400" />
                  <span className="text-neutral-300 text-sm">Self-hosting</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-neutral-800/50 rounded-lg">
                  <Building2 className="w-4 h-4 text-cyan-400" />
                  <span className="text-neutral-300 text-sm">Entrepreneuriat</span>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}