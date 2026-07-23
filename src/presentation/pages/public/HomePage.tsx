import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import SplitType from 'split-type';
import { matchRepository } from '@/infrastructure/adapters/axios-match.repository';
import type { Match } from '@/domain/entities/match.entity';
import { ArrowRight, Play, Calendar, MapPin } from 'lucide-react';
import { useTeamStore } from '@/presentation/store/team.store';
import { Magnetic } from '@/presentation/components/Magnetic';
import torneosImg from '@/assets/torneos.png';
import equiposImg from '@/assets/equipos.png';
import partidosImg from '@/assets/partidos.png';
import ctaBgImg from '@/assets/cta_bg.jpg';
import heroVideo from '@/assets/hero_video.mp4';

gsap.registerPlugin(ScrollTrigger);

const NAVY = '#0B1220';
const NAVY_MID = '#10182B';
const RED = '#E31C3D';
const OFF_WHITE = '#F4F4F5';
const FONT_DISPLAY = "'Barlow Condensed', sans-serif";

const BADGE_COLORS = [
  ['#1E3A5F', '#4A90D9'], ['#1A3C2A', '#3DAA6A'], ['#3C1A1A', '#D94A4A'],
  ['#2D1A3C', '#9B4AD9'], ['#3C2D1A', '#D9924A'], ['#1A2D3C', '#4AB5D9'],
];
function badgePalette(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) | 0;
  return BADGE_COLORS[Math.abs(h) % BADGE_COLORS.length];
}
function TeamBadge({ url, name, size = 56 }: { url?: string; name: string; size?: number }) {
  const [failed, setFailed] = useState(false);
  const [bg, fg] = badgePalette(name);
  if (url && !failed) {
    return (
      <img src={url} alt={name} width={size} height={Math.round(size * 0.67)}
        className="w-full h-full object-contain" referrerPolicy="no-referrer"
        onError={() => setFailed(true)} loading="lazy" />
    );
  }
  return (
    <div className="w-full h-full flex items-center justify-center" style={{ background: bg }}>
      <span style={{ fontFamily: FONT_DISPLAY, fontWeight: 900, fontSize: size * 0.3, color: fg, lineHeight: 1 }}>
        {name.substring(0, 3).toUpperCase()}
      </span>
    </div>
  );
}

function SectionNumber({ n, dark = true }: { n: string; dark?: boolean }) {
  return (
    <span
      className="absolute select-none pointer-events-none"
      style={{
        fontFamily: FONT_DISPLAY,
        fontWeight: 900,
        fontSize: 'clamp(60px, 10vw, 130px)',
        lineHeight: 1,
        color: dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)',
        top: '-0.1em',
        left: '-0.05em',
        letterSpacing: '-0.04em',
        userSelect: 'none',
      }}
    >
      {n}
    </span>
  );
}

function RedLabel({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="inline-block text-[9px] font-bold uppercase tracking-[0.2em]"
      style={{ color: RED, fontFamily: "'Inter', sans-serif" }}
    >
      {children}
    </span>
  );
}

function MetricBlock({
  value,
  label,
  dark = true,
}: {
  value: string;
  label: string;
  dark?: boolean;
}) {
  return (
    <div className="flex flex-col">
      <span
        className="leading-none"
        style={{
          fontFamily: FONT_DISPLAY,
          fontWeight: 900,
          fontSize: 'clamp(40px, 6vw, 72px)',
          color: dark ? '#FFFFFF' : NAVY,
          letterSpacing: '-0.03em',
          lineHeight: 0.88,
        }}
      >
        {value}
      </span>
      <span
        className="mt-2 text-[9px] font-bold uppercase tracking-[0.18em]"
        style={{ color: dark ? 'rgba(255,255,255,0.45)' : 'rgba(11,18,32,0.45)', fontFamily: "'Inter', sans-serif" }}
      >
        {label}
      </span>
    </div>
  );
}

