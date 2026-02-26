import MenuBookIcon from '@mui/icons-material/MenuBook'
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks'
import GroupIcon from '@mui/icons-material/Group'
import SwapHorizIcon from '@mui/icons-material/SwapHoriz'
import SearchIcon from '@mui/icons-material/Search'
import AutoStoriesIcon from '@mui/icons-material/AutoStories'
import SchoolIcon from '@mui/icons-material/School'
import BarChartIcon from '@mui/icons-material/BarChart'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import Button from '@mui/material/Button'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

/* ─── keyframes (injected once) ─── */
const STYLE_ID = '__landing-keyframes'
function injectKeyframes() {
  if (document.getElementById(STYLE_ID)) return
  const style = document.createElement('style')
  style.id = STYLE_ID
  style.textContent = `
    @keyframes gradientShift {
      0%   { background-position: 0% 50%; }
      50%  { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    @keyframes float {
      0%, 100% { transform: translateY(0) rotate(0deg); }
      50%      { transform: translateY(-24px) rotate(6deg); }
    }
    @keyframes float2 {
      0%, 100% { transform: translateY(0) rotate(0deg); }
      50%      { transform: translateY(-18px) rotate(-4deg); }
    }
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(32px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes shimmer {
      0%   { background-position: -200% center; }
      100% { background-position: 200% center; }
    }
    @keyframes pulse-ring {
      0%   { transform: scale(1); opacity: .35; }
      100% { transform: scale(1.6); opacity: 0; }
    }
    @keyframes slideInLeft {
      from { opacity: 0; transform: translateX(-40px); }
      to   { opacity: 1; transform: translateX(0); }
    }
  `
  document.head.appendChild(style)
}

/* ─── data ─── */
const features = [
  {
    icon: <LibraryBooksIcon sx={{ fontSize: 32 }} />,
    title: 'Catálogo digital',
    desc: 'Gestiona todo tu inventario de libros con búsqueda instantánea por título, autor o ISBN.',
    color: '#60a5fa',
  },
  {
    icon: <GroupIcon sx={{ fontSize: 32 }} />,
    title: 'Control de prestatarios',
    desc: 'Registra estudiantes y profesores con su información para un seguimiento organizado.',
    color: '#34d399',
  },
  {
    icon: <SwapHorizIcon sx={{ fontSize: 32 }} />,
    title: 'Préstamos y devoluciones',
    desc: 'Registra préstamos, controla fechas de devolución y gestiona el estado en tiempo real.',
    color: '#fbbf24',
  },
  {
    icon: <SearchIcon sx={{ fontSize: 32 }} />,
    title: 'Dashboard inteligente',
    desc: 'Visualiza estadísticas de tu biblioteca: libros disponibles, préstamos activos y vencidos.',
    color: '#a78bfa',
  },
]

const stats = [
  { icon: <AutoStoriesIcon sx={{ fontSize: 28 }} />, value: '1,200+', label: 'Libros registrados', color: '#60a5fa' },
  { icon: <SchoolIcon sx={{ fontSize: 28 }} />, value: '350+', label: 'Estudiantes activos', color: '#34d399' },
  { icon: <SwapHorizIcon sx={{ fontSize: 28 }} />, value: '4,800+', label: 'Préstamos realizados', color: '#fbbf24' },
  { icon: <BarChartIcon sx={{ fontSize: 28 }} />, value: '99%', label: 'Tasa de devolución', color: '#a78bfa' },
]

