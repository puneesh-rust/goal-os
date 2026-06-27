/**
 * useRoadmapPDF.js
 * Custom hook — generates a styled PDF from the roadmap data using jsPDF.
 * Pure client-side, no backend needed.
 *
 * Install deps:
 *   npm install jspdf
 */

import { useState } from 'react';
import { jsPDF } from 'jspdf';

// ── Colour palette (matches GoalOS dark theme as readable light PDF) ──────────
const C = {
  bg:          [255, 255, 255],
  pageBg:      [248, 249, 252],
  primary:     [99,  102, 241],   // indigo-500
  primaryDark: [67,  56,  202],   // indigo-700
  emerald:     [16,  185, 129],
  textDark:    [15,  23,  42],    // slate-900
  textMid:     [71,  85,  105],   // slate-600
  textLight:   [148, 163, 184],   // slate-400
  border:      [226, 232, 240],   // slate-200
  cardBg:      [241, 245, 249],   // slate-100
  tagBg:       [238, 242, 255],   // indigo-50
  successBg:   [236, 253, 245],   // emerald-50
  successText: [6,   95,  70],    // emerald-900
};

// ── Helpers ───────────────────────────────────────────────────────────────────
const hex = (rgb) => `#${rgb.map(v => v.toString(16).padStart(2,'0')).join('')}`;

const setFill   = (doc, rgb) => doc.setFillColor(...rgb);
const setStroke = (doc, rgb) => doc.setDrawColor(...rgb);
const setTxt    = (doc, rgb) => doc.setTextColor(...rgb);

// Word-wrap text to fit maxWidth, returns array of lines
const wrapText = (doc, text, maxWidth) => doc.splitTextToSize(String(text || ''), maxWidth);

// Rounded rect helper (jsPDF built-in)
const rRect = (doc, x, y, w, h, r, style = 'F') =>
  doc.roundedRect(x, y, w, h, r, r, style);

// ── Page layout constants ─────────────────────────────────────────────────────
const PAGE_W  = 210;   // A4 mm
const PAGE_H  = 297;
const MARGIN  = 14;
const CONTENT = PAGE_W - MARGIN * 2;   // 182 mm

