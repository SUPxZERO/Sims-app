import React from 'react';
import { createPortal } from 'react-dom';
import Button from '../common/Button';
import Badge from '../common/Badge';

export const MatchRing: React.FC<{ score: number | null }> = ({ score }) => {
  const color = score === null ? '' : score >= 80 ? 'text-emerald-400' : score >= 60 ? 'text-yellow-400' : 'text-red-400';
  return (
    <div className="relative w-12 h-12 flex items-center justify-center">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
        <path className="text-slate-700" strokeWidth="3" stroke="currentColor" fill="none"
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
        {score !== null && (
          <path className={color} strokeWidth="3" strokeDasharray={`${score}, 100`}
            stroke="currentColor" fill="none" strokeLinecap="round"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
        )}
      </svg>
      <span className={`absolute text-[10px] font-bold ${score !== null ? color : 'text-slate-500'}`}>
        {score !== null ? `${score}%` : 'N/A'}
      </span>
    </div>
  );
};

const ScoreBar: React.FC<{ label: string; value: number; weight: string; color: string }> = ({ label, value, weight, color }) => (
  <div className={`p-4 rounded-xl border ${color}`}>
    <div className="flex justify-between items-center mb-2">
      <div className="text-xs font-semibold opacity-80">{label}</div>
      <div className="text-xs opacity-60">{weight}</div>
    </div>
    <div className="text-2xl font-bold">{Math.round(value)}%</div>
    <div className="mt-2 h-1.5 rounded-full bg-white/10 overflow-hidden">
      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${value}%`, background: 'currentColor', opacity: 0.6 }} />
    </div>
  </div>
);

interface JobDetailsModalProps {
  job: any;
  cvData?: any;
  applying: number | null;
  onClose: () => void;
  onApply: (listingId: number) => void;
  showMatchScore?: boolean;
}

export const JobDetailsModal: React.FC<JobDetailsModalProps> = ({ job, cvData, applying, onClose, onApply, showMatchScore = true }) => {
  if (!job) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-[#0f1623] border border-slate-700/60 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal header */}
        <div className="flex justify-between items-start p-6 border-b border-slate-800">
          <div>
            <h2 className="text-xl font-bold text-slate-100">{job.title}</h2>
            <p className="text-slate-400 text-sm">{job.company_profile?.company_name || job.company?.full_name}</p>
            <div className="flex flex-wrap gap-2 mt-3">
              <Badge variant="primary">{job.work_mode}</Badge>
              <Badge variant="info">{job.location}</Badge>
              {job.company_profile?.industry_sector && (
                <Badge variant="info">{job.company_profile.industry_sector}</Badge>
              )}
            </div>
          </div>
          {showMatchScore && (
            <div className="flex flex-col items-center gap-1 ml-4">
              <span className="text-[10px] text-slate-500">Match</span>
              <MatchRing score={job.match_score != null ? Math.round(job.match_score) : null} />
            </div>
          )}
          <button
            onClick={onClose}
            className="ml-4 text-slate-500 hover:text-slate-200 text-2xl leading-none transition-colors self-start"
          >×</button>
        </div>

        {/* Modal body */}
        <div className="p-6 overflow-y-auto space-y-8 flex-1">

          {/* Score breakdown */}
          {showMatchScore && (
            <div>
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">
                Match Breakdown
              </h3>
              {job.match_details ? (
                <div className="grid grid-cols-3 gap-3">
                  <ScoreBar label="Skills" weight="60% weight"
                    value={job.match_details.skill_match_score}
                    color="border-blue-500/20 bg-blue-500/5 text-blue-400" />
                  <ScoreBar label="GPA" weight="20% weight"
                    value={job.match_details.gpa_match_score}
                    color="border-emerald-500/20 bg-emerald-500/5 text-emerald-400" />
                  <ScoreBar label="Preferences" weight="20% weight"
                    value={job.match_details.preference_match_score}
                    color="border-purple-500/20 bg-purple-500/5 text-purple-400" />
                </div>
              ) : (
                <div className="text-slate-500 text-sm p-4 bg-slate-800/50 rounded-lg">
                  Scores not calculated yet — click <strong>Refresh Match Scores</strong> on the main page.
                </div>
              )}
            </div>
          )}

          {/* Internship details */}
          <div>
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Internship Details
            </h3>
            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="p-3 bg-slate-800/50 rounded-lg">
                <span className="text-[11px] text-slate-500 block mb-1">Duration</span>
                <span className="text-sm font-semibold text-slate-200">{job.duration_weeks} Weeks</span>
              </div>
              <div className="p-3 bg-slate-800/50 rounded-lg">
                <span className="text-[11px] text-slate-500 block mb-1">Quota</span>
                <span className="text-sm font-semibold text-slate-200">{job.quota} slots</span>
              </div>
              <div className="p-3 bg-slate-800/50 rounded-lg">
                <span className="text-[11px] text-slate-500 block mb-1">Min. GPA</span>
                <span className="text-sm font-semibold text-slate-200">{job.min_gpa ?? 'No requirement'}</span>
              </div>
              <div className="p-3 bg-slate-800/50 rounded-lg">
                <span className="text-[11px] text-slate-500 block mb-1">Deadline</span>
                <span className="text-sm font-semibold text-slate-200">{new Date(job.application_deadline).toLocaleDateString()}</span>
              </div>
            </div>
            <p className="whitespace-pre-wrap text-slate-300 leading-relaxed text-sm mb-4">
              {job.description}
            </p>
            {job.requirements && (
               <p className="whitespace-pre-wrap text-slate-300 leading-relaxed text-sm">
                 <strong>Requirements:</strong><br/>{job.requirements}
               </p>
            )}
            {job.stipend_info && (
               <p className="whitespace-pre-wrap text-slate-300 leading-relaxed text-sm mt-4">
                 <strong>Stipend Info:</strong><br/>{job.stipend_info}
               </p>
            )}
          </div>
          
          {/* Company Profile details */}
          {job.company_profile && (
            <div>
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                Company Information
                {job.company_profile.is_verified && (
                  <span className="text-emerald-400 text-xs px-2 py-0.5 bg-emerald-500/10 rounded-full flex items-center gap-1 border border-emerald-500/20">
                    ✅ Verified
                  </span>
                )}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-1">
                  <span className="text-[11px] text-slate-500">Company Size</span>
                  <p className="text-sm text-slate-200">{job.company_profile.company_size || 'N/A'}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[11px] text-slate-500">Website</span>
                  {job.company_profile.company_website ? (
                    <a href={job.company_profile.company_website} target="_blank" rel="noreferrer" className="text-sm text-blue-400 hover:underline flex items-center gap-1">
                      {job.company_profile.company_website}
                      <span className="text-xs">↗</span>
                    </a>
                  ) : (
                    <p className="text-sm text-slate-500">N/A</p>
                  )}
                </div>
                <div className="space-y-1">
                  <span className="text-[11px] text-slate-500">Address</span>
                  <p className="text-sm text-slate-200">{job.company_profile.company_address || 'N/A'}, {job.company_profile.company_city || ''}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[11px] text-slate-500">Contact Person</span>
                  <p className="text-sm text-slate-200">
                    {job.company_profile.contact_person_name || 'N/A'}
                    {job.company_profile.contact_phone ? ` (${job.company_profile.contact_phone})` : ''}
                  </p>
                </div>
              </div>
              
              {job.company_profile.company_description && (
                <div className="mt-4">
                  <span className="text-[11px] text-slate-500 mb-1 block">About the Company</span>
                  <p className="whitespace-pre-wrap text-slate-300 leading-relaxed text-sm">
                    {job.company_profile.company_description}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Skill analysis */}
          {job.listing_required_skills?.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">
                Required Skills
                {showMatchScore && (
                  <span className="ml-2 text-slate-500 normal-case font-normal text-xs">
                    ({job.match_details?.matched_skills_count ?? '?'} / {job.listing_required_skills.length} matched)
                  </span>
                )}
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {job.listing_required_skills.map((reqSkill: any) => {
                  const hasSkill = cvData?.skills?.some((cvs: any) => cvs.skill_id === reqSkill.skill_id);
                  const studentSkill = cvData?.skills?.find((cvs: any) => cvs.skill_id === reqSkill.skill_id);
                  return (
                    <div
                      key={reqSkill.listing_skill_id}
                      className={`flex items-center gap-3 p-3 rounded-lg border ${
                        hasSkill
                          ? 'border-emerald-500/25 bg-emerald-500/10'
                          : 'border-slate-700/40 bg-slate-800/30'
                      }`}
                    >
                      <span className="text-lg shrink-0">{hasSkill ? '✅' : '❌'}</span>
                      <div className="min-w-0">
                        <div className={`font-semibold text-sm truncate ${hasSkill ? 'text-emerald-300' : 'text-slate-400'}`}>
                          {reqSkill.skill?.skill_name}
                        </div>
                        <div className="text-[11px] text-slate-500 flex gap-2">
                          <span>{reqSkill.importance}</span>
                          {hasSkill && studentSkill?.pivot?.proficiency_level && (
                            <span className="text-emerald-600">· {studentSkill.pivot.proficiency_level}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>

        {/* Modal footer */}
        <div className="p-5 border-t border-slate-800 bg-slate-900/60 flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>Close</Button>
          <Button
            onClick={() => onApply(job.listing_id)}
            disabled={applying === job.listing_id}
          >
            {applying === job.listing_id ? 'Submitting…' : 'Apply Now'}
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
};
