import React from 'react';
import Badge from '../common/Badge';
import api from '../../services/api';

interface CvViewerProps {
  cvData: any;
  studentProfile?: any;
}

export const CvViewer: React.FC<CvViewerProps> = ({ cvData, studentProfile }) => {
  if (!cvData) return null;

  const handleDownloadDocument = async (docId: number, fileName: string) => {
    try {
      const response = await api.get(`/cv/documents/${docId}/download`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (err: any) {
      alert('Failed to download document.');
    }
  };

  const personalSummary = cvData.personal_summary;
  const skills = cvData.skills || [];
  const educations = cvData.educations || [];
  const experiences = cvData.experiences || [];
  const documents = cvData.documents || [];

  return (
    <div className="space-y-6 p-6 bg-slate-800/50 rounded-lg border border-slate-700 w-full max-w-4xl mx-auto">
      {personalSummary && (
        <div>
          <h4 className="text-sm font-semibold text-slate-200 mb-2 uppercase tracking-wider">About</h4>
          <p className="text-sm text-slate-400 leading-relaxed">{personalSummary}</p>
        </div>
      )}

      {skills && skills.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-slate-200 mb-3 uppercase tracking-wider">Skills</h4>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill: any, idx: number) => {
              const skillName = skill.name || skill.skill_name || skill.skill?.skill_name || skill.skill?.name || 'Unknown Skill';
              const profLevel = skill.proficiency_level || skill.pivot?.proficiency_level || '';
              return (
                <Badge key={skill.skill_id || idx} variant="info">
                  {skillName} {profLevel ? `(${profLevel})` : ''}
                </Badge>
              );
            })}
          </div>
        </div>
      )}

      {educations && educations.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-slate-200 mb-3 uppercase tracking-wider">Education</h4>
          <div className="space-y-4">
            {educations.map((edu: any, i: number) => (
              <div key={i} className="border-l-2 border-blue-500/50 pl-4 relative before:absolute before:w-2 before:h-2 before:bg-blue-500 before:rounded-full before:-left-[5px] before:top-1.5">
                <h5 className="text-sm font-bold text-slate-200">{edu.degree} in {edu.field_of_study}</h5>
                <p className="text-sm text-slate-400">{edu.institution_name}</p>
                <p className="text-xs text-slate-500 mt-1">
                  {new Date(edu.start_date).getFullYear()} - {edu.end_date ? new Date(edu.end_date).getFullYear() : 'Present'}
                  {edu.gpa ? ` | GPA: ${edu.gpa}` : ''}
                </p>
                {edu.description && <p className="text-sm text-slate-400 mt-2">{edu.description}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {experiences && experiences.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-slate-200 mb-3 uppercase tracking-wider">Experience</h4>
          <div className="space-y-4">
            {experiences.map((exp: any, i: number) => (
              <div key={i} className="border-l-2 border-emerald-500/50 pl-4 relative before:absolute before:w-2 before:h-2 before:bg-emerald-500 before:rounded-full before:-left-[5px] before:top-1.5">
                <h5 className="text-sm font-bold text-slate-200">{exp.position_title}</h5>
                <p className="text-sm text-slate-400">{exp.company_name}</p>
                <p className="text-xs text-slate-500 mt-1">{new Date(exp.start_date).toLocaleDateString()} - {exp.end_date ? new Date(exp.end_date).toLocaleDateString() : 'Present'}</p>
                {exp.description && <p className="text-sm text-slate-400 mt-2">{exp.description}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {documents && documents.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-slate-200 mb-3 uppercase tracking-wider">Attached Documents</h4>
          <div className="space-y-2">
            {documents.map((doc: any, i: number) => (
              <div key={i} className="flex justify-between items-center bg-slate-900/50 p-4 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors">
                <div>
                  <h5 className="text-sm font-bold text-slate-200">{doc.document_label}</h5>
                  <p className="text-xs text-slate-400">{doc.file_name}</p>
                </div>
                <button
                  onClick={() => handleDownloadDocument(doc.cv_document_id, doc.file_name)}
                  className="text-xs px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {studentProfile && (
        <div className="grid grid-cols-2 gap-6 text-sm mt-6 pt-6 border-t border-slate-700">
          <div className="bg-slate-900/50 p-4 rounded-lg">
            <span className="text-slate-500 block text-xs uppercase font-semibold mb-1">Major</span>
            <span className="text-slate-200 font-medium">{studentProfile.major || 'N/A'}</span>
          </div>
          <div className="bg-slate-900/50 p-4 rounded-lg">
            <span className="text-slate-500 block text-xs uppercase font-semibold mb-1">GPA</span>
            <span className="text-slate-200 font-medium">{studentProfile.gpa || 'N/A'}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CvViewer;