// ── Main hook ─────────────────────────────────────────────────────────────────
export const useRoadmapPDF = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePDF = async (roadmap) => {
    if (!roadmap) return;
    setIsGenerating(true);

    try {
      const doc = new jsPDF({ unit: 'mm', format: 'a4', compress: true });
      let y = 0;   // current Y cursor

      // ── Page background ───────────────────────────────────────────────────
      const addPageBg = () => {
        setFill(doc, C.bg);
        doc.rect(0, 0, PAGE_W, PAGE_H, 'F');
        // Subtle left accent bar
        setFill(doc, C.primary);
        doc.rect(0, 0, 3, PAGE_H, 'F');
      };

      // ── New page helper ───────────────────────────────────────────────────
      const newPage = () => {
        doc.addPage();
        addPageBg();
        y = MARGIN;
        addPageNumber();
      };

      // ── Page number footer ────────────────────────────────────────────────
      const addPageNumber = () => {
        const n = doc.getNumberOfPages();
        doc.setFontSize(8);
        setTxt(doc, C.textLight);
        doc.text(`GoalOS  ·  Page ${n}`, PAGE_W / 2, PAGE_H - 6, { align: 'center' });
      };

      // ── Auto-page-break check ─────────────────────────────────────────────
      const needsPage = (requiredHeight) => {
        if (y + requiredHeight > PAGE_H - 18) { newPage(); return true; }
        return false;
      };

      // ── Section heading ───────────────────────────────────────────────────
      const sectionHeading = (icon, label, color = C.primary) => {
        needsPage(12);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        setTxt(doc, color);
        doc.text(`${icon}  ${label.toUpperCase()}`, MARGIN + 3, y);
        y += 2;
        setStroke(doc, color);
        doc.setLineWidth(0.4);
        doc.line(MARGIN + 3, y, MARGIN + 3 + 60, y);
        y += 5;
      };

      // ── Pill / tag ────────────────────────────────────────────────────────
      const pill = (text, x, py, bgColor, textColor) => {
        doc.setFontSize(7);
        doc.setFont('helvetica', 'bold');
        const w = doc.getTextWidth(text) + 5;
        setFill(doc, bgColor);
        rRect(doc, x, py - 3.5, w, 5, 1.5);
        setTxt(doc, textColor);
        doc.text(text, x + 2.5, py);
        return w;
      };

      // ── Checkbox row ──────────────────────────────────────────────────────
      const checkRow = (text, completed, indent) => {
        const lines = wrapText(doc, text, CONTENT - indent - 10);
        const rowH  = lines.length * 4.5 + 2;
        needsPage(rowH + 2);

        const boxX = MARGIN + indent;
        const boxY = y - 3;

        // Box
        setStroke(doc, completed ? C.emerald : C.border);
        doc.setLineWidth(0.5);
        if (completed) {
          setFill(doc, C.emerald);
          rRect(doc, boxX, boxY, 4, 4, 0.8, 'FD');
          // Tick
          setStroke(doc, C.bg);
          doc.setLineWidth(0.7);
          doc.line(boxX + 0.9, boxY + 2.1, boxX + 1.8, boxY + 3.1);
          doc.line(boxX + 1.8, boxY + 3.1, boxX + 3.2, boxY + 0.8);
        } else {
          setFill(doc, C.bg);
          rRect(doc, boxX, boxY, 4, 4, 0.8, 'FD');
        }

        // Text
        doc.setFontSize(8.5);
        doc.setFont('helvetica', completed ? 'normal' : 'normal');
        setTxt(doc, completed ? C.textLight : C.textDark);
        doc.text(lines, boxX + 6, y);
        y += rowH;
      };

      // ══════════════════════════════════════════════════════════════════════
      // PAGE 1 — Cover
      // ══════════════════════════════════════════════════════════════════════
      addPageBg();

      // Big indigo header band
      setFill(doc, C.primaryDark);
      doc.rect(0, 0, PAGE_W, 72, 'F');

      // GoalOS wordmark
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      setTxt(doc, [199, 210, 254]);   // indigo-200
      doc.text('GOAL', MARGIN + 3, 18);
      setTxt(doc, C.primary);
      doc.text('OS', MARGIN + 3 + doc.getTextWidth('GOAL') + 1, 18);

      // Category pill (white on dark)
      pill(
        (roadmap.category || 'General').toUpperCase(),
        MARGIN + 3,
        30,
        [79, 70, 229],   // indigo-600
        [224, 231, 255]  // indigo-100
      );

      // Goal title
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      setTxt(doc, C.bg);
      const titleLines = wrapText(doc, roadmap.goal, CONTENT - 6);
      doc.text(titleLines, MARGIN + 3, 42);

      // Meta row
      y = titleLines.length > 1 ? 56 : 52;
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      setTxt(doc, [199, 210, 254]);
      doc.text(`⏱  ${roadmap.estimatedTime || '—'}`, MARGIN + 3, y);
      doc.text(`⚡  ${roadmap.difficulty || '—'}`, MARGIN + 50, y);

      y = 84;

      // ── Stats cards row ───────────────────────────────────────────────────
      const allTasks   = roadmap.weekly?.flatMap(w => w.tasks) || [];
      const doneCount  = allTasks.filter(t => t.completed).length;
      const totalCount = allTasks.length;
      const pct        = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

      const statCards = [
        { label: 'Weekly Tasks',   value: `${totalCount}`,          sub: 'total tasks'       },
        { label: 'Completed',      value: `${doneCount}`,           sub: 'tasks done'        },
        { label: 'Progress',       value: `${pct}%`,                sub: 'overall'           },
        { label: 'Monthly Goals',  value: `${roadmap.monthly?.length || 0}`, sub: 'milestones' },
      ];

      const cardW = (CONTENT - 6) / 4;
      statCards.forEach((card, i) => {
        const cx = MARGIN + 3 + i * (cardW + 2);
        setFill(doc, C.cardBg);
        setStroke(doc, C.border);
        doc.setLineWidth(0.3);
        rRect(doc, cx, y, cardW, 22, 2, 'FD');

        doc.setFontSize(7);
        doc.setFont('helvetica', 'bold');
        setTxt(doc, C.textLight);
        doc.text(card.label.toUpperCase(), cx + 3, y + 6);

        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        setTxt(doc, C.primaryDark);
        doc.text(card.value, cx + 3, y + 15);

        doc.setFontSize(7);
        doc.setFont('helvetica', 'normal');
        setTxt(doc, C.textLight);
        doc.text(card.sub, cx + 3, y + 20);
      });

      y += 30;

      // ── Progress bar ──────────────────────────────────────────────────────
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      setTxt(doc, C.textMid);
      doc.text('OVERALL PROGRESS', MARGIN + 3, y);
      doc.text(`${pct}%`, PAGE_W - MARGIN - 3, y, { align: 'right' });
      y += 4;

      setFill(doc, C.border);
      rRect(doc, MARGIN + 3, y, CONTENT - 6, 4, 2);
      if (pct > 0) {
        setFill(doc, pct === 100 ? C.emerald : C.primary);
        rRect(doc, MARGIN + 3, y, Math.max(4, (CONTENT - 6) * pct / 100), 4, 2);
      }
      y += 12;

      // ── Daily habits summary on cover ─────────────────────────────────────
      if (roadmap.daily?.length) {
        sectionHeading('✦', 'Daily Habits');
        roadmap.daily.forEach(task => {
          checkRow(task.title, task.completed, 0);
        });
        y += 4;
      }

      addPageNumber();

      // ══════════════════════════════════════════════════════════════════════
      // PAGE 2+ — Monthly Plan
      // ══════════════════════════════════════════════════════════════════════
      if (roadmap.monthly?.length) {
        newPage();
        sectionHeading('◈', 'Monthly Plan', C.primaryDark);

        roadmap.monthly.forEach((month, mi) => {
          needsPage(30);

          // Month card
          setFill(doc, C.tagBg);
          setStroke(doc, [199, 210, 254]);
          doc.setLineWidth(0.4);
          const descLines = wrapText(doc, month.description, CONTENT - 22);
          const cardH = 14 + descLines.length * 4.5;
          rRect(doc, MARGIN + 3, y, CONTENT - 6, cardH, 2, 'FD');

          // Month number circle
          setFill(doc, C.primary);
          doc.circle(MARGIN + 10, y + 7, 4, 'F');
          doc.setFontSize(9);
          doc.setFont('helvetica', 'bold');
          setTxt(doc, C.bg);
          doc.text(`${mi + 1}`, MARGIN + 10, y + 9.2, { align: 'center' });

          // Title
          doc.setFontSize(10);
          doc.setFont('helvetica', 'bold');
          setTxt(doc, C.primaryDark);
          doc.text(month.title || `Month ${mi + 1}`, MARGIN + 17, y + 8);

          // Description
          doc.setFontSize(8);
          doc.setFont('helvetica', 'normal');
          setTxt(doc, C.textMid);
          doc.text(descLines, MARGIN + 17, y + 13);

          y += cardH + 5;
        });
      }

      // ══════════════════════════════════════════════════════════════════════
      // PAGE(S) — Weekly Plan
      // ══════════════════════════════════════════════════════════════════════
      if (roadmap.weekly?.length) {
        newPage();
        sectionHeading('◉', 'Weekly Roadmap', C.primaryDark);

        roadmap.weekly.forEach((week, wi) => {
          const weekTasksDone  = week.tasks?.filter(t => t.completed).length || 0;
          const weekTasksTotal = week.tasks?.length || 0;
          const weekPct        = weekTasksTotal > 0 ? Math.round((weekTasksDone / weekTasksTotal) * 100) : 0;
          const weekComplete   = weekPct === 100;

          // Estimate block height
          const titleLines = wrapText(doc, week.title, CONTENT - 20);
          const descLines  = wrapText(doc, week.description, CONTENT - 20);
          const blockH = 18 + titleLines.length * 5 + descLines.length * 4 + weekTasksTotal * 8 + 8;

          needsPage(Math.min(blockH, 60));

          // Week card background
          setFill(doc, weekComplete ? C.successBg : C.cardBg);
          setStroke(doc, weekComplete ? C.emerald : C.border);
          doc.setLineWidth(weekComplete ? 0.6 : 0.3);
          rRect(doc, MARGIN + 3, y, CONTENT - 6, blockH, 2.5, 'FD');

          // Left accent stripe
          setFill(doc, weekComplete ? C.emerald : C.primary);
          doc.roundedRect(MARGIN + 3, y, 3, blockH, 1.5, 1.5, 'F');

          const innerX = MARGIN + 9;
          const innerW = CONTENT - 18;
          let iy = y + 7;

          // Week label + progress pill
          doc.setFontSize(7);
          doc.setFont('helvetica', 'bold');
          setTxt(doc, weekComplete ? C.emerald : C.primary);
          doc.text(`WEEK ${wi + 1}`, innerX, iy);

          // Right: tasks done
          doc.setFontSize(7);
          setTxt(doc, C.textLight);
          doc.text(`${weekTasksDone}/${weekTasksTotal} tasks`, MARGIN + CONTENT - 9, iy, { align: 'right' });
          iy += 5;

          // Title
          doc.setFontSize(10);
          doc.setFont('helvetica', 'bold');
          setTxt(doc, weekComplete ? C.successText : C.textDark);
          doc.text(titleLines, innerX, iy);
          iy += titleLines.length * 5 + 1;

          // Description
          doc.setFontSize(8);
          doc.setFont('helvetica', 'normal');
          setTxt(doc, C.textMid);
          doc.text(descLines, innerX, iy);
          iy += descLines.length * 4 + 3;

          // Mini progress bar
          setFill(doc, C.border);
          rRect(doc, innerX, iy, innerW, 2, 1);
          if (weekPct > 0) {
            setFill(doc, weekComplete ? C.emerald : C.primary);
            rRect(doc, innerX, iy, Math.max(3, innerW * weekPct / 100), 2, 1);
          }
          iy += 6;

          // Task checkboxes
          const savedY = y;
          y = iy;
          week.tasks?.forEach(task => {
            needsPage(8);
            checkRow(task.title, task.completed, 6);
          });

          y = Math.max(y, savedY + blockH) + 5;
        });
      }

      // ══════════════════════════════════════════════════════════════════════
      // Back cover strip
      // ══════════════════════════════════════════════════════════════════════
      needsPage(20);
      setFill(doc, C.primaryDark);
      doc.rect(MARGIN + 3, y, CONTENT - 6, 14, 'F');
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      setTxt(doc, C.bg);
      doc.text('Generated with GoalOS', MARGIN + 8, y + 6);
      doc.setFontSize(7.5);
      doc.setFont('helvetica', 'normal');
      setTxt(doc, [199, 210, 254]);
      doc.text(new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }), MARGIN + 8, y + 11);

      // ── Save ─────────────────────────────────────────────────────────────
      const filename = `GoalOS_${(roadmap.goal || 'roadmap')
        .replace(/[^a-z0-9]/gi, '_')
        .replace(/_+/g, '_')
        .substring(0, 40)}.pdf`;

      doc.save(filename);

    } catch (err) {
      console.error('PDF generation failed:', err);
      alert('PDF generation failed. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return { generatePDF, isGenerating };
};