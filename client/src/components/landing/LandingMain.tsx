import MenuBookIcon from '@mui/icons-material/MenuBook'
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks'
import GroupIcon from '@mui/icons-material/Group'
import SwapHorizIcon from '@mui/icons-material/SwapHoriz'
import SearchIcon from '@mui/icons-material/Search'
import AutoStoriesIcon from '@mui/icons-material/AutoStories'
import SchoolIcon from '@mui/icons-material/School'
import BarChartIcon from '@mui/icons-material/BarChart'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import PeopleIcon from '@mui/icons-material/People'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/* ─── framer-motion variants ─── */
const fadeInUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay, ease: 'easeOut' },
  }),
}

const slideInLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: (delay = 0) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, delay, ease: 'easeOut' },
  }),
}

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
}

const staggerItem = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

const viewportOnce = { once: true, amount: 0.3 } as const

/* ─── carousel images ─── */
const carouselImages = [
  { src: '/school/I.E 21578.jpeg', alt: 'Vista exterior de la escuela' },
  { src: '/school/school-3.png', alt: 'Patio y áreas verdes' },
  { src: '/school/IE-21578_2024-02.jpeg', alt: 'Biblioteca escolar' },
  { src: '/school/patio_21578.png', alt: 'Vista aérea del campus' },
]