/* ─── component ─── */
export default function LandingMain() {
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    injectKeyframes()
    const handler = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <div style={{ background: '#050d1a', minHeight: '100vh', color: '#fff', overflowX: 'hidden' }}>

      {/* ━━━ Navbar ━━━ */}
      <nav
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
          padding: '16px 0',
          background: scrolled ? 'rgba(5,13,26,.92)' : 'transparent',
          backdropFilter: scrolled ? 'blur(16px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,.06)' : 'none',
          transition: 'all .35s ease',
        }}
      >
        <div style={{ maxWidth: 1140, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 38, height: 38, borderRadius: 10,
              background: 'linear-gradient(135deg, #1565c0, #42a5f5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <MenuBookIcon sx={{ fontSize: 22, color: '#fff' }} />
            </div>
            <div>
              <span style={{ fontWeight: 700, fontSize: 16, letterSpacing: '-.02em' }}>BiblioTK</span>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,.45)', marginLeft: 6, fontWeight: 500 }}>21578</span>
            </div>
          </div>
          <Button
            variant="contained"
            size="small"
            onClick={() => navigate('/auth/login')}
            sx={{
              textTransform: 'none', fontWeight: 600, borderRadius: '10px',
              background: 'linear-gradient(135deg, #1565c0, #1e88e5)',
              px: 2.5, py: .8,
              boxShadow: '0 0 20px rgba(21,101,192,.35)',
              '&:hover': { boxShadow: '0 0 30px rgba(21,101,192,.55)', background: 'linear-gradient(135deg, #1e88e5, #42a5f5)' },
            }}
          >
            Iniciar sesión
          </Button>
        </div>
      </nav>

      {/* ━━━ Hero ━━━ */}
      <section
        style={{
          position: 'relative',
          minHeight: '100vh',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          textAlign: 'center',
          padding: '120px 24px 80px',
          background: 'linear-gradient(135deg, #050d1a 0%, #0a1e3d 25%, #122a52 50%, #0d1f3f 75%, #050d1a 100%)',
          backgroundSize: '400% 400%',
          animation: 'gradientShift 12s ease infinite',
          overflow: 'hidden',
        }}
      >
        {/* Decorative orbs */}
        <div style={{
          position: 'absolute', top: '10%', left: '8%', width: 280, height: 280,
          borderRadius: '50%', background: 'radial-gradient(circle, rgba(21,101,192,.18) 0%, transparent 70%)',
          animation: 'float 8s ease-in-out infinite', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '12%', right: '6%', width: 220, height: 220,
          borderRadius: '50%', background: 'radial-gradient(circle, rgba(66,165,245,.14) 0%, transparent 70%)',
          animation: 'float2 10s ease-in-out infinite', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', top: '50%', left: '55%', width: 160, height: 160,
          borderRadius: '50%', background: 'radial-gradient(circle, rgba(251,191,36,.08) 0%, transparent 70%)',
          animation: 'float 14s ease-in-out infinite', pointerEvents: 'none',
        }} />
        {/* Grid pattern overlay */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', opacity: .04,
          backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />

        {/* Badge */}
        <div
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(21,101,192,.15)', border: '1px solid rgba(21,101,192,.25)',
            borderRadius: 999, padding: '6px 18px', marginBottom: 32,
            animation: 'fadeInUp .7s ease both',
          }}
        >
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#42a5f5', display: 'inline-block' }} />
          <span style={{ fontSize: 13, fontWeight: 500, color: '#90caf9', letterSpacing: '.02em' }}>
            Sistema de Biblioteca Escolar
          </span>
        </div>

        {/* School name – hero */}
        <h1
          style={{
            fontSize: 'clamp(2rem, 5.5vw, 4.2rem)',
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: '-.03em',
            margin: '0 0 8px',
            animation: 'fadeInUp .7s ease .15s both',
          }}
        >
          <span style={{ color: 'rgba(255,255,255,.55)', fontSize: 'clamp(.9rem, 2vw, 1.15rem)', fontWeight: 600, display: 'block', marginBottom: 12, letterSpacing: '.08em', textTransform: 'uppercase' }}>
            Escuela
          </span>
          <span
            style={{
              display: 'inline-block',
              background: 'linear-gradient(90deg, #ffffff 0%, #e3f2fd 30%, #fbbf24 55%, #f59e0b 70%, #ffffff 100%)',
              backgroundSize: '200% auto',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              animation: 'shimmer 4s linear infinite',
            }}
          >
            Bicentenario
          </span>
          <span
            style={{
              display: 'block',
              fontSize: 'clamp(2.6rem, 7vw, 5.5rem)',
              fontWeight: 900,
              background: 'linear-gradient(135deg, #ffffff, #bbdefb)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-.02em',
              marginTop: 4,
            }}
          >
            21578
          </span>
        </h1>

        {/* Divider */}
        <div
          style={{
            width: 64, height: 3, borderRadius: 2,
            background: 'linear-gradient(90deg, transparent, #1565c0, #42a5f5, transparent)',
            margin: '24px auto',
            animation: 'fadeInUp .7s ease .3s both',
          }}
        />

        {/* Subtitle */}
        <p
          style={{
            fontSize: 'clamp(1rem, 2vw, 1.2rem)',
            color: 'rgba(255,255,255,.55)',
            maxWidth: 540, lineHeight: 1.7,
            margin: '0 auto 36px',
            animation: 'fadeInUp .7s ease .4s both',
          }}
        >
          <strong style={{ color: '#90caf9' }}>BiblioTK</strong> simplifica la gestión de la biblioteca.
          Controla libros, préstamos y prestatarios desde un solo lugar.
        </p>

        {/* CTA buttons */}
        <div
          style={{
            display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center',
            animation: 'fadeInUp .7s ease .55s both',
          }}
        >
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/auth/login')}
            endIcon={<ArrowForwardIcon />}
            sx={{
              textTransform: 'none', fontWeight: 700, borderRadius: '14px',
              fontSize: 16, px: 4, py: 1.5,
              background: 'linear-gradient(135deg, #1565c0, #1e88e5)',
              boxShadow: '0 4px 30px rgba(21,101,192,.4)',
              '&:hover': {
                background: 'linear-gradient(135deg, #1e88e5, #42a5f5)',
                boxShadow: '0 6px 40px rgba(21,101,192,.6)',
                transform: 'translateY(-2px)',
              },
              transition: 'all .3s ease',
            }}
          >
            Acceder al sistema
          </Button>
          <Button
            variant="outlined"
            size="large"
            onClick={() => {
              document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })
            }}
            sx={{
              textTransform: 'none', fontWeight: 600, borderRadius: '14px',
              fontSize: 16, px: 4, py: 1.5,
              color: '#90caf9', borderColor: 'rgba(144,202,249,.25)',
              '&:hover': {
                borderColor: 'rgba(144,202,249,.5)',
                background: 'rgba(144,202,249,.06)',
                transform: 'translateY(-2px)',
              },
              transition: 'all .3s ease',
            }}
          >
            Conocer más
          </Button>
        </div>

        {/* Scroll indicator */}
        <div
          style={{
            position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
            animation: 'fadeInUp .7s ease .7s both',
          }}
        >
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,.3)', letterSpacing: '.1em', textTransform: 'uppercase' }}>Scroll</span>
          <div style={{ width: 1, height: 32, background: 'linear-gradient(to bottom, rgba(255,255,255,.3), transparent)' }} />
        </div>
      </section>

      {/* ━━━ Features ━━━ */}
      <section
        id="features"
        style={{
          maxWidth: 1140, margin: '0 auto',
          padding: '100px 24px 80px',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <span style={{
            display: 'inline-block', fontSize: 12, fontWeight: 600,
            color: '#60a5fa', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 12,
          }}>
            Funcionalidades
          </span>
          <h2 style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.2rem)', fontWeight: 800, letterSpacing: '-.02em', margin: 0 }}>
            Todo lo que necesitas para tu biblioteca
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 20 }}>
          {features.map((f, i) => (
            <div
              key={f.title}
              style={{
                background: 'rgba(255,255,255,.03)',
                border: '1px solid rgba(255,255,255,.06)',
                borderRadius: 18,
                padding: 28,
                cursor: 'default',
                transition: 'all .35s ease',
                animation: `fadeInUp .6s ease ${.15 * i}s both`,
                position: 'relative',
                overflow: 'hidden',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget
                el.style.transform = 'translateY(-6px)'
                el.style.borderColor = `${f.color}33`
                el.style.boxShadow = `0 12px 40px ${f.color}15`
                el.style.background = 'rgba(255,255,255,.05)'
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget
                el.style.transform = 'translateY(0)'
                el.style.borderColor = 'rgba(255,255,255,.06)'
                el.style.boxShadow = 'none'
                el.style.background = 'rgba(255,255,255,.03)'
              }}
            >
              <div style={{
                width: 48, height: 48, borderRadius: 12,
                background: `${f.color}15`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 18, color: f.color,
              }}>
                {f.icon}
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8, margin: '0 0 8px' }}>{f.title}</h3>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,.5)', lineHeight: 1.65, margin: 0 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ━━━ Stats ━━━ */}
      <section style={{ padding: '60px 24px 80px' }}>
        <div
          style={{
            maxWidth: 1140, margin: '0 auto',
            background: 'linear-gradient(135deg, rgba(21,101,192,.12), rgba(66,165,245,.06))',
            border: '1px solid rgba(21,101,192,.15)',
            borderRadius: 24, padding: '48px 32px',
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 24,
          }}
        >
          {stats.map((s, i) => (
            <div
              key={s.label}
              style={{
                textAlign: 'center',
                animation: `fadeInUp .6s ease ${.1 * i}s both`,
              }}
            >
              <div style={{ display: 'inline-flex', color: s.color, marginBottom: 8 }}>{s.icon}</div>
              <div style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 800, letterSpacing: '-.02em' }}>{s.value}</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,.45)', marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ━━━ CTA ━━━ */}
      <section style={{ padding: '40px 24px 100px' }}>
        <div
          style={{
            maxWidth: 720, margin: '0 auto', textAlign: 'center',
            background: 'linear-gradient(135deg, #0d2240, #122a52)',
            border: '1px solid rgba(21,101,192,.2)',
            borderRadius: 24, padding: '56px 40px',
            position: 'relative', overflow: 'hidden',
          }}
        >
          {/* Glow */}
          <div style={{
            position: 'absolute', top: '-40%', left: '50%', transform: 'translateX(-50%)',
            width: 300, height: 300, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(21,101,192,.2) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />

          <h2 style={{ fontSize: 'clamp(1.3rem, 3vw, 1.8rem)', fontWeight: 800, marginBottom: 12, position: 'relative' }}>
            ¿Listo para organizar tu biblioteca?
          </h2>
          <p style={{ color: 'rgba(255,255,255,.5)', fontSize: 15, maxWidth: 460, margin: '0 auto 28px', lineHeight: 1.7, position: 'relative' }}>
            Inicia sesión y comienza a gestionar los recursos de la <strong style={{ color: '#90caf9' }}>Escuela Bicentenario 21578</strong>.
          </p>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/auth/login')}
            endIcon={<ArrowForwardIcon />}
            sx={{
              position: 'relative', textTransform: 'none', fontWeight: 700, borderRadius: '14px',
              fontSize: 16, px: 4, py: 1.5,
              background: 'linear-gradient(135deg, #1565c0, #1e88e5)',
              boxShadow: '0 4px 30px rgba(21,101,192,.4)',
              '&:hover': {
                background: 'linear-gradient(135deg, #1e88e5, #42a5f5)',
                boxShadow: '0 6px 40px rgba(21,101,192,.6)',
                transform: 'translateY(-2px)',
              },
              transition: 'all .3s ease',
            }}
          >
            Comenzar ahora
          </Button>
        </div>
      </section>

      {/* ━━━ Footer ━━━ */}
      <footer
        style={{
          borderTop: '1px solid rgba(255,255,255,.06)',
          padding: '24px 0',
        }}
      >
        <div style={{
          maxWidth: 1140, margin: '0 auto', padding: '0 24px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          fontSize: 13, color: 'rgba(255,255,255,.35)',
          flexWrap: 'wrap', gap: 8,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <MenuBookIcon sx={{ fontSize: 16 }} />
            <span style={{ fontWeight: 600 }}>BiblioTK 21578</span>
          </div>
          <span>Escuela Bicentenario 21578 — © {new Date().getFullYear()}</span>
        </div>
      </footer>
    </div>
  )
}
