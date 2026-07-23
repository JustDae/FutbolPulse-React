import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import SplitType from 'split-type';
import gsap from 'gsap';
import { subscriptionRepository } from '@/infrastructure/adapters/axios-subscription.repository';
import { ArrowRight, Zap } from 'lucide-react';
import { Magnetic } from '@/presentation/components/Magnetic';

const RED = '#E31C3D';
const FONT_DISPLAY = "'Barlow Condensed', sans-serif";

function RedLabel({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="text-[9px] font-bold uppercase tracking-[0.2em]"
      style={{ color: RED, fontFamily: "'Inter', sans-serif" }}
    >
      {children}
    </span>
  );
}

export function ProPage() {
  const [premiumCount, setPremiumCount] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const splitTexts = document.querySelectorAll('.split-text-anim');
    splitTexts.forEach((el) => {
      const text = new SplitType(el as HTMLElement, { types: 'chars' });
      gsap.fromTo(
        text.chars,
        { yPercent: 100, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.02,
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
          },
        }
      );
    });

    gsap.fromTo(
      '.stagger-card',
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.1,
        scrollTrigger: {
          trigger: '.stagger-card-container',
          start: 'top 85%',
        },
      }
    );
  }, { scope: containerRef });

  useEffect(() => {
    subscriptionRepository.getSubscriptions()
      .then(subs => {
        const proSubs = (subs as any[]).filter(s => s.plan === 'Premium' && s.estado === 'Activo');
        setPremiumCount(proSubs.length);
      })
      .catch(() => {});
  }, []);

  return (
    <div ref={containerRef} className="w-full relative" style={{ fontFamily: "'Inter', sans-serif", background: '#0B1220' }}>
      <section className="relative w-full overflow-hidden" style={{ background: '#070C16', padding: '120px 0', minHeight: 'calc(100vh - 64px)' }}>
        <div className="absolute inset-0 opacity-10" style={{ background: 'radial-gradient(circle at 50% 50%, rgba(227, 28, 61, 0.4) 0%, transparent 70%)' }} />
        
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <Zap className="w-4 h-4" style={{ color: RED }} />
              <RedLabel>Desbloquea Todo el Potencial</RedLabel>
            </div>
            <h2
              className="uppercase text-white mb-6 split-text-anim"
              style={{ fontFamily: FONT_DISPLAY, fontWeight: 900, fontSize: 'clamp(32px, 5vw, 64px)', lineHeight: 0.9, letterSpacing: '-0.02em', clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)' }}
            >
              NIVEL <span style={{ color: RED }}>PRO</span>
            </h2>
            <p className="text-white/50 text-sm leading-relaxed max-w-md mb-8">
              Herramientas avanzadas para entrenadores, scouts y administradores. Gestiona plantillas, analiza métricas y toma el control total de tu equipo.
            </p>
            
            <div className="flex items-center gap-4 mb-10">
              <div className="flex -space-x-3">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-[#070C16] bg-white/10 flex items-center justify-center text-[10px] font-bold text-white/40">
                    CLUB
                  </div>
                ))}
              </div>
              <div className="flex flex-col">
                <span className="text-white font-bold text-sm">+{premiumCount} Clubes Activos</span>
                <span className="text-[9px] uppercase tracking-widest text-white/40">Ya son Nivel PRO</span>
              </div>
            </div>

            <Magnetic>
              <Link
                to="/register"
                className="inline-flex items-center gap-3 px-10 py-4 text-[11px] font-bold uppercase tracking-[0.15em] transition-opacity hover:opacity-90"
                style={{ background: RED, color: '#FFF' }}
              >
                Obtener PRO Ahora <ArrowRight className="w-4 h-4" />
              </Link>
            </Magnetic>
          </div>

          <div className="grid grid-cols-1 gap-4 stagger-card-container">
            {[
              { title: 'Gestión de Plantillas', desc: 'Controla jugadores, lesiones y contratos.' },
              { title: 'Estadísticas Avanzadas', desc: 'Métricas detalladas de rendimiento por partido.' },
              { title: 'Live Match Tracker', desc: 'Panel en vivo para actualizar eventos en tiempo real.' },
            ].map((feature, idx) => (
              <div key={idx} className="p-6 bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] transition-colors stagger-card">
                <h3 className="text-white font-bold mb-2 uppercase tracking-wide text-sm">{feature.title}</h3>
                <p className="text-white/40 text-xs">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
