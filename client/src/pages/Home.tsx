import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, ArrowRight, Download, RotateCcw, Loader2, Users } from "lucide-react";
import html2canvas from "html2canvas";
import { QUIZ_QUESTIONS, calculateResult, type RoleType, DEV_ROLES } from "@/lib/quiz-data";
import { ShareCard } from "@/components/ShareCard";
import { useCreateParticipant, useParticipants } from "@/hooks/use-participants";

type Step = "welcome" | "quiz" | "analyzing" | "result";

export default function Home() {
  const [step, setStep] = useState<Step>("welcome");
  
  // User Form State
  const [name, setName] = useState("");
  const [experienceYears, setExperienceYears] = useState<string>("");
  const [domain, setDomain] = useState("Fullstack");
  
  // Quiz State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<RoleType[]>([]);
  const [result, setResult] = useState<RoleType | null>(null);

  const cardRef = useRef<HTMLDivElement>(null);
  
  // Mutations & Queries
  const { mutateAsync: createParticipant } = useCreateParticipant();
  const { data: participants, isLoading: isLoadingParticipants } = useParticipants();

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !experienceYears.trim()) return;
    setStep("quiz");
  };

  const handleAnswer = async (roleValue: RoleType) => {
    const newAnswers = [...answers, roleValue];
    setAnswers(newAnswers);

    if (currentQuestionIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Finished Quiz
      setStep("analyzing");
      const computedResult = calculateResult(newAnswers);
      setResult(computedResult);

      try {
        // Minimum visual delay for the "analyzing" aesthetic
        await Promise.all([
          createParticipant({
            name,
            experienceYears: parseInt(experienceYears, 10),
            domain,
            resultType: computedResult
          }),
          new Promise(resolve => setTimeout(resolve, 2500))
        ]);
        setStep("result");
      } catch (err) {
        console.error("Failed to save result", err);
        // Still proceed to result even if saving fails, to not block the user
        setStep("result");
      }
    }
  };

  const handleDownload = async () => {
    if (!cardRef.current) return;
    try {
      const canvas = await html2canvas(cardRef.current, { 
        backgroundColor: '#020617', // slate-950 equivalent to ensure clean background
        scale: 2
      });
      const url = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = url;
      a.download = `dev-community-role-${name.toLowerCase().replace(/\s+/g, '-')}.png`;
      a.click();
    } catch (err) {
      console.error("Failed to generate image", err);
    }
  };

  const handleRestart = () => {
    setStep("welcome");
    setAnswers([]);
    setCurrentQuestionIndex(0);
    setResult(null);
  };

  // Calculate Community Distribution
  const distribution = participants?.reduce((acc, p) => {
    acc[p.resultType as RoleType] = (acc[p.resultType as RoleType] || 0) + 1;
    return acc;
  }, {} as Record<RoleType, number>);

  const totalParticipants = participants?.length || 0;
  const sameTypeCount = result && distribution ? (distribution[result] || 1) : 1;
  const sameTypePercentage = totalParticipants > 0 
    ? Math.round((sameTypeCount / totalParticipants) * 100) 
    : 100;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 overflow-hidden">
      
      {/* Header outside the animated steps */}
      <div className="absolute top-6 left-6 flex items-center gap-3">
        <div className="p-2 bg-slate-900 rounded-xl border border-slate-800 shadow-lg">
          <Flame className="text-orange-500 w-6 h-6" />
        </div>
        <div>
          <h1 className="font-display font-bold text-slate-200">Campfire</h1>
          <p className="text-xs text-slate-500 font-medium">개발자 커뮤니티 활동</p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        
        {/* STEP 1: WELCOME */}
        {step === "welcome" && (
          <motion.div 
            key="welcome"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-md"
          >
            <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl box-glow">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center mb-6 shadow-lg shadow-orange-500/20">
                <Flame className="text-white w-8 h-8" />
              </div>
              
              <h2 className="text-3xl font-display font-bold text-white mb-2">
                내 커뮤니티 역할 찾기
              </h2>
              <p className="text-slate-400 mb-8">
                빌더, 스토리텔러, 익스플로러 중 당신은 누구일까요? 5개의 질문을 통해 캠프파이어 테스트를 시작해보세요.
              </p>

              <form onSubmit={handleStart} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">이름</label>
                  <input
                    required
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder:text-slate-600 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                    placeholder="이름을 입력하세요"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">경력 (년)</label>
                    <input
                      required
                      type="number"
                      min="0"
                      max="50"
                      value={experienceYears}
                      onChange={(e) => setExperienceYears(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder:text-slate-600 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                      placeholder="예: 3"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">주요 도메인</label>
                    <select
                      value={domain}
                      onChange={(e) => setDomain(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all appearance-none"
                    >
                      <option value="Frontend">프론트엔드</option>
                      <option value="Backend">백엔드</option>
                      <option value="Fullstack">풀스택</option>
                      <option value="Mobile">모바일</option>
                      <option value="DevOps / SRE">데브옵스 / SRE</option>
                      <option value="Data / AI">데이터 / AI</option>
                      <option value="Design / UX">디자인 / UX</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full mt-6 flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold bg-gradient-to-r from-orange-600 to-amber-500 text-white shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/40 hover:-translate-y-0.5 transition-all duration-200"
                >
                  테스트 시작하기 <ArrowRight size={20} />
                </button>
              </form>
            </div>
          </motion.div>
        )}

        {/* STEP 2: QUIZ */}
        {step === "quiz" && (
          <motion.div
            key="quiz"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="w-full max-w-2xl"
          >
            <div className="mb-8 flex items-center gap-4">
              <div className="flex-1 h-2 bg-slate-900 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-orange-500 to-amber-400"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentQuestionIndex) / QUIZ_QUESTIONS.length) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <span className="text-sm font-medium text-slate-400 font-display">
                {currentQuestionIndex + 1} / {QUIZ_QUESTIONS.length}
              </span>
            </div>

            <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xl">
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-white mb-8 leading-tight">
                {QUIZ_QUESTIONS[currentQuestionIndex].text}
              </h2>
              
              <div className="space-y-3">
                {QUIZ_QUESTIONS[currentQuestionIndex].options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(option.roleValue)}
                    className="w-full text-left p-5 rounded-2xl border border-slate-800 bg-slate-950/50 hover:bg-slate-800 hover:border-orange-500/50 text-slate-200 hover:text-white transition-all duration-200 group flex items-center gap-4"
                  >
                    <div className="w-8 h-8 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-500 group-hover:bg-orange-500/20 group-hover:border-orange-500 group-hover:text-orange-500 transition-colors">
                      {String.fromCharCode(65 + idx)}
                    </div>
                    <span className="flex-1 text-lg">{option.text}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* STEP 3: ANALYZING */}
        {step === "analyzing" && (
          <motion.div
            key="analyzing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center text-center space-y-6"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="relative"
            >
              <div className="absolute inset-0 bg-orange-500 blur-3xl opacity-20 rounded-full" />
              <Flame size={80} className="text-orange-500 relative z-10" />
            </motion.div>
            <div className="space-y-2">
              <h2 className="text-2xl font-display font-bold text-white">결과를 분석 중입니다...</h2>
              <p className="text-slate-400 flex items-center justify-center gap-2">
                <Loader2 size={16} className="animate-spin" /> 캠프파이어 장작을 지피는 중
              </p>
            </div>
          </motion.div>
        )}

        {/* STEP 4: RESULT */}
        {step === "result" && result && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start"
          >
            {/* Left Column: The Card to Share */}
            <div className="lg:col-span-7 flex flex-col items-center">
              <ShareCard 
                ref={cardRef}
                name={name}
                domain={domain}
                experienceYears={parseInt(experienceYears, 10)}
                resultType={result}
              />
              
              <div className="flex gap-4 mt-8 w-full max-w-md">
                <button
                  onClick={handleDownload}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold bg-white text-slate-950 hover:bg-slate-200 transition-colors shadow-lg"
                >
                  <Download size={20} /> 카드 저장하기
                </button>
                <button
                  onClick={handleRestart}
                  className="flex items-center justify-center px-6 py-4 rounded-xl font-bold bg-slate-800 text-white hover:bg-slate-700 transition-colors"
                  aria-label="Restart Quiz"
                >
                  <RotateCcw size={20} />
                </button>
              </div>
            </div>

            {/* Right Column: Community Stats */}
            <div className="lg:col-span-5 bg-slate-900/50 backdrop-blur-md rounded-3xl p-8 border border-slate-800">
              <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-800">
                <div className="p-3 bg-slate-800 rounded-xl">
                  <Users className="text-blue-400 w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-xl text-white">커뮤니티 통계</h3>
                  <p className="text-sm text-slate-400">{isLoadingParticipants ? '...' : totalParticipants}명의 참여자 기반</p>
                </div>
              </div>

              {!isLoadingParticipants && distribution ? (
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-end mb-2">
                      <span className="text-slate-300 font-medium">나와 같은 유형</span>
                      <span className="text-2xl font-display font-bold text-white">{sameTypePercentage}%</span>
                    </div>
                    <p className="text-sm text-slate-500 mb-4">
                      캠프파이어 참여자 중 {sameTypePercentage}%가 당신과 같은 <strong className="text-slate-300">{DEV_ROLES[result].title}</strong> 유형입니다.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xs uppercase tracking-wider text-slate-500 font-bold mb-3">전체 유형 분포</h4>
                    {(Object.keys(DEV_ROLES) as RoleType[]).map(role => {
                      const count = distribution[role] || 0;
                      const percent = totalParticipants > 0 ? (count / totalParticipants) * 100 : 0;
                      const roleData = DEV_ROLES[role];
                      
                      return (
                        <div key={role} className="space-y-1.5">
                          <div className="flex justify-between text-sm">
                            <span className={role === result ? "text-white font-bold" : "text-slate-400"}>
                              {roleData.title} {role === result && " (나)"}
                            </span>
                            <span className="text-slate-500">{Math.round(percent)}%</span>
                          </div>
                          <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                            <div 
                              className={`h-full bg-gradient-to-r ${roleData.color} opacity-80`}
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="py-12 flex justify-center text-slate-500">
                  <Loader2 className="w-8 h-8 animate-spin" />
                </div>
              )}
            </div>
            
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
