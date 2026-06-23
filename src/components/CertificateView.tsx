import React, { useRef, useEffect } from 'react';
import { Award, Download, Share2, X, Check, ShieldCheck } from 'lucide-react';

interface CertificateViewProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle: string;
  recipientName: string;
  badgeLabel: string;
  badgeChar: string;
  sealColor: string; // 'sky' | 'red' | 'neutral'
  dateString: string;
  description: string;
}

export const CertificateView: React.FC<CertificateViewProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  recipientName,
  badgeLabel,
  badgeChar,
  sealColor,
  dateString,
  description
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!isOpen || !canvasRef.current) return;
    drawCertificate();
  }, [isOpen, title, subtitle, recipientName, badgeLabel, badgeChar, sealColor, dateString]);

  const drawCertificate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // High-resolution landscape layout (1600 x 1130 px, standard land A4 / Golden ratio)
    canvas.width = 1600;
    canvas.height = 1130;

    const w = canvas.width;
    const h = canvas.height;

    // 1. Double gradient elegant background (Soft satin cream + subtle washi fiber texture effect)
    const baseGrad = ctx.createRadialGradient(w / 2, h / 2, 80, w / 2, h / 2, w / 2 + 100);
    baseGrad.addColorStop(0, '#FFFDF8');
    baseGrad.addColorStop(0.7, '#FAF5E8');
    baseGrad.addColorStop(1, '#F0E6CD');
    ctx.fillStyle = baseGrad;
    ctx.fillRect(0, 0, w, h);

    // Apply fine washi noise texture
    ctx.fillStyle = 'rgba(212, 175, 55, 0.02)';
    for (let i = 0; i < 2000; i++) {
      const rx = Math.random() * w;
      const ry = Math.random() * h;
      const rw = Math.random() * 2 + 1;
      const rh = Math.random() * 2 + 1;
      ctx.fillRect(rx, ry, rw, rh);
    }

    // 2. Draw Luxurious Gold-Embossed Outer Border Details
    const goldGrad = ctx.createLinearGradient(0, 0, w, h);
    goldGrad.addColorStop(0, '#D4AF37');
    goldGrad.addColorStop(0.3, '#FFF3CD');
    goldGrad.addColorStop(0.5, '#C5A02B');
    goldGrad.addColorStop(0.7, '#FFF3CD');
    goldGrad.addColorStop(1, '#947214');

    // Thick gold border frame
    ctx.strokeStyle = goldGrad;
    ctx.lineWidth = 14;
    ctx.strokeRect(50, 50, w - 100, h - 100);

    // Dynamic inner red double layout lines ('Seal' border detail)
    ctx.strokeStyle = '#BC2F32';
    ctx.lineWidth = 2;
    ctx.strokeRect(63, 63, w - 126, h - 126);
    ctx.strokeRect(69, 69, w - 138, h - 138);

    // Inside decorative corners (gold and red brackets)
    const drawFineCorner = (cx: number, cy: number, dx: number, dy: number) => {
      ctx.strokeStyle = '#BC2F32';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(cx, cy + dy * 45);
      ctx.lineTo(cx, cy);
      ctx.lineTo(cx + dx * 45, cy);
      ctx.stroke();

      ctx.strokeStyle = goldGrad;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cx + dx * 10, cy + dy * 35);
      ctx.lineTo(cx + dx * 10, cy + dy * 10);
      ctx.lineTo(cx + dx * 35, cy + dy * 10);
      ctx.stroke();
    };

    drawFineCorner(80, 80, 1, 1); // top left
    drawFineCorner(w - 80, 80, -1, 1); // top right
    drawFineCorner(80, h - 80, 1, -1); // bottom left
    drawFineCorner(w - 80, h - 80, -1, -1); // bottom right

    // 3. Luxurious Large "Enso" (円相 - Zen circle) background watermark representing perfection
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.05)';
    ctx.lineWidth = 26;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(w / 2, h / 2 + 30, 225, -Math.PI * 0.45, Math.PI * 1.35, false);
    ctx.stroke();

    // 4. Header translation text & dynamic golden crest logo
    ctx.textAlign = 'center';
    ctx.fillStyle = '#8C857B';
    ctx.font = "bold tracking-[0.25em] 18px 'Noto Sans JP', sans-serif";
    ctx.fillText('SHODŌ JAPANESE WRITING MASTER CLASS association', w / 2, 120);

    // Traditional dynamic seal flower stamp
    ctx.strokeStyle = '#BC2F32';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(w / 2, 170, 24, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = '#BC2F32';
    ctx.font = "bold 16px 'Noto Sans JP', sans-serif";
    ctx.textBaseline = 'middle';
    ctx.fillText('証', w / 2, 170); // Verification seal center
    ctx.textBaseline = 'alphabetic';

    // 5. Traditional Japanese Kanbun Title (Certification of Unification Ninteisho)
    // Draw embossed shadow drop behind kanji
    ctx.fillStyle = 'rgba(148, 114, 20, 0.15)';
    ctx.font = "bold 68px 'Noto Sans JP', sans-serif";
    ctx.fillText('任 定 書', w / 2 + 1, 256 + 1); // light gold emboss drop shadow

    // Primary kanji heading
    ctx.fillStyle = '#1A1A1A';
    ctx.fillText('任 定 書', w / 2, 256);

    // Golden embossed Latin Title
    // Drop shadow
    ctx.fillStyle = 'rgba(26, 26, 26, 0.2)';
    ctx.font = "bold italic tracking-[0.08em] 34px 'Noto Sans JP', sans-serif";
    ctx.fillText(title.toUpperCase(), w / 2 + 1.5, 316 + 1.5);
    
    // Gold embossed gradient overlay
    ctx.fillStyle = goldGrad;
    ctx.fillText(title.toUpperCase(), w / 2, 316);

    // Subtitle
    ctx.fillStyle = '#5A544A';
    ctx.font = "italic 24px 'Noto Sans JP', sans-serif";
    ctx.fillText(subtitle, w / 2, 362);

    // Decorative separator line with twin diamond stamps
    ctx.strokeStyle = '#E5E1D8';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(w / 2 - 250, 400);
    ctx.lineTo(w / 2 + 250, 400);
    ctx.stroke();

    // Red diamonds in separator center
    ctx.fillStyle = '#BC2F32';
    ctx.fillRect(w / 2 - 6, 396, 12, 8);

    // 6. Recipient Section
    ctx.fillStyle = '#8C857B';
    ctx.font = "bold tracking-[0.2em] 18px 'Noto Sans JP', sans-serif";
    ctx.fillText('THIS HIGH MASTER CALLIGRAPHY CERTIFICATE IS CONFERRED UPON', w / 2, 458);

    ctx.fillStyle = '#1A1A1A';
    ctx.font = "bold 56px 'Noto Sans JP', sans-serif";
    ctx.fillText(recipientName, w / 2, 535);

    // Delicate underlines for the recipient
    ctx.strokeStyle = goldGrad;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(w / 2 - 300, 565);
    ctx.lineTo(w / 2 + 300, 565);
    ctx.stroke();

    // 7. Text Description and Calligraphy Endorsement lines
    ctx.fillStyle = '#5C564C';
    ctx.font = "22px/1.8 'Noto Sans JP', sans-serif";
    const bodyLines = [
      'For demonstrating absolute mechanical accuracy, pristine stroke sequence choreography,',
      'and meticulous geometric precision during rigorous real-time canvas evaluations.',
      description
    ];

    let currentY = 620;
    bodyLines.forEach(l => {
      ctx.fillText(l, w / 2, currentY);
      currentY += 40;
    });

    // 8. Render luxurious dynamic red Hanko Seal / Stamp in Japanese classical style in the right margin
    const sealX = w - 240;
    const sealY = h - 230;
    const sealRadius = 95;

    let strokeColor = '#BC2F32';
    let stampBgColor = 'rgba(188, 47, 50, 0.03)';
    if (sealColor === 'sky') {
      strokeColor = '#0284c7';
      stampBgColor = 'rgba(2, 132, 199, 0.03)';
    } else if (sealColor === 'neutral') {
      strokeColor = '#262626';
      stampBgColor = 'rgba(38, 38, 38, 0.03)';
    }

    // Traditional gold embossed Hanko container border
    ctx.strokeStyle = goldGrad;
    ctx.lineWidth = 5;
    ctx.strokeRect(sealX - sealRadius, sealY - sealRadius, sealRadius * 2, sealRadius * 2);

    // Vermillion red double stamp outer track
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 5;
    ctx.fillStyle = stampBgColor;
    ctx.strokeRect(sealX - sealRadius + 5, sealY - sealRadius + 5, (sealRadius - 5) * 2, (sealRadius - 5) * 2);
    ctx.fillRect(sealX - sealRadius + 5, sealY - sealRadius + 5, (sealRadius - 5) * 2, (sealRadius - 5) * 2);

    // Red inner label text or traditional seals glyphs
    ctx.fillStyle = strokeColor;
    ctx.font = "bold 98px 'Noto Sans JP', sans-serif";
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(badgeChar, sealX, sealY + 2);
    ctx.textBaseline = 'alphabetic';

    // Approved small header and badge label labels around stamp area
    ctx.fillStyle = strokeColor;
    ctx.font = "bold tracking-[0.15em] 12px monospace";
    ctx.fillText('VERIFIED SEAL', sealX, sealY + sealRadius + 22);
    
    ctx.fillStyle = '#6B7280';
    ctx.font = "bold tracking-[0.1em] 11px monospace";
    ctx.fillText(badgeLabel.toUpperCase(), sealX, sealY - sealRadius - 12);

    // 9. Signatures (Left side of bottom area)
    ctx.strokeStyle = '#E5E1D8';
    ctx.lineWidth = 1;
    
    // Left line (Date)
    ctx.beginPath();
    ctx.moveTo(180, h - 210);
    ctx.lineTo(440, h - 210);
    ctx.stroke();

    ctx.fillStyle = '#8C857B';
    ctx.font = "bold tracking-[0.1em] 16px 'Noto Sans JP', sans-serif";
    ctx.textAlign = 'left';
    ctx.fillText('DATE OF CONFERRAL', 180, h - 175);
    ctx.fillStyle = '#1A1A1A';
    ctx.font = "bold 22px 'Noto Sans JP', sans-serif";
    ctx.fillText(dateString, 180, h - 225);

    // Center signature line (Representative Board)
    ctx.strokeStyle = '#E5E1D8';
    ctx.beginPath();
    ctx.moveTo(w / 2 - 130, h - 210);
    ctx.lineTo(w / 2 + 130, h - 210);
    ctx.stroke();

    ctx.fillStyle = '#8C857B';
    ctx.textAlign = 'center';
    ctx.font = "bold tracking-[0.1em] 16px 'Noto Sans JP', sans-serif";
    ctx.fillText('MASTER SENSEI SIGNATURE', w / 2, h - 175);
    ctx.fillStyle = '#BC2F32';
    ctx.font = "bold italic 26px 'Noto Sans JP', sans-serif";
    ctx.fillText('書道総監  - Kaku Board', w / 2, h - 225);

    // 10. Small verifiable signature ID footer
    const stampId = 'SHODO-NBR-' + Math.floor(100000 + Math.random() * 900000) + '-' + badgeChar.charCodeAt(0);
    ctx.fillStyle = '#9CA3AF';
    ctx.font = "14px monospace";
    ctx.textAlign = 'center';
    ctx.fillText(`VERIFIABLE METRIC STAMP ID: [ ${stampId} ]`, w / 2, h - 85);
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = url;
    link.download = `shodo_mastery_${badgeLabel.toLowerCase().replace(/[^a-z0-9]/g, '_')}_certification.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = () => {
    const shareText = `🎯 I officially mastered Shodō calligraphic characters and earned the verified Gold-Embossed ${badgeLabel} Stamp seal with a verifiable certificate code! Practice Japanese calligraphy & brush style check on Kaku master!`;
    if (navigator.share) {
      navigator.share({
        title: 'Shodō Calligraphy Certification',
        text: shareText,
        url: window.location.href
      }).catch(err => console.log(err));
    } else {
      navigator.clipboard.writeText(shareText + ' ' + window.location.href);
      alert('📋 Verification certificate details and application URL copied to your clipboard! Share it with friends.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-neutral-900/90 z-50 flex items-center justify-center p-4 overflow-y-auto backdrop-blur-md select-none" id="certificate-overlay">
      <div className="bg-white rounded-lg border border-amber-300 shadow-2xl max-w-4xl w-full flex flex-col p-6 animate-zoom-in relative">
        
        {/* Header toolbar */}
        <div className="flex justify-between items-center border-b border-[#E5E1D8] pb-3 mb-4">
          <div className="flex items-center gap-2 text-[#BC2F32]">
            <ShieldCheck className="text-amber-500 animate-pulse" size={20} />
            <span className="text-xs font-sans font-bold tracking-widest uppercase text-amber-600">
              Gold-Embossed Shodō Mastery Certificate
            </span>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:bg-gray-150 hover:text-black transition"
            id="btn-close-certificate"
          >
            <X size={18} />
          </button>
        </div>

        {/* Certificate Display scrolling box */}
        <div className="flex-1 flex flex-col items-center justify-center bg-neutral-50 p-4 border border-gray-200 rounded-sm">
          <p className="text-[11px] font-sans text-amber-700 font-bold mb-3 uppercase tracking-wider text-center">
            ★ Verifiable Fine Art Calligraphy Certificate (Landscape Golden Ratio, fully download-ready)
          </p>
          
          {/* Responsive styled landscape view container */}
          <div className="relative border-4 border-amber-400/50 shadow-inner bg-[#FCFAF7] w-full max-w-[760px] overflow-hidden rounded-md select-none bg-radial from-white to-gray-25 shadow-xl">
            <canvas 
              ref={canvasRef} 
              style={{ width: '100%', height: 'auto', display: 'block' }} 
            />
          </div>
        </div>

        {/* Actions bar footer */}
        <div className="mt-5 flex gap-3">
          <button
            onClick={handleShare}
            className="flex-1 py-3 px-4 border border-amber-200 bg-amber-50/50 hover:bg-amber-100/50 flex items-center justify-center gap-2 text-xs font-sans font-bold uppercase tracking-wider text-amber-800 transition rounded"
          >
            <Share2 size={15} />
            <span>Copy Achievement Share</span>
          </button>
          
          <button
            onClick={handleDownload}
            className="flex-1 py-3 px-4 bg-gradient-to-r from-neutral-900 to-amber-950 hover:from-black hover:to-amber-900 text-amber-200 border border-amber-300 flex items-center justify-center gap-2 text-xs font-sans font-bold uppercase tracking-wider transition rounded shadow-md"
          >
            <Download size={15} />
            <span>Download PNG Certificate</span>
          </button>
        </div>

      </div>
    </div>
  );
};
