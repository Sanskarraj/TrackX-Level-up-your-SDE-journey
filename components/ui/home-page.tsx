"use client";
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ChevronRight, CheckCircle, Circle, BarChart3, Trophy, Zap, BookOpen, ExternalLink, Play, FileText, Code, GitCommit, LineChart } from 'lucide-react';
import logo from "@/public/logo.png";
import Image from "next/image";
import HeaderUserInfo from '../header-user-info';
import axios from 'axios';
import  StatCard  from '@/components/stats-card';
import SkeletonCard from '@/components/skeleton-card';
import  ProgressBar  from '@/components/progress-bar';
import LinearProgress from '@mui/material/LinearProgress';
import { CircularProgress } from '@mui/material';

type Question = {
  id: number;
  title: string;
  difficulty: number;
  category: string;
  GFGLink: string;
  LeetCodeLink: string;
  SolutionLink: string;
  VideoLink: string;
  createdAt: string;
  updatedAt: string;
};

type UserStatus = {
  userId: string;
  questionId: number;
  status: 'solved' | 'attempted' | 'not_attempted';
  createdAt: string;
  updatedAt: string;
};

type QuizProgressAppProps = {
  user: {
    id: string;
    name: string;
    email: string;
    image: string;
  };
};

// Category order as specified
const CATEGORY_ORDER = [
  'Arrays', 'Sorting', 'Strings', 'Hashing', 'Binary Search', 'Matrix',
  'Recursion and Backtracking', 'Stack', 'Queue', 'Deque', 'Stack + Queue',
  'Heap', 'Bit Manipulation', 'Linked List', 'Binary Tree', 'Binary Search Tree',
  'Greedy', 'Dynamic Programming', 'Graph', 'Trie'
];

// Category icons and colors
type CategoryStyle = {
  icon: string;
  color: string;
};

type CategoryStyles = {
  [key: string]: CategoryStyle;
};

const CATEGORY_STYLES: CategoryStyles = {
  'Arrays': { icon: '🔢', color: 'from-blue-500 to-purple-600' },
  'Sorting': { icon: '📊', color: 'from-green-500 to-emerald-600' },
  'Strings': { icon: '🔤', color: 'from-yellow-500 to-orange-600' },
  'Hashing': { icon: '#️⃣', color: 'from-purple-500 to-pink-600' },
  'Binary Search': { icon: '🎯', color: 'from-red-500 to-rose-600' },
  'Matrix': { icon: '⬜', color: 'from-indigo-500 to-blue-600' },
  'Recursion and Backtracking': { icon: '🔄', color: 'from-teal-500 to-cyan-600' },
  'Stack': { icon: '📚', color: 'from-orange-500 to-red-600' },
  'Queue': { icon: '➡️', color: 'from-lime-500 to-green-600' },
  'Deque': { icon: '↔️', color: 'from-amber-500 to-yellow-600' },
  'Stack + Queue': { icon: '📋', color: 'from-rose-500 to-pink-600' },
  'Heap': { icon: '🏔️', color: 'from-violet-500 to-purple-600' },
  'Bit Manipulation': { icon: '🔀', color: 'from-sky-500 to-blue-600' },
  'Linked List': { icon: '🔗', color: 'from-emerald-500 to-teal-600' },
  ' Canonical Tree': { icon: '🌳', color: 'from-green-600 to-emerald-700' },
  'Binary Search Tree': { icon: '🌲', color: 'from-forest-600 to-green-700' },
  'Greedy': { icon: '💰', color: 'from-yellow-600 to-amber-600' },
  'Dynamic Programming': { icon: '⚡', color: 'from-blue-600 to-indigo-600' },
  'Graph': { icon: '🕸️', color: 'from-purple-600 to-violet-600' },
  'Trie': { icon: '🌿', color: 'from-green-500 to-lime-600' }
};

type DifficultyStyle = {
  label: string;
  class: string;
};

type DifficultyStyles = {
  [key: number]: DifficultyStyle;
};

const DIFFICULTY_STYLES: DifficultyStyles = {
  1: { label: 'Easy', class: 'bg-green-500/20 text-green-400' },
  2: { label: 'Medium', class: 'bg-yellow-500/20 text-yellow-400' },
  3: { label: 'Hard', class: 'bg-red-500/20 text-red-400' }
};

type User = {
  id: string;
  name?: string;
  // email?: string;
  image?: string;
};


type Status = {
  id: string;
  userId: string;
  questionId: number;
};

// Reusable components

