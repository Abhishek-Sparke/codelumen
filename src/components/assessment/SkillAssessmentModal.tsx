import React, { useState } from 'react';
import { 
  Check, ArrowRight, Activity, Brain, BarChart3, 
  Sparkles, CheckCircle2, XCircle, X 
} from 'lucide-react';
import { UserProfile } from '../../types';

interface SkillAssessmentModalProps {
  isOpen: boolean;
  currentUser: UserProfile;
  onClose: () => void;
  onApplyRecommendation: (recommendedTopic: string, scores: Record<string, number>) => void;
}

interface AssessmentQuestion {
  id: string;
  topic: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  question: string;
  options: string[];
  correctIndex: number;
}

export const SkillAssessmentModal: React.FC<SkillAssessmentModalProps> = ({
  isOpen,
  currentUser,
  onClose,
  onApplyRecommendation
}) => {
  const [currentQIndex, setCurrentQIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isCompleted, setIsCompleted] = useState(false);

  if (!isOpen) return null;

  const questions: AssessmentQuestion[] = [
    {
      id: 'q-arrays',
      topic: 'Arrays & Hashing',
      difficulty: 'Easy',
      question: 'Which data structure achieves O(1) average time complexity for both inserting an element and verifying its membership?',
      options: [
        'Sorted Dynamic Array with Binary Search',
        'Hash Table / Hash Set',
        'Balanced Binary Search Tree',
        'Linked List with Tail Pointer'
      ],
      correctIndex: 1
    },
    {
      id: 'q-trees',
      topic: 'Trees & BST',
      difficulty: 'Medium',
      question: 'In a valid Binary Search Tree (BST), what traversal order always yields node values in strictly ascending order?',
      options: [
        'Pre-order traversal (Root, Left, Right)',
        'In-order traversal (Left, Root, Right)',
        'Post-order traversal (Left, Right, Root)',
        'Breadth-First Level Order'
      ],
      correctIndex: 1
    },
    {
      id: 'q-graphs',
      topic: 'Graphs & BFS/DFS',
      difficulty: 'Medium',
      question: 'Which algorithm is best suited for detecting whether a directed graph contains a cycle in O(V + E) time?',
      options: [
        'Kruskal Minimum Spanning Tree',
        'Dijkstra Shortest Path with Fibonacci Heap',
        'Topological Sort (Kahn’s In-Degree Algorithm or DFS 3-Coloring)',
        'Floyd-Warshall All-Pairs'
      ],
      correctIndex: 2
    },
    {
      id: 'q-dp',
      topic: 'Dynamic Programming',
      difficulty: 'Hard',
      question: 'What fundamental properties must a problem satisfy to be solvable with Dynamic Programming rather than pure divide-and-conquer?',
      options: [
        'Deterministic sorting and greedy choice property',
        'Optimal substructure and overlapping subproblems',
        'Strictly linear state transitions with no caching',
        'Independent disjoint subproblems with no recurrence'
      ],
      correctIndex: 1
    }
  ];

  const currentQuestion = questions[currentQIndex];

  const handleSelectOption = (optIdx: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQIndex]: optIdx
    }));
  };

  const handleNext = () => {
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex(prev => prev + 1);
    } else {
      setIsCompleted(true);
    }
  };

  // Calculate scores per topic (percentage)
  const calculateTopicScores = (): Record<string, number> => {
    const scores: Record<string, number> = {};
    questions.forEach((q, idx) => {
      const isCorrect = selectedAnswers[idx] === q.correctIndex;
      scores[q.topic] = isCorrect ? 95 : 35;
    });
    return scores;
  };

  const topicScores = calculateTopicScores();

  // Find lowest scoring topic for recommendation
  const getRecommendedStartingPoint = () => {
    const sorted = Object.entries(topicScores).sort((a, b) => a[1] - b[1]);
    return sorted[0] ? sorted[0][0] : 'Arrays & Hashing';
  };

  const recommendedTopic = getRecommendedStartingPoint();

  const handleFinishAssessment = () => {
    onApplyRecommendation(recommendedTopic, topicScores);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="glass-panel relative w-full max-w-lg overflow-hidden rounded-3xl border border-indigo-500/30 bg-[#0c0c11] p-6 sm:p-8 shadow-[0_30px_90px_-20px_rgba(99,102,241,0.25)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-4 mb-6">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-300">
              <Activity className="h-3.5 w-3.5" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-white">
              Diagnostic Skill Assessment
            </span>
          </div>
          <button 
            onClick={onClose}
            className="text-white/40 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {!isCompleted ? (
          <div>
            {/* Question Progress */}
            <div className="flex items-center justify-between text-xs text-white/50 mb-3">
              <span>Question {currentQIndex + 1} of {questions.length}</span>
              <span className="font-mono text-indigo-400 font-medium">{currentQuestion.topic}</span>
            </div>

            <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden mb-6">
              <div 
                className="h-full bg-indigo-500 transition-all duration-300"
                style={{ width: `${((currentQIndex + 1) / questions.length) * 100}%` }}
              />
            </div>

            {/* Question Prompt */}
            <h3 className="font-display text-base sm:text-lg font-bold text-white leading-snug mb-5">
              {currentQuestion.question}
            </h3>

            {/* Options List */}
            <div className="space-y-2.5 mb-8">
              {currentQuestion.options.map((opt, optIdx) => {
                const isSelected = selectedAnswers[currentQIndex] === optIdx;
                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelectOption(optIdx)}
                    className={`flex w-full items-start justify-between rounded-xl border p-3.5 text-xs text-left transition-all ${
                      isSelected
                        ? 'border-indigo-400 bg-indigo-500/15 text-white ring-1 ring-indigo-400/40'
                        : 'border-white/[0.08] bg-white/[0.02] text-white/75 hover:border-white/20'
                    }`}
                  >
                    <span className="leading-relaxed">{opt}</span>
                    <div className={`mt-0.5 ml-3 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                      isSelected ? 'border-indigo-400 bg-indigo-400 text-black' : 'border-white/20'
                    }`}>
                      {isSelected && <Check className="h-2.5 w-2.5 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Action Bar */}
            <button
              disabled={selectedAnswers[currentQIndex] === undefined}
              onClick={handleNext}
              className={`flex w-full items-center justify-center gap-2 rounded-xl py-3 text-xs font-bold uppercase tracking-wider transition-all ${
                selectedAnswers[currentQIndex] !== undefined
                  ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-lg shadow-indigo-500/25 hover:scale-[1.01]'
                  : 'bg-white/10 text-white/30 cursor-not-allowed'
              }`}
            >
              <span>{currentQIndex === questions.length - 1 ? 'Complete Diagnostic' : 'Next Question'}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          /* Assessment Results Screen (Section 24) */
          <div className="animate-in fade-in slide-in-from-right-4 duration-200">
            <div className="text-center mb-6">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/20 border border-indigo-400/30 text-indigo-400">
                <BarChart3 className="h-6 w-6" />
              </div>
              <h3 className="font-display text-xl font-bold text-white">
                Diagnostic Skill Map
              </h3>
              <p className="text-xs text-white/50 mt-1">
                Based on your diagnostic answers, here is your algorithmic breakdown:
              </p>
            </div>

            {/* Topic Skill Bars */}
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 space-y-3.5 mb-6">
              {Object.entries(topicScores).map(([topic, score]) => (
                <div key={topic}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-white/80 font-medium">{topic}</span>
                    <span className={`font-mono font-bold ${score >= 70 ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {score}%
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        score >= 70 ? 'bg-emerald-400' : 'bg-amber-400'
                      }`}
                      style={{ width: `${score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Recommendation Box */}
            <div className="rounded-xl border border-indigo-500/30 bg-indigo-500/10 p-4 mb-6 text-left">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300 block mb-1">
                RECOMMENDED STARTING POINT
              </span>
              <p className="text-sm font-bold text-white">
                Start with {recommendedTopic}
              </p>
              <p className="text-[11px] text-indigo-200/70 mt-1">
                Targeting this area first will give you the highest acceleration on your interview prep.
              </p>
            </div>

            {/* Zero-Stats Guarantee Notice (Section 24) */}
            <p className="text-center text-[10px] text-white/40 mb-5">
              Note: Diagnostic assessment is diagnostic only and does not falsely increment your solved problem counter.
            </p>

            <button
              onClick={handleFinishAssessment}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 py-3 text-xs font-bold text-black shadow-lg shadow-amber-500/25 hover:scale-[1.01] transition-transform"
            >
              <span>Apply Recommended Starting Point →</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
