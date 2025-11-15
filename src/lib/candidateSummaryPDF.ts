import jsPDF from 'jspdf';

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  score?: number;
  fit?: string;
  experience_years: number;
  skills: string[];
  appliedDate: string;
  fileName: string;
}

export interface RoleSummaryData {
  roleTitle: string;
  candidates: Candidate[];
}

export const generateCandidateSummaryPDF = (data: RoleSummaryData) => {
  const doc = new jsPDF();
  const { roleTitle, candidates } = data;

  let yPosition = 20;
  const pageWidth = 210; // A4 width in mm
  const pageHeight = 297; // A4 height in mm
  const margin = 20;
  const contentWidth = pageWidth - (2 * margin);

  // Helper function to check if we need a new page
  const checkPageBreak = (requiredSpace: number) => {
    if (yPosition + requiredSpace > pageHeight - margin) {
      doc.addPage();
      yPosition = margin;
      return true;
    }
    return false;
  };

  // Helper function to add wrapped text
  const addWrappedText = (text: string, x: number, fontSize: number, maxWidth: number, fontStyle: 'normal' | 'bold' = 'normal') => {
    doc.setFont('helvetica', fontStyle);
    doc.setFontSize(fontSize);
    const lines = doc.splitTextToSize(text, maxWidth);
    lines.forEach((line: string) => {
      checkPageBreak(7);
      doc.text(line, x, yPosition);
      yPosition += fontSize * 0.5;
    });
  };

  // Header
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('Candidate Summary Report', margin, yPosition);
  yPosition += 10;

  doc.setFontSize(16);
  doc.setFont('helvetica', 'normal');
  doc.text(roleTitle, margin, yPosition);
  yPosition += 8;

  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`, margin, yPosition);
  doc.text(`Total Candidates: ${candidates.length}`, pageWidth - margin - 40, yPosition);
  yPosition += 10;

  // Divider Line
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.5);
  doc.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 10;

  // Executive Summary Section
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('Executive Summary', margin, yPosition);
  yPosition += 8;

  const avgScore = candidates.length > 0
    ? Math.round(candidates.reduce((sum, c) => sum + (c.score || 0), 0) / candidates.length)
    : 0;
  const topCandidates = candidates.filter(c => c.score && c.score >= 85);
  const excellentFit = candidates.filter(c => c.fit === 'excellent');

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Average Match Score: ${avgScore}%`, margin, yPosition);
  yPosition += 6;
  doc.text(`Top Candidates (>=85%): ${topCandidates.length}`, margin, yPosition);
  yPosition += 6;
  doc.text(`Excellent Fit: ${excellentFit.length}`, margin, yPosition);
  yPosition += 12;

  // Skill Distribution Section
  checkPageBreak(40);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Top Skills', margin, yPosition);
  yPosition += 8;

  const skillCounts: Record<string, number> = {};
  candidates.forEach(c => c.skills.forEach(skill => {
    skillCounts[skill] = (skillCounts[skill] || 0) + 1;
  }));

  const topSkills = Object.entries(skillCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  topSkills.forEach(([skill, count]) => {
    checkPageBreak(6);
    doc.text(`• ${skill}`, margin + 5, yPosition);
    doc.text(`${count} candidate${count > 1 ? 's' : ''}`, pageWidth - margin - 30, yPosition);
    yPosition += 6;
  });
  yPosition += 8;

  // Top Candidates Section
  if (topCandidates.length > 0) {
    checkPageBreak(40);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Top Candidates', margin, yPosition);
    yPosition += 8;

    topCandidates.forEach((candidate, index) => {
      checkPageBreak(30);

      // Candidate header with score
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text(`${index + 1}. ${candidate.name}`, margin, yPosition);

      // Score badge
      doc.setFillColor(59, 130, 246); // Blue color
      doc.roundedRect(pageWidth - margin - 25, yPosition - 4, 25, 8, 2, 2, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(10);
      doc.text(`${candidate.score}%`, pageWidth - margin - 17, yPosition + 1);
      doc.setTextColor(0, 0, 0);
      yPosition += 8;

      // Candidate details
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text(`Email: ${candidate.email}`, margin + 5, yPosition);
      yPosition += 5;
      doc.text(`Phone: ${candidate.phone}`, margin + 5, yPosition);
      yPosition += 5;
      doc.text(`Experience: ${candidate.experience_years} years`, margin + 5, yPosition);
      yPosition += 5;
      doc.text(`Fit: ${candidate.fit || 'N/A'}`, margin + 5, yPosition);
      yPosition += 5;

      // Skills (wrapped)
      const skillsText = `Skills: ${candidate.skills.slice(0, 8).join(', ')}${candidate.skills.length > 8 ? '...' : ''}`;
      const skillLines = doc.splitTextToSize(skillsText, contentWidth - 10);
      skillLines.forEach((line: string) => {
        checkPageBreak(5);
        doc.text(line, margin + 5, yPosition);
        yPosition += 5;
      });

      yPosition += 6;
    });
  }

  // All Candidates Section
  checkPageBreak(40);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('All Candidates', margin, yPosition);
  yPosition += 8;

  // Sort candidates by score
  const sortedCandidates = [...candidates].sort((a, b) => (b.score || 0) - (a.score || 0));

  sortedCandidates.forEach((candidate, index) => {
    checkPageBreak(25);

    // Candidate name and rank
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(`${index + 1}. ${candidate.name}`, margin, yPosition);

    // Score
    if (candidate.score) {
      doc.setFont('helvetica', 'normal');
      doc.text(`${candidate.score}%`, pageWidth - margin - 20, yPosition);
    }
    yPosition += 6;

    // Details in two columns
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`${candidate.email}`, margin + 5, yPosition);
    doc.text(`${candidate.experience_years} years exp`, pageWidth - margin - 45, yPosition);
    yPosition += 5;
    doc.text(`${candidate.phone}`, margin + 5, yPosition);
    if (candidate.fit) {
      doc.text(`Fit: ${candidate.fit}`, pageWidth - margin - 45, yPosition);
    }
    yPosition += 5;

    // Skills (limited to fit on one or two lines)
    const limitedSkills = candidate.skills.slice(0, 6).join(', ');
    const skillText = `Skills: ${limitedSkills}${candidate.skills.length > 6 ? `, +${candidate.skills.length - 6} more` : ''}`;
    const lines = doc.splitTextToSize(skillText, contentWidth - 10);
    lines.forEach((line: string, i: number) => {
      if (i < 2) { // Limit to 2 lines
        checkPageBreak(5);
        doc.text(line, margin + 5, yPosition);
        yPosition += 5;
      }
    });

    yPosition += 6;
  });

  // Recommendations Section
  checkPageBreak(40);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Recommendations', margin, yPosition);
  yPosition += 8;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');

  const recommendations = [
    `Schedule interviews with the top ${Math.min(3, topCandidates.length)} candidates scoring above 85%`,
    `${excellentFit.length} candidate${excellentFit.length !== 1 ? 's' : ''} show excellent fit and should be prioritized`,
    `Focus on candidates with strong experience in: ${topSkills.slice(0, 3).map(([s]) => s).join(', ')}`
  ];

  recommendations.forEach(rec => {
    checkPageBreak(10);
    const lines = doc.splitTextToSize(`• ${rec}`, contentWidth - 10);
    lines.forEach((line: string) => {
      doc.text(line, margin + 5, yPosition);
      yPosition += 6;
    });
  });

  // Footer on last page
  yPosition = pageHeight - margin;
  doc.setFontSize(9);
  doc.setTextColor(128, 128, 128);
  doc.text('ParseScore - Automated CV Parsing & Scoring', margin, yPosition);
  doc.text(`Page ${doc.getNumberOfPages()}`, pageWidth - margin - 20, yPosition);

  // Add page numbers to all pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(9);
    doc.setTextColor(128, 128, 128);
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin - 25, pageHeight - margin + 5);
  }

  // Generate filename
  const filename = `${roleTitle.replace(/\s+/g, '-').toLowerCase()}-summary-${Date.now()}.pdf`;

  // Download the PDF
  doc.save(filename);
};
