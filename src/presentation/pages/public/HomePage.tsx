import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { matchRepository } from '@/infrastructure/adapters/axios-match.repository';
import type { Match } from '@/domain/entities/match.entity';

export function HomePage() {
  const [latestMatches, setLatestMatches] = useState<Match[]>([]);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const matches = await matchRepository.getMatches();
        setLatestMatches(matches.slice(0, 3));
      } catch (error) {
        console.error('Error fetching matches:', error);
      }
    };
    fetchMatches();
  }, []);

  return (
    <div className="w-screen relative left-1/2 -translate-x-1/2 -mt-6 bg-white font-sans pb-20">
      
      {/* Hero Section */}
      <section className="relative w-full bg-white overflow-hidden flex flex-col md:flex-row h-[calc(100vh-4rem)] min-h-[500px]">
        {/* Left Side: Large Image with slant */}
        <div className="relative w-full md:w-[55%] h-1/2 md:h-full z-10 md:[clip-path:polygon(0_0,100%_0,85%_100%,0%_100%)]">
          <div className="absolute inset-0 bg-slate-900">
            <img 
              src="https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=1000&auto=format&fit=crop" 
              alt="Fútbol Hero" 
              className="w-full h-full object-cover opacity-90"
            />
            {/* Overlay gradient for readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          </div>
        </div>

        {/* Right Side: Content */}
        <div className="w-full md:w-[45%] flex flex-col justify-center p-8 md:p-12 lg:p-16 relative z-0 bg-white md:-ml-12 h-1/2 md:h-full">
          <div className="max-w-lg space-y-6 md:pl-16 relative z-10">
            <div className="inline-flex items-center bg-[#e63946] px-3 py-1 text-[10px] font-bold text-white uppercase tracking-widest">
               Versión Beta
            </div>
            
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-[1.1] tracking-tight">
              La pasión del fútbol, <br/><span className="text-[#e63946]">organizada.</span>
            </h1>
            
            <p className="text-sm md:text-base text-slate-500 leading-relaxed font-medium">
              Fútbol Pulse te permite seguir a tus equipos favoritos, revisar los resultados de los partidos y mantenerte al día con los torneos más importantes a nivel global.
            </p>
            
            <div className="pt-4">
              <Link 
                to="/torneos" 
                className="inline-block border-2 border-[#e63946] bg-transparent text-[#e63946] hover:bg-[#e63946] hover:text-white px-8 py-3 text-sm font-bold transition-colors uppercase tracking-widest"
              >
                Ver Torneos
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Match Schedule / Últimos Partidos (Red Band) */}
      <section className="w-full bg-[#e63946] text-white py-16 px-6 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto flex flex-col xl:flex-row gap-12 items-center">
          
          {/* Left Content */}
          <div className="xl:w-1/4 space-y-6">
            <h2 className="text-4xl font-black leading-tight drop-shadow-sm">
              Últimos<br/>Partidos
            </h2>
            <p className="text-red-100 text-sm leading-relaxed font-medium">
              Mantente al tanto de los encuentros más recientes. Revisa las estadísticas, marcadores y todo lo que sucede en el terreno de juego con nuestra plataforma en tiempo real.
            </p>
            <Link to="/partidos" className="inline-block border border-white text-white hover:bg-white hover:text-[#e63946] px-8 py-2 text-xs font-bold transition-colors uppercase tracking-widest mt-4">
              Más Detalles
            </Link>
          </div>

          {/* Right Cards */}
          <div className="xl:w-3/4 grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            {latestMatches.length > 0 ? latestMatches.map((match, index) => {
              const colors = [
                { bg: 'bg-blue-50', border: 'border-blue-100', text: 'text-blue-600' },
                { bg: 'bg-red-50', border: 'border-red-100', text: 'text-red-600' },
                { bg: 'bg-emerald-50', border: 'border-emerald-100', text: 'text-emerald-600' },
              ];
              const colorHome = colors[index % 3];
              const colorAway = { bg: 'bg-slate-50', border: 'border-slate-200', text: 'text-slate-700' };

              return (
                <div key={match.id} className="bg-slate-50 rounded shadow-lg overflow-hidden flex flex-col transform hover:-translate-y-1 transition-transform duration-300 text-slate-900">
                  <div className="bg-white p-6 flex justify-between items-center border-b border-slate-200">
                    <div className={`w-16 h-16 rounded-full ${colorHome.bg} border ${colorHome.border} flex items-center justify-center font-black ${colorHome.text} shadow-sm text-lg`}>
                      {match.equipoLocal.substring(0, 3).toUpperCase()}
                    </div>
                    <span className="text-sm font-bold text-slate-300">v</span>
                    <div className={`w-16 h-16 rounded-full ${colorAway.bg} border ${colorAway.border} flex items-center justify-center font-black ${colorAway.text} shadow-sm text-lg`}>
                      {match.equipoVisitante.substring(0, 3).toUpperCase()}
                    </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-slate-900 font-bold text-lg mb-1">{match.equipoLocal} v {match.equipoVisitante}</h3>
                    <p className="text-xs text-slate-500 font-semibold mb-4">{match.matchType || 'Liga Profesional'}</p>
                    <div className="mt-auto space-y-1 pt-4 border-t border-slate-200">
                      <p className="text-xs font-medium text-slate-400">{match.stadium || 'Sede Por Definir'}</p>
                      <p className="text-xs font-medium text-slate-400 capitalize">
                        {new Date(match.matchDate).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                      <p className="text-xs font-medium text-slate-400">
                        {new Date(match.matchDate).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <div className="mt-6 flex items-center text-[#e63946] font-bold text-xs uppercase tracking-wider hover:text-[#d62828] cursor-pointer">
                      Previa <span className="ml-2 h-4 w-4 rounded-full bg-[#e63946] text-white flex items-center justify-center text-[10px] font-bold">&gt;</span>
                    </div>
                  </div>
                </div>
              );
            }) : (
              <div className="col-span-3 text-center py-12 text-red-100 bg-red-900/20 rounded-lg">
                <p className="font-bold">Aún no hay partidos programados.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Latest News / Equipos y Torneos (White Section) */}
      <section className="w-full max-w-7xl mx-auto px-6 md:px-12 py-20 bg-white">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-10 gap-6 border-b border-slate-200 pb-4">
          <h2 className="text-3xl font-black text-red-500 tracking-tight">
            Novedades
          </h2>
          <div className="flex border border-slate-200 rounded-full overflow-hidden bg-white shadow-sm">
            <button className="px-6 py-2 text-[10px] font-bold text-red-500 border-b-2 border-red-500 bg-red-50/50 uppercase tracking-widest">Torneos</button>
            <button className="px-6 py-2 text-[10px] font-bold text-slate-500 hover:bg-slate-50 uppercase tracking-widest transition-colors">Equipos</button>
            <button className="px-6 py-2 text-[10px] font-bold text-slate-500 hover:bg-slate-50 uppercase tracking-widest transition-colors">Noticias</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* News Card 1 */}
          <Link to="/torneos" className="bg-slate-50 border border-slate-200 rounded overflow-hidden group hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col">
            <div className="h-56 overflow-hidden relative">
              <img src="https://images.unsplash.com/photo-1518605368461-1ee7c5320c9f?q=80&w=800&auto=format&fit=crop" alt="Torneo" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            </div>
            <div className="p-6 flex-1 flex flex-col items-start bg-gradient-to-b from-white to-slate-50">
              <h3 className="font-bold text-slate-900 text-lg mb-4 line-clamp-2 leading-snug group-hover:text-red-500 transition-colors">
                Explora los torneos en curso y sigue las tablas de posiciones y estadísticas al instante.
              </h3>
              <span className="mt-auto inline-block bg-red-500 text-white text-[10px] font-bold px-3 py-1 rounded shadow-sm uppercase tracking-widest">
                DESTACADO
              </span>
            </div>
          </Link>

          {/* News Card 2 */}
          <Link to="/equipos" className="bg-slate-50 border border-slate-200 rounded overflow-hidden group hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col">
            <div className="h-56 overflow-hidden relative">
              <img src="https://images.unsplash.com/photo-1551280857-2b9ebf262c51?q=80&w=800&auto=format&fit=crop" alt="Equipos" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            </div>
            <div className="p-6 flex-1 flex flex-col items-start bg-gradient-to-b from-white to-slate-50">
              <h3 className="font-bold text-slate-900 text-lg mb-4 line-clamp-2 leading-snug group-hover:text-red-500 transition-colors">
                Conoce a los equipos, sus jugadores estrella y su rendimiento histórico en la liga.
              </h3>
              <span className="mt-auto inline-block bg-red-500 text-white text-[10px] font-bold px-3 py-1 rounded shadow-sm uppercase tracking-widest">
                ACTUALIDAD
              </span>
            </div>
          </Link>

          {/* News Card 3 */}
          <Link to="/partidos" className="bg-slate-50 border border-slate-200 rounded overflow-hidden group hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col">
            <div className="h-56 overflow-hidden relative">
              <img src="https://images.unsplash.com/photo-1508344928928-7157b87de15a?q=80&w=800&auto=format&fit=crop" alt="Calendario" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            </div>
            <div className="p-6 flex-1 flex flex-col items-start bg-gradient-to-b from-white to-slate-50">
              <h3 className="font-bold text-slate-900 text-lg mb-4 line-clamp-2 leading-snug group-hover:text-red-500 transition-colors">
                No te pierdas ningún encuentro. Revisa los resultados y próximos juegos en tiempo real.
              </h3>
              <span className="mt-auto inline-block bg-slate-800 text-white text-[10px] font-bold px-3 py-1 rounded shadow-sm uppercase tracking-widest">
                ÚLTIMO MINUTO
              </span>
            </div>
          </Link>
        </div>
      </section>

    </div>
  );
}
