import { jsPDF } from 'jspdf';
import { JournalEntry } from '../types';

export function exportReflectionsToText(entries: JournalEntry[], userName: string = 'Beloved Sister'): void {
  const exportDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  let textContent = '';
  textContent += '================================================================================\n';
  textContent += '              GENEROUSLEE — FAITH, WELLNESS & REFLECTION SANCTUARY               \n';
  textContent += '                         Personal Journaling Records                            \n';
  textContent += '================================================================================\n\n';
  textContent += `Owner: ${userName}\n`;
  textContent += `Export Date: ${exportDate}\n`;
  textContent += `Total Entries Recorded: ${entries.length}\n`;
  textContent += 'Scripture Verse: "Write the vision; make it plain on tablets, so he may run who reads it." — Habakkuk 2:2\n';
  textContent += '--------------------------------------------------------------------------------\n\n';

  if (entries.length === 0) {
    textContent += 'No reflections recorded yet.\n';
  } else {
    entries.forEach((entry, idx) => {
      const entryNum = entries.length - idx;
      textContent += `[ENTRY #${entryNum}] — ${entry.date}\n`;
      if (entry.moodTag) {
        textContent += `Spiritual State: ${entry.moodTag.toUpperCase()}\n`;
      }
      textContent += `Prompt: ${entry.prompt}\n`;
      if (entry.scriptureReference) {
        textContent += `Scripture Anchor: ${entry.scriptureReference}\n`;
      }
      textContent += '\nREFLECTION:\n';
      textContent += `${entry.reflectionText}\n`;

      if (entry.gratitudeNote) {
        textContent += `\nGRATITUDE OFFERING:\n${entry.gratitudeNote}\n`;
      }

      textContent += '\n' + '-'.repeat(80) + '\n\n';
    });
  }

  textContent += '================================================================================\n';
  textContent += '   Preserved with intentionality and covenant grace in GenerousLee Community    \n';
  textContent += '================================================================================\n';

  const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `GenerousLee_Reflections_${new Date().toISOString().split('T')[0]}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export async function exportReflectionsToPDF(entries: JournalEntry[], userName: string = 'Beloved Sister'): Promise<void> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'letter'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 48;
  const contentWidth = pageWidth - margin * 2;

  let y = margin;

  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - margin) {
      doc.addPage();
      y = margin;
      drawHeaderFooter();
    }
  };

  const drawHeaderFooter = () => {
    // Top subtle rule
    doc.setDrawColor(231, 223, 212); // #E7DFD4
    doc.setLineWidth(1);
    doc.line(margin, 35, pageWidth - margin, 35);

    doc.setFont('times', 'italic');
    doc.setFontSize(8);
    doc.setTextColor(168, 149, 124); // #A8957C
    doc.text('GenerousLee Private Faith & Reflection Sanctuary', margin, 28);
    doc.text(
      `Page ${doc.getNumberOfPages()}`,
      pageWidth - margin,
      28,
      { align: 'right' }
    );
  };

  // Title page / Top header
  doc.setFont('times', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(33, 28, 21); // #211C15
  doc.text('GenerousLee Journal & Daily Reflections', margin, y);
  y += 24;

  doc.setFont('times', 'italic');
  doc.setFontSize(11);
  doc.setTextColor(185, 91, 61); // #B95B3D
  doc.text('Personal Journaling Records & Spiritual Growth Cadence', margin, y);
  y += 18;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(126, 109, 86); // #7E6D56
  const dateStr = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  doc.text(`Recorded for: ${userName}  •  Exported on: ${dateStr}  •  Total Entries: ${entries.length}`, margin, y);
  y += 16;

  // Horizontal divider
  doc.setDrawColor(185, 91, 61);
  doc.setLineWidth(1.5);
  doc.line(margin, y, pageWidth - margin, y);
  y += 24;

  if (entries.length === 0) {
    doc.setFont('times', 'italic');
    doc.setFontSize(12);
    doc.setTextColor(126, 109, 86);
    doc.text('No reflections have been logged yet in your sanctuary.', margin, y);
    y += 30;
  } else {
    entries.forEach((entry, index) => {
      checkPageBreak(120);

      // Card container background simulation
      const cardStartY = y;

      // Date banner
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(185, 91, 61); // Terracotta
      doc.text(entry.date.toUpperCase(), margin, y);

      if (entry.moodTag) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(93, 112, 82); // Sage
        doc.text(`Spiritual State: ${entry.moodTag}`, margin + 120, y);
      }

      y += 16;

      // Prompt / Heading
      doc.setFont('times', 'bold');
      doc.setFontSize(13);
      doc.setTextColor(33, 28, 21);
      const promptLines = doc.splitTextToSize(entry.prompt, contentWidth);
      doc.text(promptLines, margin, y);
      y += promptLines.length * 15 + 4;

      // Scripture anchor if present
      if (entry.scriptureReference) {
        doc.setFont('times', 'italic');
        doc.setFontSize(9);
        doc.setTextColor(126, 109, 86);
        const scriptLines = doc.splitTextToSize(`Anchor: ${entry.scriptureReference}`, contentWidth);
        doc.text(scriptLines, margin, y);
        y += scriptLines.length * 12 + 8;
      }

      // Reflection body
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(56, 48, 37);
      const bodyLines = doc.splitTextToSize(entry.reflectionText, contentWidth);
      checkPageBreak(bodyLines.length * 13 + 30);
      doc.text(bodyLines, margin, y);
      y += bodyLines.length * 13 + 8;

      // Gratitude note
      if (entry.gratitudeNote) {
        checkPageBreak(40);
        doc.setFillColor(250, 240, 237); // #FAF0ED
        doc.setDrawColor(243, 221, 215); // #F3DDD7
        const gratLines = doc.splitTextToSize(`Gratitude Offering: ${entry.gratitudeNote}`, contentWidth - 16);
        const boxHeight = gratLines.length * 12 + 14;
        doc.roundedRect(margin, y, contentWidth, boxHeight, 4, 4, 'FD');
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(9);
        doc.setTextColor(185, 91, 61);
        doc.text(gratLines, margin + 8, y + 13);
        y += boxHeight + 12;
      }

      // Divider between entries
      y += 12;
      doc.setDrawColor(231, 223, 212);
      doc.setLineWidth(0.5);
      doc.line(margin, y, pageWidth - margin, y);
      y += 20;
    });
  }

  // Draw headers & page numbers on all pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    // Footer
    doc.setFont('times', 'italic');
    doc.setFontSize(8);
    doc.setTextColor(168, 149, 124);
    doc.text(
      'GenerousLee — Faith, Motherhood & Wholeness Sanctuary',
      margin,
      pageHeight - 25
    );
    doc.text(
      `Page ${i} of ${totalPages}`,
      pageWidth - margin,
      pageHeight - 25,
      { align: 'right' }
    );
  }

  doc.save(`GenerousLee_Journal_Reflections_${new Date().toISOString().split('T')[0]}.pdf`);
}
