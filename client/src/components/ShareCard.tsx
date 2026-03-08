import React, { forwardRef } from "react";
import { Flame, Code, Terminal, Sparkles } from "lucide-react";
import { DEV_ROLES, type RoleType } from "@/lib/quiz-data";

interface ShareCardProps {
  name: string;
  domain: string;
  experienceYears: number;
  resultType: RoleType;
}

export const ShareCard = forwardRef<HTMLDivElement, ShareCardProps>(
  ({ name, domain, experienceYears, resultType }, ref) => {
    const roleData = DEV_ROLES[resultType];

    return (
      <div 
        ref={ref}
        className="w-full max-w-md mx-auto relative overflow-hidden rounded-3xl bg-slate-900 border-2 border-slate-800 shadow-2xl p-8"
        style={{
          backgroundImage: `
            radial-gradient(circle at 100% 0%, hsl(var(--primary) / 0.15) 0%, transparent 50%),
            radial-gradient(circle at 0% 100%, hsl(var(--accent) / 0.1) 0%, transparent 40%)
          `
        }}
      >
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 p-6 opacity-20">
          <Terminal size={120} />
        </div>
        <div className="absolute bottom-0 left-0 p-4 opacity-10">
          <Code size={80} />
        </div>

        <div className="relative z-10 flex flex-col items-center text-center">
          <div className={`p-4 rounded-2xl mb-6 bg-gradient-to-br ${roleData.color} shadow-lg shadow-black/50`}>
            {resultType === "The Storyteller" && <Sparkles size={48} className="text-white" />}
            {resultType === "The Guide" && <Flame size={48} className="text-white" />}
            {resultType === "The Builder" && <Code size={48} className="text-white" />}
            {resultType === "The Explorer" && <Terminal size={48} className="text-white" />}
          </div>

          <h3 className="text-slate-400 font-medium uppercase tracking-wider text-sm mb-1">
            개발자 커뮤니티 아이덴티티
          </h3>
          <h1 className={`text-4xl font-display font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r ${roleData.color}`}>
            {roleData.title}
          </h1>

          <p className="text-slate-300 mb-8 leading-relaxed">
            "{roleData.description}"
          </p>

          <div className="w-full border-t border-slate-800 pt-6 mt-2 flex justify-between items-center text-left">
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">개발자</p>
              <p className="text-lg font-bold text-slate-100">{name}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">백그라운드</p>
              <p className="text-sm font-medium text-slate-300">{domain}</p>
              <p className="text-xs text-slate-400">{experienceYears}년차 경력</p>
            </div>
          </div>

          <div className="mt-8 pt-4 w-full flex items-center justify-center gap-2 text-xs text-slate-600 font-medium tracking-widest uppercase">
            <Flame size={14} className="text-orange-500" />
            캠프파이어 개발자 커뮤니티
          </div>
        </div>
      </div>
    );
  }
);

ShareCard.displayName = "ShareCard";