export function HomePage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const { teams, fetchTeams } = useTeamStore();
  const mainRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // 1. (Removed ball timeline)

    // 2. SplitType Text Animations
    const splitTexts = document.querySelectorAll('.split-text-anim');
    splitTexts.forEach((text) => {
      const split = new SplitType(text as HTMLElement, { types: 'lines,words,chars' });
      gsap.from(split.chars, {
        scrollTrigger: {
          trigger: text,
          start: 'top 90%',
          toggleActions: 'play none none reverse',
        },
        y: 100,
        opacity: 0,
        stagger: 0.02,
        duration: 0.8,
        ease: 'back.out(1.7)'
      });
    });

    // 3. Parallax Effects for backgrounds
    gsap.utils.toArray('.parallax-bg').forEach((bg: any) => {
      gsap.to(bg, {
        y: '20%',
        ease: 'none',
        scrollTrigger: {
          trigger: bg.parentElement,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        }
      });
    });

    // 4. Staggered Card reveals
    gsap.utils.toArray('.stagger-card-container').forEach((container: any) => {
      const cards = container.querySelectorAll('.stagger-card');
      gsap.from(cards, {
        scrollTrigger: {
          trigger: container,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
        y: 50,
        opacity: 0,
        stagger: 0.1,
        duration: 0.6,
        ease: 'power2.out'
      });
    });

  }, { scope: mainRef });

  useEffect(() => {
    fetchTeams();
    matchRepository
      .getMatches()
      .then((m) => setMatches(m))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [fetchTeams]);

  const getTeamBadge = (teamName: string) => {
    const team = teams.find(t => t.name.toLowerCase() === teamName.toLowerCase() || t.name.toLowerCase().includes(teamName.toLowerCase()) || teamName.toLowerCase().includes(t.name.toLowerCase()));
    return team?.badgeUrl || '';
  };

  const displayMatches = matches.slice(0, 3);
  const liveMatch = matches.find(m => m.status === 'En curso');

  return (
      <div ref={mainRef} className="w-full overflow-x-hidden relative" style={{ fontFamily: "'Inter', sans-serif" }}>

      <section
        className="relative w-full overflow-hidden"
        style={{ background: NAVY, minHeight: '92vh' }}
      >
        <div className="absolute inset-0 z-0">
          <video
            src={heroVideo}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-[120%] object-cover parallax-bg absolute -top-[10%]"
            style={{ objectPosition: 'center 30%' }}
          />
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(105deg, rgba(11,18,32,0.97) 0%, rgba(11,18,32,0.85) 45%, rgba(11,18,32,0.3) 100%)' }}
          />
        </div>

        <SectionNumber n="01" dark />

        <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] gap-0" style={{ minHeight: '92vh' }}>

          <div className="flex flex-col justify-center py-20 md:py-0 pr-0 md:pr-16">

            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-[3px]" style={{ background: RED }} />
              <RedLabel>Gestión Deportiva Profesional</RedLabel>
            </div>

            <h1
              className="uppercase mb-6 split-text-anim"
              style={{
                fontFamily: FONT_DISPLAY,
                fontWeight: 900,
                fontSize: 'clamp(34px, 5vw, 68px)',
                lineHeight: 0.95,
                letterSpacing: '-0.02em',
                color: '#FFFFFF',
              }}
            >
              LA PASIÓN<br />
              DEL FÚTBOL,<br />
              <span style={{ color: RED }}>ORGANIZADA.</span>
            </h1>

            <p className="text-white/50 text-sm leading-relaxed max-w-md mb-10" style={{ fontFamily: "'Inter', sans-serif" }}>
              Resultados en tiempo real y gestión de torneos a nivel profesional.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                to="/torneos"
                className="flex items-center gap-3 px-8 py-4 text-[11px] font-bold uppercase tracking-[0.15em] transition-opacity hover:opacity-90"
                style={{ background: RED, color: '#FFF' }}
              >
                Ver Torneos <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/partidos"
                className="flex items-center gap-3 px-8 py-4 text-[11px] font-bold uppercase tracking-[0.15em] border border-white/20 text-white hover:bg-white/5 transition-colors"
              >
                <Play className="w-3.5 h-3.5 fill-white" /> En Vivo
              </Link>
            </div>
          </div>

          <div className="hidden md:flex flex-col justify-center gap-6 pl-12">

            <div className="flex items-center gap-2">
              <span className="w-2 h-2 blink-live" style={{ background: RED }} />
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/60">Partido en Curso</span>
            </div>

            {liveMatch ? (
              <div className="p-6 border border-white/10" style={{ background: 'rgba(16,24,43,0.8)' }}>
                <p className="text-[9px] font-bold uppercase tracking-widest text-white/40 mb-4">{liveMatch.matchType || 'Liga Profesional'}</p>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex flex-col items-center gap-2 flex-1">
                    <div className="w-14 aspect-[3/2] overflow-hidden shadow-sm bg-slate-950">
                      <TeamBadge url={getTeamBadge(liveMatch.equipoLocal)} name={liveMatch.equipoLocal} size={56} />
                    </div>
                    <p className="text-white/80 text-xs font-semibold text-center leading-tight mt-1">{liveMatch.equipoLocal}</p>
                  </div>

                  <div className="flex flex-col items-center gap-1">
                    <div className="flex items-center gap-3">
                      <span
                        style={{ fontFamily: FONT_DISPLAY, fontWeight: 900, fontSize: '52px', color: '#FFF', lineHeight: 1, letterSpacing: '-0.03em' }}
                      >
                        {liveMatch.homeScore ?? '–'}
                      </span>
                      <span className="text-white/20 text-2xl font-light">:</span>
                      <span
                        style={{ fontFamily: FONT_DISPLAY, fontWeight: 900, fontSize: '52px', color: '#FFF', lineHeight: 1, letterSpacing: '-0.03em' }}
                      >
                        {liveMatch.awayScore ?? '–'}
                      </span>
                    </div>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-white/40">
                      {liveMatch.status}
                    </span>
                  </div>

                  <div className="flex flex-col items-center gap-2 flex-1">
                    <div className="w-14 aspect-[3/2] overflow-hidden shadow-sm bg-slate-950">
                      <TeamBadge url={getTeamBadge(liveMatch.equipoVisitante)} name={liveMatch.equipoVisitante} size={56} />
                    </div>
                    <p className="text-white/80 text-xs font-semibold text-center leading-tight mt-1">{liveMatch.equipoVisitante}</p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
                  <p className="text-white/30 text-[10px]">{liveMatch.stadium || 'Sede por definir'}</p>
                  <Link to="/partidos" className="text-[9px] font-bold uppercase tracking-widest hover:opacity-80 transition-opacity" style={{ color: RED }}>
                    Ver detalle →
                  </Link>
                </div>
              </div>
            ) : (
              <div className="p-6 border border-white/10 text-white/30 text-sm text-center" style={{ background: 'rgba(16,24,43,0.8)' }}>
                {loading ? 'Cargando partidos...' : 'Sin partidos activos'}
              </div>
            )}

            <div className="grid grid-cols-3 gap-px" style={{ background: 'rgba(255,255,255,0.06)' }}>
              {[
                { value: String(matches.length), label: 'Partidos' },
                { value: matches.filter(m => m.status === 'En curso').length > 0 ? String(matches.filter(m => m.status === 'En curso').length) : '0', label: 'En Vivo' },
                { value: matches.filter(m => m.status === 'Finalizado').length > 0 ? String(matches.filter(m => m.status === 'Finalizado').length) : '0', label: 'Finaliz.' },
              ].map(({ value, label }) => (
                <div key={label} className="flex flex-col items-center justify-center py-4" style={{ background: NAVY_MID }}>
                  <span style={{ fontFamily: FONT_DISPLAY, fontWeight: 900, fontSize: '32px', color: '#FFF', lineHeight: 1 }}>{value}</span>
                  <span className="text-[9px] font-bold uppercase tracking-widest mt-1" style={{ color: 'rgba(255,255,255,0.35)' }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section 
        className="w-full relative overflow-hidden" 
        style={{ 
          background: 'linear-gradient(135deg, #1C0307 0%, #3D0811 50%, #690D1D 100%)' 
        }}
      >
        <div className="absolute right-10 bottom-0 opacity-5 select-none pointer-events-none hidden md:block">
          <span style={{ fontFamily: FONT_DISPLAY, fontWeight: 900, fontSize: '220px', lineHeight: 0.8, color: '#FFF' }}>MATCHES</span>
        </div>

        <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-16 md:py-20 relative z-10">

          <div className="flex items-end justify-between mb-12 border-b border-white/10 pb-6">
            <div>
              <span className="inline-block text-[9px] font-bold uppercase tracking-[0.2em] text-white/50">Calendario</span>
              <h2
                className="uppercase text-white mt-1.5 split-text-anim"
                style={{ fontFamily: FONT_DISPLAY, fontWeight: 900, fontSize: 'clamp(26px, 4vw, 48px)', lineHeight: 0.9, letterSpacing: '-0.02em', clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)' }}
              >
                ÚLTIMOS<br />PARTIDOS
              </h2>
            </div>
            <Link
              to="/partidos"
              className="hidden md:flex items-center gap-2 border border-white/20 text-white text-[10px] font-bold uppercase tracking-widest px-6 py-3 hover:bg-white/10 hover:border-white/40 transition-colors"
            >
              Ver todos <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 stagger-card-container">
              {[0, 1, 2].map(i => (
                <div key={i} className="h-56 bg-white/[0.04] border border-white/5 animate-pulse stagger-card" />
              ))}
            </div>
          ) : displayMatches.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 stagger-card-container">
              {displayMatches.map((match) => (
                <Link
                  key={match.id}
                  to={`/partidos/${match.id}`}
                  className="group flex flex-col p-6 bg-white/[0.05] border border-white/10 hover:bg-white/[0.09] hover:border-white/20 hover:-translate-y-1 transition-all duration-300 shadow-xl stagger-card"
                  style={{ borderRadius: '0px' }}
                >
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/5">
                    <span className="text-white/40 text-[9px] font-bold uppercase tracking-wider">{match.matchType || 'Liga de Competencia'}</span>
                    <span className={`text-[8px] font-black uppercase px-2 py-0.5 tracking-wider ${
                      match.status === 'En curso' ? 'bg-red-600 text-white animate-pulse' : 'bg-white/10 text-white/60'
                    }`}>
                      {match.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-4 my-4">

                    <div className="flex flex-col items-center gap-2 flex-1 min-w-0">
                      <div className="w-14 aspect-[3/2] overflow-hidden shadow bg-slate-950">
                        <TeamBadge url={getTeamBadge(match.equipoLocal)} name={match.equipoLocal} size={56} />
                      </div>
                      <span className="text-white font-bold text-xs text-center truncate w-full leading-tight">{match.equipoLocal}</span>
                    </div>

                    <div className="flex items-center gap-2 px-2 shrink-0">
                      <span style={{ fontFamily: FONT_DISPLAY, fontWeight: 900, fontSize: '40px', color: '#FFF', lineHeight: 1 }}>
                        {match.homeScore ?? '–'}
                      </span>
                      <span className="text-white/30 text-lg font-light">:</span>
                      <span style={{ fontFamily: FONT_DISPLAY, fontWeight: 900, fontSize: '40px', color: '#FFF', lineHeight: 1 }}>
                        {match.awayScore ?? '–'}
                      </span>
                    </div>

                    <div className="flex flex-col items-center gap-2 flex-1 min-w-0">
                      <div className="w-14 aspect-[3/2] overflow-hidden shadow bg-slate-950">
                        <TeamBadge url={getTeamBadge(match.equipoVisitante)} name={match.equipoVisitante} size={56} />
                      </div>
                      <span className="text-white font-bold text-xs text-center truncate w-full leading-tight">{match.equipoVisitante}</span>
                    </div>

                  </div>

                  <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between text-[10px] text-white/50">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-white/30" />
                      <span>{new Date(match.matchDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}</span>
                    </div>
                    <div className="flex items-center gap-1.5 max-w-[120px]">
                      <MapPin className="w-3.5 h-3.5 text-white/30 shrink-0" />
                      <span className="truncate">{match.stadium || 'Estadio Oficial'}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 border border-white/10 text-white/40 font-bold uppercase tracking-widest text-xs bg-white/[0.02]">
              Sin partidos recientes
            </div>
          )}

          <div className="md:hidden mt-8 text-center">
            <Link
              to="/partidos"
              className="inline-flex items-center gap-2 border border-white/20 text-white text-[10px] font-bold uppercase tracking-widest px-8 py-3 hover:bg-white/10 transition-colors"
            >
              Ver todos los partidos <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      <section className="w-full relative overflow-hidden" style={{ background: OFF_WHITE }}>
        <SectionNumber n="02" dark={false} />
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 py-20 md:py-28">

          <div className="grid grid-cols-1 md:grid-cols-[1fr_1.5fr] gap-12 md:gap-20 items-start">

            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-[3px]" style={{ background: RED }} />
                <RedLabel>Temporada Actual</RedLabel>
              </div>
              <h2
                className="uppercase split-text-anim"
                style={{
                  fontFamily: FONT_DISPLAY,
                  fontWeight: 900,
                  fontSize: 'clamp(30px, 4.5vw, 56px)',
                  lineHeight: 0.9,
                  letterSpacing: '-0.02em',
                  color: NAVY,
                  clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)'
                }}
              >
                SEASON<br />STATS
              </h2>

              <p className="mt-6 text-sm leading-relaxed max-w-sm" style={{ color: 'rgba(11,18,32,0.5)', fontFamily: "'Inter', sans-serif" }}>
                Datos agregados de todos los torneos y partidos registrados en la plataforma.
                Actualización en tiempo real desde el backend.
              </p>

              <div className="mt-8">
                <Link
                  to="/torneos"
                  className="inline-flex items-center gap-3 px-8 py-3 text-[10px] font-bold uppercase tracking-widest border-2 transition-colors hover:text-white hover:border-transparent"
                  style={{ borderColor: RED, color: RED, ['--hover-bg' as string]: RED }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = RED; (e.currentTarget as HTMLElement).style.color = '#FFF'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = RED; }}
                >
                  Ver Torneos <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12 stagger-card-container">
                <div className="stagger-card"><MetricBlock value={String(matches.length || '0')} label="Partidos registrados" dark={false} /></div>
                <div className="stagger-card"><MetricBlock
                  value={String(matches.filter(m => m.status === 'Finalizado').length || '0')}
                  label="Partidos finalizados"
                  dark={false}
                /></div>
                <div className="stagger-card"><MetricBlock
                  value={String(matches.filter(m => m.status === 'En curso').length || '0')}
                  label="En vivo ahora"
                  dark={false}
                /></div>
                <div className="stagger-card"><MetricBlock
                  value={String(matches.reduce((acc, m) => acc + (m.homeScore ?? 0) + (m.awayScore ?? 0), 0) || '0')}
                  label="Goles marcados"
                  dark={false}
                /></div>
                <div className="stagger-card"><MetricBlock
                  value={String(matches.filter(m => m.status === 'Programado').length || '0')}
                  label="Próximos partidos"
                  dark={false}
                /></div>
                <div className="stagger-card"><MetricBlock
                  value={String(new Set(matches.flatMap(m => [m.equipoLocal, m.equipoVisitante])).size || '0')}
                  label="Equipos activos"
                  dark={false}
                /></div>
              </div>

              <div className="flex gap-2 mt-10">
                <div className="w-6 h-6" style={{ background: RED, opacity: 0.8 }} />
                <div className="w-6 h-6" style={{ background: RED, opacity: 0.4 }} />
                <div className="w-6 h-6" style={{ background: RED, opacity: 0.15 }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full relative overflow-hidden" style={{ background: NAVY }}>
        <SectionNumber n="03" dark />

        <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 py-20 md:py-28">

          <div className="flex items-end justify-between mb-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-[3px]" style={{ background: RED }} />
                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/40">Explora</span>
              </div>
              <h2
                className="uppercase text-white split-text-anim"
                style={{ fontFamily: FONT_DISPLAY, fontWeight: 900, fontSize: 'clamp(26px, 4vw, 48px)', lineHeight: 0.9, letterSpacing: '-0.02em', clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)' }}
              >
                EQUIPOS<br />&amp; TORNEOS
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[1.6fr_1fr] gap-px" style={{ background: 'rgba(255,255,255,0.06)' }}>

            <Link
              to="/torneos"
              className="group relative overflow-hidden"
              style={{ minHeight: '420px' }}
            >
              <img
                src={torneosImg}
                alt="Torneos"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(11,18,32,0.3) 0%, rgba(11,18,32,0.92) 100%)' }} />

              <div className="absolute top-6 left-6 w-8 h-8" style={{ background: RED }} />

              <div className="relative z-10 p-8 h-full flex flex-col justify-end">
                <RedLabel>Torneos Activos</RedLabel>
                <h3
                  className="uppercase text-white mt-2 mb-4 split-text-anim"
                  style={{ fontFamily: FONT_DISPLAY, fontWeight: 900, fontSize: 'clamp(22px, 3vw, 38px)', lineHeight: 0.92, letterSpacing: '-0.02em', clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)' }}
                >
                  EXPLORA<br />TODOS LOS<br />TORNEOS
                </h3>
                <p className="text-white/50 text-sm mb-6 max-w-xs">Tablas de posiciones, estadísticas completas y fixture actualizado en tiempo real.</p>
                <div className="flex items-center gap-2 text-white text-[10px] font-bold uppercase tracking-widest group-hover:gap-4 transition-all">
                  Ver torneos <ArrowRight className="w-4 h-4" style={{ color: RED }} />
                </div>
              </div>
            </Link>

            <div className="flex flex-col gap-px" style={{ background: 'rgba(255,255,255,0.06)' }}>

              <Link
                to="/equipos"
                className="group relative overflow-hidden flex-1"
                style={{ minHeight: '200px' }}
              >
                <img
                  src={equiposImg}
                  alt="Equipos"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(11,18,32,0.4) 0%, rgba(11,18,32,0.88) 100%)' }} />
                <div className="relative z-10 p-6 h-full flex flex-col justify-end">
                  <RedLabel>Equipos</RedLabel>
                  <h3
                    className="uppercase text-white mt-1 split-text-anim"
                    style={{ fontFamily: FONT_DISPLAY, fontWeight: 900, fontSize: '28px', lineHeight: 0.92, letterSpacing: '-0.01em', clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)' }}
                  >
                    TODOS LOS EQUIPOS
                  </h3>
                  <p className="text-white/40 text-xs mt-2">Plantillas, jugadores y estadísticas de rendimiento.</p>
                </div>
              </Link>

              <Link
                to="/partidos"
                className="group relative overflow-hidden flex-1"
                style={{ minHeight: '200px' }}
              >
                <img
                  src={partidosImg}
                  alt="Calendario"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(11,18,32,0.4) 0%, rgba(11,18,32,0.88) 100%)' }} />
                <div className="relative z-10 p-6 h-full flex flex-col justify-between">
                  <RedLabel>Partidos</RedLabel>
                  <div>
                    <h3
                      className="uppercase text-white mb-3 split-text-anim"
                      style={{ fontFamily: FONT_DISPLAY, fontWeight: 900, fontSize: '28px', lineHeight: 0.92, letterSpacing: '-0.01em', clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)' }}
                    >
                      CALENDARIO<br />COMPLETO
                    </h3>
                    <div className="flex items-center gap-2 text-white/40 text-[10px] font-bold uppercase tracking-widest group-hover:text-white transition-colors">
                      Ver partidos <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="relative w-full overflow-hidden" style={{ minHeight: '360px' }}>
        <img
          src={ctaBgImg}
          alt="Fútbol en acción"
          className="absolute inset-0 w-full h-[120%] object-cover parallax-bg -top-[10%]"
          style={{ objectPosition: 'center 40%' }}
        />
        <div className="absolute inset-0" style={{ background: 'rgba(11,18,32,0.88)' }} />

        <div
          className="absolute left-0 top-0 h-full w-2"
          style={{ background: RED }}
        />

        <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 py-20 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <RedLabel>Acceso al Panel</RedLabel>
            <h2
              className="uppercase text-white mt-2 split-text-anim"
              style={{ fontFamily: FONT_DISPLAY, fontWeight: 900, fontSize: 'clamp(28px, 4.5vw, 56px)', lineHeight: 0.9, letterSpacing: '-0.02em', clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)' }}
            >
              GESTIONA<br />TU CLUB<br /><span style={{ color: RED }}>HOY.</span>
            </h2>
          </div>
          <div className="flex flex-col gap-4 items-start md:items-end">
            <Magnetic>
              <Link
                to="/login"
                className="inline-flex items-center gap-3 px-10 py-4 text-[11px] font-bold uppercase tracking-[0.15em] transition-opacity hover:opacity-90"
                style={{ background: RED, color: '#FFF' }}
              >
                Iniciar sesión <ArrowRight className="w-4 h-4" />
              </Link>
            </Magnetic>
            <Link
              to="/register"
              className="text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-white transition-colors"
            >
              Crear cuenta gratuita →
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