const Header = ({ user }: { user: User }) => (
  <div className="sticky top-0 z-50 border-b border-gray-800 bg-[#1b1c1d] backdrop-blur-sm">
    <div className="max-w-6xl mx-auto px-6 py-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 group hover:scale-110 transition-transform duration-300">
          <div className="h-24 w-24 transition-transform duration-300 group-hover:scale-110">
            <Image
              src={logo}
              alt="Your Company Logo"
              className="h-full w-full object-contain"
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              TrackX
            </h1>
            <p className="text-gray-400 text-sm">Level up your SDE journey!</p>
          </div>
        </div>
        <HeaderUserInfo user={user} />
      </div>
    </div>
  </div>
);

const LoadingContent = () => (
  <>
    {/* Stats Skeleton */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {Array.from({ length: 3 }, (_, i) => (
        <div key={i} className="bg-gray-800/50 rounded-xl p-6 animate-pulse">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gray-700 rounded-lg"></div>
            <div className="flex-1">
              <div className="h-8 bg-gray-700 rounded w-16 mb-2"></div>
              <div className="h-4 bg-gray-700 rounded w-20"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
    {/* Overall Progress Skeleton */}
    <div className="bg-gray-800/50 rounded-xl p-6 animate-pulse border border-gray-700/50 mb-8">
      <div className="h-5 bg-gray-700 rounded w-40 mb-4"></div>
      <div className="h-3 bg-gray-700 rounded w-full mb-2"></div>
      <div className="h-4 bg-gray-700 rounded w-48"></div>
    </div>
    {/* Categories Skeleton */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {Array.from({ length: 4 }, (_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  </>
);

const QuestionsLoadingSkeleton = () => (
  <div className="space-y-4">
    {Array.from({ length: 5 }, (_, i) => (
      <div key={i} className="bg-gray-800/50 rounded-xl p-6 animate-pulse">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-1">
            <div className="w-6 h-6 bg-gray-700 rounded-full"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-700 rounded w-1/4"></div>
            </div>
          </div>
          <div className="w-16 h-6 bg-gray-700 rounded"></div>
        </div>
      </div>
    ))}
  </div>
);

const HomePage = ({ user }: QuizProgressAppProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [questionsLoading, setQuestionsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [userProgress, setUserProgress] = useState<Record<number, boolean>>({});
  const [pendingChanges, setPendingChanges] = useState<Record<number, boolean>>({});
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [userStatus, setUserStatus] = useState<UserStatus[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isCommitting, setIsCommitting] = useState(false);
  const [commitSuccess, setCommitSuccess] = useState(false);

  // Fetch questions and user status from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch questions and user status in parallel
        const [questionsResponse, statusResponse] = await Promise.all([
          axios.get('https://trackx-nu.vercel.app/api/questions'),
          axios.get(`https://trackx-nu.vercel.app/api/status?userId=${user?.id}`)
        ]);
        
        setQuestions(questionsResponse.data);
        
        // The API returns solved questions in this format:
        // {"statuses":[{"id":"...","userId":"...","questionId":"4","createdAt":"..."}]}
        const solvedStatuses = statusResponse.data.statuses || [];
        
        // Convert to progress format - if questionId exists in response, it's solved
        const progressMap: Record<number, boolean> = {};
        solvedStatuses.forEach((status: Status) => {
          // Convert questionId string to number and mark as solved
          progressMap[(status.questionId)] = true;
        });
        
        setUserProgress(progressMap);
        setUserStatus(solvedStatuses); // Store the raw status data if needed elsewhere
        
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.id) {
      fetchData();
    }
  }, [user?.id]);

  // Group and sort questions by category
  const categorizedQuestions = useMemo(() => {
    const grouped = questions.reduce((acc, question) => {
      if (!acc[question.category]) {
        acc[question.category] = [];
      }
      acc[question.category].push(question);
      return acc;
    }, {} as Record<string, Question[]>);

    // Sort questions within each category by difficulty
    Object.keys(grouped).forEach(category => {
      grouped[category].sort((a, b) => a.difficulty - b.difficulty);
    });

    return grouped;
  }, [questions]);

  // Create ordered categories with proper typing
  const orderedCategories = useMemo(() => {
    return CATEGORY_ORDER
      .filter(category => categorizedQuestions[category])
      .map(categoryName => ({
        name: categoryName,
        questions: categorizedQuestions[categoryName],
        ...(CATEGORY_STYLES[categoryName] || { icon: '📝', color: 'from-gray-500 to-gray-600' })
      }));
  }, [categorizedQuestions]);

  const handleCategoryClick = useCallback((categoryName: string) => {
    setQuestionsLoading(true);
    setSelectedCategory(categoryName);
    const timer = setTimeout(() => {
      setQuestionsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  const toggleQuestionExpand = useCallback((questionId: number) => {
    setExpandedQuestion(prev => prev === questionId ? null : questionId);
  }, []);

  
const toggleQuestionComplete = useCallback((questionId: number, e?: React.MouseEvent) => {
  e?.stopPropagation();
  
  const isAlreadySolved = userProgress[questionId];
  
  // Don't allow toggling already solved questions
  if (isAlreadySolved) {
    return;
  }
  
  setPendingChanges(prev => ({
    ...prev,
    [questionId]: !prev[questionId]
  }));
}, [userProgress]);

const commitChanges = useCallback(async () => {
    const questionIds = Object.keys(pendingChanges)
      .filter(id => {
        const questionId = parseInt(id);
        const isPending = pendingChanges[questionId];
        const isAlreadySolved = userProgress[questionId];
        return isPending && !isAlreadySolved;
      })
      .map(id => id.toString());

    if (questionIds.length === 0) {
      setPendingChanges({});
      return;
    }

    try {
      setIsCommitting(true);
      await axios.post('https://trackx-nu.vercel.app/api/status', {
        userId: user.id,
        questionIds
      });

      const newProgress = { ...userProgress };
      questionIds.forEach(id => {
        newProgress[parseInt(id)] = true;
      });
      
      setUserProgress(newProgress);
      setCommitSuccess(true);
      
      // Reset success state after animation
      setTimeout(() => {
        setCommitSuccess(false);
        setPendingChanges({});
      }, 1000);

    } catch (error) {
      console.error('Error committing changes:', error);
      setError('Failed to commit changes. Please try again.');
    } finally {
      setIsCommitting(false);
    }
  }, [pendingChanges, userProgress, user.id]);

  const goBack = useCallback(() => {
    setSelectedCategory(null);
    setExpandedQuestion(null);
  }, []);

  // Calculate stats
  const stats = useMemo(() => {
    const totalQuestions = questions.length;
    const completedQuestions = Object.values(userProgress).filter(Boolean).length;
    const pendingCount = Object.values(pendingChanges).filter(Boolean).length;
    const overallProgress = totalQuestions > 0 ? (completedQuestions / totalQuestions) * 100 : 0;
    
    return { totalQuestions, completedQuestions, pendingCount, overallProgress };
  }, [questions.length, userProgress, pendingChanges]);

  const selectedCategoryData = useMemo(() => 
    orderedCategories.find(c => c.name === selectedCategory), 
    [orderedCategories, selectedCategory]
  );

  const currentQuestions = useMemo(() => 
    selectedCategory ? categorizedQuestions[selectedCategory] || [] : [], 
    [selectedCategory, categorizedQuestions]
  );

  if (error) {
    return (
      <div className="min-h-screen bg-[#121212] text-white">
        <Header user={user} />
        <div className="relative z-10 max-w-6xl mx-auto px-6 py-8">
          <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-6 text-center">
            <div className="text-red-400 text-lg font-semibold mb-2">Error</div>
            <div className="text-gray-300">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      <Header user={user} />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-8">
        {isLoading ? (
          <LoadingContent />
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <StatCard 
                icon={Trophy} 
                value={stats.completedQuestions} 
                label="Completed" 
                gradient="from-green-400 to-green-600"
                delay={0}
              />
              <StatCard 
                icon={BarChart3} 
                value={stats.totalQuestions} 
                label="Total Questions" 
                gradient="from-blue-400 to-blue-600"
                delay={100}
              />
              <StatCard 
                icon={Zap} 
                value={`${stats.overallProgress.toFixed(1)}%`}  // outputs "84.6%"
                label="Progress" 
                gradient="from-purple-400 to-purple-600"
                delay={200}
              />
            </div>

            {/* Pending Changes Commit Box with smooth animations */}
            <div 
              className={`transition-all duration-1000 ease-in-out transform ${
                stats.pendingCount > 0 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 -translate-y-4 pointer-events-none h-0 overflow-hidden'
              }`}
            >
              {stats.pendingCount > 0 && (
                <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-600/30 rounded-xl p-6 mb-8 animate-in slide-in-from-top duration-500">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <GitCommit className={`w-6 h-6 text-blue-400 transition-transform duration-500 ${
                        isCommitting ? 'animate-spin' : commitSuccess ? 'scale-125' : ''
                      }`} />
                      <div>
                        <h3 className="text-lg font-semibold text-white">Pending Changes</h3>
                        <p className="text-sm text-gray-400">
                          {stats.pendingCount} question{stats.pendingCount > 1 ? 's' : ''} marked as completed (not saved)
                        </p>
                      </div>
                    </div>
                    
                    {isCommitting && (
  <div className="w-1/2 px-4">
    <LinearProgress color="success" sx={{ backgroundColor: '#fff', height: 5, animationDuration: '0.3s' }} />
  </div>
)}
{commitSuccess && (
                        <span className="flex items-center justify-center text-green-400">
                                    ✅ Committed Successfully! 

                        </span>
                      )}
                    <button
                      onClick={commitChanges}
                      disabled={isCommitting}
                      className={`
                        px-4 py-2 rounded-lg relative overflow-hidden transition-all duration-300
                        ${isCommitting 
                          ? 'bg-blue-500/50 cursor-not-allowed' 
                          : commitSuccess 
                            ? 'bg-green-500 scale-105' 
                            : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600'
                        }
                        transform hover:scale-105 active:scale-95
                      `}
                    >
                      <span className={`
                        flex items-center space-x-2 transition-all duration-300 transform
                        ${isCommitting || commitSuccess ? 'opacity-0' : 'opacity-100'}
                      `}>
                        {(!isCommitting && !commitSuccess) && (<span>Commit</span>)}

                      </span>
                      {/* {isCommitting && (
                        <span className="absolute inset-0 flex items-center justify-center">
                          <CircularProgress className="w-6 h-6 animate-spin text-blue-400" />
                          </span>
                        )}
                      {commitSuccess && (
                        <span className="pl-3 absolute inset-0 flex items-center justify-center">
                                    <div className='text-green-400'>201</div>

                        </span>
                      )} */}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Note: Committing changes is irreversible.</p>
                </div>
              )}
            </div>

            {/* Overall Progress */}
            <div className="bg-gradient-to-br backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 mb-8">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-blue-400" />
                Overall Progress
              </h2>
              <ProgressBar progress={stats.overallProgress} />
              <div className="mt-2 text-sm text-gray-400">
                {stats.completedQuestions} of {stats.totalQuestions} questions completed
                {stats.pendingCount > 0 && ` (${stats.pendingCount} pending)`}
              </div>
            </div>

            {/* Categories or Questions */}
            {!selectedCategory ? (
              <div>
                <h2 className="text-xl font-semibold mb-6 flex items-center">
                  <BookOpen className="w-5 h-5 mr-2 text-purple-400" />
                  Categories
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {orderedCategories.map((category, index) => {
                    const categoryQuestions = category.questions;
                    const completedCount = categoryQuestions.filter(q => userProgress[q.id]).length;
                    const pendingCategoryCount = categoryQuestions.filter(q => pendingChanges[q.id]).length;
                    const progressPercent = categoryQuestions.length > 0 ? (completedCount / categoryQuestions.length) * 100 : 0;
                    
                    return (
                      <div
                        key={category.name}
                        className="group bg-gradient-to-br backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-gray-600/50 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/10"
                        onClick={() => handleCategoryClick(category.name)}
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-4">
                            <div className={`w-12 h-12 bg-gradient-to-r ${category.color} rounded-lg flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300`}>
                              {category.icon}
                            </div>
                            <div>
                              <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                                {index+1}. {category.name}
                              </h3>
                              <p className="text-sm text-gray-400">
                                {completedCount}/{categoryQuestions.length} questions
                                {pendingCategoryCount > 0 && ` (${pendingCategoryCount} pending)`}
                              </p>
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
                        </div>
                        <ProgressBar progress={progressPercent} />
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center space-x-4 mb-6">
                  <button
                    onClick={goBack}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    ← Back
                  </button>
                  <h2 className="text-xl font-semibold">
                    {selectedCategoryData?.name}
                  </h2>
                </div>

                {questionsLoading ? (
                  <QuestionsLoadingSkeleton />
                ) : (
                  <div className="space-y-4">
                    {currentQuestions.map((question, index) => {
                      const isSaved = userProgress[question.id];
                      const isPending = pendingChanges[question.id];
                      const isExpanded = expandedQuestion === question.id;
                      const difficultyInfo = DIFFICULTY_STYLES[question.difficulty];
                      
                      return (
                        <div
                          key={question.id}
                          className="group bg-gradient-to-br backdrop-blur-sm rounded-xl border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 overflow-hidden"
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          <div
                            className="p-6 cursor-pointer hover:bg-gray-700/20 transition-colors"
                            onClick={() => toggleQuestionExpand(question.id)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4 flex-1">
                                <div 
                                  className="relative z-10"
                                  onClick={(e) => toggleQuestionComplete(question.id, e)}
                                >
                                  {isSaved ? (
                                    <CheckCircle className="w-6 h-6 text-green-400" />
                                  ) : isPending ? (
                                    <CheckCircle className="w-6 h-6 text-blue-400 hover:scale-110 transition-transform cursor-pointer" />
                                  ) : (
                                    <Circle className="w-6 h-6 text-gray-500 hover:text-gray-300 hover:scale-110 transition-all cursor-pointer" />
                                  )}
                                </div>
                                <div className="flex-1">
                                  <h3 className={`font-medium ${isSaved ? 'text-green-400 line-through' : isPending ? 'text-blue-400' : 'text-white'} group-hover:text-blue-400 transition-colors`}>
                                    {question.title}
                                  </h3>
                                  <p className="text-sm text-gray-400">Question {question.id}</p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-3">
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${difficultyInfo.class}`}>
                                  {difficultyInfo.label}
                                </span>
                                <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`} />
                              </div>
                            </div>
                          </div>

                          {/* Expanded Links Section */}
                          {isExpanded && (
                            <div className="border-t border-gray-700/50 bg-gray-800/30 p-6 animate-in slide-in-from-top-2 duration-300">
                              <div className="grid grid-cols-2 gap-4">
                                {question.GFGLink !== "Could not found ;(" && (
                                  <a
                                    href={question.GFGLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center space-x-3 p-3 bg-gradient-to-r from-green-600/20 to-green-700/20 border border-green-600/30 rounded-lg hover:border-green-500/50 hover:bg-green-600/30 transition-all duration-200 group/link"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <div className="flex items-center justify-center w-8 h-8 bg-green-600 rounded-lg group-hover/link:scale-110 transition-transform">
                                      <span className="text-white font-bold text-sm">G</span>
                                    </div>
                                    <div>
                                      <div className="text-white font-medium text-sm">GeeksforGeeks</div>
                                      <div className="text-gray-400 text-xs">Practice Problem</div>
                                    </div>
                                    <ExternalLink className="w-4 h-4 text-gray-400 ml-auto group-hover/link:text-white" />
                                  </a>
                                )}

                                {question.LeetCodeLink !== "Could not found ;(" && (
                                  <a
                                    href={question.LeetCodeLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center space-x-3 p-3 bg-gradient-to-r from-orange-600/20 to-yellow-600/20 border border-orange-600/30 rounded-lg hover:border-orange-500/50 hover:bg-orange-600/30 transition-all duration-200 group/link"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-lg group-hover/link:scale-110 transition-transform">
                                      <Code className="w-4 h-4 text-white" />
                                    </div>
                                    <div>
                                      <div className="text-white font-medium text-sm">LeetCode</div>
                                      <div className="text-gray-400 text-xs">Coding Challenge</div>
                                    </div>
                                    <ExternalLink className="w-4 h-4 text-gray-400 ml-auto group-hover/link:text-white" />
                                  </a>
                                )}

                                {question.SolutionLink !== "Could not found ;(" && (
                                  <a
                                    href={question.SolutionLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center space-x-3 p-3 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-600/30 rounded-lg hover:border-blue-500/50 hover:bg-blue-600/30 transition-all duration-200 group/link"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg group-hover/link:scale-110 transition-transform">
                                      <FileText className="w-4 h-4 text-white" />
                                    </div>
                                    <div>
                                      <div className="text-white font-medium text-sm">Solution</div>
                                      <div className="text-gray-400 text-xs">Step-by-step</div>
                                    </div>
                                    <ExternalLink className="w-4 h-4 text-gray-400 ml-auto group-hover/link:text-white" />
                                  </a>
                                )}

                                {question.VideoLink !== "Could not found ;(" && (
                                  <a
                                    href={question.VideoLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center space-x-3 p-3 bg-gradient-to-r from-red-600/20 to-pink-600/20 border border-red-600/30 rounded-lg hover:border-red-500/50 hover:bg-red-600/30 transition-all duration-200 group/link"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg group-hover/link:scale-110 transition-transform">
                                      <Play className="w-4 h-4 text-white ml-0.5" />
                                    </div>
                                    <div>
                                      <div className="text-white font-medium text-sm">Video Tutorial</div>
                                      <div className="text-gray-400 text-xs">Watch & Learn</div>
                                    </div>
                                    <ExternalLink className="w-4 h-4 text-gray-400 ml-auto group-hover/link:text-white" />
                                  </a>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default HomePage;