/* ─── school info ─── */
const schoolInfo = [
  {
    icon: <LocationOnIcon sx={{ fontSize: 26 }} />,
    title: 'Ubicación',
    items: ['Región: Lima', 'Provincia: Barranca', 'Distrito: Paramonga'],
    color: '#42a5f5',
  },
  {
    icon: <AttachMoneyIcon sx={{ fontSize: 26 }} />,
    title: 'Inversión',
    items: ['S/ 79 161 848,92 soles'],
    color: '#66bb6a',
  },
  {
    icon: <PeopleIcon sx={{ fontSize: 26 }} />,
    title: 'Beneficiarios',
    items: ['809 estudiantes*', '*Número proyectado a 10 años'],
    color: '#ffa726',
  },
]

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
  const [currentSlide, setCurrentSlide] = useState(0)
  const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const goToSlide = useCallback((idx: number) => {
    setCurrentSlide((idx + carouselImages.length) % carouselImages.length)
  }, [])

  const nextSlide = useCallback(() => goToSlide(currentSlide + 1), [currentSlide, goToSlide])
  const prevSlide = useCallback(() => goToSlide(currentSlide - 1), [currentSlide, goToSlide])

  /* autoplay */
  useEffect(() => {
    autoplayRef.current = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % carouselImages.length)
    }, 5000)
    return () => { if (autoplayRef.current) clearInterval(autoplayRef.current) }
  }, [])

  /* pause autoplay on interaction */
  const resetAutoplay = useCallback(() => {
    if (autoplayRef.current) clearInterval(autoplayRef.current)
    autoplayRef.current = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % carouselImages.length)
    }, 5000)
  }, [])

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <div style={{ background: '#050d1a', minHeight: '100vh', color: '#fff', overflowX: 'hidden' }}>

      {/* Decorative CSS keyframes (infinite loops only) */}
      <style>{`
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
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
      `}</style>

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
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          custom={0}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(21,101,192,.15)', border: '1px solid rgba(21,101,192,.25)',
            borderRadius: 999, padding: '6px 18px', marginBottom: 32,
          }}
        >
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#42a5f5', display: 'inline-block' }} />
          <span style={{ fontSize: 13, fontWeight: 500, color: '#90caf9', letterSpacing: '.02em' }}>
            Sistema de Biblioteca Escolar
          </span>
        </motion.div>

        {/* School name – hero */}
        <motion.h1
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          custom={0.15}
          style={{
            fontSize: 'clamp(2rem, 5.5vw, 4.2rem)',
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: '-.03em',
            margin: '0 0 8px',
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
        </motion.h1>

        {/* Divider */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          custom={0.3}
          style={{
            width: 64, height: 3, borderRadius: 2,
            background: 'linear-gradient(90deg, transparent, #1565c0, #42a5f5, transparent)',
            margin: '24px auto',
          }}
        />

        {/* Subtitle */}
        <motion.p
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          custom={0.4}
          style={{
            fontSize: 'clamp(1rem, 2vw, 1.2rem)',
            color: 'rgba(255,255,255,.55)',
            maxWidth: 540, lineHeight: 1.7,
            margin: '0 auto 36px',
          }}
        >
          <strong style={{ color: '#90caf9' }}>BiblioTK</strong> simplifica la gestión de la biblioteca.
          Controla libros, préstamos y prestatarios desde un solo lugar.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          custom={0.55}
          style={{
            display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center',
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
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          custom={0.7}
          style={{
            position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
          }}
        >
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,.3)', letterSpacing: '.1em', textTransform: 'uppercase' }}>Scroll</span>
          <div style={{ width: 1, height: 32, background: 'linear-gradient(to bottom, rgba(255,255,255,.3), transparent)' }} />
        </motion.div>
      </section>

      {/* ━━━ Sobre la Escuela ━━━ */}
      <section
        id="sobre"
        style={{
          maxWidth: 1140, margin: '0 auto',
          padding: '100px 24px 80px',
        }}
      >
        {/* Section header */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          custom={0}
          style={{ textAlign: 'center', marginBottom: 56 }}
        >
          <span style={{
            display: 'inline-block', fontSize: 12, fontWeight: 600,
            color: '#42a5f5', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 12,
          }}>
            Sobre esta Escuela Bicentenario
          </span>
          <h2 style={{
            fontSize: 'clamp(1.5rem, 3.5vw, 2.4rem)', fontWeight: 800,
            letterSpacing: '-.02em', margin: 0,
          }}>
            IE 21578
          </h2>
        </motion.div>

        {/* Two-column layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 420px), 1fr))',
          gap: 40,
          alignItems: 'start',
        }}>

          {/* ── Left: School Info Cards ── */}
          <div style={{
            display: 'flex', flexDirection: 'column', gap: 16,
          }}>
            {schoolInfo.map((info, i) => (
              <motion.div
                key={info.title}
                variants={slideInLeft}
                initial="hidden"
                whileInView="visible"
                viewport={viewportOnce}
                custom={0.1 * i}
                whileHover={{
                  borderColor: `${info.color}33`,
                  boxShadow: `0 8px 32px ${info.color}12`,
                  background: 'rgba(255,255,255,.05)',
                }}
                style={{
                  display: 'flex', alignItems: 'flex-start', gap: 16,
                  background: 'rgba(255,255,255,.03)',
                  border: '1px solid rgba(255,255,255,.06)',
                  borderRadius: 16,
                  padding: '20px 24px',
                  cursor: 'default',
                }}
              >
                <div style={{
                  width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                  background: `${info.color}15`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: info.color,
                }}>
                  {info.icon}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4, color: info.color }}>
                    {info.title}
                  </div>
                  {info.items.map((item, j) => (
                    <div key={j} style={{
                      color: item.startsWith('*') ? 'rgba(255,255,255,.35)' : 'rgba(255,255,255,.6)',
                      lineHeight: 1.5,
                      fontStyle: item.startsWith('*') ? 'italic' : 'normal',
                      fontSize: item.startsWith('*') ? 11 : 13,
                    }}>
                      {item}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* ── Right: Image Carousel ── */}
          <div style={{
            position: 'relative', borderRadius: 20, overflow: 'hidden',
            background: 'rgba(255,255,255,.03)',
            border: '1px solid rgba(255,255,255,.08)',
            aspectRatio: '16 / 11',
          }}>
            {/* Image with AnimatePresence */}
            <AnimatePresence mode="wait">
              <motion.img
                key={currentSlide}
                src={carouselImages[currentSlide].src}
                alt={carouselImages[currentSlide].alt}
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                style={{
                  width: '100%', height: '100%', objectFit: 'cover',
                  position: 'absolute', inset: 0,
                }}
              />
            </AnimatePresence>

            {/* Gradient overlay bottom */}
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0, height: 100,
              background: 'linear-gradient(to top, rgba(5,13,26,.7), transparent)',
              pointerEvents: 'none', zIndex: 1,
            }} />

            {/* Navigation arrows */}
            <IconButton
              onClick={() => { prevSlide(); resetAutoplay() }}
              sx={{
                position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
                background: 'rgba(5,13,26,.55)', backdropFilter: 'blur(8px)',
                color: '#fff', width: 42, height: 42, zIndex: 2,
                border: '1px solid rgba(255,255,255,.1)',
                '&:hover': { background: 'rgba(5,13,26,.8)', borderColor: 'rgba(255,255,255,.2)' },
                transition: 'all .25s ease',
              }}
            >
              <ChevronLeftIcon />
            </IconButton>
            <IconButton
              onClick={() => { nextSlide(); resetAutoplay() }}
              sx={{
                position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                background: 'rgba(5,13,26,.55)', backdropFilter: 'blur(8px)',
                color: '#fff', width: 42, height: 42, zIndex: 2,
                border: '1px solid rgba(255,255,255,.1)',
                '&:hover': { background: 'rgba(5,13,26,.8)', borderColor: 'rgba(255,255,255,.2)' },
                transition: 'all .25s ease',
              }}
            >
              <ChevronRightIcon />
            </IconButton>

            {/* Dot indicators */}
            <div style={{
              position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)',
              display: 'flex', gap: 8, zIndex: 2,
            }}>
              {carouselImages.map((_, dotIdx) => (
                <button
                  key={dotIdx}
                  onClick={() => { goToSlide(dotIdx); resetAutoplay() }}
                  style={{
                    width: dotIdx === currentSlide ? 24 : 10,
                    height: 10, borderRadius: 999,
                    background: dotIdx === currentSlide
                      ? 'linear-gradient(135deg, #42a5f5, #1565c0)'
                      : 'rgba(255,255,255,.35)',
                    border: 'none', cursor: 'pointer', padding: 0,
                    transition: 'all .3s ease',
                    boxShadow: dotIdx === currentSlide ? '0 0 10px rgba(66,165,245,.5)' : 'none',
                  }}
                />
              ))}
            </div>

            {/* Image label */}
            <div style={{
              position: 'absolute', bottom: 36, left: 16, zIndex: 2,
              fontSize: 12, color: 'rgba(255,255,255,.7)', fontWeight: 500,
              background: 'rgba(5,13,26,.5)', backdropFilter: 'blur(4px)',
              borderRadius: 8, padding: '4px 12px',
            }}>
              {carouselImages[currentSlide].alt}
            </div>
          </div>
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
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          custom={0}
          style={{ textAlign: 'center', marginBottom: 56 }}
        >
          <span style={{
            display: 'inline-block', fontSize: 12, fontWeight: 600,
            color: '#60a5fa', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 12,
          }}>
            Funcionalidades
          </span>
          <h2 style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.2rem)', fontWeight: 800, letterSpacing: '-.02em', margin: 0 }}>
            Todo lo que necesitas para tu biblioteca
          </h2>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 20 }}
        >
          {features.map((f) => (
            <motion.div
              key={f.title}
              variants={staggerItem}
              whileHover={{
                y: -6,
                borderColor: `${f.color}33`,
                boxShadow: `0 12px 40px ${f.color}15`,
                background: 'rgba(255,255,255,.05)',
              }}
              style={{
                background: 'rgba(255,255,255,.03)',
                border: '1px solid rgba(255,255,255,.06)',
                borderRadius: 18,
                padding: 28,
                cursor: 'default',
                position: 'relative',
                overflow: 'hidden',
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
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ━━━ Stats ━━━ */}
      <section style={{ padding: '60px 24px 80px' }}>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          style={{
            maxWidth: 1140, margin: '0 auto',
            background: 'linear-gradient(135deg, rgba(21,101,192,.12), rgba(66,165,245,.06))',
            border: '1px solid rgba(21,101,192,.15)',
            borderRadius: 24, padding: '48px 32px',
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 24,
          }}
        >
          {stats.map((s) => (
            <motion.div
              key={s.label}
              variants={staggerItem}
              style={{ textAlign: 'center' }}
            >
              <div style={{ display: 'inline-flex', color: s.color, marginBottom: 8 }}>{s.icon}</div>
              <div style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 800, letterSpacing: '-.02em' }}>{s.value}</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,.45)', marginTop: 4 }}>{s.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ━━━ CTA ━━━ */}
      <section style={{ padding: '40px 24px 100px' }}>
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          custom={0}
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
        </motion.div>
      </section>

      {/* ━━━ Footer ━━━ */}
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
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
      </motion.footer>
    </div>
  )
}
